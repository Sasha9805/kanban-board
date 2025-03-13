import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IKanbanBoard } from "../shared/types";
import { GITHUB_REG } from "../config";

dayjs.extend(relativeTime);

export const formatDateAgo = (dateString: string): string => {
	return dayjs(dateString).fromNow();
};

export const extractRepoInfo = (repoUrl: string): [string, string] | null => {
	const match = repoUrl.match(GITHUB_REG);

	if (match) {
		return [match[2], match[3]];
	}

	return null;
};

export const saveToLocalStorage = (key: string, state: IKanbanBoard) => {
	try {
		localStorage.setItem(key, JSON.stringify(state));
	} catch (error) {
		console.error("Error saving to localStorage:", error);
	}
};

export const loadFromLocalStorage = (key: string): IKanbanBoard | null => {
	try {
		const savedState = localStorage.getItem(key);
		return savedState ? JSON.parse(savedState) : null;
	} catch (error) {
		console.error("Error loading from localStorage:", error);
		return null;
	}
};

export const checkOrganizationAndRepoInLocalStorage = (
	key: string,
	organization: string,
	repo: string
): boolean | null => {
	const boardState = loadFromLocalStorage(key);
	if (boardState) {
		return !!boardState?.[organization]?.[repo];
	}
	return null;
};

export const formatNumberToK = (number: number): string => {
	const formatter = new Intl.NumberFormat("en", {
		notation: "compact",
		compactDisplay: "short",
		maximumFractionDigits: 0,
	});
	if (number >= 1000) {
		// return `${(number / 1000).toFixed(0)}K`;
		return formatter.format(number);
	}
	return number.toString();
};
