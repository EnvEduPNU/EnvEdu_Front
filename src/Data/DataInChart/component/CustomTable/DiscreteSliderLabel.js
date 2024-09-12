import * as React from "react";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import { useState, useEffect } from "react";

import { categoricalStore } from "../../store/categoricalStore";

export default function DiscreteSliderLabel() {
  const store = categoricalStore();
  const selectedCategory = store.getSelectedCategory();
  const selectedCategoryLenth = store.getCategoriesLength();

  const [value, setValue] = useState(0);

  console.log(selectedCategory);

  useEffect(() => {
    console.log("들어오는 데이터 : " + selectedCategory);
  }, [store]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (
      selectedCategory.length > 0 &&
      newValue >= 0 &&
      newValue < selectedCategory.length
    ) {
      store.changeCategoryLength(newValue + 1);
      console.log("들어오는 데이터 길이 : " + selectedCategoryLenth);
    }
  };

  const marks = selectedCategory.map((index, category) => ({
    value: category,
    label: index,
  }));

  console.log("마크는 뭐지 : " + JSON.stringify(marks, null, 2));

  return (
    <Stack
      sx={{ height: 30, width: "70%", margin: "0 0 5vh 20vh" }}
      spacing={1}
      direction="column"
    >
      <Slider
        getAriaLabel={() => "Category Selection"}
        orientation="horizontal"
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        marks={marks}
        max={marks.length - 1}
        style={{ marginLeft: "15px" }}
      />
    </Stack>
  );
}
