const React = require("react");

const styled = require("styled-components").default;

const Layout = styled.div`

  margin: 2rem;

  video {
    max-height: 50vh;
    margin-bottom: 2rem;
    display: block;
  }
`;
const Pipe = styled.span`
  padding-left: .25rem;
  padding-right: .25rem;
  color: #555;
`;

function DownloadPage(props) {
  return React.createElement(Layout, null, React.createElement("h1", null, "Download Video"), React.createElement("video", {
    src: props.videoFile,
    loop: true,
    controls: true,
    autoPlay: true
  }), React.createElement("a", {
    href: props.videoFile,
    download: true
  }, "Save your video"), React.createElement(Pipe, null, "|"), React.createElement("a", {
    href: "#",
    onClick: props.onClickStartOver
  }, "Start over"));
}

module.exports = DownloadPage;