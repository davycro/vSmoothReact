const React = require("react");
const styled = require("styled-components").default;
const Slider = require('rc-slider').default;



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

  margin-bottom: .5rem;

  transition: all 0.3s;

  &:hover {
    background: black;
    color: white;
  }
`;


function ControlsPage() {

  return (
    <LayoutContainer>
      <aside>
        <Button>Start Over</Button>
        <Button>Sample</Button>
        <Button>Full Video</Button>
      </aside>
      <article>
        <h3>Accuracy</h3>
        <Slider min={1} max={15} defaultValue={5} marks={{1:1, 5:5, 10:10, 15:15}} step={1} dots={true} />
      </article>
    </LayoutContainer>

    )
}

module.exports = ControlsPage;
