export interface IIssue {
	id: number;
	number: number;
	title: string;
	created_at: string;
	author: string;
	comments: number;
	status: "open" | "closed";
}

export interface IIssuesData {
	todo: IIssue[];
	inProgress: IIssue[];
	done: IIssue[];
	stars: number | null;
}

export interface IKanbanBoard {
	[organization: string]: {
		[repository: string]: IIssuesData;
	};
}

export interface IIssuesState {
	data: IKanbanBoard;
	isLoading: boolean;
	error: string | null;
	repoUrl: string;
}

export interface IGitHubIssueResponse {
	id: number;
	title: string;
	state: "open" | "closed";
	created_at: string;
	user: {
		login: string;
	};
	comments: number;
	number: number;
}

export interface DragItem {
	index: number;
	id: string;
	columnName: "todo" | "inProgress" | "done";
	type: string;
}

export type ColumnsNames = "todo" | "inProgress" | "done";
