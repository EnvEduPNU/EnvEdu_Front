import { create } from "zustand";

export const useLineStore = create((set, get) => ({
  x: [],
  y: [],
  min: 0,
  max: 0,
  stepSize: 0,
  errorMessage: null,
  getXIndex: variable => {
    return get().x.indexOf(variable);
  },
  getYIndex: variable => {
    return get().y.indexOf(variable);
  },

  changeXAxis: variable =>
    set(state => {
      const xIndex = get().getXIndex(variable);
      const yIndex = get().getYIndex(variable);

      const newX = [...get().x];
      const newY = [...get().y];
      if (xIndex === -1 && yIndex === -1) {
        newX.push(variable);
      } else if (xIndex > -1 && yIndex === -1) {
        newX.splice(xIndex, 1);
      } else if (xIndex > -1 && yIndex > -1) {
        newY.splice(yIndex, 1);
        newX.splice(xIndex, 1);
      } else if (xIndex === -1 && yIndex > -1) {
        newY.splice(yIndex, 1);
        newX.push(variable);
      }

      return {
        ...state,
        x: newX,
        y: newY,
      };
    }),

  changeYAxis: variable =>
    set(state => {
      const xIndex = get().getXIndex(variable);
      const yIndex = get().getYIndex(variable);

      const newX = [...get().x];
      const newY = [...get().y];

      if (xIndex === -1 && yIndex === -1) {
        newY.push(variable);
      } else if (xIndex > -1 && yIndex === -1) {
        newX.splice(xIndex, 1);
        newY.push(variable);
      } else if (xIndex > -1 && yIndex > -1) {
        newX.splice(xIndex, 1);
        newY.splice(xIndex, 1);
      } else if (xIndex === -1 && yIndex > -1) {
        newY.splice(yIndex, 1);
      }

      return {
        ...state,
        x: newX,
        y: newY,
      };
    }),

  changeMinValue: min =>
    set(state => ({
      ...state,
      min: Math.round(min * 10) / 10,
    })),

  changeMaxValue: max =>
    set(state => ({
      ...state,
      max: Math.round(max * 10) / 10,
    })),

  changeStepSize: stepSize =>
    set(state => ({
      ...state,
      stepSize: Math.round(stepSize * 10) / 10,
    })),
}));
