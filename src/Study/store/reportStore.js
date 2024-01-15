import { create } from "zustand";

//보고서 타입: 질문 & 답변, 표, 차트

const TABLE = "table";
const GRAPH = "graph";
const TEXT = "text";
const SEED = "seed";
const DISCUSSION = "discussion";
const FILL_TABLE = "fill_table";

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
    new Activity("활동1: 센서에서 측정된 값을 읽고 현재 데이터 기록하기", SEED),
    new Activity(
      "활동2: 측정된 현재 데이터와 대기환경 기준 비교하고 이유 토론하기",
      DISCUSSION
    ),
    new Activity("활동3: 센서를 활용하여 30분간 교실 공기질 측정하기", "none"),
    new Activity("활동4: 표 채워넣기", FILL_TABLE),
    new Activity("활동5: 그래프 만들어보기", GRAPH),
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
