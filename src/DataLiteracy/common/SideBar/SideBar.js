import "./SideBar.scss";

function SideBar() {
  return (
    <div className="sidebar">
      <span className="subtitle">Data Literacy</span>
      <ul>
        <li>1. 데이터 입력하기</li>
        <li>2. 데이터 전처리</li>
        <li className="active">3. 그래프 그리기</li>
        <li>4. 그래프 해석하기</li>
      </ul>
    </div>
  );
}

export default SideBar;
