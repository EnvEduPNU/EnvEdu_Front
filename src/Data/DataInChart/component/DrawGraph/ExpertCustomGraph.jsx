import { useGraphDataStore } from '../../store/graphStore';
import BarGraph from './graphs/BarGraph';
import LineGraph from './graphs/LineGraph';
import ComboGraph from './graphs/ComboGraph';
import DoughnutGraph from './graphs/DoughnutGraph';
import ScatterGraph from './graphs/ScatterGraph';

function ExpertCustomGraph() {
  const { graphIdx } = useGraphDataStore();

  return (
    <div>
      {graphIdx === 0 && <BarGraph />}
      {graphIdx === 1 && <LineGraph />}
      {graphIdx === 2 && <ComboGraph />}
      {graphIdx === 3 && <DoughnutGraph />}
      {graphIdx === 4 && <ScatterGraph />}
    </div>
  );
}

export default ExpertCustomGraph;
