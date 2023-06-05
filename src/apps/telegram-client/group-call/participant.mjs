import { useCallback, useState } from "react";
import { useEffect } from "react";
import { date, duration } from "../../../tools.js";
import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Pagination from "../../component/pagination.js";
import Download from "../../component/download.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

function Participant() {
  const search = useRef(null);
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { callId } = useParams();
  const [showModal, setShowModal] = useState(false);

  const getParticipants = useCallback(
    (userId, page) => {
      let query = "";
      let filters = [`callId=${callId}`, "limit=10"];
      if (userId) filters.push(`userId=${userId}`);
      if (page) filters.push(`page=${page}`);
      if (filters.length) query = `?${filters.join("&")}`;

      axios
        .get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/telegram-client/video-chat-participant${query}`
        )
        .then((response) => {
          setState({ ...response.data });
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setError("Internal server error");
        });
    },
    [callId]
  );

  useEffect(() => {
    getParticipants();
  }, [callId, getParticipants]);

  return (
    <>
      {loading ? (
        <div className="text-center mt-5 fw-bold heading">Loading...</div>
      ) : error ? (
        <div className="text-center mt-5 text-danger heading">{error}</div>
      ) : (
        <div className="text-center p-5">
          <div className="fw-bold heading text-start">
            <Link to="/">Home</Link> &gt;{" "}
            <Link to="/telegram-client/group-call">Group Calls</Link> &gt;
            Participants ({state.totalDocuments})
          </div>
          <div className="mt-5 row">
            <Download
              showModal={showModal}
              hideModal={() => setShowModal(false)}
              path="telegram-client/video-chat-participant"
            />
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
                className="btn btn-primary button-label d-flex align-self-center me-2"
                onClick={() => getParticipants(search.current?.value)}
              >
                Search
              </button>
              <FontAwesomeIcon
                icon={faDownload}
                className="text-secondary d-flex align-self-center cursor-pointer"
                style={{ fontSize: "1.5rem" }}
                title="Download"
                onClick={() => setShowModal(true)}
              />
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
                <Pagination
                  currentPage={state.currentPage}
                  totalPages={state.totalPages}
                  totalDocuments={state.totalDocuments}
                  paginate={(page) => getParticipants(null, page)}
                />
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
