import { render, screen } from "../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import IssueSearch from "../features/kanban/IssueSearch";

test("init conditions", () => {
	render(<IssueSearch />);

	const repoInput = screen.getByRole("textbox");
	expect(repoInput).toBeInTheDocument();

	const loadBtn = screen.getByRole("button", {
		name: /load issues/i,
	});
	expect(loadBtn).toBeInTheDocument();

	const errorContainer = screen.queryByText(/enter/i);
	expect(errorContainer).toBeNull();
});

test("url input flow", async () => {
	const user = userEvent.setup();

	render(<IssueSearch />);

	const repoInput = screen.getByRole("textbox");

	await user.clear(repoInput);
	await user.type(repoInput, "ht");
	expect(repoInput).toHaveClass("is-invalid");
	const errorContainer = screen.getByText(/enter/i);
	expect(errorContainer).not.toBeEmptyDOMElement();

	await user.clear(repoInput);
	await user.type(repoInput, "https://github.com/f/ ");
	expect(repoInput).toHaveClass("is-invalid");

	await user.clear(repoInput);
	await user.type(repoInput, " ");
	expect(repoInput).toHaveClass("is-invalid");

	await user.clear(repoInput);
	await user.type(repoInput, "https://github.com/facebook/react");
	expect(repoInput).not.toHaveClass("is-invalid");
	expect(errorContainer).toBeEmptyDOMElement();
});
