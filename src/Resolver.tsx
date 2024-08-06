import ReactDOM from "react-dom/client";
import type { CRSOption } from "./types";

export abstract class Resolver {
  buildTool: string | undefined;
  renderRoot: ReactDOM.Root;

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

    // 如果挂载容器不存在，抛出报错
    if (!container) {
      throw new Error(`Mounting node not found`);
    }

    // 存储唯一的根渲染实例
    this.renderRoot = ReactDOM.createRoot(container);
  }

  /**
   * 记录错误日志
   * @param error
   */
  logError(error: any) {
    if (!(import.meta as any).env.PROD) {
      console.error(error);
    }
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
    this.renderRoot.render(content);
  }

  /**
   * 设置页面内容
   * @param pathname
   * @param option
   * @returns
   */
  abstract setPageContent(pathname: string): Promise<void>;
}
