import axios from "axios";
import ReactModal from "react-modal";
import { useState } from "react";
import loadingGif from "../../images/loading.gif";

function Recording() {
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [clickable, setClickable] = useState(true);
  const [action, setAction] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

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

  const handleEvent = (_action) => {
    setClickable(false);
    setShowModal(true);
    setAction(_action);
  };

  const handleCancel = () => {
    setClickable(true);
    setShowModal(false);
  };

  const sendEvent = (requestBody) => {
    setProcessing(true);
    setShowMessage(true);
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/zoom/bot/event/create`,
        requestBody
      )
      .then(() => {
        setClickable(true);
        setShowModal(false);
        setAction(null);
        setProcessing(false);
        const timeoutId = setTimeout(() => {
          setShowMessage(false);
          clearTimeout(timeoutId);
        }, 5000);
      })
      .catch(() => {
        setClickable(true);
        setShowModal(false);
        setAction(null);
        setProcessing(false);
        const timeoutId = setTimeout(() => {
          setShowMessage(false);
          clearTimeout(timeoutId);
        }, 5000);
      });
  };

  return (
    <>
      <ReactModal isOpen={showModal} style={customStyles}>
        <div>
          <div className="text-center mt-2">
            <div className="fw-bold text-secondary mb-3">
              Are you sure? You want to {action} recording
            </div>
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
                onClick={() => sendEvent({ name: "record", action })}
              >
                Yes
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
      <div className="col border p-3">
        <div className="fw-bold">Recording</div>

        <div className="text-secondary mt-2">
          {showMessage ? "You request has been submitted" : null}
        </div>

        <div className="mt-3">
          <div
            className="btn btn-primary me-3"
            onClick={() =>
              clickable ? handleEvent("start") : console.log("please wait...")
            }
          >
            Start
          </div>
          <div
            className="btn btn-secondary"
            onClick={() =>
              clickable ? handleEvent("stop") : console.log("please wait...")
            }
          >
            Stop
          </div>
        </div>
      </div>
    </>
  );
}

export default Recording;
