import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsDown as faThumbsDownRegular,
  faThumbsUp as faThumbsUpRegular,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBookOpen,
  faCheck,
  faCheckDouble,
  faThumbsDown as faThumbsDownSolid,
  faThumbsUp as faThumbsUpSolid,
} from "@fortawesome/free-solid-svg-icons";

function Feedback() {
  const [state, setState] = useState({ loading: true });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const SessionID = queryParams.get("session");

  console.log("Render");
  useEffect(() => {
    console.log("Inside use Effect");
    getSessionData(SessionID);
  }, [SessionID]);

  const getSessionData = (SessionID) => {
    if (SessionID) {
      fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/api/glow/feedback?action=list&table=Sessions&condition=SessionID='${SessionID}' AND MessageType='UserMessage'`
      )
        .then((response) => {
          response.json().then((jsonResponse) => {
            console.log(jsonResponse);
            setState({ ...jsonResponse, loading: false });
            if (
              jsonResponse &&
              jsonResponse.data instanceof Array &&
              jsonResponse.data.length
            )
              trackLink(
                jsonResponse.data[0].Sessions.Mobile,
                jsonResponse.data[0].Sessions.SessionID
              );
          });
        })
        .catch((error) => {
          setState({ ...state, loading: false });
          console.error(error);
        });
    }
  };

  const trackLink = (phone, session) => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/glow/link/tracking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phone, session: session }),
    })
      .then((response) =>
        response.json().then((jsonResponse) => console.log(jsonResponse))
      )
      .catch((error) => {
        console.error(error);
      });
  };

  const userFeedback = (value, index) => {
    if (state.data instanceof Array) {
      const data = state.data.map((element, _index) => {
        if (index === _index) {
          return { Sessions: { ...element.Sessions, UserFeedback: value } };
        }
        return element;
      });
      setState({ data });
      // update database
      const requestBody = {
        table: "Sessions",
        set: {
          UserFeedback: value,
        },
        condition: `ROWID=${state.data[index].Sessions.ROWID}`,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      };
      fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/api/glow/feedback?action=update`,
        options
      )
        .then((response) => {
          response.json().then((jsonResponse) => {
            console.log(jsonResponse);
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="container-fluid p-5">
      {state.loading ? (
        <div className="text-center mt-5 fw-bold">Loading...</div>
      ) : state.data.length ? (
        state.data.map((session, index) => (
          <div className="row justify-content-center mt-3 mb-3" key={index}>
            <div className="col-md-6">
              <div className="border w-75 p-3 system-container text-light mb-3 float-end rounded">
                <div
                  className={
                    session.Sessions.Classification === "Could be improved"
                      ? "mb-1 text-warning"
                      : "mb-1 classification-color"
                  }
                >
                  <span>
                    {session.Sessions.Classification?.toLowerCase() ===
                    "could be improved" ? (
                      <>
                        <FontAwesomeIcon icon={faCheck} className="me-1" />
                        Could be improved
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faCheckDouble}
                          className="me-1"
                        />
                        Perfect line
                      </>
                    )}
                  </span>
                  <span className="float-end">
                    <FontAwesomeIcon
                      icon={
                        session.Sessions.UserFeedback?.toLowerCase() === "up"
                          ? faThumbsUpSolid
                          : faThumbsUpRegular
                      }
                      className="text-secondary me-2"
                      onClick={() => userFeedback("Up", index)}
                    />
                    <FontAwesomeIcon
                      icon={
                        session.Sessions.UserFeedback?.toLowerCase() === "down"
                          ? faThumbsDownSolid
                          : faThumbsDownRegular
                      }
                      className="text-secondary"
                      onClick={() => userFeedback("Down", index)}
                    />
                  </span>
                </div>
                <div className="">
                  {decodeURIComponent(session.Sessions.Message)}
                </div>
                {session.Sessions.Classification?.toLowerCase() ===
                "could be improved" ? (
                  <>
                    <div className="border-top mt-3 pt-2 small tutor-feedback">
                      <FontAwesomeIcon icon={faBookOpen} className="me-1" />
                      Miss Ramya Feedback
                    </div>
                    <div>{session.Sessions.Improvement}</div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="border w-75 p-3 rounded user-container text-light float-start">
                {decodeURIComponent(session.Sessions.Reply)}
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
