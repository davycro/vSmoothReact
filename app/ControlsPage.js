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

const Thumb = (props, state) => (
  <StyledThumb {...props}>{state.valueNow}</StyledThumb>
);


// Special case where value of 100 equates to "Max" and actually will be value of 0
const SmoothingThumb = (props, state) => (
  <StyledThumb {...props}>{state.valueNow === 100 ? "Max" : state.valueNow}</StyledThumb>
)

// Special case where value of 200 equates to "Max" and actually will be value of -1
const MaxshiftThumb = (props, state) => (
  <StyledThumb {...props}>{state.valueNow === 200 ? "Max" : state.valueNow}</StyledThumb>
)

// Special case where value of 360 equates to "Max" and actually will be value of -1
const MaxpixelsThumb = (props, state) => (
  <StyledThumb {...props}>{state.valueNow === 360 ? "Max" : state.valueNow}</StyledThumb>
)

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${props => (props.index === 0 ? "black" : "#e1e1e1")};
  border-radius: 999px;
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

function SliderControl(props) {
  const Container = styled.div`
    margin-bottom: 1rem;
  `;

  const Label = styled.div`
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  `;

  return (
    <Container>
      <Label>{props.label}</Label>
      <StyledSlider renderTrack={Track} renderThumb={Thumb} {...props} />
    </Container>
  );
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

  return (
    <Container>
      <section>
        <Label>Crop Method</Label>
        <select onChange={(e) => props.onChangeControl("crop", e.target.value)}>
          <option value="keep">keep</option>
          <option value="black">black frame</option>
        </select>
      </section>

      <section>
        <Label>Camera Path</Label>
        <select onChange={(e) => props.onChangeControl("optalgo", e.target.value)}>
          <option value="gauss">Gauss</option>
          <option value="avg">Averaging</option>
        </select>
      </section>

      <section>
        <Label>Tripod</Label>
        <select onChange={(e) => props.onChangeControl("tripod", e.target.value)}>
          <option value="0">Off</option>
          <option value="1">On</option>
        </select>
      </section>

    </Container>
    )

}


function ControlsPage(props) {
  return (
    <LayoutContainer>
      <aside>
        <Button onClick={props.onClickReselectVideo}>Start Over</Button>
        <Button onClick={props.onClickRenderVideo}>Render Video</Button>
      </aside>
      <article>
        <SliderControl
          label="Accuracy"
          min={1}
          max={15}
          defaultValue={15}
          onAfterChange={value => props.onChangeControl("accuracy", value)}
        />
        <SliderControl
          label="Shakiness"
          min={1}
          max={10}
          defaultValue={5}
          onAfterChange={value => props.onChangeControl("shakiness", value)}
        />
        <SliderControl
          label="Smoothing (frames)"
          min={1}
          max={100}
          defaultValue={10}
          onAfterChange={value => {
            value === 100
              ? props.onChangeControl("smoothing", 0)
              : props.onChangeControl("smoothing", value);
          }}
          renderThumb={SmoothingThumb}
        />
        <SliderControl
          label="Max shift (pixels)"
          min={1}
          max={200}
          defaultValue={200}
          onAfterChange={value => {
            value === 200
              ? props.onChangeControl("maxshift", -1)
              : props.onChangeControl("maxshift", value);
          }}
          renderThumb={MaxshiftThumb}
        />
        <SliderControl
          label="Max angle (degrees)"
          min={1}
          max={360}
          defaultValue={360}
          onAfterChange={value => {
            value === 360
              ? props.onChangeControl("maxangle", -1)
              : props.onChangeControl("maxangle", value);
          }}
          renderThumb={MaxpixelsThumb}
        />
        <HorizontalInputs onChangeControl={props.onChangeControl} />

      </article>
    </LayoutContainer>
  );
}

module.exports = ControlsPage;
