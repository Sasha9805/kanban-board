import axios from "axios";
import { IIssue, IGitHubIssueResponse } from "../shared/types";

export const fetchIssuesFromGitHub = async (
	organization: string,
	repository: string
): Promise<IIssue[]> => {
	try {
		const response = await axios.get(
			`https://api.github.com/repos/${organization}/${repository}/issues?per_page=10`
		);
		return transformIssues(response.data);
	} catch (error: unknown) {
		// Обработка ошибки с проверкой типа
		if (axios.isAxiosError(error)) {
			// Проверка, что ошибка является axios ошибкой
			if (error.response) {
				// Сервер вернул ошибку (например, 404 или 500)
				throw new Error(
					`Ошибка загрузки данных: ${error.response.status} ${error.response.statusText}`
				);
			} else if (error.request) {
				// Нет ответа от сервера
				throw new Error("Нет ответа от сервера");
			}
		}

		// Для прочих ошибок, например, если ошибка не от axios
		if (error instanceof Error) {
			throw new Error(`Ошибка: ${error.message}`);
		} else {
			// В случае если ошибка не является экземпляром Error или axios
			throw new Error("Неизвестная ошибка");
		}
	}
};

export const fetchRepoStars = async (
	organization: string,
	repository: string
): Promise<number> => {
	try {
		const response = await axios.get(
			`https://api.github.com/repos/${organization}/${repository}`
		);
		return response.data.stargazers_count as number;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				throw new Error(
					`Ошибка загрузки данных: ${error.response.status} ${error.response.statusText}`
				);
			} else if (error.request) {
				throw new Error("Нет ответа от сервера");
			}
		}

		if (error instanceof Error) {
			throw new Error(`Ошибка: ${error.message}`);
		} else {
			throw new Error("Неизвестная ошибка");
		}
	}
};

// Трансформация данных issues
export const transformIssues = (data: IGitHubIssueResponse[]): IIssue[] => {
	return data.map((issue) => ({
		id: issue.id,
		status: issue.state,
		created_at: issue.created_at,
		title: issue.title,
		author: issue.user.login,
		comments: issue.comments,
		number: issue.number,
	}));
};
