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

export const useMixStore = create((set, get) => ({
  y1Axis: new Axis(),
  y2Axis: new Axis(),

  changeY1MinValue: min =>
    set(state => {
      const newY1Axis = get().y1Axis.copy();
      newY1Axis.setMin(Math.round(min * 10) / 10);
      return {
        ...state,
        y1Axis: newY1Axis,
      };
    }),

  changeY1MaxValue: max =>
    set(state => {
      const newY1Axis = get().y1Axis.copy();
      newY1Axis.setMax(Math.round(max * 10) / 10);
      return {
        ...state,
        y1Axis: newY1Axis,
      };
    }),

  changeY1StepSizeValue: stepSize =>
    set(state => {
      const newY1Axis = get().y1Axis.copy();
      newY1Axis.setStepSize(Math.round(stepSize * 10) / 10);
      return {
        ...state,
        y1Axis: newY1Axis,
      };
    }),

  changeY2MinValue: min =>
    set(state => {
      const newY2Axis = get().y2Axis.copy();
      newY2Axis.setMin(Math.round(min * 10) / 10);
      return {
        ...state,
        y2Axis: newY2Axis,
      };
    }),

  changeY2MaxValue: max =>
    set(state => {
      const newY2Axis = get().y2Axis.copy();
      newY2Axis.setMax(Math.round(max * 10) / 10);
      return {
        ...state,
        y2Axis: newY2Axis,
      };
    }),

  changeY2StepSizeValue: stepSize =>
    set(state => {
      const newY2Axis = get().y2Axis.copy();
      newY2Axis.setStepSize(Math.round(stepSize * 10) / 10);
      return {
        ...state,
        y2Axis: newY2Axis,
      };
    }),
}));
