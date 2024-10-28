import './leftSlidePage.scss';
import MyDataDropdown from './MyDataDropdown';
import ExpertDataButton from './ExpertDataButton';

export default function LeftSlidePage({
  filteredData,
  setFilteredData,
  summary,
  setSummary,
}) {
  return (
    <div className="e-class-mydata">
      <div className="myData-left">
        <div className="myData-summary">
          <ExpertDataButton />
          {/* <MyDataButton buttonName={"Assignmnet"} />
          <MyDataButton buttonName={"Submitted"} /> */}
          {/* DATA 드롭다운 */}
          <MyDataDropdown
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            summary={summary}
            setSummary={setSummary}
          />
        </div>
      </div>
    </div>
  );
}
