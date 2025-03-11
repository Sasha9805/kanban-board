import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import ErrorIndicator from "../../components/ErrorIndicator/ErrorIndicator";
import Loader from "../../components/Loader/Loader";
import NotFoundData from "../../components/NotFoundData/NotFoundData";
import { useAppSelector } from "../../app/hooks";
import { selectIssuesByRepo } from "./kanbanSlice";
import { IssueColumn } from "./IssueColumn";

export const KanbanBoard = () => {
	const issues = useAppSelector(selectIssuesByRepo);
	const isLoading = useAppSelector((state) => state.kanban.isLoading);
	const isError = useAppSelector((state) => state.kanban.error);

	const noContent = isLoading || isError || !issues;

	if (noContent) {
		return (
			<Row className="mt-4 h-100 flex-grow-1">
				<Col className="d-flex align-items-center">
					{isLoading && <Loader />}
					{isError && <ErrorIndicator />}
					{!issues && !isLoading && !isError && <NotFoundData />}
				</Col>
			</Row>
		);
	}

	return (
		<Row className="mt-2 gy-4">
			<Col sm="4">
				<IssueColumn title="todo" issues={issues.todo} />
			</Col>
			<Col sm="4">
				<IssueColumn title="inProgress" issues={issues.inProgress} />
			</Col>
			<Col sm="4">
				<IssueColumn title="done" issues={issues.done} />
			</Col>
		</Row>
	);
};

export default KanbanBoard;
