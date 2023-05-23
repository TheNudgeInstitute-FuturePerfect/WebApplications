import { Link } from "react-router-dom";
import telegramClient from "./images/telegram-client.png";
const Home = () => {
  return (
    <div className="row p-4">
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
    </div>
  );
};

export default Home;
