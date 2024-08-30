import L from "lodash";

import SessionStorageService from "./session";

const storage = new SessionStorageService();

class SandboxHistoryService {
  #key = "sandbox-history";

  pushHistory = (currScreen, nextScreen, fid, prevFid = null, nextFid = null) => {
    let history = storage.getItem(this.#key) ?? [];

    let currIndex = history.findIndex((hist) => hist.name === currScreen);
    if (currIndex === -1) currIndex = history.length;
    let nextIndex = history.findIndex((hist) => hist.name === nextScreen);
    if (nextIndex === -1) nextIndex = currIndex + 1;

    const newCurrHistItem = { name: currScreen, fid, prevFid, nextFid };
    if (L.isEqual(history[currIndex], newCurrHistItem)) {
      history[nextIndex] = { ...history[nextIndex], name: nextScreen, fid: nextFid, prevFid: fid };
    } else {
      history[currIndex] = newCurrHistItem;
      history[nextIndex] = { name: nextScreen, fid: nextFid, prevFid: fid };
      history.splice(nextIndex + 1);
    }

    storage.setItem(this.#key, history);
  };

  getFromHistory = (targetScreen, sourceScreen = null) => {
    const history = storage.getItem(this.#key) || [];
    const histItem = history.find((hist) => hist.name === targetScreen);

    if (sourceScreen) {
      const sourceScreenIndex = history.findIndex((hist) => hist.name === sourceScreen) || 1;
      history[sourceScreenIndex - 1] = { name: targetScreen };
      storage.setItem(this.#key, history);
    }

    return histItem || { name: targetScreen };
  };
}

export default new SandboxHistoryService();
