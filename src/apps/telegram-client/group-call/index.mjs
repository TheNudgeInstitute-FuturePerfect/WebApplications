import { useCallback, useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { date, duration } from "../../../tools.js";
import { useRef } from "react";
import axios from "axios";
import Pagination from "../../component/pagination.js";

function GroupCall() {
  const search = useRef(null);
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getVideoChats = useCallback((callId, page) => {
    let query = "";
    let filters = ["limit=10"];
    if (callId) filters.push(`callId=${callId}`);
    if (page) filters.push(`page=${page}`);
    if (filters.length) query = `?${filters.join("&")}`;

    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/telegram-client/video-chat${query}`
      )
      .then((response) => {
        setState({ ...response.data });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError("Internal server error");
      });
  }, []);

  useEffect(() => {
    getVideoChats();
  }, [getVideoChats]);

  return (
    <>
      {loading ? (
        <div className="text-center mt-5 fw-bold heading">Loading...</div>
      ) : error ? (
        <div className="text-center mt-5 text-danger heading">{error}</div>
      ) : (
        <div className="text-center p-5">
          <div className="fw-bold heading text-start">
            <Link to="/">Home</Link> &gt; Group Calls ({state.totalDocuments})
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
                  <div className="p-2 border col">Participants</div>
                  <div className="p-2 border col">Duration</div>
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
                      <div className="p-2 border col">
                        {videoChat.numberOfparticipants}
                      </div>
                      <div className="p-2 border col">
                        {duration(videoChat.createdAt, videoChat.endAt)}
                      </div>
                    </div>
                  ))}
                  <Pagination
                    currentPage={state.currentPage}
                    totalPages={state.totalPages}
                    totalDocuments={state.totalDocuments}
                    paginate={(page) => getVideoChats(null, page)}
                  />
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
