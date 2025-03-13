import { http, HttpResponse, delay } from "msw";
import { facebookReactMock, facebookReactIssuesMock } from "./mockData";

export const handlers = [
	http.get("https://api.github.com/repos/facebook/react/issues", async () => {
		await delay(100);
		return HttpResponse.json(facebookReactIssuesMock);
	}),
	http.get("https://api.github.com/repos/facebook/react", async () => {
		await delay(100);
		return HttpResponse.json(facebookReactMock);
	}),
];
