let enabled = true;
if (process.env.ENV) {
  enabled = false;
}

function log(...args) {
  if (enabled) console.log(...args);
}

export default log;
