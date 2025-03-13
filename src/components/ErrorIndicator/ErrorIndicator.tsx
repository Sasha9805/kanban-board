import errorImg from "./error.gif";
import "./errorMessage.css";

const ErrorIndicator = () => {
	return (
		<img
			aria-label="error image"
			className="error-message"
			src={errorImg}
			alt="Error"
		/>
	);
};

export default ErrorIndicator;
