import { create } from "zustand";

class Variable {
  constructor(name) {
    this.name = name;
    this.type = "Categorical";
    this.isSelected = true;
    this.axis = null;
    this.graph = null;
  }

  get getIsSelected() {
    return this.isSelected;
  }
  get getName() {
    return this.name;
  }
  get getType() {
    return this.type;
  }
  get getAxis() {
    return this.axis;
  }
  get getGraph() {
    return this.graph;
  }

  setName(name) {
    this.name = name;
  }

  setType(type) {
    this.type = type;
  }

  toggleSelected() {
    this.isSelected = !this.isSelected;
  }

  setIsSelected(isSelected) {
    this.isSelected = isSelected;
  }
  setAxis(axis) {
    if (this.axis === axis) {
      axis = null;
    }
    this.axis = axis;
  }
  setGraph(graph) {
    if (this.graph === graph) {
      graph = null;
    }
    this.graph = graph;
  }

  copy() {
    const newVariable = new Variable(this.name);
    newVariable.setIsSelected(this.getIsSelected);
    newVariable.setType(this.type);
    newVariable.setAxis(this.axis);
    newVariable.setGraph(this.graph);
    return newVariable;
  }
}

export const useGraphDataStore = create((set, get) => ({
  data: [
    ["농업지대", "평균기온", "강수량", "일조시간"],
    ["태백고냉", 21.9, 181.9, 149.7],
    ["소백간산", 25.3, 675.6, 140],
    ["영남내륙산간", 24.6, 578.3, 137.8],
    ["중부내륙", 25.9, 505.3, 144.5],
    ["소백서부내륙", 26, 699.7, 138.6],
    ["노령동서내륙", 25.6, 570.2, 136.2],
    ["호남내륙", 25.6, 570.2, 136.2],
    ["영남내륙", 26, 477.5, 123.8],
    ["중서부평야", 25.7, 508.1, 157],
    ["남서해안", 25.6, 500.8, 104.9],
    ["남부해안", 25.2, 623.4, 113.6],
    ["동해안남부", 26.2, 235.6, 167.3],
  ],

  variables: ["농업지대", "평균기온", "강수량", "일조시간"].map(
    name => new Variable(name)
  ),

  graphIdx: 0,

  changeGraphIndex: index =>
    set(state => {
      if (index === get().graphIdx) {
        return { ...state };
      }

      const newVariable = get().data[0].map(name => new Variable(name));
      newVariable.forEach((variable, idx) => {
        variable.setIsSelected(get().variables[idx].getIsSelected);
        variable.setType(get().variables[idx].getType);
      });
      return {
        ...state,
        graphIdx: index,
        variables: newVariable,
      };
    }),

  changeValue: (row, col, newValue) =>
    set(state => {
      const newData = state.data.map(d => [...d]);
      newData[row][col] = newValue;
      return {
        ...state,
        data: newData,
      };
    }),

  changeSelectedVariable: variableIdx =>
    set(state => {
      const newVariables = state.variables.map(variable => variable.copy());
      newVariables[variableIdx].toggleSelected();
      return {
        ...state,
        variables: newVariables,
      };
    }),

  changeVariableType: (variableIdx, type) =>
    set(state => {
      const newVariables = state.variables.map(variable => variable.copy());
      newVariables[variableIdx].setType(type);
      return {
        ...state,
        variables: newVariables,
      };
    }),

  changeAxis: (variableIdx, axis) =>
    set(state => {
      const newVariables = state.variables.map(variable => variable.copy());
      newVariables[variableIdx].setAxis(axis);
      return {
        ...state,
        variables: newVariables,
      };
    }),

  changeGraph: (variableIdx, graph) =>
    set(state => {
      const newVariables = state.variables.map(variable => variable.copy());
      newVariables[variableIdx].setGraph(graph);
      // console.log(variableIdx, axis, newVariables);
      return {
        ...state,
        variables: newVariables,
      };
    }),
}));
