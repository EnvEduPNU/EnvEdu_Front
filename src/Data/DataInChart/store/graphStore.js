import { create } from "zustand";

class Variable {
  constructor(name) {
    this._name = name;
    this._type = "";
    this._isSelected = true;
    this._axis = null;
    this._graph = null;
    this._unit = "";
  }

  get isSelected() {
    return this._isSelected;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  get axis() {
    return this._axis;
  }

  get graph() {
    return this._graph;
  }

  get unit() {
    return this._unit;
  }

  setName(name) {
    this._name = name;
  }

  setType(type) {
    this._type = type;
  }

  toggleSelected() {
    this._isSelected = !this._isSelected;
  }

  setIsSelected(isSelected) {
    this._isSelected = isSelected;
  }

  setAxis(axis) {
    if (this._axis === axis) {
      axis = null;
    }
    this._axis = axis;
  }

  setGraph(graph) {
    if (this._graph === graph) {
      graph = null;
    }
    this._graph = graph;
  }

  setUnit(unit) {
    this._unit = unit;
  }

  copy() {
    const newVariable = new Variable(this._name);
    newVariable.setIsSelected(this._isSelected);
    newVariable.setType(this._type);
    newVariable.setAxis(this._axis);
    newVariable.setGraph(this._graph);
    newVariable.setUnit(this._unit);
    return newVariable;
  }
}

const data = [];
const title = "";
export const useGraphDataStore = create((set, get) => ({
  title: title || "",
  data: data || [],

  variables:
    (data && data[0]?.map((name) => new Variable(name))) ||
    ["농업지대", "평균기온", "강수량", "일조시간"].map(
      (name) => new Variable(name)
    ),
  graphIdx: 0,
  pageIndex: -1,
  activityIndex: -1,

  changeActivity: (pageIndex, activityIndex) =>
    set((state) => ({
      ...state,
      pageIndex,
      activityIndex,
    })),

  setData: (newData) =>
    set((state) => ({
      ...state,
      data: newData,
      variables: newData[0].map((name) => new Variable(name)),
    })),

  setDataInit: () =>
    set((state) => ({
      ...state,
      data: [],
      variables: new Variable(),
    })),

  setTitle: (title) =>
    set((state) => ({
      ...state,
      title,
    })),

  changeGraphIndex: (index) =>
    set((state) => {
      if (index === get().graphIdx) {
        return { ...state };
      }

      const newVariable = get().data[0].map((name) => new Variable(name));
      newVariable.forEach((variable, idx) => {
        variable.setIsSelected(get().variables[idx].isSelected);
        variable.setType(get().variables[idx].type);
        variable.setUnit(get().variables[idx].unit);
      });
      return {
        ...state,
        graphIdx: index,
        variables: newVariable,
      };
    }),

  changeValue: (row, col, newValue) =>
    set((state) => {
      const newData = state.data.map((d) => [...d]);
      newData[row][col] = newValue;
      return {
        ...state,
        data: newData,
      };
    }),

  changeSelectedVariable: (variableIdx) =>
    set((state) => {
      const newVariables = state.variables.map((variable) => variable.copy());
      newVariables[variableIdx].toggleSelected();
      return {
        ...state,
        variables: newVariables,
      };
    }),

  changeVariableType: (variableIdx, type) =>
    set((state) => {
      const newVariables = state.variables.map((variable) => variable.copy());

      console.log(newVariables);

      newVariables[variableIdx].setType(type);

      return {
        ...state,
        variables: newVariables,
      };
    }),

  changeAxis: (variableIdx, axis) =>
    set((state) => {
      const newVariables = state.variables.map((variable) => variable.copy());
      newVariables[variableIdx].setAxis(axis);
      return {
        ...state,
        variables: newVariables,
      };
    }),

  changeGraph: (variableIdx, graph) =>
    set((state) => {
      const newVariables = state.variables.map((variable) => variable.copy());
      newVariables[variableIdx].setGraph(graph);

      return {
        ...state,
        variables: newVariables,
      };
    }),
}));
