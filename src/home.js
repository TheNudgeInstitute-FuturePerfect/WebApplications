import { Link } from "react-router-dom";
import talkNote from "./images/talk-note.png";

const Home = () => {
  return (
    <div className="row p-5">
      <div className="col-4 shadow rounded text-center p-4">
        <h4 className="">Talk Note</h4>
        <img src={talkNote} alt="Talk Note" className="w-100" />
        <Link
          to="/talk-note"
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
