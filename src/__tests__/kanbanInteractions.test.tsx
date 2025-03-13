import {
	render,
	screen,
	fireEvent,
	waitFor,
} from "../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

test("loader shows while the correct url", async () => {
	const user = userEvent.setup();

	render(<App />);

	const repoInput = screen.getByRole("textbox");

	const loadBtn = screen.getByRole("button", {
		name: /load issues/i,
	});

	await user.clear(repoInput);
	await user.type(repoInput, "https://github.com/facebook/react");
	await user.click(loadBtn);
	await waitFor(() => {
		expect(loadBtn).toBeDisabled();
	});

	const loader = screen.getByTestId("loader");
	expect(loader).toBeInTheDocument();
});

test("error indicator shows while the correct url", async () => {
	server.use(
		http.get("https://api.github.com/repos/facebook/react/issues", () => {
			return new HttpResponse(null, { status: 500 });
		}),
		http.get("https://api.github.com/repos/facebook/react", () => {
			return new HttpResponse(null, { status: 500 });
		})
	);
	const user = userEvent.setup();

	render(<App />);

	const repoInput = screen.getByRole("textbox");

	const loadBtn = screen.getByRole("button", {
		name: /load issues/i,
	});

	await user.clear(repoInput);
	await user.type(repoInput, "https://github.com/facebook/react");
	await user.click(loadBtn);

	const errorIndicator = await screen.findByRole("img", {
		name: /error image/i,
	});
	expect(errorIndicator).toBeInTheDocument();
});

test("successful data receiving", async () => {
	const user = userEvent.setup();

	render(<App />);

	const repoInput = screen.getByRole("textbox");

	const loadBtn = screen.getByRole("button", {
		name: /load issues/i,
	});

	await user.clear(repoInput);
	await user.type(repoInput, "https://github.com/facebook/react");
	await user.click(loadBtn);

	const links = await screen.findAllByRole("link");
	const linksTextArray = links.map((a) => a.textContent);
	expect(linksTextArray).toEqual(["Facebook", "React"]);
	const stars = screen.getByText(/233K stars/i);
	expect(stars).toBeInTheDocument();

	const headings = screen.getAllByRole("heading");
	const headingsTextArray = headings.map((h) => h.textContent);
	expect(headingsTextArray).toEqual(["todo", "inProgress", "done"]);

	const openIssue1 = screen.getByText(/#32599/i);
	const closedIssue1 = screen.getByText(/#32598/i);
	const closedIssue2 = screen.getByText(/#32597/i);

	const todoColumn = screen.getByTestId("todo");
	const doneColumn = screen.getByTestId("done");

	expect(todoColumn).toContainElement(openIssue1);
	expect(doneColumn).toContainElement(closedIssue1);
	expect(doneColumn).toContainElement(closedIssue2);
});

test("drag from done to inProgress", async () => {
	const user = userEvent.setup();

	render(<App />);

	const repoInput = screen.getByRole("textbox");

	const loadBtn = screen.getByRole("button", {
		name: /load issues/i,
	});

	await user.clear(repoInput);
	await user.type(repoInput, "https://github.com/facebook/react");
	await user.click(loadBtn);

	const closedIssue = await screen.findByText(/#32598/i);
	const inProgressColumn = screen.getByTestId("inProgress");
	const doneColumn = screen.getByTestId("done");

	fireEvent.dragStart(closedIssue);
	fireEvent.dragEnter(inProgressColumn);
	fireEvent.drop(inProgressColumn);

	const newInProgressIssue = screen.getByText(/#32598/i);

	expect(inProgressColumn).toContainElement(newInProgressIssue);
	expect(doneColumn).not.toContainElement(closedIssue);
	expect(doneColumn).not.toContainElement(newInProgressIssue);
});
