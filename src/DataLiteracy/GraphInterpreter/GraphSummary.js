import CustomChart from "../common/CustomChart/CustomChart";
import Table from "../common/Table/Table";
import { getFilterData } from "../utils/localStorage";

function GraphSummary() {
  const data = getFilterData();

  return (
    <div className="graphSummary">
      <div className="summary">
        그래프 요인 요약 자료 및 기술 통계값 Lorem ipsum dolor sit amet,
        consectetur adipisicing elit. Neque quaerat itaque exercitationem nobis
        a illo atque nihil ex repudiandae quibusdam! Culpa possimus, nostrum
        facilis ipsam inventore amet vero facere perferendis.
      </div>
      <Table head={data[0]} body={data.slice(1)} />
      <CustomChart data={data} />
    </div>
  );
}

export default GraphSummary;
