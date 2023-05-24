import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faLightbulb } from "@fortawesome/free-regular-svg-icons";
import { faBookOpen, faCheck } from "@fortawesome/free-solid-svg-icons";

function Feedback() {
  const [state, setState] = useState({ loading: true });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const SessionID = queryParams.get("session");

  useEffect(() => {
    getSessionData(SessionID);
  }, [SessionID]);

  const getSessionData = (SessionID) => {
    if (SessionID) {
      fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/api/glow/feedback?action=list&table=Sessions&condition=SessionID='${SessionID}'`
      )
        .then((response) => {
          response.json().then((jsonResponse) => {
            setState({ ...jsonResponse, loading: false });
          });
        })
        .catch((error) => {
          setState({ ...state, loading: false });
          console.error(error);
        });
    }
  };

  return (
    <div className="container-fluid p-4">
      {state.loading ? (
        <div className="text-center mt-5 fw-bold">Loading...</div>
      ) : state.data.length ? (
        state.data.map((session, index) => (
          <div className="row justify-content-center mt-3 mb-3" key={index}>
            <div className="col-md-6">
              <div className="border w-75 p-3 rounded user-container text-light mb-3">
                {decodeURIComponent(session.Sessions.Reply)}
              </div>
              <div className="border w-75 p-3 system-container text-light  float-end rounded">
                <div
                  className={
                    session.Sessions.Classification === "Could be improved"
                      ? "mb-1 text-info"
                      : "mb-1 classification-color"
                  }
                >
                  <span>
                    {session.Sessions.Classification?.toLowerCase() ===
                    "could be improved" ? (
                      <>
                        <FontAwesomeIcon icon={faCircle} className="me-1" />
                        Could be improved
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheck} className="me-1" />
                        Perfect line
                      </>
                    )}
                  </span>
                  <FontAwesomeIcon
                    icon={faLightbulb}
                    className="text-secondary float-end"
                  />
                </div>
                <div className="">
                  {decodeURIComponent(session.Sessions.Message)}
                </div>
                {session.Sessions.Classification?.toLowerCase() ===
                "could be improved" ? (
                  <>
                    <div className="border-top mt-3 pt-2 small tutor-feedback">
                      <FontAwesomeIcon icon={faBookOpen} className="me-1" />
                      Tutor Feedback
                    </div>
                    <div>{session.Sessions.Improvement}</div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center mt-5">
          <div className="text-danger">Something went wrong</div>
          <div className="mt-4">
            <a
              href=""
              onClick={location.reload}
              className="btn btn-primary text-decoration-none"
              style={{ cursor: "pointer" }}
            >
              Retry
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feedback;
