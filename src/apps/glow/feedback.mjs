import { Fragment, useEffect, useState } from "react";
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
import { getSessionData, userFeedback } from "./api.mjs";

function Feedback({ params }) {
  const [state, setState] = useState({
    data: params?.data || [],
    loading: params?.loading === false ? false : true,
    error: params?.error || null,
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const SessionID = queryParams.get("session");

  useEffect(() => {
    if (state.data.length === 0) {
      getSessionData(SessionID).then((data) => setState({ ...data }));
    }
  }, [SessionID]);

  return (
    <div className="d-flex justify-content-center m-3">
      {state.loading ? (
        <div className="text-center mt-5 fw-bold">Loading...</div>
      ) : state.error ? (
        <div className="text-center mt-5 text-danger heading">
          {state.error}
        </div>
      ) : state.data?.length ? (
        <div className="d-flex flex-column" style={{ maxWidth: 500 }}>
          {state.data?.map((session, index) => (
            <Fragment key={index}>
              <div className="border p-2 system-container text-light rounded mb-3 align-self-end ms-5">
                <div
                  className={
                    session.Sessions.Classification?.toLowerCase() ===
                    "could be improved"
                      ? "mb-1 text-warning"
                      : "mb-1 classification-color"
                  }
                >
                  <span className="me-3">
                    {session.Sessions.Classification?.toLowerCase() ===
                    "could be improved" ? (
                      <>
                        <FontAwesomeIcon icon={faCheck} className="me-1" />
                        Could be Improved
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faCheckDouble}
                          className="me-1"
                        />
                        Perfect Line
                      </>
                    )}
                  </span>
                  <span className="float-end">
                    <FontAwesomeIcon
                      icon={
                        session.Sessions.UserFeedback?.toLowerCase() === "good"
                          ? faThumbsUpSolid
                          : faThumbsUpRegular
                      }
                      className="text-secondary me-2"
                      onClick={() =>
                        setState({
                          ...state,
                          data: userFeedback(state.data, "Good", index),
                        })
                      }
                    />
                    <FontAwesomeIcon
                      icon={
                        session.Sessions.UserFeedback?.toLowerCase() === "bad"
                          ? faThumbsDownSolid
                          : faThumbsDownRegular
                      }
                      className="text-secondary"
                      onClick={() =>
                        setState({
                          ...state,
                          data: userFeedback(state.data, "Bad", index),
                        })
                      }
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

              <div className="border p-2 rounded user-container text-light mb-3 align-self-start me-5">
                {decodeURIComponent(session.Sessions.Reply)}
              </div>
            </Fragment>
          ))}
        </div>
      ) : (
        <div className="text-center mt-5 fw-bold small">No data found</div>
      )}
    </div>
  );
}

export default Feedback;
