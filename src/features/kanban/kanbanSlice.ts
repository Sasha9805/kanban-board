import {
	createSlice,
	createAsyncThunk,
	PayloadAction,
	createSelector,
} from "@reduxjs/toolkit";
import {
	fetchIssuesFromGitHub,
	fetchRepoStars,
} from "../../services/githubApi";
import { ColumnsNames, IIssue, IIssuesState } from "../../shared/types";
import {
	extractRepoInfo,
	loadFromLocalStorage,
	saveToLocalStorage,
} from "../../utils/helpers";
import { RootState } from "../../app/store";
import { KANBAN_KEY } from "../../config";

const initialState: IIssuesState = {
	data: {},
	isLoading: false,
	error: null,
	repoUrl: "",
};

export const fetchIssuesThunk = createAsyncThunk<
	{ issues: IIssue[]; repoUrl: string; starsCount: number }, // Тип данных, которые возвращаем в случае успешной загрузки
	string, // Тип для аргумента (repoUrl)
	{ rejectValue: string } // Тип ошибки, которую возвращаем в случае неудачи
>("kanban/fetchIssues", async (repoUrl: string, { rejectWithValue }) => {
	const repoInfo = extractRepoInfo(repoUrl);

	if (!repoInfo) {
		return rejectWithValue("Некорректный URL репозитория");
	}

	const [organization, repository] = repoInfo;

	try {
		const [issues, starsCount] = await Promise.all([
			fetchIssuesFromGitHub(organization, repository),
			fetchRepoStars(organization, repository),
		]);
		return { issues, repoUrl, starsCount };
	} catch (error: unknown) {
		if (error instanceof Error) {
			return rejectWithValue(error.message);
		}
		return rejectWithValue("Ошибка загрузки issues");
	}
});

const kanbanSlice = createSlice({
	name: "kanban",
	initialState,
	reducers: {
		loadBoardStateFromLocalStorage: (
			state,
			action: PayloadAction<string>
		) => {
			const kanbanBoard = loadFromLocalStorage(action.payload);
			if (kanbanBoard) {
				state.data = kanbanBoard;
			}
		},
		updateRepoUrl: (state, action: PayloadAction<string>) => {
			state.repoUrl = action.payload;
			state.isLoading = false;
			state.error = null;
		},
		moveIssue: (
			state,
			action: PayloadAction<{
				issueIndex: number;
				dropIndex: number;
				fromColumn: ColumnsNames;
				toColumn: ColumnsNames;
			}>
		) => {
			const { issueIndex, dropIndex, fromColumn, toColumn } =
				action.payload;
			const repoInfo = extractRepoInfo(state.repoUrl);

			if (!repoInfo) {
				return;
			}

			const [organization, repository] = repoInfo;

			const deletedIssue =
				state.data[organization]?.[repository]?.[fromColumn]?.[
					issueIndex
				];

			if (toColumn === "done") {
				deletedIssue.status = "closed";
			}

			if (toColumn === "inProgress" || toColumn === "todo") {
				deletedIssue.status = "open";
			}

			state.data[organization]?.[repository]?.[fromColumn].splice(
				issueIndex,
				1
			);
			state.data[organization]?.[repository]?.[toColumn].splice(
				dropIndex,
				0,
				deletedIssue
			);

			saveToLocalStorage(KANBAN_KEY, state.data);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIssuesThunk.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchIssuesThunk.fulfilled, (state, action) => {
				const { issues, repoUrl, starsCount } = action.payload;
				const repoInfo = extractRepoInfo(repoUrl);

				if (!repoInfo) {
					return;
				}

				const [organization, repository] = repoInfo;

				if (!state.data[organization]) {
					state.data[organization] = {};
				}

				if (!state.data[organization][repository]) {
					state.data[organization][repository] = {
						todo: [],
						inProgress: [],
						done: [],
						stars: null,
					};
				}

				state.data[organization][repository].todo = issues.filter(
					(issue) => issue.status === "open"
				);
				state.data[organization][repository].done = issues.filter(
					(issue) => issue.status === "closed"
				);
				state.data[organization][repository].stars = starsCount;

				state.isLoading = false;
				state.error = null;

				saveToLocalStorage(KANBAN_KEY, state.data);
			})
			.addCase(fetchIssuesThunk.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});
	},
});

export const { loadBoardStateFromLocalStorage, updateRepoUrl, moveIssue } =
	kanbanSlice.actions;

export default kanbanSlice.reducer;

export const selectIssuesByRepo = (state: RootState) => {
	if (!state.kanban.repoUrl) return null;
	const repoUrl = state.kanban.repoUrl;
	const repoInfo = extractRepoInfo(repoUrl);
	if (!repoInfo) return null;

	const [organization, repository] = repoInfo;
	return state.kanban.data[organization]?.[repository] || null;
};

export const selectRepoStars = createSelector(
	selectIssuesByRepo,
	(issues) => issues?.stars
);
