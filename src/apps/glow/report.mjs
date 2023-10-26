import {
  faPaperPlane,
  faSquareCheck,
  faStar as faStarRegular,
} from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Feedback from "./feedback.mjs";
import { useEffect, useState } from "react";
import { getSessionData, getSystemPrompts, trackLink } from "./api.mjs";
import { useLocation } from "react-router-dom";
import downArrow from "../../images/down-arrow.png";

function Report() {
  const [state, setState] = useState({ stars: 0, loading: true });
  const [showObjective, setShowObjective] = useState(false);
  const [showFeedback] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const SessionID = queryParams.get("session");

  useEffect(() => {
    getSessionData(SessionID).then((SessionData) => {
      if (SessionData.data.length)
        getSystemPrompts(SessionData.data[0].SystemPromptsROWID).then(
          (SystemPrompt) => {
            setState({
              ...SessionData,
              stars: stars(SessionData.data),
              wordCount: wordCount(SessionData.data),
              ...SystemPrompt.data[0],
            });
          }
        );
      else setState({ data: [], loading: false });
    });
  }, [SessionID]);

  const wordCount = (data) => {
    return data.reduce(
      (accumulator, currentValue) =>
        accumulator +
          decodeURIComponent(currentValue.Message)?.split(" ")?.length || 0,
      0
    );
  };

  const stars = (data) => {
    const perfectLines = data.reduce(
      (accumulator, currentValue) =>
        accumulator +
        (currentValue.Classification?.toLowerCase() === "could be improved"
          ? 0
          : 1),

      0
    );
    const percentage = (perfectLines / data.length) * 100;
    if (percentage < 40) return 1;
    if (percentage >= 40 && percentage < 70) return 2;
    if (percentage >= 70) return 3;
  };

  const handleExpand = () => {
    if (expanded) setExpanded(false);
    else {
      trackLink(
        state.data[0].Mobile,
        state.data[0].SessionID,
        "Feedback Expanded"
      );
      setExpanded(true);
    }
  };

  return (
    <div className="nudge-theme d-flex justify-content-center m-3">
      {state.loading ? (
        <div className="text-center mt-5 fw-bold">Loading...</div>
      ) : state.error ? (
        <div className="text-center mt-5 text-danger heading">
          {state.error}
        </div>
      ) : state.data?.length ? (
        <div className="d-flex flex-column text-center">
          <div className="text-nudge heading" style={{ fontSize: "2rem" }}>
            Congratulations 👏🏽
          </div>
          <div
            className="d-none text-secondary mt-2"
            style={{ fontSize: "1rem" }}
          >
            You have completed your practice session!
          </div>
          <div className="text-nudge mt-3" style={{ fontSize: "1.25rem" }}>
            {`${state?.Persona ? state.Persona + " - " : "Topic: "}${
              state?.Name
            }`}
          </div>
          <div className="text-nudge mt-3" style={{ fontSize: "1.5rem" }}>
            English Level
          </div>
          <div className="mt-1" style={{ fontSize: "2rem" }}>
            <FontAwesomeIcon
              icon={state.stars >= 1 ? faStarSolid : faStarRegular}
              className="text-nudge"
            />
            <FontAwesomeIcon
              icon={state.stars >= 2 ? faStarSolid : faStarRegular}
              className="text-nudge"
            />
            <FontAwesomeIcon
              icon={state.stars > 2 ? faStarSolid : faStarRegular}
              className="text-nudge"
            />
          </div>
          <div className="text-secondary">
            {state.stars === 3
              ? "Excellent!"
              : state.stars === 2
              ? "Great job!"
              : state.stars === 1
              ? "Good job!"
              : null}
          </div>

          <div className="w-100 text-nudge text-start mt-5" style={{}}>
            <div
              className="d-none text-nudge border rounded p-2 cursor-pointer"
              style={{ borderColor: "#693d30", backgroundColor: "#f9f9f9" }}
              onClick={() => setShowObjective(showObjective ? false : true)}
            >
              <div className="d-flex justify-content-between fw-bold">
                <div className="w-auto">Tasks Completed</div>
                <div className="d-flex">
                  <div className="me-3">1/3</div>
                  <div>
                    <FontAwesomeIcon icon={faAngleDown} />
                  </div>
                </div>
              </div>
              <div
                className="mt-1"
                style={
                  showObjective ? { display: "block" } : { display: "none" }
                }
              >
                <div className="mt-2">
                  <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
                  <span>Objective 1</span>
                </div>
                <div className="mt-2">
                  <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
                  <span>Objective 1</span>
                </div>
                <div className="mt-2">
                  <FontAwesomeIcon icon={faSquareCheck} className="me-2" />
                  <span>Objective 1</span>
                </div>
              </div>
            </div>

            <div
              className="text-nudge d-flex flex-column justify-content-between mt-2 border rounded p-2 cursor-pointer"
              style={{ borderColor: "#693d30" }}
            >
              <div
                className="w-auto fw-bold d-flex justify-content-between"
                // onClick={() => setShowFeedback(showFeedback ? false : true)}
              >
                <div>Sentence Correction</div>
                {/* <div className="d-flex">
                  <div>
                    <FontAwesomeIcon icon={faAngleDown} />
                  </div>
                </div> */}
              </div>
              <div className="position-relative p-2">
                <div
                  className="border rounded"
                  style={{
                    maxHeight: expanded ? 400 : 200,
                    overflowY: "scroll",
                    display: showFeedback ? "block" : "none",
                  }}
                >
                  <Feedback
                    params={{
                      data: state.data,
                      loading: state.loading,
                      error: state.error,
                    }}
                  />
                </div>
                <div
                  className="d-flex justify-content-center pt-5 pb-3 border-right rounded position-absolute"
                  style={{
                    width: "97%",
                    opacity: 0.7,
                    bottom: 0,
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))",
                  }}
                  onClick={handleExpand}
                >
                  <img src={downArrow} alt="Expand" width={20} />
                  {/* <FontAwesomeIcon
                    icon={expanded ? faAngleDoubleUp : faAngleDoubleDown}
                  /> */}
                </div>
              </div>
            </div>
            <div
              className="text-nudge d-flex justify-content-between mt-2 fw-bold border rounded p-2 cursor-pointer"
              style={{ borderColor: "#693d30" }}
            >
              <div className="w-auto">Words used</div>
              <div className="d-flex">
                <div className="me-3">{state.wordCount}</div>
              </div>
            </div>
          </div>
          <div className="d-flex mt-2">
            <div className="d-none d-flex border rounded p-2 me-2">
              <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: 30 }} />
            </div>
            <div
              className="d-flex w-100 text-light bg-nudge justify-content-center border rounded p-2"
              style={{ borderColor: "#693d30 !important" }}
            >
              <div className="d-flex align-items-center">
                <a
                  href="https://wa.me/918884401029"
                  className="text-decoration-none text-light"
                >
                  Back to Practice
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-info fw-bold mt-5">Invalid Session</div>
      )}
    </div>
  );
}

export default Report;
