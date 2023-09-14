import Instance from "./instance.js";
import Meeting from "./meeting.js";

function Zoom() {
  return (
    <div className="p-5">
      <div className="mt-5 row">
        <Instance />
        <Meeting />
      </div>
    </div>
  );
}

export default Zoom;
