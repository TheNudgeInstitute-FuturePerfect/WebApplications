import ReactModal from "react-modal";
import { useRef } from "react";
import { useState } from "react";
import loadingGif from "../../images/loading.gif";
import axios from "axios";

function Meeting() {
  const meetingId = useRef(null);
  const passcode = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [clickable, setClickable] = useState(true);
  const [action, setAction] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [showError, setShowError] = useState({
    meetingId: false,
    passcode: false,
  });

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

  const handleMeeting = (_action) => {
    setClickable(false);
    setShowModal(true);
    setAction(_action);
  };

  const handleCancel = () => {
    setClickable(true);
    setShowModal(false);
    setShowError({ meetingId: false, passcode: false });
  };

  const join_meeting = (meetingId, passcode) => {
    if (isValidMeetingID(meetingId) && isValidPasscode(passcode)) {
      setProcessing(true);
      setShowMessage(true);
      axios
        .post(
          `${process.env.REACT_APP_API_ENDPOINT}/api/zoom/bot/meeting/create`,
          {
            meetingId,
            passcode,
          }
        )
        .then(() => {
          setClickable(true);
          setProcessing(false);
          setShowModal(false);
          const timeoutId = setTimeout(() => {
            setShowMessage(false);
            clearTimeout(timeoutId);
          }, 5000);
        })
        .catch(() => {
          setClickable(true);
          setProcessing(false);
          setShowModal(false);
          const timeoutId = setTimeout(() => {
            setShowMessage(false);
            clearTimeout(timeoutId);
          }, 5000);
        });
    } else {
      setClickable(true);
    }
  };

  const leave_meeting = () => {
    setProcessing(true);
    setShowMessage(true);
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/api/zoom/bot/event/create`, {
        name: "meeting",
        action: "leave",
      })
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

  const isValidMeetingID = (meetingId) => {
    const id = meetingId.trim().split(" ").join("");
    if (id.length >= 10 && id.length <= 11) {
      setShowError({ meetingId: false, passcode: false });
      return true;
    }
    setShowError({ meetingId: true, passcode: false });
    return false;
  };

  const isValidPasscode = (passcode) => {
    if (passcode.length) {
      setShowError({ meetingId: false, passcode: false });
      return true;
    }
    setShowError({ meetingId: false, passcode: true });
    return false;
  };

  const formatMeetingID = (meetingId) => {
    const trim = meetingId.trim();
    const split_and_join = trim.split(" ").join("");
    return (
      split_and_join.slice(0, 3) +
      " " +
      split_and_join.slice(3, 6) +
      " " +
      split_and_join.slice(6, 11)
    );
  };

  return (
    <>
      <ReactModal isOpen={showModal} style={customStyles}>
        <div>
          {action === "join" ? (
            <>
              <div className="">
                <input
                  type="text"
                  placeholder="Enter meeting ID"
                  required
                  style={{ padding: 5 }}
                  ref={meetingId}
                />
              </div>
              {showError.meetingId ? (
                <div className="text-danger small">
                  Please enter valid meeting ID
                </div>
              ) : null}
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Enter passcode"
                  required
                  style={{ padding: 5 }}
                  ref={passcode}
                />
              </div>
              {showError.passcode ? (
                <div className="text-danger small">Please enter passcode</div>
              ) : null}
            </>
          ) : (
            <div className="fw-bold text-secondary mb-3">
              Are you sure? You want to {action} meeting
            </div>
          )}
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
                onClick={() =>
                  action === "join"
                    ? join_meeting(
                        formatMeetingID(meetingId.current?.value),
                        passcode.current?.value
                      )
                    : leave_meeting()
                }
              >
                {action === "join" ? "Submit" : "Yes"}
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
      <div className="col border p-3 me-2">
        <div className="fw-bold">Meeting</div>

        <div className="text-secondary mt-2">
          {showMessage ? "You request has been submitted" : null}
        </div>

        <div className="mt-3">
          <div
            className="btn btn-primary me-3"
            onClick={() =>
              clickable ? handleMeeting("join") : console.log("please wait...")
            }
          >
            Join
          </div>
          <div
            className="btn btn-secondary"
            onClick={() =>
              clickable ? handleMeeting("leave") : console.log("please wait...")
            }
          >
            Leave
          </div>
        </div>
      </div>
    </>
  );
}

export default Meeting;
