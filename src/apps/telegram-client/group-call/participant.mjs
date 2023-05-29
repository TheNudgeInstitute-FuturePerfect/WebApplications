import { useState } from "react";
import { useEffect } from "react";
import { date, duration } from "../../../tools.js";
import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function Participant() {
  const search = useRef(null);
  const [state, setState] = useState({ loading: true, error: null });
  const { callId } = useParams();

  useEffect(() => {
    getParticipants();
  }, [callId]);

  const getParticipants = (userId) => {
    let query = "";
    if (userId) {
      query = `&userId=${userId}`;
    }
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/telegram-client/video-chat-participant?callId=${callId}${query}`
      )
      .then((response) => {
        setState({ ...response.data, loading: false });
      })
      .catch(() => {
        setState({
          ...state,
          loading: false,
          error: "Internal server error",
        });
      });
  };

  return (
    <>
      {state.loading ? (
        <div className="text-center mt-5 fw-bold heading">Loading...</div>
      ) : state.error ? (
        <div className="text-center mt-5 text-danger heading">
          {state.error}
        </div>
      ) : (
        <div className="text-center p-5">
          <div className="fw-bold heading text-start">
            <Link to="/">Home</Link> &gt;{" "}
            <Link to="/telegram-client/group-call">Group Calls</Link> &gt;
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
                  <div className="p-2 border col-2">User ID</div>
                  <div className="p-2 border col-4">Joined At</div>
                  <div className="p-2 border col-4">Left At</div>
                  <div className="p-2 border col-2">Duration</div>
                </div>

                {state.data?.map((participant, index) => (
                  <div key={index} className="row">
                    <div className="p-2 border col-2">{participant.userId}</div>
                    <div className="p-2 border col-4">
                      {date(participant.createdAt)}
                    </div>
                    <div className="p-2 border col-4">
                      {date(participant.leftAt)}
                    </div>
                    <div className="p-2 border col-2">
                      {duration(participant.createdAt, participant.leftAt)}
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
