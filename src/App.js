import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout";
import Home from "./home";
import PageNotFound from "./page-not-found";
import Feedback from "./apps/glow/feedback.mjs";
import Glow from "./apps/glow/index.mjs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/glow" element={<Glow />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route path="/glow/feedback" element={<Feedback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
