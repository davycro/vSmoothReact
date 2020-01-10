const React = require("react");

const ReactDOM = require("react-dom");

const SelectVideoPage = require("./SelectVideoPage");

const ControlsPage = require("./ControlsPage");

const RenderPage = require("./RenderPage");

const DownloadPage = require("./DownloadPage");

const VideoProcessor = require("./VideoProcessor");

const e = React.createElement;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoadedVideo = this.handleLoadedVideo.bind(this);
    this.handleReselectVideo = this.handleReselectVideo.bind(this);
    this.handleStartRender = this.handleStartRender.bind(this);
    this.handleRenderProgress = this.handleRenderProgress.bind(this);
    this.handleRenderCompleted = this.handleRenderCompleted.bind(this);
    this.handleChangeControl = this.handleChangeControl.bind(this);
    this.state = {
      activePage: "SelectVideoPage"
    };
    this.processorOptions = {};
    this.state = {
      activePage: "ControlsPage"
    };
  }

  handleReselectVideo() {
    this.videoProcessor = null;
    this.processorOptions = {};
    this.setState({
      videoFile: null,
      activePage: "SelectVideoPage"
    });
  }

  handleLoadedVideo(videoFile) {
    this.videoProcessor = new VideoProcessor(videoFile);
    this.setState({
      videoFile: videoFile,
      activePage: "ControlsPage"
    });
  }

  handleChangeControl(key, value) {
    this.processorOptions[key] = value;
    console.log(this.processorOptions);
  }

  handleStartRender() {
    this.setState({
      activePage: "RenderPage"
    });
    this.videoProcessor.build({
      onProgress: this.handleRenderProgress,
      onComplete: this.handleRenderCompleted,
      ...this.processorOptions
    });
  }

  handleRenderProgress(options) {
    if (!options) return null;
    this.setState({
      renderProgress: options
    });
  }

  handleRenderCompleted(options) {
    this.setState({
      activePage: "DownloadPage",
      finalFile: options.finalFile
    });
  }

  render() {
    switch (this.state.activePage) {
      case "SelectVideoPage":
        return React.createElement(SelectVideoPage, {
          onSelectVideo: this.handleLoadedVideo
        });

      case "ControlsPage":
        return React.createElement(ControlsPage, {
          onClickRenderVideo: this.handleStartRender,
          onChangeControl: this.handleChangeControl,
          onClickReselectVideo: this.handleReselectVideo
        });

      case "RenderPage":
        return React.createElement(RenderPage, {
          progress: this.state.renderProgress
        });

      case "DownloadPage":
        return React.createElement(DownloadPage, {
          videoFile: this.state.finalFile,
          onClickStartOver: this.handleReselectVideo
        });
    }
  }

}

const domContainer = document.querySelector("#App");
ReactDOM.render(e(App), domContainer);