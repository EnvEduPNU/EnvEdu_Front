import { create } from "zustand";

import data from "../utils/data2.json";

export const useTextbookStore = create((set, get) => ({
  data,

  searchData: [],
  tags: [],
  isSearch: false,
  changeSearch: isSearch => set(state => ({ ...state, isSearch })),

  setTags: tags =>
    set(state => {
      return {
        ...state,
        tags,
      };
    }),

  setSearchData: tags =>
    set(state => {
      // 빈 객체를 만듭니다.
      const transformedData = {};

      // 데이터 배열을 반복하면서 키와 값에 따라 객체를 채웁니다.
      tags.forEach(item => {
        if (!transformedData[item.type]) {
          transformedData[item.type] = [];
        }
        transformedData[item.type].push(item.value);
      });
      console.log(transformedData);
      if (
        "gradeLabel" in transformedData &&
        "subjectLabel" in transformedData
      ) {
        return {
          searchData: get().data.filter(
            d =>
              transformedData.gradeLabel.includes(d.gradeLabel) &&
              transformedData.subjectLabel.includes(d.subjectLabel)
          ),
          isSearch: true,
        };
      } else if ("gradeLabel" in transformedData) {
        return {
          searchData: get().data.filter(d =>
            transformedData.gradeLabel.includes(d.gradeLabel)
          ),
          isSearch: true,
        };
      } else if ("subjectLabel" in transformedData)
        return {
          searchData: get().data.filter(d =>
            transformedData.subjectLabel.includes(d.subjectLabel)
          ),
          isSearch: true,
        };

      return {
        ...state,
        searchData: [],
        isSearch: false,
      };
    }),
}));
