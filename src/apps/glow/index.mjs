import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { date } from "../../tools.js";
import { useRef } from "react";
import log from "../../log.mjs";

function Glow() {
  const searchPhone = useRef(null);
  const searchSession = useRef(null);
  const [state, setState] = useState({ loading: true });

  log("Render");
  useEffect(() => {
    log("Inside use Effect");
    getGlowLinkTracking();
  }, []);

  const getGlowLinkTracking = (phone, session) => {
    let query = "";
    let filters = [];
    if (phone) filters.push(`phone=${phone}`);
    if (session) filters.push(`session=${session}`);
    if (filters.length) query = `?${filters.join("&")}`;

    fetch(
      process.env.REACT_APP_API_ENDPOINT + "/api/glow/link/tracking" + query
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
        <div className="text-center p-2 p-sm-5">
          <div className="fw-bold heading text-start">
            <Link to="/">Home</Link> &gt; Glow Link Tracking (
            {state.totalDocuments})
          </div>
          <div className="mt-3 row text-center">
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
            <div className="mt-2 col-sm-2">
              <button
                className="btn btn-primary button-label"
                onClick={() =>
                  getGlowLinkTracking(
                    searchPhone.current?.value,
                    searchSession.current?.value
                  )
                }
              >
                Search
              </button>
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
