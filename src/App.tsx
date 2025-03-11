import Container from "react-bootstrap/Container";
import IssueSearch from "./features/kanban/IssueSearch";
import KanbanBoard from "./features/kanban/KanbanBoard";
import RepoInfo from "./features/kanban/RepoInfo";

const App = () => {
	return (
		<Container
			fluid
			className="pt-4 pb-4 min-vh-100 h-100 d-flex flex-column"
		>
			<IssueSearch />
			<RepoInfo />
			<KanbanBoard />
		</Container>
	);
};

export default App;
