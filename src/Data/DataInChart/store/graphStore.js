import { create } from 'zustand';
import { selectVariableType } from './utils/selectVariableType';

const data = JSON.parse(localStorage.getItem('data'));
const title = JSON.parse(localStorage.getItem('title'));

export const useGraphDataStore = create((set, get) => ({
  title: title || '',
  data: data || [
    ['초기값', '초기값1', '초기값2', '초기값3'],
    ['테스트1', 10, 20, 30],
  ],

  variables:
    data === null || data === undefined
      ? ['초기값', '초기값1', '초기값2', '초기값3'].map((name) => ({
          name,
          type: selectVariableType(name),
          isSelected: false,
          isMoreSelected: false,
        }))
      : data[0].map((name) => ({
          name,
          type: selectVariableType(name),
          isSelected: false,
          isMoreSelected: false,
        })),

  graphIdx: 0,

  selectedYVariableIndexs: [],
  selectedMoreYVariableIndexs: [],

  selctedXVariableIndex: -1,

  setData: (newData, title, isNew, newVariables) =>
    set((state) => {
      console.log(newVariables);
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
            variables: newData[0].map((name, index) => {
              return {
                name,
                type: selectVariableType(name),
                isSelected: false,
                isMoreSelected: false,
                variableIndex: index,
              };
            }),
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
          name: variable.name,
          type: variable.type,
          isSelected: variable.isSelected,
          isMoreSelected: variable.isMoreSelected,
          variableIndex: index,
        })),
      };
    }),

  setTitle: (title) =>
    set((state) => {
      return {
        ...state,
        data: state.data.map((row) => [...row]),
        variables: state.variables.map((variable, index) => ({
          name: variable.name,
          type: variable.type,
          isSelected: variable.isSelected,
          isMoreSelected: variable.isMoreSelected,
          variableIndex: index,
        })),
        title,
        selectedYVariableIndexs: [...state.selectedYVariableIndexs],
        selectedMoreYVariableIndexs: [...state.selectedMoreYVariableIndexs],
      };
    }),

  changeGraphIndex: (index) =>
    set((state) => {
      return {
        ...state,
        graphIdx: index,
        selectedYVariableIndexs: [...state.selectedYVariableIndexs],
        selectedMoreYVariableIndexs: [...state.selectedMoreYVariableIndexs],
      };
    }),

  addSelectedYVariableIndexs: (variableIdx) =>
    set((state) => {
      const newVariables = state.variables.map((variable, index) => ({
        name: variable.name,
        type: variable.type,
        isSelected: variable.isSelected,
        isMoreSelected: variable.isMoreSelected,
        variableIndex: index,
      }));

      newVariables[variableIdx].isSelected = true;

      return {
        ...state,
        variables: newVariables,
        selectedYVariableIndexs: [
          ...state.selectedYVariableIndexs,
          variableIdx,
        ],
        selectedMoreYVariableIndexs: state.selectedMoreYVariableIndexs,
      };
    }),

  deleteSelectedYVariableIndexs: (variableIdx) =>
    set((state) => {
      const newVariables = state.variables.map((variable, index) => ({
        name: variable.name,
        type: variable.type,
        isSelected: variable.isSelected,
        isMoreSelected: variable.isMoreSelected,
        variableIndex: index,
      }));

      const filteredVariables = [...state.selectedYVariableIndexs].filter(
        (variableIndex) => variableIndex !== variableIdx,
      );

      newVariables[variableIdx].isSelected = false;

      return {
        ...state,
        variables: newVariables,
        selectedYVariableIndexs: filteredVariables,
        selectedMoreYVariableIndexs: state.selectedMoreYVariableIndexs,
      };
    }),

  selectXVariableIndex: (variableIdx) =>
    set((state) => {
      const newVariables = state.variables.map((variable, index) => ({
        name: variable.name,
        type: variable.type,
        isSelected: variable.isSelected,
        isMoreSelected: variable.isMoreSelected,
        variableIndex: index,
      }));

      newVariables[variableIdx].isSelected = true;

      return {
        ...state,
        variables: newVariables,
        selectedYVariableIndexs: state.selectedYVariableIndexs,
        selectedMoreYVariableIndexs: state.selectedMoreYVariableIndexs,
        selctedXVariableIndex: variableIdx,
      };
    }),

  unselectXVariableIndex: (variableIdx) =>
    set((state) => {
      const newVariables = state.variables.map((variable, index) => ({
        name: variable.name,
        type: variable.type,
        isSelected: variable.isSelected,
        isMoreSelected: variable.isMoreSelected,
        variableIndex: index,
      }));

      newVariables[variableIdx].isSelected = false;

      return {
        ...state,
        variables: newVariables,
        selectedYVariableIndexs: state.selectedYVariableIndexs,
        selectedMoreYVariableIndexs: state.selectedMoreYVariableIndexs,
        selctedXVariableIndex: variableIdx,
      };
    }),

  addSelectedMoreYVariableIndexs: (variableIdx) =>
    set((state) => {
      const newVariables = state.variables.map((variable, index) => ({
        name: variable.name,
        type: variable.type,
        isSelected: variable.isSelected,
        isMoreSelected: variable.isMoreSelected,
        variableIndex: index,
      }));

      newVariables[variableIdx].isMoreSelected = true;

      return {
        ...state,
        variables: newVariables,
        selectedYVariableIndexs: state.selectedYVariableIndexs,
        selectedMoreYVariableIndexs: [
          ...state.selectedMoreYVariableIndexs,
          variableIdx,
        ],
      };
    }),

  deleteSelectedMoreYVariableIndexs: (variableIdx) =>
    set((state) => {
      const newVariables = state.variables.map((variable, index) => ({
        name: variable.name,
        type: variable.type,
        isSelected: variable.isSelected,
        isMoreSelected: variable.isMoreSelected,
        variableIndex: index,
      }));

      const filteredVariables = [...state.selectedMoreYVariableIndexs].filter(
        (variableIndex) => variableIndex !== variableIdx,
      );

      newVariables[variableIdx].isMoreSelected = false;

      return {
        ...state,
        variables: newVariables,
        selectedYVariableIndexs: state.selectedYVariableIndexs,
        selectedMoreYVariableIndexs: filteredVariables,
      };
    }),
}));
