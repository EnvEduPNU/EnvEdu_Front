import { useEffect, useState } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { GoGraph } from "react-icons/go";
import { Bubble, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getDropdownMenuPlacement } from "react-bootstrap/esm/DropdownMenu";
import { PiFloppyDiskFill } from "react-icons/pi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const option = {
  responsive: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "", ""];

/**
 * 디바이스에서 메시지가 올때마다 일어난다.
 *
 */
export default function SingleDataContainer(props) {
  console.log("들어올때마다 확인 ");
  const handleClick = (type) => {
    props.toggleSelection(type);
  };

  const [value, setValue] = useState(-99999); //만약 값이 -99999인 경우, 유효하지 않은 값으로 판단해 처리하지 않음
  const [graphData] = useState([]); //그래프를 렌더링하기 위한 데이터
  const [seeGraph, setSeeGraph] = useState(false); //그래프 생성 여부

  /**
   * 유효하지 않은 데이터를 제외한 값을 이용해 그래프 생성
   * 컴포넌트가 처음 생성될 때 받았던 데이터 중 유효한 값을 graphData에 추가
   */
  useEffect(() => {
    if (props.type === "temp") {
      props.data.forEach((elem) => {
        if (elem.temp !== -99999) graphData.push(elem.temp);
      });
    } else if (props.type === "pH") {
      props.data.forEach((elem) => {
        if (elem.ph !== -99999) graphData.push(elem.ph);
      });
    } else if (props.type === "hum") {
      props.data.forEach((elem) => {
        if (elem.hum !== -99999) graphData.push(elem.hum);
      });
    } else if (props.type === "hum_earth") {
      props.data.forEach((elem) => {
        if (elem.hum_EARTH !== -99999) graphData.push(elem.hum_EARTH);
      });
    } else if (props.type === "tur") {
      props.data.forEach((elem) => {
        if (elem.tur !== -99999) graphData.push(elem.tur);
      });
    } else if (props.type === "dust") {
      props.data.forEach((elem) => {
        if (elem.dust !== -99999) graphData.push(elem.dust);
      });
    } else if (props.type === "dox") {
      props.data.forEach((elem) => {
        if (elem.dox !== -99999) graphData.push(elem.dox);
      });
    } else if (props.type === "co2") {
      props.data.forEach((elem) => {
        if (elem.co2 !== -99999) graphData.push(elem.co2);
      });
    } else if (props.type === "lux") {
      props.data.forEach((elem) => {
        if (elem.lux !== -99999) graphData.push(elem.lux);
      });
    } else if (props.type === "pre") {
      props.data.forEach((elem) => {
        if (elem.pre !== -99999) graphData.push(elem.pre);
      });
    }
  }, []);

  /**
   * 데이터를 받았을 때, 유효한 값이면 마지막으로 받은 값 갱신
   * graphData에도 추가
   */
  useEffect(() => {
    if (props.current !== null && props.current !== undefined) {
      if (props.type === "temp") {
        setValue(props.data[props.data.length - 1].temp);
        if (props.current.temp !== -99999) {
          graphData.push(props.current.temp);
        }
      } else if (props.type === "pH") {
        setValue(props.data[props.data.length - 1].ph);
        if (props.current.ph !== -99999) {
          graphData.push(props.current.ph);
        }
      } else if (props.type === "hum") {
        setValue(props.data[props.data.length - 1].hum);
        if (props.current.hum !== -99999) {
          graphData.push(props.current.hum);
        }
      } else if (props.type === "hum_earth") {
        setValue(props.data[props.data.length - 1].hum_EARTH);
        if (props.current.hum_EARTH !== -99999) {
          graphData.push(props.current.hum_EARTH);
        }
      } else if (props.type === "tur") {
        setValue(props.data[props.data.length - 1].tur);
        if (props.current.tur !== -99999) {
          graphData.push(props.current.tur);
        }
      } else if (props.type === "dust") {
        setValue(props.data[props.data.length - 1].dust);
        if (props.current.dust !== -99999) {
          graphData.push(props.current.dust);
        }
      } else if (props.type === "dox") {
        setValue(props.data[props.data.length - 1].dox);
        if (props.current.dox !== -99999) {
          graphData.push(props.current.dox);
        }
      } else if (props.type === "co2") {
        setValue(props.data[props.data.length - 1].co2);
        if (props.current.co2 !== -99999) {
          graphData.push(props.current.co2);
        }
      } else if (props.type === "lux") {
        setValue(props.data[props.data.length - 1].lux);
        if (props.current.lux !== -99999) {
          graphData.push(props.current.lux);
        }
      } else if (props.type === "pre") {
        setValue(props.data[props.data.length - 1].pre);
        if (props.current.pre !== -99999) {
          graphData.push(props.current.pre);
        }
      }

      /**
       * receivedData와 마찬가지로 graphData도 10개로 유지
       */
      if (graphData.length > 10) {
        graphData.splice(0, 1);
      }
    }
  }, [props.data]);

  const dataElem = {
    labels,
    datasets: [
      {
        label: props.type,
        data: graphData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  /*센서 이름 css */
  const style = {
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.75em",
    fontWeight: "bold",
    width: "8rem",
    backgroundColor: value === -99999 ? "#fff" : "#FFE2E7",
    borderRadius: "1.25rem",
    textAlign: "center",
  };

  const putUnit = (type) => {
    const unitMap = {
      temp: "°C",
      hum: "%",
      tur: "NTU",
      dust: "㎍/㎥",
      dox: "mg/L",
      co2: "ppm",
      lux: "lx",
      pre: "hPa",
    };

    return unitMap[type] || null;
  };

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            className="border pe-2 ps-2 mb-2"
            onClick={() => handleClick(props.type)}
            style={style}
          >
            {props.type === "temp" && "기온"}
            {props.type === "pH" && "pH"}
            {props.type === "hum" && "습도"}
            {props.type === "hum_earth" && "토양 습도"}
            {props.type === "tur" && "탁도"}
            {props.type === "dust" && "미세먼지"}
            {props.type === "dox" && "용존산소량"}
            {props.type === "co2" && "이산화탄소"}
            {props.type === "lux" && "조도"}
            {props.type === "pre" && "기압"}
            {/*
                        {props.selectedTypes.includes(props.type) && 
                            <CiFloppyDisk size="20" style={{ marginRight: '0.2rem' }}/>
                        }
                        */}

            <PiFloppyDiskFill
              size="20"
              color={
                props.selectedTypes.includes(props.type) ? "#FF5271" : "#000"
              }
              style={{ marginRight: "0.2rem" }}
            />
          </span>
          &nbsp;&nbsp;
          {
            /**
             * 유효하지 않은 값의 처리
             */
            <span style={{ fontSize: "0.75em", fontWeight: "bold" }}>
              {value === -99999 ? "" : value} {putUnit(props.type)}
            </span>
          }
        </div>

        <div>
          <OverlayTrigger
            trigger="click"
            placement="left"
            defaultShow={false}
            overlay={
              <Popover id="popover-positioned-left">
                <Popover.Header as="h3">
                  {props.type}센서 보정하기
                </Popover.Header>
                <Popover.Body>
                  {/**
                   * 보정 메세지 형식 준수
                   * 보정시 시작 -> 보정 -> 종료 순서 준수
                   */}
                  <Button
                    onClick={() =>
                      props.sendFunction(
                        "{ENTER" +
                          (props.type === "pH"
                            ? "PH"
                            : props.type === "tur"
                            ? "TUR"
                            : props.type === "dox"
                            ? "DO"
                            : "CO2") +
                          "}"
                      )
                    }
                  >
                    시작
                  </Button>
                  <br />
                  <Button
                    onClick={() =>
                      props.sendFunction(
                        "{CAL" +
                          (props.type === "pH"
                            ? "PH"
                            : props.type === "tur"
                            ? "TUR"
                            : props.type === "dox"
                            ? "DO"
                            : "CO2") +
                          "}"
                      )
                    }
                  >
                    보정
                  </Button>
                  <br />
                  <Button
                    onClick={() =>
                      props.sendFunction(
                        "{EXIT" +
                          (props.type === "pH"
                            ? "PH"
                            : props.type === "tur"
                            ? "TUR"
                            : props.type === "dox"
                            ? "DO"
                            : "CO2") +
                          "}"
                      )
                    }
                  >
                    종료
                  </Button>
                </Popover.Body>
              </Popover>
            }
          >
            {
              /**
               * 보정 가능한 센서 - ph, tur, dox, co2
               * 위 센서 값이 유효하지 않은 경우, 보정 기능 비활성화
               */
              (props.type === "pH" ||
                props.type === "tur" ||
                props.type === "dox" ||
                props.type === "co2") &&
              value !== -99999 ? (
                <span className="border" style={{ fontSize: "0.8em" }}>
                  보정하기
                </span>
              ) : (
                <></>
              )
            }
          </OverlayTrigger>

          <div
            style={{ cursor: "pointer", display: "inline-block" }}
            onClick={() => {
              setSeeGraph(!seeGraph);
            }}
          >
            📈
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        {seeGraph === true && props.data.length !== 0 ? (
          <div
            style={{
              borderRadius: "1.875rem",
              background: "#fff",
              padding: "1rem",
            }}
          >
            <Line options={option} data={dataElem} width="500" height="300" />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
