import { Button } from "react-bootstrap";
import Table from "../common/Table/Table";
import { data } from "../sampleData/sampleData";
import { useChartMetaDataStore } from "../store/drawGraphStore";
import BarChart from "../common/CustomChart/BarChart";
import BubbleChart from "../common/CustomChart/BubbleChart";
import LineChart from "../common/CustomChart/LineChart";
import MixChart from "../common/CustomChart/MixChart";
import ScatterChart from "../common/CustomChart/ScatterChart";

const FinishDrawGraph = () => {
  const { tableTitle, chartTitle } = useChartMetaDataStore(
    state => state.metaData
  );
  const localStorageData = JSON.parse(localStorage.getItem("drawGraph")) || {};
  const graph = localStorageData?.selectedGraph;

  const filterData = data.map(row => {
    return row.filter((_, index) =>
      localStorageData.selectedVariable?.includes(index)
    );
  });

  return (
    <div className="finishDrawGraph">
      <div>
        <h3>{tableTitle}</h3>
        <Table head={filterData[0]} body={filterData.slice(1)} />
      </div>
      <div className="chartWrapper">
        <h3>{chartTitle}</h3>
        {graph === 0 && (
          <BarChart data={filterData} qualitativeVariableIdx={0} />
        )}
        {graph === 1 && (
          <LineChart data={filterData} qualitativeVariableIdx={0} />
        )}
        {graph === 2 && (
          <BubbleChart data={filterData} qualitativeVariableIdx={0} />
        )}
        {graph === 4 && (
          <ScatterChart data={filterData} qualitativeVariableIdx={0} />
        )}
        {graph === 5 && (
          <MixChart data={filterData} qualitativeVariableIdx={0} />
        )}
      </div>
      <div className="buttons">
        <Button>그래프 SEEd 저장</Button>
        <Button>PDF로 저장</Button>
      </div>
    </div>
  );
};

export default FinishDrawGraph;
