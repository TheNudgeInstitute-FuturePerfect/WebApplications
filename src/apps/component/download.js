import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import ReactModal from "react-modal";
import { generateExcelSheet } from "./excel.js";
import axios from "axios";
import loading from "../../images/loading.gif";

function Download({ showModal, hideModal, path }) {
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [downloading, setDownloading] = useState(false);

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

  const fetchData = () => {
    setDownloading(true);
    const startDate = range.startDate;
    const endDate = range.endDate;
    if (endDate) {
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);
      endDate.setMilliseconds(999);
    }

    if (startDate && endDate) {
      axios
        .get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/${path}?startDate=${startDate}&endDate=${endDate}`
        )
        .then((response) => excel(response.data.data))
        .catch((error) => console.error(error))
        .finally(() => {
          setDownloading(false);
          hideModal();
        });
    }
  };

  const excel = (data) => {
    switch (path) {
      case "glow/link/tracking":
        generateExcelSheet(
          data,
          ["ID", "Phone", "Session ID", "Date Time"],
          [
            { key: "_id" },
            { key: "phone" },
            { key: "session" },
            { key: "createdAt", type: "date" },
          ],
          "Glow Link Trackings.xlsx"
        );
        break;
      case "telegram-client/video-chat":
        generateExcelSheet(
          data,
          ["ID", "Date Time", "Call ID", "Participants", "Duration"],
          [
            { key: "_id" },
            { key: "createdAt", type: "date" },
            { key: "callId" },
            { key: "numberOfparticipants" },
            {
              key: "virtual",
              function: "duration",
              arguments: ["createdAt", "endAt"],
            },
          ],
          "Telegram Group Calls.xlsx"
        );
        break;
      case "telegram-client/video-chat-participant":
        generateExcelSheet(
          data,
          ["ID", "User ID", "Joined Time", "Left Time", "Duration"],
          [
            { key: "_id" },
            { key: "userId" },
            { key: "createdAt", type: "date" },
            { key: "leftAt", type: "date" },
            {
              key: "virtual",
              function: "duration",
              arguments: ["createdAt", "leftAt"],
            },
          ],
          "Telegram Group Call Participants.xlsx"
        );
        break;
      case "link/list":
        generateExcelSheet(
          data,
          ["ID", "Date Time", "Name", "Phone", "Link Status", "URL"],
          [
            { key: "_id" },
            { key: "createdAt", type: "date" },
            { key: "name" },
            { key: "phone" },
            { key: "status" },
            { key: "url" },
          ],
          "Demo Links.xlsx"
        );
        break;
      default:
    }
  };

  return (
    <ReactModal isOpen={showModal} contentLabel="Download" style={customStyles}>
      <div>
        <DateRangePicker
          ranges={[range]}
          onChange={(range) => {
            setRange({ ...range.selection, key: "selection" });
          }}
        />
        <div className="text-center mt-2">
          <button
            className="btn btn-secondary me-2"
            onClick={() => hideModal()}
          >
            Close
          </button>
          {downloading ? (
            <img src={loading} alt="Downloading" height={30} width={30} />
          ) : (
            <button className="btn btn-primary" onClick={() => fetchData()}>
              Download
            </button>
          )}
        </div>
      </div>
    </ReactModal>
  );
}

export default Download;
