import { atom } from "recoil";

export const basicInfoState = atom({
  key: "basicInfo",
  default: {},
});

export const allColumnsState = atom({
  key: "allColumns",
  default: [],
});

export const targetColumnState = atom({
  key: "targetColumn",
  default: "",
});
