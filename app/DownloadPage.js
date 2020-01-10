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
`

function DownloadPage(props) {

  return (
    <Layout>
      <h1>Download Video</h1>
      <video src={props.videoFile} loop controls autoPlay />
      <a href={props.videoFile} download>Save your video</a>
      <Pipe>|</Pipe>
      <a href="#" onClick={props.onClickStartOver}>Start over</a>
    </Layout>
    )
}

module.exports = DownloadPage;
