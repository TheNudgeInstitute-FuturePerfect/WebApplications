import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { date } from "../tools.js";
import { useRef } from "react";
import axios from "axios";

function LinkTracking() {
  const searchName = useRef(null);
  const searchPhone = useRef(null);
  const searchURL = useRef(null);
  const [state, setState] = useState({ loading: true, error: null });

  useEffect(() => {
    getLinkTracking();
  }, []);

  const getLinkTracking = (name, phone, url) => {
    let query = "";
    let filters = [];
    if (name) filters.push(`name=${name}`);
    if (phone) filters.push(`phone=${phone}`);
    if (url) filters.push(`url=${url}`);
    if (filters.length) query = `?${filters.join("&")}`;
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "/api/link/list" + query)
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
            <Link to="/">Home</Link> &gt; Links ({state.totalDocuments})
          </div>
          <div className="mt-3 row text-center">
            <div className="d-inline-block col-12 col-sm-3 mt-2">
              <input
                type="text"
                placeholder="Enter Name"
                className="p-2 input w-100"
                ref={searchName}
              />
            </div>
            <div className="d-inline-block col-12 col-sm-3 mt-2">
              <input
                type="text"
                placeholder="Enter Phone"
                className="p-2 input w-100"
                ref={searchPhone}
              />
            </div>
            <div className="d-inline-block col-12 col-sm-3 mt-2">
              <input
                type="text"
                placeholder="Enter URL"
                className="p-2 input w-100"
                ref={searchURL}
              />
            </div>
            <div className="d-flex col-12 col-sm-3 mt-2">
              <button
                className="btn btn-primary button-label"
                onClick={() =>
                  getLinkTracking(
                    searchName.current?.value,
                    searchPhone.current?.value,
                    searchURL.current?.value
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
                  <div className="p-2 border col">Date</div>
                  <div className="p-2 border col">Name</div>
                  <div className="p-2 border col">Phone</div>
                  <div className="p-2 border col">Link Opened</div>
                  <div className="p-2 border col">URL</div>
                </div>

                <div>
                  {state.data?.map((link, index) => (
                    <div key={index} className="row">
                      <div className="p-2 border col">
                        {date(link.createdAt)}
                      </div>
                      <div className="p-2 border col">{link.name}</div>
                      <div className="p-2 border col">{link.phone}</div>
                      <div className="p-2 border col">
                        {link.status === "opened" ? "Yes" : "No"}
                      </div>
                      <div className="p-2 border col">{link.url}</div>
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

export default LinkTracking;
