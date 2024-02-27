import * as Styled from "./Styled";

function CustomTable({ data }) {
  const tableNumberData = data.map((d, idx) => {
    if (idx == 0) return "Rows#";
    return `${idx}`;
  });

  const headers = data[0];

  return (
    <Styled.Wrapper>
      <Styled.FirstColumn key={"starter"} $isNotEnd>
        <Styled.HeaderWrapper>
          <Styled.HeaderStartar>{tableNumberData[0]}</Styled.HeaderStartar>
        </Styled.HeaderWrapper>
        {tableNumberData.slice(1).map((d, idx) => (
          <Styled.RowNumber disabled key={idx}>
            {d}
          </Styled.RowNumber>
        ))}
      </Styled.FirstColumn>
      {headers.map((header, col) => (
        <Styled.Column key={col} $isNotEnd={col != headers.length - 1}>
          <Styled.HeaderWrapper>
            <div>{header}</div>
          </Styled.HeaderWrapper>
          {data.slice(1).map((d, row) => (
            <Styled.Data key={row} $isEditCell={false}>
              <Styled.InputDiv>{d[col]}</Styled.InputDiv>
            </Styled.Data>
          ))}
        </Styled.Column>
      ))}
    </Styled.Wrapper>
  );
}

export default CustomTable;
