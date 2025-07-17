import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
} from "history";
import { HistoryMode, NavigationInfo, NavigationType } from "./types";
import { normalize } from "./utils";

export const navInfo: NavigationInfo = {
  baseUrl: "/",
  history: undefined,
};

/**
 * 获取历史记录对象，如果没有，就创建
 * @param mode
 * @returns History
 */
export function getHistory(mode: HistoryMode = "browser") {
  if (navInfo.history) {
    return navInfo.history;
  }

  if (mode === "browser") {
    navInfo.history = createBrowserHistory();
  } else if (mode === "hash") {
    navInfo.history = createHashHistory();
  } else if (mode === "memory") {
    navInfo.history = createMemoryHistory();
  } else {
    throw new Error(`Unknown history type: ${mode}`);
  }
  return navInfo.history;
}

/**
 * 跳转到指定路径
 * @param path 路径
 * @param params 参数
 * @param type 跳转类型
 */
export function goto(
  path: string,
  params?: Record<string, any>,
  type: NavigationType = "push"
) {
  if (!navInfo.history) return;
  let url = normalize(path || "/");
  if (!url) {
    url = navInfo.baseUrl;
  } else {
    url = normalize(navInfo.baseUrl, "right") + "/" + url;
  }

  const search = new URLSearchParams(params ?? undefined);
  if (/\?/.test(url)) {
    url += "&" + search.toString();
  } else {
    url += "?" + search.toString();
  }
  navInfo.history[type](url);
}
