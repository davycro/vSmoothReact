const React = require("react");

const useDropzone = require("react-dropzone").useDropzone;

const styled = require("styled-components").default;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #ccc;

  cursor: pointer;

  h1 {
    font-weight: bold;
    font-size: 2rem;
  }

  &:hover {
    background: white;
  }

  article {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;
const DropBox = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: black;
  color: white;
  outline: 3px dashed #f1f1f1;
  outline-offset: -20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-size: 2rem;
  font-weight: bold;
`;

function SelectVideoPage(props) {
  const onDrop = React.useCallback(acceptedFiles => {
    props.onSelectVideo(acceptedFiles[0]);
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    accept: "video/*",
    multiple: false
  });
  return React.createElement(Container, getRootProps(), React.createElement("input", getInputProps()), isDragActive && React.createElement(DropBox, null, "Release to drop the files here."), React.createElement("article", null, React.createElement("h1", null, "Drag and drop video here, or click to select file"), React.createElement("p", null, "Supported file types: mp4, m4v, avi, wmv, mov, flv, mpg, mpeg, gif")));
}

module.exports = SelectVideoPage;