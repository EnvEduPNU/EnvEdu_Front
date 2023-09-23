import { Button } from "react-bootstrap";
import Table from "../common/Table/Table";
import { data } from "../sampleData/sampleData";
import { useChartMetaDataStore } from "../store/drawGraphStore";
import CustomChart from "../common/CustomChart/CustomChart";

const FinishDrawGraph = () => {
  const { tableTitle, chartTitle } = useChartMetaDataStore(
    state => state.metaData
  );
  const localStorageData = JSON.parse(localStorage.getItem("drawGraph")) || {};

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
        <CustomChart data={filterData} />
      </div>
      <div className="buttons">
        <Button>그래프 SEEd 저장</Button>
        <Button>PDF로 저장</Button>
      </div>
    </div>
  );
};

export default FinishDrawGraph;
