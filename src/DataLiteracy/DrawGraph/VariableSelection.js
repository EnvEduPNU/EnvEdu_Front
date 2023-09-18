import "./DrawGraph.scss";
import { useSelectedVariable } from "../store/drawGraphStore";
import { data } from "../sampleData/sampleData";
import Table from "../common/Table/Table";

function VariableSelection() {
  const { selectedVariable, changeSelectedVariable } = useSelectedVariable();

  return (
    <div>
      <Table
        head={data[0]}
        body={data.slice(1)}
        isShowCheckBox={true}
        seleted={selectedVariable}
        changeSelected={changeSelectedVariable}
      />
    </div>
  );
}

export default VariableSelection;
