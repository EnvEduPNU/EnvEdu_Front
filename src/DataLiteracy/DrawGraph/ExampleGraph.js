import bar from "../image/bar.png";
import line from "../image/line.png";
import combo from "../image/combo.png";
import doughnut from "../image/doughnut.png";
import scatter from "../image/scatter.png";

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
