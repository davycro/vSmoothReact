function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const React = require("react");

const styled = require("styled-components").default;

const ReactSlider = require("react-slider").default;

const LayoutContainer = styled.div`
  display: flex;

  padding-top: 1rem;
  padding-bottom: 1rem;

  aside {
    width: 200px;
    display: flex;
    flex-direction: column;

    padding-left: 1rem;
  }
  article {
    flex: 1;
    padding-left: 1rem;
    padding-right: 2rem;
  }
`;
const Button = styled.button`
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 3px solid black;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;

  margin-bottom: 0.5rem;

  transition: all 0.3s;

  &:hover {
    background: black;
    color: white;
  }
`;
const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 1.5rem;
  margin-bottom: 1rem;
`;
const StyledThumb = styled.div`
  height: 1.5rem;
  line-height: 1.5rem;
  width: 2rem;
  text-align: center;
  background-color: #000;
  color: #fff;
  border-radius: 25%;
  cursor: grab;
  border: 0px;
`;

const Thumb = (props, state) => React.createElement(StyledThumb, props, state.valueNow); // Special case where value of 100 equates to "Max" and actually will be value of 0


const SmoothingThumb = (props, state) => React.createElement(StyledThumb, props, state.valueNow === 100 ? "Max" : state.valueNow); // Special case where value of 200 equates to "Max" and actually will be value of -1


const MaxshiftThumb = (props, state) => React.createElement(StyledThumb, props, state.valueNow === 200 ? "Max" : state.valueNow); // Special case where value of 360 equates to "Max" and actually will be value of -1


const MaxpixelsThumb = (props, state) => React.createElement(StyledThumb, props, state.valueNow === 360 ? "Max" : state.valueNow);

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${props => props.index === 0 ? "black" : "#e1e1e1"};
  border-radius: 999px;
`;

const Track = (props, state) => React.createElement(StyledTrack, _extends({}, props, {
  index: state.index
}));

function SliderControl(props) {
  const Container = styled.div`
    margin-bottom: 1rem;
  `;
  const Label = styled.div`
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  `;
  return React.createElement(Container, null, React.createElement(Label, null, props.label), React.createElement(StyledSlider, _extends({
    renderTrack: Track,
    renderThumb: Thumb
  }, props)));
}

function HorizontalInputs(props) {
  const Container = styled.div`
    display: flex;
    justify-content: space-evenly;
  `;
  const Label = styled.div`
    font-size: 0.8rem;
    font-weight: 400;
  `;
  return React.createElement(Container, null, React.createElement("section", null, React.createElement(Label, null, "Crop Method"), React.createElement("select", {
    onChange: e => props.onChangeControl("crop", e.target.value)
  }, React.createElement("option", {
    value: "keep"
  }, "keep"), React.createElement("option", {
    value: "black"
  }, "black frame"))), React.createElement("section", null, React.createElement(Label, null, "Camera Path"), React.createElement("select", {
    onChange: e => props.onChangeControl("optalgo", e.target.value)
  }, React.createElement("option", {
    value: "gauss"
  }, "Gauss"), React.createElement("option", {
    value: "avg"
  }, "Averaging"))), React.createElement("section", null, React.createElement(Label, null, "Tripod"), React.createElement("select", {
    onChange: e => props.onChangeControl("tripod", e.target.value)
  }, React.createElement("option", {
    value: "0"
  }, "Off"), React.createElement("option", {
    value: "1"
  }, "On"))));
}

function ControlsPage(props) {
  return React.createElement(LayoutContainer, null, React.createElement("aside", null, React.createElement(Button, {
    onClick: props.onClickReselectVideo
  }, "Start Over"), React.createElement(Button, {
    onClick: props.onClickRenderVideo
  }, "Render Video")), React.createElement("article", null, React.createElement(SliderControl, {
    label: "Accuracy",
    min: 1,
    max: 15,
    defaultValue: 15,
    onAfterChange: value => props.onChangeControl("accuracy", value)
  }), React.createElement(SliderControl, {
    label: "Shakiness",
    min: 1,
    max: 10,
    defaultValue: 5,
    onAfterChange: value => props.onChangeControl("shakiness", value)
  }), React.createElement(SliderControl, {
    label: "Smoothing (frames)",
    min: 1,
    max: 100,
    defaultValue: 10,
    onAfterChange: value => {
      value === 100 ? props.onChangeControl("smoothing", 0) : props.onChangeControl("smoothing", value);
    },
    renderThumb: SmoothingThumb
  }), React.createElement(SliderControl, {
    label: "Max shift (pixels)",
    min: 1,
    max: 200,
    defaultValue: 200,
    onAfterChange: value => {
      value === 200 ? props.onChangeControl("maxshift", -1) : props.onChangeControl("maxshift", value);
    },
    renderThumb: MaxshiftThumb
  }), React.createElement(SliderControl, {
    label: "Max angle (degrees)",
    min: 1,
    max: 360,
    defaultValue: 360,
    onAfterChange: value => {
      value === 360 ? props.onChangeControl("maxangle", -1) : props.onChangeControl("maxangle", value);
    },
    renderThumb: MaxpixelsThumb
  }), React.createElement(HorizontalInputs, {
    onChangeControl: props.onChangeControl
  })));
}

module.exports = ControlsPage;