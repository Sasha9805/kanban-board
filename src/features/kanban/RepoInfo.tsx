import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";

import { useAppSelector } from "../../app/hooks";
import { extractRepoInfo, formatNumberToK } from "../../utils/helpers";
import { selectRepoStars } from "./kanbanSlice";

const RepoInfo = () => {
	const stars = useAppSelector(selectRepoStars);
	const repoUrl = useAppSelector((state) => state.kanban.repoUrl);
	const isLoading = useAppSelector((state) => state.kanban.isLoading);
	const isError = useAppSelector((state) => state.kanban.error);
	const repoInfo = extractRepoInfo(repoUrl);

	if (!repoUrl || !repoInfo) {
		return (
			<Row className="mt-4">
				<Col>Enter a repo URL above</Col>
			</Row>
		);
	}

	if (isLoading) {
		return null;
	}

	if (isError) {
		return (
			<Row className="mt-4">
				<Col>
					Some error occurred. Try again to get additional repo info!
				</Col>
			</Row>
		);
	}

	return (
		<Row className="mt-4">
			<Col className="d-flex">
				<Breadcrumb className="breadcrumb mb-0">
					<Breadcrumb.Item
						href={`https://github.com/${repoInfo[0]}`}
						target="_blank"
					>
						{repoInfo[0][0].toUpperCase() + repoInfo[0].slice(1)}
					</Breadcrumb.Item>
					<Breadcrumb.Item
						href={`https://github.com/${repoInfo[0]}/${repoInfo[1]}`}
						target="_blank"
					>
						{repoInfo[1][0].toUpperCase() + repoInfo[1].slice(1)}
					</Breadcrumb.Item>
				</Breadcrumb>
				<div className="ps-4">
					<i className="bi bi-star-fill text-warning"></i>
					<span className="ms-1">
						{stars ? formatNumberToK(stars) : "no data about"} stars
					</span>
				</div>
			</Col>
		</Row>
	);
};

export default RepoInfo;
