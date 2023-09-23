import "./SideBar.scss";

function SideBar({ activeIdx }) {
  const menus = [
    "데이터 입력하기",
    "데이터 전처리",
    "그래프 그리기",
    "그래프 해석하기",
  ];
  return (
    <div className="sidebar">
      <span className="subtitle">Data Literacy</span>
      <ul>
        {menus.map((menu, idx) => (
          <li
            key={menu + idx}
            className={activeIdx === idx ? "active" : "no-active"}
          >
            {idx}. {menu}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
