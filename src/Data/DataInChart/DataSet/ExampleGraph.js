import bar from "./../images/bar.png";
import line from "./../images/line.png";
import combo from "./../images/combo.png";
import doughnut from "./../images/doughnut.png";
import scatter from "./../images/scatter.png";

function ExampleGraph({ type }) {
  const graphImg = () => {
    switch (type) {
      case 0:
        return bar;
      case 1:
        return line;
      case 2:
        return scatter;
      case 3:
        return doughnut;
      case 4:
        return scatter;
      default:
        return combo;
    }
  };
  return <img src={graphImg()} alt="graph" />;
}

export default ExampleGraph;
