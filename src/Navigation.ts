import {
  type History,
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
} from "history";

// 历史记录模式
export type HistoryMode = "browser" | "hash" | "memory";

// 跳转类型
export type JumpType = "push" | "replace";

/**
 * 导航类
 */
export class Navigation {
  /**
   * 历史记录实例
   */
  public history?: History;

  /**
   * 获取历史记录对象，如果没有，就创建
   * @returns History
   */
  public getHistory(mode: HistoryMode = "browser"): History {
    if (this.history) {
      return this.history;
    }

    if (mode === "browser") {
      this.history = createBrowserHistory();
    } else if (mode === "hash") {
      this.history = createHashHistory();
    } else if (mode === "memory") {
      this.history = createMemoryHistory();
    } else {
      throw new Error(`Unknown history type: ${mode}`);
    }
    return this.history;
  }

  /**
   * 跳转到指定路径
   * @param path 路径
   * @param params 参数
   * @param type 跳转类型
   */
  public to(
    path: string,
    params?: Record<string, any>,
    type: JumpType = "push"
  ) {
    let url = path || "/";
    const search = new URLSearchParams();
    for (let key in params) {
      search.append(key, params[key]);
    }
    if (/\?/.test(url)) {
      url += "&" + search.toString();
    } else {
      url += "?" + search.toString();
    }
    this.getHistory()[type](url);
  }
}
