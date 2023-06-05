import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { date } from "../../tools.js";
import { useRef } from "react";
import axios from "axios";
import Pagination from "../component/pagination.js";
import { useCallback } from "react";
import Download from "../component/download.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

function Glow() {
  const searchPhone = useRef(null);
  const searchSession = useRef(null);
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getGlowLinkTracking = useCallback((phone, session, page) => {
    let query = "";
    let filters = ["limit=10"];
    if (phone) filters.push(`phone=${phone}`);
    if (session) filters.push(`session=${session}`);
    if (page) filters.push(`page=${page}`);
    if (filters.length) query = `?${filters.join("&")}`;

    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/glow/link/tracking${query}`
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
    getGlowLinkTracking();
  }, [getGlowLinkTracking]);

  return (
    <>
      {loading ? (
        <div className="text-center mt-5 fw-bold heading">Loading...</div>
      ) : error ? (
        <div className="text-center mt-5 text-danger heading">{error}</div>
      ) : (
        <div className="text-center p-2 p-sm-5">
          <div className="fw-bold heading text-start">
            <Link to="/">Home</Link> &gt; Glow Link Tracking (
            {state.totalDocuments})
          </div>
          <div className="mt-3 row text-center">
            <Download
              showModal={showModal}
              hideModal={() => setShowModal(false)}
              path="glow/link/tracking"
            />
            <div className="mt-2 col-sm-5">
              <input
                type="text"
                placeholder="Enter Phone"
                className="p-2 input w-100"
                ref={searchPhone}
              />
            </div>
            <div className="mt-2 col-sm-5">
              <input
                type="text"
                placeholder="Enter Session ID"
                className="p-2 input w-100"
                ref={searchSession}
              />
            </div>
            <div className="mt-2 col-sm-2 d-flex">
              <button
                className="btn btn-primary button-label me-3 d-flex align-self-center"
                onClick={() =>
                  getGlowLinkTracking(
                    searchPhone.current?.value,
                    searchSession.current?.value
                  )
                }
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
                  <div className="p-2 border col">Phone</div>
                  <div className="p-2 border col">Session ID</div>
                  <div className="p-2 border col">Time</div>
                </div>

                <div>
                  {state.data?.map((glowLinkTracking, index) => (
                    <div key={index} className="row">
                      <div className="p-2 border col">
                        {glowLinkTracking.phone}
                      </div>
                      <div className="p-2 border col">
                        {glowLinkTracking.session}
                      </div>
                      <div className="p-2 border col">
                        {date(glowLinkTracking.createdAt)}
                      </div>
                    </div>
                  ))}
                  <Pagination
                    currentPage={state.currentPage}
                    totalPages={state.totalPages}
                    totalDocuments={state.totalDocuments}
                    paginate={(page) => getGlowLinkTracking(null, null, page)}
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

export default Glow;
