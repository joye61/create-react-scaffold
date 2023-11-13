import ReactDOM from "react-dom/client";
import type { CRSOption } from "./types";

export abstract class Resolver {
  // 挂载容器对象
  container: HTMLElement;
  // 构建工具
  buildTool: "vite" | "create-react-app";

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
    this.buildTool = option.buildTool!;
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
   * 记录日志
   * @param callback
   */
  async log(callback: () => Promise<void>) {
    try {
      await callback();
    } catch (error) {
      if (
        (this.buildTool === "create-react-app" &&
          process.env.NODE_ENV !== "production") ||
        (this.buildTool === "vite" && !(import.meta as any).env.PROD)
      ) {
        console.error(error);
      }
    }
  }

  /**
   * 设置页面内容
   * @param pathname
   * @param option
   * @returns
   */
  abstract setPageContent(pathname: string): Promise<void>;
}
