import * as React from "react";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import { useState, useEffect } from "react";

import { useBarStore } from "../../store/barStore";

function LabelInput({ labelName, value, onChange }) {
  return (
    <div>
      <label>{labelName}:</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function valuetext(value) {
  return `${value}°C`;
}

const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 50,
    label: "50",
  },
  {
    value: 100,
    label: "100",
  },
  {
    value: 120,
    label: "120",
  },
];

export default function VerticalSlider() {
  const { min, max, changeMinValue, changeMaxValue } = useBarStore();
  const [value, setValue] = useState([min, max]);
  const [sliderMax, setSliderMax] = useState(120); // 최대값을 상태로 관리

  useEffect(() => {
    setValue([min, max]); // 스토어의 초기값으로 상태를 업데이트합니다.

    console.log("최고값 : " + max);
    console.log("최저값 : " + min);
  }, [min, max]);

  useEffect(() => {
    // value[1]이 100보다 큰 경우, sliderMax를 value[1]로 설정
    if (value[1] > 100) {
      setSliderMax(value[1]);
    } else {
      setSliderMax(120); // 기본 최대값은 120
    }
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    changeMinValue(newValue[0]);
    changeMaxValue(newValue[1]);
  };

  const handleInputChange = (type, inputValue) => {
    const intValue = Number(inputValue);
    if (type === "MIN") {
      setValue([intValue, value[1]]);
      changeMinValue(intValue);
    } else if (type === "MAX") {
      setValue([value[0], intValue]);
      changeMaxValue(intValue);
    }
  };

  return (
    <Stack
      sx={{ height: 300, width: "60px", margin: "50px 20px 0px 0px" }}
      spacing={1}
      direction="column"
    >
      <LabelInput
        labelName="최댓값"
        value={value[1]}
        onChange={(inputValue) => handleInputChange("MAX", inputValue)}
      />
      <Slider
        getAriaLabel={() => "Temperature"}
        orientation="vertical"
        getAriaValueText={valuetext}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        marks={marks}
        max={sliderMax}
        style={{ marginLeft: "15px" }}
      />
      <LabelInput
        labelName="최솟값"
        value={value[0]}
        onChange={(inputValue) => handleInputChange("MIN", inputValue)}
      />
    </Stack>
  );
}
