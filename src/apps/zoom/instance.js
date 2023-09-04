import { useCallback, useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { date, duration } from "../../tools.js";
import { useRef } from "react";
import axios from "axios";
import Pagination from "../component/pagination.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import ReactModal from "react-modal";
import loadingGif from "../../images/loading.gif";

function Instance() {
  const bots = useRef(null);
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clickable, setClickable] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [action, setAction] = useState(null);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  ReactModal.setAppElement("#root");

  const getInstances = useCallback(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/zoom/bot/aws/ec2/instances`
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

  const handleInstances = (_action) => {
    setClickable(false);
    setShowModal(true);
    setAction(_action);
  };

  const handleCancel = () => {
    setClickable(true);
    setShowModal(false);
    setError(false);
  };

  const setInstances = (bots) => {
    if (isValidNumber(bots)) {
      setProcessing(true);
      axios
        .post(
          `${process.env.REACT_APP_API_ENDPOINT}/api/zoom/bot/aws/ec2/instances`,
          { action, number: bots }
        )
        .then((response) => {
          setState({ ...response.data });
          setLoading(false);
          setClickable(true);
          setProcessing(false);
          setShowModal(false);
          const id = setTimeout(() => {
            getInstances();
            clearTimeout(id);
          }, 60000);
        })
        .catch(() => {
          setLoading(false);
          setClickable(true);
          setProcessing(false);
          setShowModal(false);
        });
    } else {
      setClickable(true);
    }
  };

  const isValidNumber = (number) => {
    if (number.length) {
      setError(false);
      return true;
    }
    setError(true);
    return false;
  };

  useEffect(() => {
    getInstances();
  }, [getInstances]);

  return (
    <>
      <ReactModal isOpen={showModal} style={customStyles}>
        <div>
          <div className="">
            <input
              type="number"
              min="1"
              placeholder="Enter number of bots"
              required
              style={{ padding: 5 }}
              ref={bots}
            />
          </div>
          {error ? (
            <div className="text-danger small">Please enter number of bots</div>
          ) : null}
          <div className="text-center mt-2">
            {processing ? (
              <img
                src={loadingGif}
                alt="Processing"
                height={30}
                width={30}
                className="me-2"
              />
            ) : (
              <button
                className="btn btn-primary me-2"
                onClick={() => setInstances(bots.current?.value)}
              >
                Submit
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={() => handleCancel()}
            >
              Cancel
            </button>
          </div>
        </div>
      </ReactModal>
      {loading ? (
        <div className="text-center mt-5 fw-bold heading">Loading...</div>
      ) : (
        <>
          <div className="col border p-3 me-2">
            <div className="">
              <span className="fw-bold text-primary">Bots</span> (
              {state.instances?.total || 0}) |{" "}
              <span className="fw-bold text-success">Running</span> (
              {state.instances?.running || 0}) |{" "}
              <span className="fw-bold text-danger">Stopped</span> (
              {state.instances?.stopped || 0})
            </div>

            <div className="text-secondary mt-2">
              {state.instances?.stopping || state.instances?.pending
                ? "Please wait..."
                : null}
            </div>

            <div className="mt-3">
              <div
                className="btn btn-primary me-3"
                onClick={() =>
                  clickable &&
                  state.instances?.pending === 0 &&
                  state.instances?.stopping === 0
                    ? handleInstances("start")
                    : console.log("please wait...")
                }
              >
                Start
              </div>
              <div
                className="btn btn-secondary"
                onClick={() =>
                  clickable &&
                  state.instances?.pending === 0 &&
                  state.instances?.stopping === 0
                    ? handleInstances("stop")
                    : console.log("please wait...")
                }
              >
                Stop
              </div>
            </div>
          </div>

          <div className="w-75 text-center d-none">
            <div className="d-inline-block w-75">
              <input
                type="text"
                placeholder="Enter Call ID"
                className="p-2 input w-100"
              />
            </div>
            <div className="d-flex w-25">
              <button
                className="btn btn-primary button-label d-flex align-self-center me-2"
                onClick={() => getInstances()}
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
          <div className="mt-5 d-none">
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
                    paginate={(page) => getInstances(null, page)}
                  />
                </div>
              </div>
            ) : (
              <div className="fw-bold small">Not record found</div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Instance;
