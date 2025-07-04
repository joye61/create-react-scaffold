import {
  type History,
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
} from "history";
import { HistoryMode, NavigationType } from "./types";

let _history: History | undefined;

/**
 * 获取历史记录对象，如果没有，就创建
 * @param mode
 * @returns History
 */
export function getHistory(mode: HistoryMode = "browser") {
  if (_history) {
    return _history;
  }

  if (mode === "browser") {
    _history = createBrowserHistory();
  } else if (mode === "hash") {
    _history = createHashHistory();
  } else if (mode === "memory") {
    _history = createMemoryHistory();
  } else {
    throw new Error(`Unknown history type: ${mode}`);
  }
  return _history;
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
  if (!_history) return;
  let url = path || "/";
  let base = (import.meta as any).env.BASE_URL || "/";

  const search = new URLSearchParams(params ?? undefined);
  if (/\?/.test(url)) {
    url += "&" + search.toString();
  } else {
    url += "?" + search.toString();
  }
  _history[type](url);
}
