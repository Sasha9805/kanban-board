import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IKanbanBoard } from "../shared/types";
import { GITHUB_REG } from "../config";

// Подключаем плагин для работы с относительным временем
dayjs.extend(relativeTime);

export const formatDateAgo = (dateString: string): string => {
	return dayjs(dateString).fromNow(); // Преобразует дату в формат "X ago"
};

// Функция для извлечения организации и репозитория из URL GitHub
export const extractRepoInfo = (repoUrl: string): [string, string] | null => {
	const match = repoUrl.match(GITHUB_REG);

	if (match) {
		return [match[2], match[3]]; // [organization, repository]
	}

	return null; // Если URL не подходит
};

// Запись состояния в localStorage
export const saveToLocalStorage = (key: string, state: IKanbanBoard) => {
	try {
		localStorage.setItem(key, JSON.stringify(state));
	} catch (error) {
		console.error("Error saving to localStorage:", error);
	}
};

// Загружаем состояние из localStorage
export const loadFromLocalStorage = (key: string): IKanbanBoard | null => {
	try {
		const savedState = localStorage.getItem(key);
		return savedState ? JSON.parse(savedState) : null;
	} catch (error) {
		console.error("Error loading from localStorage:", error);
		return null;
	}
};

// Проверка состояния из localStorage
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

// Преобразование числа к формату с "К" в конце
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
