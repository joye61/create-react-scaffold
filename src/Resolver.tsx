import ReactDOM from "react-dom/client";
import type { CRSOption } from "./types";

export abstract class Resolver {
  // 挂载容器对象
  container: HTMLElement;

  /**
   * 构造函数
   * @param option
   */
  constructor(option: CRSOption) {
    let container: HTMLElement | null;
    if (option.root instanceof HTMLElement) {
      container = option.root;
    } else if (typeof option.root === "string") {
      container = document.querySelector(option.root);
    } else {
      throw new Error(`Unsupported root type`);
    }

    // 如果挂载容器不存在，报错
    if (!container) {
      throw new Error(`Mounting node not found`);
    }

    this.container = container;
  }

  /**
   * 格式化路径
   * @param pathname
   * @returns
   */
  normalize(pathname: string) {
    return pathname.replace(/^\/*|\/*$/g, "");
  }

  /**
   * 解析路径
   * @param pathname
   * @returns
   */
  render(content: React.ReactNode) {
    ReactDOM.createRoot(this.container).render(content);
  }

  /**
   * 设置页面内容
   * @param pathname
   * @param option
   * @returns
   */
  abstract setPageContent(pathname: string): Promise<void>;
}
