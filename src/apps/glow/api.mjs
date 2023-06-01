import axios from "axios";

const getSessionData = async (SessionID) => {
  if (SessionID) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/glow/feedback?action=list&table=Sessions&condition=SessionID='${SessionID}' AND MessageType='UserMessage'`
      );
      if (response.data.data instanceof Array && response.data.data.length)
        trackLink(
          response.data.data[0].Sessions.Mobile,
          response.data.data[0].Sessions.SessionID
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

const trackLink = (phone, session) => {
  fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/glow/link/tracking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone: phone, session: session }),
  })
    .then((response) =>
      response.json().then((jsonResponse) => console.log(jsonResponse))
    )
    .catch((error) => {
      console.error(error);
    });
};

const userFeedback = (data, value, index) => {
  if (data instanceof Array) {
    const _data = data.map((element, _index) => {
      if (index === _index) {
        return { Sessions: { ...element.Sessions, UserFeedback: value } };
      }
      return element;
    });
    // update database
    const requestBody = {
      table: "Sessions",
      set: {
        UserFeedback: value,
      },
      condition: `ROWID=${data[index].Sessions.ROWID}`,
    };
    console.log(requestBody);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };
    fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/glow/feedback?action=update`,
      options
    )
      .then((response) => {
        response.json().then((jsonResponse) => {
          console.log(jsonResponse);
        });
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(_data);
    return _data;
  }
};

export { getSessionData, userFeedback };