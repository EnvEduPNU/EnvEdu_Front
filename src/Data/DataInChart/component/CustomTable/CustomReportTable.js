import Table from "../../../DataLiteracy/common/Table/Table";

function CustomReportTable({ data }) {
  return <Table head={data[0]} body={data.slice(1)} />;
}

export default CustomReportTable;
