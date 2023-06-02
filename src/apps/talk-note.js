import React, { Component } from "react";
import axios from "axios";
import LoadingScreen from "react-loading-screen";

export default class TalkNote extends Component {
  constructor(props) {
    super(props);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      profileImg: "",
      loaderFlag: false,
      data: "",
      error: null,
    };
  }
  onFileChange(e) {
    this.setState({
      profileImg: e.target.files[0],
      loaderFlag: false,
      data: "",
      error: null,
    });
  }
  onSubmit(e) {
    e.preventDefault();
    this.setState({ loaderFlag: true });
    const formData = new FormData();
    formData.append("audiofile", this.state.profileImg);
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/talk-note/upload`,
        formData,
        {}
      )
      .then((res) => {
        this.setState({
          profileImg: "",
          loaderFlag: false,
          data: this.beautify(res.data.data),
          error: null,
        });
      })
      .catch((error) => {
        if (error.response?.status === 500)
          this.setState({
            ...this.state,
            error: "File not supported!",
            loaderFlag: false,
          });
        else
          this.setState({
            ...this.state,
            error: error.message,
            loaderFlag: false,
          });
      });
  }

  beautify(subtitles) {
    let response_data = "";
    let speakerFlag = "";
    let talktime = {};

    for (let x of subtitles) {
      if (x.end_time && x.start_time) {
        talktime[x.speaker_label] =
          parseFloat(talktime[x.speaker_label] || 0) +
          (parseFloat(x.end_time) - parseFloat(x.start_time));
      }

      if (x.speaker_label === speakerFlag) {
        response_data += " " + x.alternatives[0].content;
      } else {
        speakerFlag = x.speaker_label;
        response_data +=
          "\n Speaker " +
          speakerFlag.replace(/[^0-9]/g, "") +
          ": " +
          x.alternatives[0].content;
      }
    }
    return { transcript: response_data, talktime };
  }

  readableTime(seconds) {
    if (Math.round(seconds) < 60) {
      return `${Math.round(seconds)} seconds`;
    } else {
      return `${Math.floor(Math.round(seconds) / 60)} minutes and ${
        Math.round(seconds) % 60
      } seconds`;
    }
  }

  render() {
    return (
      <div className="row p-4">
        <div className="col-12 col-md-3 col-lg-2" style={{ fontSize: 14 }}>
          <p className="fw-bold">About Talk Note</p>
          <p>
            With talk note, you can distinguish between different speakers in
            your transcription output. It can differentiate between a maximum of
            3 unique speakers and labels the text from each unique speaker with
            a unique value (Speaker 0 through Speaker 2).
          </p>
          <p>
            In addition to the standard transcript, this application also
            calculate the total talk time of each speaker.
          </p>
          <p>
            <strong>Cost</strong> Rs 2/minute of audio
          </p>
        </div>
        <div className="col-12 col-md-9 col-lg-10">
          <LoadingScreen
            loading={this.state.loaderFlag}
            bgColor="#f1f1f1"
            spinnerColor="#9ee5f8"
            textColor="#676767"
            text="Please wait..."
          >
            <div className="text-center mt-5">
              <div className="display-6 fw-bold pb-5 text-secondary">
                Talk Note
              </div>

              <form onSubmit={this.onSubmit} style={{ fontSize: 16 }}>
                <div className="form-group">
                  <input
                    type="file"
                    onChange={this.onFileChange}
                    accept="audio/mp3,video/mp4"
                    className="pe-5 d-inline-block"
                  />

                  <button className="btn btn-primary" type="submit">
                    Upload
                  </button>
                  <div className="text-info small mt-3">
                    Only mp3 and mp4 file supported
                  </div>
                </div>
              </form>

              {this.state.error ? (
                <div className="pt-5 text-danger">{this.state.error}</div>
              ) : null}
              <div
                className="pt-5 text-start"
                style={{ display: "inline-block" }}
              >
                {this.state.data ? (
                  <p>
                    <strong className="text-success">Talktime</strong>
                  </p>
                ) : null}
                {Object.keys(this.state.data?.talktime || {}).map(
                  (tt, index) => {
                    return (
                      <p key={index}>{`${tt.replace(
                        "spk_",
                        "Speaker "
                      )}: ${this.readableTime(
                        this.state.data?.talktime[tt]
                      )}`}</p>
                    );
                  }
                )}
                {this.state.data ? (
                  <p>
                    <strong className="text-success">Transcription</strong>
                  </p>
                ) : null}
                {this.state.data
                  ? this.state.data?.transcript?.split("\n").map((i, index) => {
                      if (i) return <p key={index}>{i}</p>;
                      else return <></>;
                    })
                  : null}
              </div>
            </div>
          </LoadingScreen>
        </div>
      </div>
    );
  }
}
