const React = require("react"); // Import the useDropzone hooks from react-dropzone


const useDropzone = require("react-dropzone").useDropzone;

const styled = require('styled-components').default;

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

const Dropzone = ({
  onDrop,
  accept
}) => {
  // Initializing useDropzone hooks with options
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    accept,
    multiple: false
  });
  return React.createElement(Container, getRootProps(), React.createElement("input", getInputProps()), isDragActive && React.createElement(DropBox, null, "Release to drop the files here."), React.createElement("article", null, React.createElement("h1", null, "Choose a video to start"), React.createElement("p", null, "Supported file types: mp4, m4v, avi, wmv, mov, flv, mpg, mpeg, gif")));
};

module.exports = Dropzone;