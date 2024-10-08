import './leftSlidePage.scss';
import Header from '../component/Header/Header';
import MyDataDropdown from './MyDataDropdown';
import ExpertDataButton from './ExpertDataButton';

export default function LeftSlidePage({ setDataCategory }) {
  return (
    <div className="e-class-mydata">
      <div className="myData-left">
        <div className="myData-summary">
          <ExpertDataButton setDataCategory={setDataCategory} />
          {/* <MyDataButton buttonName={"Assignmnet"} />
          <MyDataButton buttonName={"Submitted"} /> */}
          {/* DATA 드롭다운 */}
          <MyDataDropdown />
        </div>
      </div>
    </div>
  );
}
