import SelectedGraph from "../DrawGraph/SelectedGraph";
import CustomChart from "../common/CustomChart/CustomChart";
import Table from "../common/Table/Table";
import { useGraphInterpreterStore } from "../store/graphInterpreterStore";
import { getFilterData, getSelectedGraph } from "../utils/localStorage";

function GraphEvaluator() {
  const { purpose, infomation } = useGraphInterpreterStore(
    state => state.userData
  );

  const researcher = {
    purpose: "연구진이 입력한 그래프 작성의 목적 Text Box",
    infomation: "연구진이 입력한 그래프에서 파악한 정보 Text Box",
  };
  const data = getFilterData();
  const graph = getSelectedGraph();
  return (
    <div className="graphEvaluator">
      <div className="resultWrapper">
        <div className="result">
          <h5>자동생성 그래프</h5>
          <SelectedGraph data={data} graph={graph} />
          <div>{researcher.purpose}</div>
          <div>{researcher.infomation}</div>
        </div>
        <div className="result">
          <h5>나의 그래프</h5>
          <CustomChart data={data} />
          <div>{purpose}</div>
          <div>{infomation}</div>
        </div>
      </div>
      <Table head={data[0]} body={data.slice(1)} />
    </div>
  );
}

export default GraphEvaluator;
