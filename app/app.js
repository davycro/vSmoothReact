const React = require("react");
const ReactDOM = require("react-dom");

const SelectVideoPage = require("./SelectVideoPage");
const ControlsPage = require("./ControlsPage");
const RenderPage = require("./RenderPage");
const DownloadPage = require("./DownloadPage");

const VideoProcessor = require('./VideoProcessor');

const e = React.createElement;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoadedVideo = this.handleLoadedVideo.bind(this);
    this.handleStartRender = this.handleStartRender.bind(this);
    this.handleRenderProgress = this.handleRenderProgress.bind(this);
    this.handleRenderCompleted = this.handleRenderCompleted.bind(this);
    this.state = {
      activePage: "SelectVideoPage",
    };
  }

  handleLoadedVideo(videoFile) {
    this.videoProcessor = new VideoProcessor(videoFile);
    this.setState({ videoFile: videoFile, activePage: "ControlsPage" });
  }

  handleStartRender() {
    this.setState({activePage: "RenderPage"})
    this.videoProcessor.build({
      onProgress: this.handleRenderProgress,
      onComplete: this.handleRenderCompleted
    });
  }

  handleRenderProgress(options) {
    if (!options) return null;
    this.setState({renderProgress: options});
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
        return <SelectVideoPage onSelectVideo={this.handleLoadedVideo} />;
      case "ControlsPage":
        return <ControlsPage onClickRenderVideo={this.handleStartRender} />;
      case "RenderPage":
        return <RenderPage progress={this.state.renderProgress} />;
      case "DownloadPage":
        return <DownloadPage videoFile={this.state.finalFile} />;
    }
  }
}

const domContainer = document.querySelector("#App");
ReactDOM.render(e(App), domContainer);
