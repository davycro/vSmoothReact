const React = require("react");

const ReactDOM = require("react-dom");

const SelectVideoPage = require("./SelectVideoPage");

const ControlsPage = require("./ControlsPage");

const e = React.createElement;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoadedVideo = this.handleLoadedVideo.bind(this);
    this.state = {
      videoFile: false,
      activePage: "SelectVideoPage"
    };
  }

  handleLoadedVideo(videoFile) {
    this.setState({
      videoFile: videoFile,
      activePage: "ControlsPage"
    });
  }

  render() {
    switch (this.state.activePage) {
      case "SelectVideoPage":
        return React.createElement(SelectVideoPage, {
          onSelectVideo: this.handleLoadedVideo
        });

      case "ControlsPage":
        return React.createElement(ControlsPage, null);
    }
  }

}

const domContainer = document.querySelector("#App");
ReactDOM.render(e(App), domContainer);