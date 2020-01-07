const React = require("react");

const styled = require("styled-components").default;

function RenderPage(props) {
  if (!props.progress) {
    return React.createElement("h1", null, "Preparing to render");
  }

  const {
    step,
    currentTime,
    totalTime
  } = props.progress;
  const percentDone = currentTime / totalTime * 100.0;
  return React.createElement("div", null, React.createElement("h1", null, step), React.createElement("p", null, `${percentDone.toFixed(2)} percent done`));
}

module.exports = RenderPage;