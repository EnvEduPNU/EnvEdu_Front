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
          dropdownSelect: false,
        }))
      : data[0].map((name) => ({
          name,
          type: selectVariableType(name),
          isSelected: false,
        })),

  graphIdx: 0,

  selectedYVariableIndexs: [],

  selctedXVariableIndex: -1,

  setData: (newData, title) =>
    set((state) => {
      if (state.title !== title)
        return {
          ...state,
          data: newData,
          variables: newData[0].map((name, index) => {
            return {
              name,
              type: selectVariableType(name),
              isSelected: false,
              variableIndex: index,
            };
          }),
          title: '',
          selectedYVariableIndexs: [],
          selctedXVariableIndex: -1,
        };
      return {
        ...state,
        data: newData,
        variables: state.variables.map((variable, index) => ({
          name: variable.name,
          type: variable.type,
          isSelected: variable.isSelected,
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
          variableIndex: index,
        })),
        title,
        selectedYVariableIndexs: [...state.selectedYVariableIndexs],
      };
    }),

  changeGraphIndex: (index) =>
    set((state) => {
      return {
        ...state,
        graphIdx: index,
        selectedYVariableIndexs: [...state.selectedYVariableIndexs],
      };
    }),

  addSelectedYVariableIndexs: (variableIdx) =>
    set((state) => {
      const newVariables = state.variables.map((variable, index) => ({
        name: variable.name,
        type: variable.type,
        isSelected: variable.isSelected,
        variableIndex: index,
      }));

      newVariables[variableIdx].isSelected = true;
      console.log(state.selectedYVariableIndexs);

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
        name: variable.name,
        type: variable.type,
        isSelected: variable.isSelected,
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
      };
    }),

  selectXVariableIndex: (variableIdx) =>
    set((state) => {
      const newVariables = state.variables.map((variable, index) => ({
        name: variable.name,
        type: variable.type,
        isSelected: variable.isSelected,
        variableIndex: index,
      }));

      newVariables[variableIdx].isSelected = true;

      return {
        ...state,
        variables: newVariables,
        selectedYVariableIndexs: state.selectedYVariableIndexs,
        selctedXVariableIndex: variableIdx,
      };
    }),

  unselectXVariableIndex: (variableIdx) =>
    set((state) => {
      const newVariables = state.variables.map((variable, index) => ({
        name: variable.name,
        type: variable.type,
        isSelected: variable.isSelected,
        variableIndex: index,
      }));

      newVariables[variableIdx].isSelected = false;

      return {
        ...state,
        variables: newVariables,
        selectedYVariableIndexs: state.selectedYVariableIndexs,
        selctedXVariableIndex: variableIdx,
      };
    }),
}));
