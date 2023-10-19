import axios from "axios";

const getSessionData = async (SessionID) => {
  if (SessionID) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/glow/feedback?collection=sessions&SessionID=${SessionID}`
      );
      if (response.data.data instanceof Array && response.data.data.length)
        trackLink(
          response.data.data[0].Mobile,
          response.data.data[0].SessionID,
          "Page Opened"
        );
      return { ...response.data, loading: false };
    } catch (error) {
      return {
        loading: false,
        error: "Internal server error",
      };
    }
  }
};

const getSystemPrompts = async (ROWID) => {
  if (ROWID) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/glow/feedback?collection=systemprompts&ROWID=${ROWID}`
      );
      if (response.data.data instanceof Array && response.data.data.length)
        return { ...response.data, loading: false };
    } catch (error) {
      return {
        loading: false,
        error: "Internal server error",
      };
    }
  }
};

const trackLink = (phone, session, activity) => {
  fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/glow/link/tracking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: phone,
      session: session,
      activity: activity,
    }),
  })
    .then((response) => response.json().then((jsonResponse) => null))
    .catch((error) => {
      console.error(error);
    });
};

const userFeedback = (data, value, index) => {
  if (data instanceof Array) {
    const _data = data.map((element, _index) => {
      if (index === _index) {
        return { ...element, UserFeedback: value };
      }
      return element;
    });
    // update database
    const requestBody = {
      collection: "sessions",
      set: {
        UserFeedback: value,
      },
      ROWID: `${data[index].ROWID}`,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };

    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/glow/feedback`, options)
      .then((response) => {
        response.json().then((jsonResponse) => {
          // console.log(jsonResponse);
        });
      })
      .catch((error) => {
        console.error(error);
      });
    return _data;
  }
};

export { getSessionData, userFeedback, trackLink, getSystemPrompts };
