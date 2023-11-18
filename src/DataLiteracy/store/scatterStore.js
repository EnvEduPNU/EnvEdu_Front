import { create } from "zustand";

class Axis {
  constructor() {
    this._min = 0;
    this._max = 0;
    this._stepSize = 0;
  }

  get min() {
    return this._min;
  }

  get max() {
    return this._max;
  }

  get stepSize() {
    return this._stepSize;
  }

  setMin(min) {
    this._min = min;
  }

  setMax(max) {
    this._max = max;
  }

  setStepSize(stepSize) {
    this._stepSize = stepSize;
  }

  copy() {
    const newAxis = new Axis();
    newAxis.setMin(this._min);
    newAxis.setMax(this._max);
    newAxis.setStepSize(this._stepSize);
    return newAxis;
  }
}

export const useScatterStore = create((set, get) => ({
  xAxis: new Axis(),
  yAxis: new Axis(),

  changeXMinValue: min =>
    set(state => {
      const newXAxis = get().xAxis.copy();
      newXAxis.setMin(Math.round(min * 10) / 10);
      return {
        ...state,
        xAxis: newXAxis,
      };
    }),

  changeXMaxValue: max =>
    set(state => {
      const newXAxis = get().xAxis.copy();
      newXAxis.setMax(Math.round(max * 10) / 10);
      return {
        ...state,
        xAxis: newXAxis,
      };
    }),

  changeXStepSizeValue: stepSize =>
    set(state => {
      const newXAxis = get().xAxis.copy();
      newXAxis.setStepSize(Math.round(stepSize * 10) / 10);
      return {
        ...state,
        xAxis: newXAxis,
      };
    }),

  changeYMinValue: min =>
    set(state => {
      const newYAxis = get().yAxis.copy();
      newYAxis.setMin(Math.round(min * 10) / 10);
      return {
        ...state,
        yAxis: newYAxis,
      };
    }),

  changeYMaxValue: max =>
    set(state => {
      const newYAxis = get().yAxis.copy();
      newYAxis.setMax(Math.round(max * 10) / 10);
      return {
        ...state,
        yAxis: newYAxis,
      };
    }),

  changeYStepSizeValue: stepSize =>
    set(state => {
      const newYAxis = get().yAxis.copy();
      newYAxis.setStepSize(Math.round(stepSize * 10) / 10);
      return {
        ...state,
        yAxis: newYAxis,
      };
    }),
}));
