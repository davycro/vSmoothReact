const React = require("react");
const styled = require("styled-components").default;


function RenderPage(props) {
  if (!props.progress) {
    return (
      <h1>Preparing to render</h1>
    )
  }

  const {label, currentTime, totalTime} = props.progress;
  const percentDone = (currentTime / totalTime) * 100.0;

  return (

    <div>
      <h1>{label}</h1>
      <p>
        {`${percentDone.toFixed(2)} percent done`}
      </p>
    </div>

    )
}

module.exports = RenderPage;
