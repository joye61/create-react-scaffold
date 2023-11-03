import {
  type History,
  type Location,
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
   * 创建导航实例
   *
   * @param mode 模式
   */
  constructor(public mode: HistoryMode = "browser") {
    this.getHistory();
  }

  /**
   * 监听页面跳转
   * @param callback
   */
  onChange(callback: (location: Location) => void) {
    this.getHistory().listen(({ location }) => callback(location));
  }

  /**
   * 获取历史记录对象，如果没有，就创建
   * @returns History
   */
  public getHistory(): History {
    if (this.history) {
      return this.history;
    }

    if (this.mode === "browser") {
      this.history = createBrowserHistory();
    } else if (this.mode === "hash") {
      this.history = createHashHistory();
    } else if (this.mode === "memory") {
      this.history = createMemoryHistory();
    } else {
      throw new Error(`Unknown history type: ${this.mode}`);
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
