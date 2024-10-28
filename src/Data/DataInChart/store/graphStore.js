import { create } from 'zustand';
import { selectVariableType } from './utils/selectVariableType';

const data = JSON.parse(localStorage.getItem('data'));
const title = JSON.parse(localStorage.getItem('title'));

export const useGraphDataStore = create((set, get) => ({
  title: title || '',
  data: data || [],
  data: data || [],

  variables:
    data && data.length > 0
      ? data[0].map((name) => ({
          name,
          type: selectVariableType(name),
          isSelected: false,
          isMoreSelected: false,
          variableIndex: index,
        }))
      : [],

  graphIdx: 0,

  selectedYVariableIndexs: [],
  selectedMoreYVariableIndexs: [],

  selctedXVariableIndex: -1,

  setData: (newData, title, isNew, newVariables) =>
    set((state) => {
      if (state.title !== title || isNew) {
        if (newVariables !== undefined)
          return {
            ...state,
            data: newData,
            variables: newVariables,
            title,
            selectedYVariableIndexs: [],
            selectedMoreYVariableIndexs: [],
            selctedXVariableIndex: -1,
          };
        else
          return {
            ...state,
            data: newData,
            variables: newData[0].map((name, index) => ({
              name,
              type: selectVariableType(name),
              isSelected: false,
              isMoreSelected: false,
              variableIndex: index,
            })),
            title,
            selectedYVariableIndexs: [],
            selectedMoreYVariableIndexs: [],
            selctedXVariableIndex: -1,
          };
      }

      return {
        ...state,
        data: newData,
        variables: state.variables.map((variable, index) => ({
          ...variable,
          variableIndex: index,
        })),
      };
    }),

  setTitle: (title) =>
    set((state) => ({
      ...state,
      title,
    })),

  changeGraphIndex: (index) =>
    set((state) => ({
      ...state,
      graphIdx: index,
    })),

  addSelectedYVariableIndexs: (variableIdx) =>
    set((state) => {
      const newVariables = state.variables.map((variable, index) => ({
        ...variable,
        isSelected: index === variableIdx ? true : variable.isSelected,
      }));

      return {
        ...state,
        variables: newVariables,
        selectedYVariableIndexs: [
          ...state.selectedYVariableIndexs,
          variableIdx,
        ],
      };
    }),

  deleteSelectedYVariableIndexs: (variableIdx) =>
    set((state) => {
      const newVariables = state.variables.map((variable, index) => ({
        ...variable,
        isSelected: index === variableIdx ? false : variable.isSelected,
      }));

      const filteredVariables = state.selectedYVariableIndexs.filter(
        (index) => index !== variableIdx,
      );

      return {
        ...state,
        variables: newVariables,
        selectedYVariableIndexs: filteredVariables,
      };
    }),

  selectXVariableIndex: (variableIdx) =>
    set((state) => ({
      ...state,
      selctedXVariableIndex: variableIdx,
    })),

  unselectXVariableIndex: (variableIdx) =>
    set((state) => ({
      ...state,
      selctedXVariableIndex: -1,
    })),

  addSelectedMoreYVariableIndexs: (variableIdx) =>
    set((state) => {
      const newVariables = state.variables.map((variable, index) => ({
        ...variable,
        isMoreSelected: index === variableIdx ? true : variable.isMoreSelected,
      }));

      return {
        ...state,
        variables: newVariables,
        selectedMoreYVariableIndexs: [
          ...state.selectedMoreYVariableIndexs,
          variableIdx,
        ],
      };
    }),

  deleteSelectedMoreYVariableIndexs: (variableIdx) =>
    set((state) => {
      const newVariables = state.variables.map((variable, index) => ({
        ...variable,
        isMoreSelected: index === variableIdx ? false : variable.isMoreSelected,
      }));

      const filteredVariables = state.selectedMoreYVariableIndexs.filter(
        (index) => index !== variableIdx,
      );

      return {
        ...state,
        variables: newVariables,
        selectedMoreYVariableIndexs: filteredVariables,
      };
    }),
}));
