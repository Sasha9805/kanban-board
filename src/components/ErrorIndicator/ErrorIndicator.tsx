import errorImg from "./error.gif";
import "./errorMessage.css";

const ErrorIndicator = () => {
	return <img className="error-message" src={errorImg} alt="Error" />;
};

export default ErrorIndicator;
