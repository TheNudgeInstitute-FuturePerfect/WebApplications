import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout";
import Home from "./home";
import PageNotFound from "./page-not-found";
import TalkNote from "./apps/talk-note";
import GroupCall from "./apps/telegram-client/group-call/index.mjs";
import Participant from "./apps/telegram-client/group-call/participant.mjs";
import Feedback from "./apps/glow/feedback.mjs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/talk-note" element={<TalkNote />} />
          <Route path="/telegram-client/group-call" element={<GroupCall />} />
          <Route
            path="/telegram-client/group-call/:callId"
            element={<Participant />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route path="/glow/feedback" element={<Feedback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
