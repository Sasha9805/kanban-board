import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import ErrorIndicator from "../ErrorIndicator/ErrorIndicator";

const ErrorFallback = () => {
	return (
		<Container className="mt-4">
			<Row>
				<Col>
					<ErrorIndicator />
					<p className="fs-3 mx-auto text-center">
						Something went wrong. Please, try again later...
					</p>
				</Col>
			</Row>
		</Container>
	);
};

export default ErrorFallback;
