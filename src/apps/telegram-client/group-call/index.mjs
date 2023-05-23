import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { date } from "../../../tools.js";
import { useRef } from "react";

function GroupCall() {
  const search = useRef(null);
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    getVideoChats();
  }, []);

  const getVideoChats = (callId) => {
    let query = "";
    if (callId) {
      query = `?callId=${callId}`;
    }
    fetch(
      process.env.REACT_APP_API_ENDPOINT +
        "/api/telegram-client/video-chat" +
        query
    ).then((response) => {
      response
        .json()
        .then((jsonResponse) => setState({ ...jsonResponse, loading: false }));
    });
  };

  return (
    <>
      {state.loading ? (
        <div className="text-center mt-5 fw-bold heading">Loading...</div>
      ) : (
        <div className="text-center p-5">
          <div className="fw-bold heading">
            Group Calls ({state.totalDocuments})
          </div>
          <div className="mt-5 row text-center">
            <div className="d-inline-block w-75">
              <input
                type="text"
                placeholder="Enter Call ID"
                className="p-2 input w-100"
                ref={search}
              />
            </div>
            <div className="d-flex w-25">
              <button
                className="btn btn-primary button-label"
                onClick={() => getVideoChats(search.current?.value)}
              >
                Search
              </button>
            </div>
          </div>
          <div className="mt-5">
            {state.data?.length ? (
              <div className="text-start table-text">
                <div className="row fw-bold">
                  <div className="p-2 border col">Date</div>
                  <div className="p-2 border col">Call ID</div>
                </div>

                <div>
                  {state.data?.map((videoChat, index) => (
                    <div key={index} className="row">
                      <div className="p-2 border col">
                        {date(videoChat.createdAt)}
                      </div>
                      <div className="p-2 border col">
                        <Link to={videoChat.callId}>{videoChat.callId}</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="fw-bold small">Not record found</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default GroupCall;
