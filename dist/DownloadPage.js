const React = require("react");

const styled = require("styled-components").default;

function DownloadPage(props) {
  return React.createElement("div", null, React.createElement("h1", null, "Movie Preview"), React.createElement("video", {
    src: props.videoFile,
    loop: "true"
  }));
}

module.exports = DownloadPage;