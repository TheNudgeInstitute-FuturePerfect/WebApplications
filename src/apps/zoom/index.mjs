import BreakoutRoom from "./breakout-room.js";
import Instance from "./instance.js";
import Meeting from "./meeting.js";
import Recording from "./recording.js";

function Zoom() {
  return (
    <div className="p-5">
      <div className="mt-5 row">
        <Instance />
        <Meeting />
        <BreakoutRoom />
        <Recording />
      </div>
    </div>
  );
}

export default Zoom;
