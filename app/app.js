

const React = require("react")
const ReactDOM = require("react-dom")

const Dropzone = require("./Dropzone")

const e = React.createElement;

function App() {
  // onDrop function
  const onDrop = React.useCallback(acceptedFiles => {
    // this callback will be called after files get dropped, we will get the acceptedFiles. If you want, you can even access the rejected files too
    console.log(acceptedFiles);
  }, []);

  // We pass onDrop function and accept prop to the component. It will be used as initial params for useDropzone hook
  return (
    <Dropzone onDrop={onDrop} accept={"image/*"} />
  );
}

const domContainer = document.querySelector('#App');
ReactDOM.render(e(App), domContainer);
