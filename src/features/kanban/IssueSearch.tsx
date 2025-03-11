import { Formik } from "formik";
import * as yup from "yup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchIssuesThunk, updateRepoUrl } from "./kanbanSlice";
import {
	checkOrganizationAndRepoInLocalStorage,
	extractRepoInfo,
} from "../../utils/helpers";
import { GITHUB_REG, KANBAN_KEY } from "../../config";

const schema = yup.object().shape({
	repoUrl: yup
		.string()
		.matches(
			GITHUB_REG,
			"Enter a correct url! (e.g. https://github.com/facebook/react)"
		)
		.required("Please enter url"),
});

const IssueSearch = () => {
	const dispatch = useAppDispatch();
	const repoUrl = useAppSelector((state) => state.kanban.repoUrl);

	return (
		<Formik
			validationSchema={schema}
			initialValues={{
				repoUrl: repoUrl,
			}}
			onSubmit={async (values) => {
				const repoUrl = values.repoUrl;
				if (!repoUrl) {
					return;
				}

				const repoInfo = extractRepoInfo(repoUrl);
				if (!repoInfo) {
					return;
				}

				dispatch(updateRepoUrl(repoUrl));

				if (
					!checkOrganizationAndRepoInLocalStorage(
						KANBAN_KEY,
						repoInfo[0],
						repoInfo[1]
					)
				) {
					await dispatch(fetchIssuesThunk(repoUrl)).unwrap();
				}
			}}
		>
			{({
				values,
				errors,
				touched,
				handleChange,
				handleBlur,
				handleSubmit,
				isSubmitting,
			}) => {
				return (
					<Form onSubmit={handleSubmit} noValidate>
						<Row className="gy-4">
							<Form.Group as={Col} controlId="repoUrl">
								<Form.Control
									name="repoUrl"
									type="url"
									placeholder="Enter repo URL"
									value={values.repoUrl}
									onChange={handleChange}
									onBlur={handleBlur}
									isValid={touched.repoUrl && !errors.repoUrl}
									isInvalid={!!errors.repoUrl}
								/>
								<Form.Control.Feedback type="invalid">
									{errors.repoUrl}
								</Form.Control.Feedback>
							</Form.Group>
							<Col md="2" xl="auto">
								<Button
									type="submit"
									disabled={isSubmitting}
									className="w-100 text-nowrap"
								>
									Load issues
								</Button>
							</Col>
						</Row>
					</Form>
				);
			}}
		</Formik>
	);
};

export default IssueSearch;
