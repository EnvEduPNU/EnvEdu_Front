import CustomChart from "../common/CustomChart/CustomChart";
import Textarea from "../common/Textarea/Textarea";
import { getFilterData } from "../utils/localStorage";
import { useGraphInterpreterStore } from "../store/graphInterpreterStore";

function GraphInterpreter() {
  const {
    userData: { purpose, infomation },
    changeUserData,
  } = useGraphInterpreterStore();
  const data = getFilterData();

  return (
    <div className="GraphInterpreter">
      <div className="label-textarea-wrapper">
        <div className="label-textarea">
          <h5>1. 그래프가 목적에 맞게 잘 그려졌는지 설명해봅시다.</h5>
          <Textarea
            value={purpose}
            onChange={e => changeUserData("purpose", e.target.value)}
          />
        </div>
        <div className="label-textarea">
          <h5>2. 그래프를 보고 알 수 있는 정보를 써봅시다.</h5>
          <Textarea
            value={infomation}
            onChange={e => changeUserData("infomation", e.target.value)}
          />
        </div>
      </div>

      <CustomChart data={data} />
    </div>
  );
}

export default GraphInterpreter;
