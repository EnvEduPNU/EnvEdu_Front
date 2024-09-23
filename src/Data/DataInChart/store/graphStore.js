import { create } from "zustand";
import { selectVariableType } from "./utils/selectVariableType";

class Variable {
  constructor(name) {
    this.name = name;
    this.type = "Categorical";
    this.isSelected = true;
    this.axis = null;
    this.graph = null;
    this.unit = "";
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
  get getUnit() {
    return this.unit;
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
  setUnit(unit) {
    this.unit = unit;
  }

  copy() {
    const newVariable = new Variable(this.name);
    newVariable.setIsSelected(this.getIsSelected);
    newVariable.setType(this.type);
    newVariable.setAxis(this.axis);
    newVariable.setGraph(this.graph);
    newVariable.setUnit(this.unit);
    return newVariable;
  }
}

const data = JSON.parse(localStorage.getItem("data"));
const title = JSON.parse(localStorage.getItem("title"));

export const useGraphDataStore = create((set, get) => ({
  title: title || "",
  data: data || [
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

  variables:
    data === null || data === undefined
      ? ["농업지대", "평균기온", "강수량", "일조시간"].map(
          (name) => new Variable(name)
        )
      : data[0].map((name) => new Variable(name)),

  graphIdx: 0,

  setData: (newData) =>
    set((state) => ({
      ...state,
      data: newData,
      variables: newData[0]
        .map((name) => new Variable(name))
        .map((variable) => {
          const type = selectVariableType(variable.name);
          if (type) {
            variable.setType(type);
          } else variable.setType("Categorical");
          return variable;
        }),
      title: "",
    })),

  setTitle: (title) =>
    set((state) => {
      return {
        ...state,
        data: state.data.map((row) => [...row]),
        variables: state.data[0]
          .map((name) => new Variable(name))
          .map((variable) => {
            const type = selectVariableType(variable.name);
            if (type) {
              variable.setType(type);
            } else variable.setType("Categorical");
            return variable;
          }),
        title,
      };
    }),

  changeGraphIndex: (
    index //이건 뭐냐 도대체?
  ) =>
    set((state) => {
      if (index === get().graphIdx) {
        return {
          ...state,
          data: state.data.map((row) => [...row]),
          variables: state.variables
            .map((name) => new Variable(name))
            .map((variable) => {
              const type = selectVariableType(variable.name);
              if (type) {
                variable.setType(type);
              } else variable.setType("Categorical");
              return variable;
            }),
        };
      }

      const newVariables = state.data[0]
        .map((name) => new Variable(name))
        .map((variable) => {
          const type = selectVariableType(variable.name);
          if (type) {
            variable.setType(type);
          } else variable.setType("Categorical");
          return variable;
        });
      // newVariables.forEach((newVariable, idx) => {
      //   newVariable.setIsSelected(state.variables[idx].getIsSelected);
      //   newVariable.setType(state.variables[idx].getType);
      //   newVariable.setUnit(state.variables[idx].getUnit);
      // });
      newVariables[index].toggleSelected();
      return {
        ...state,
        graphIdx: index,
        variables: newVariables,
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
      // console.log(variableIdx, axis, newVariables);
      return {
        ...state,
        variables: newVariables,
      };
    }),
}));
