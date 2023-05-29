import { Link } from "react-router-dom";
import talkNote from "./images/talk-note.png";
import eclass from "./images/e-class.png";

import telegramClient from "./images/telegram-client.png";
import glow from "../src/images/glow.png";
const Home = () => {
  return (
    <div className="row p-4">
      <div className="col-12 col-sm-6 col-md-3 col-lg-2 shadow rounded text-center p-4 app-cont mt-3">
        <h4 className="">Talk Note</h4>
        <img src={talkNote} alt="Talk Note" className="w-100 mt-2 mb-2" />
        <Link
          to="/talk-note"
          style={{ fontSize: 20 }}
          className="btn btn-primary text-decoration-none w-100"
        >
          Start
        </Link>
      </div>
      <div className="col-12 col-sm-6 col-md-3 col-lg-2 shadow rounded text-center p-4 app-cont mt-3">
        <h4 className="">eClass</h4>
        <img src={eclass} alt="eClass" className="w-100 mt-2 mb-2" />
        <Link
          to={`${process.env.REACT_APP_API_ENDPOINT}/e-class/`}
          style={{ fontSize: 20 }}
          className="btn btn-primary text-decoration-none w-100"
          target="blank"
        >
          Start
        </Link>
      </div>
      <div className="col-12 col-sm-6 col-md-3 col-lg-2 shadow rounded text-center p-4 app-cont mt-3">
        <h4 className="">Telegram</h4>
        <img
          src={telegramClient}
          alt="Telegram Client"
          className="w-100 mt-2 mb-2"
        />
        <Link
          to="/telegram-client/group-call"
          style={{ fontSize: 20 }}
          className="btn btn-primary text-decoration-none w-100"
        >
          Start
        </Link>
      </div>
      <div className="col-12 col-sm-6 col-md-3 col-lg-2 shadow rounded text-center p-4 app-cont mt-3">
        <h4 className="">GLOW</h4>
        <img src={glow} alt="GLOW" className="w-100 mt-2 mb-2" />
        <Link
          to="/glow"
          style={{ fontSize: 20 }}
          className="btn btn-primary text-decoration-none w-100"
        >
          Start
        </Link>
      </div>
    </div>
  );
};

export default Home;
