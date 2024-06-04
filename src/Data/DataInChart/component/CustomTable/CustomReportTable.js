import Table from "../../../DataLiteracy/common/Table/Table";

// 레포트 쓰는 컴포넌트
function CustomReportTable({ data }) {
  return <Table head={data[0]} body={data.slice(1)} />;
}

export default CustomReportTable;
