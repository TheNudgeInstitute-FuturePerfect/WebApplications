import { useState } from "react";
import { useEffect } from "react";
import { date } from "../../../tools.js";
import { useRef } from "react";
import { useParams } from "react-router-dom";

function Participant() {
  const search = useRef(null);
  const [state, setState] = useState({ loading: true });
  const { callId } = useParams();

  useEffect(() => {
    getParticipants();
  }, [callId]);

  const getParticipants = (userId) => {
    let query = "";
    if (userId) {
      query = `&userId=${userId}`;
    }
    fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/telegram-client/video-chat-participant?callId=${callId}${query}`
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
            Participants ({state.totalDocuments})
          </div>
          <div className="mt-5 row">
            <div className="d-inline-block w-75">
              <input
                type="text"
                placeholder="Enter User ID"
                className="p-1 input w-100"
                ref={search}
              />
            </div>
            <div className="d-flex w-25">
              <button
                className="btn btn-primary button-label"
                onClick={() => getParticipants(search.current?.value)}
              >
                Search
              </button>
            </div>
          </div>
          <div className="mt-5">
            {state.data?.length ? (
              <div className="text-start table-text">
                <div className="row fw-bold">
                  <div className="p-2 border col-4">User ID</div>
                  <div className="p-2 border col-5">Joined At</div>
                  <div className="p-2 border col-3">Left At</div>
                </div>

                {state.data?.map((participant, index) => (
                  <div key={index} className="row">
                    <div className="p-2 border col-4">{participant.userId}</div>
                    <div className="p-2 border col-5">
                      {date(participant.createdAt)}
                    </div>
                    <div className="p-2 border col-3">
                      {date(participant.leftAt)}
                    </div>
                  </div>
                ))}
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

export default Participant;
