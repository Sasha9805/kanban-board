import noDataImg from "./no-data.gif";
import "./notFoundData.css";

const NotFoundData = () => {
	return (
		<img
			aria-label="not-found-data"
			className="not-found-data"
			src={noDataImg}
			alt="No data"
		/>
	);
};

export default NotFoundData;
