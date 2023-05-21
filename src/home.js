import { Link } from "react-router-dom";
import eclass from "./images/e-class.png";

const Home = () => {
  return (
    <div className="row p-5">
      <div className="col-2 shadow rounded text-center p-4">
        <h4 className="">eClass</h4>
        <img src={eclass} alt="eClass" className="w-100" />
        <Link
          to={`${process.env.REACT_APP_API_ENDPOINT}/e-class/`}
          style={{ fontSize: 20 }}
          className="btn btn-primary text-decoration-none ps-5 pe-5"
        >
          Start
        </Link>
      </div>
    </div>
  );
};

export default Home;
