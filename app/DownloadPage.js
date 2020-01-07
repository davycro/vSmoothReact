const React = require("react");
const styled = require("styled-components").default;

function DownloadPage(props) {

  return (
    <div>
      <h1>Movie Preview</h1>
      <video src={props.videoFile} loop="true" />
    </div>
    )
}

module.exports = DownloadPage;
