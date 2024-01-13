import { create } from "zustand";

//보고서 타입: 질문 & 답변, 표, 차트

const TABLE = "table";
const GRAPH = "graph";
const TEXT = "text";

class Activity {
  constructor(question, type) {
    this._question = question;
    this._type = type;
    this._answer = null;
  }

  get question() {
    return this._question;
  }

  get type() {
    return this._type;
  }

  get answer() {
    return this._answer;
  }

  setAnswer(answer) {
    this._answer = answer;
  }

  copy() {
    const newActivity = new Activity(this._question, this._type);
    newActivity.setAnswer(this._answer);
    return newActivity;
  }
}
export const useReportStore = create((set, get) => ({
  activities: [
    new Activity("활동1: 교실의 공기질 측정하기", TABLE),
    new Activity(
      "활동2: 측정된 현재 데이터와 대기환경 기준 비교하고 이유 토론하기",
      TEXT
    ),
    new Activity("활동3: 그래프 만들어보기", GRAPH),
  ],

  writeAnswer: (index, answer) =>
    set(state => {
      const newActivities = get().activities.map(activity => activity.copy());
      newActivities[index].setAnswer(answer);
      return {
        ...state,
        activities: newActivities,
      };
    }),
}));
