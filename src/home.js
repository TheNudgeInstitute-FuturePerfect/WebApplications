import { Link } from "react-router-dom";
import talkNote from "./images/talk-note.png";
import eclass from "./images/e-class.png";
import link from "./images/link.png";

import telegramClient from "./images/telegram-client.png";
import glow from "../src/images/glow.png";
const Home = () => {
  return (
    <div className="row p-5 p-sm-2">
      <div className="col-12 col-sm-3 col-md-2 shadow rounded text-center p-2 app-cont mt-3">
        <img src={talkNote} alt="Talk Note" className="w-100 mt-2 mb-2" />
        <Link
          to="/talk-note"
          style={{ fontSize: 14 }}
          className="btn btn-primary text-decoration-none w-100"
        >
          Talk Note
        </Link>
      </div>
      <div className="col-12 col-sm-3 col-md-2 shadow rounded text-center p-2 app-cont mt-3">
        <img src={eclass} alt="eClass" className="w-100 mt-2 mb-2" />
        <Link
          to={`${process.env.REACT_APP_API_ENDPOINT}/e-class/`}
          style={{ fontSize: 14 }}
          className="btn btn-primary text-decoration-none w-100"
          target="blank"
        >
          eClass
        </Link>
      </div>
      <div className="col-12 col-sm-3 col-md-2 shadow rounded text-center p-2 app-cont mt-3">
        <img
          src={telegramClient}
          alt="Telegram Client"
          className="w-100 mt-2 mb-2"
        />
        <Link
          to="/telegram-client/group-call"
          style={{ fontSize: 14 }}
          className="btn btn-primary text-decoration-none w-100"
        >
          Telegram
        </Link>
      </div>
      <div className="col-12 col-sm-3 col-md-2 shadow rounded text-center p-2 app-cont mt-3">
        <img src={glow} alt="GLOW" className="w-100 mt-2 mb-2" />
        <Link
          to="/glow"
          style={{ fontSize: 14 }}
          className="btn btn-primary text-decoration-none w-100"
        >
          GLOW
        </Link>
      </div>
      <div className="col-12 col-sm-3 col-md-2 shadow rounded text-center p-2 app-cont mt-3">
        <img src={link} alt="GLOW" className="w-100 mt-2 mb-2" />
        <Link
          to="/link-tracking"
          style={{ fontSize: 14 }}
          className="btn btn-primary text-decoration-none w-100"
        >
          Link
        </Link>
      </div>
    </div>
  );
};

export default Home;
