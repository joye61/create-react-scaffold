import React from "react";
import ReactDOM from "react-dom/client";
import type { CreateReactScaffoldOption, PathInfo } from "./types";
import { normalize } from "./utils";
import { navInfo } from "./history";

export class ViteApp {
  private modules: Record<string, () => Promise<any>>;
  private renderRoot: ReactDOM.Root;

  constructor(public option: CreateReactScaffoldOption) {
    // 首先获取所有动态模块的路径
    this.modules = (import.meta as any).glob([
      "@/pages/**/index.[jt]sx",
      "@/pages/**/data.[jt]s?(x)",
    ]);

    // 设置根渲染实例
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

    this.renderRoot = ReactDOM.createRoot(container);
  }

  /**
   * 记录错误日志
   * @param error
   */
  error(error: any) {
    if (!(import.meta as any).env.PROD) {
      console.error(error);
    }
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
   * 加载页面，此时不渲染
   * @param pathinfo
   * @returns
   */
  async loadPage(pathinfo: PathInfo) {
    // 首先查找页面是否存在，如果不存在，直接返回null
    const pageLoader =
      this.modules[`/src/pages/${pathinfo.trim}/index.jsx`] ||
      this.modules[`/src/pages/${pathinfo.trim}/index.tsx`];
    if (!pageLoader) {
      return null;
    }

    // 开始加载页面
    let page: React.ReactNode | null = null;
    try {
      const pageModule = await pageLoader();
      const keys = Object.keys(pageModule);

      let PageComponent: React.ComponentType | null = null;
      if (pageModule.default) {
        PageComponent = pageModule.default;
      } else if (keys[0]) {
        PageComponent = pageModule[keys[0]];
      }
      if (PageComponent) {
        page = <PageComponent />;
      }
    } catch (error) {
      this.error(error);
      return null;
    }

    // 如果有onPage回调，调用
    const onPage = this.option.onPage;
    if (onPage && typeof onPage === "function") {
      page = await onPage(page, pathinfo);
    }

    return page;
  }

  /**
   * 加载页面数据
   * @param pathinfo
   */
  async loadData(pathinfo: PathInfo) {
    // 只有页面确认存在才加载页面数据
    const dataLoader =
      this.modules[`/src/pages/${pathinfo.trim}/data.js`] ||
      this.modules[`/src/pages/${pathinfo.trim}/data.jsx`] ||
      this.modules[`/src/pages/${pathinfo.trim}/data.ts`] ||
      this.modules[`/src/pages/${pathinfo.trim}/data.tsx`];

    if (dataLoader) {
      try {
        const dataModule = await dataLoader();
        if (typeof dataModule.default === "function") {
          await dataModule.default();
        } else if (typeof dataModule.getPageData === "function") {
          await dataModule.getPageData();
        }
      } catch (error) {
        this.error(error);
      }
    }
  }

  /**
   * 设置页面内容
   * @param pathname 页面路径
   */
  public async setPageContent(pathname: string) {
    const origin = pathname;

    // 如果页面存在基础路径，先移除基础路径
    let base = normalize(navInfo.baseUrl);
    pathname = normalize(pathname);
    if (base && pathname.startsWith(base)) {
      pathname = pathname.slice(base.length);
      pathname = normalize(pathname);
    }

    // 如果路径为空，路由到入口路径
    if (!pathname) {
      pathname = normalize(this.option.entry!);
    }

    // 路径信息
    const pathinfo: PathInfo = {
      origin,
      real: "/" + pathname,
      trim: pathname,
    };

    // 页面加载前置页面拦截
    const onBeforePage = this.option.onBeforePage;
    if (onBeforePage && typeof onBeforePage === "function") {
      const onBeforePageResult = await onBeforePage(pathinfo);
      if (onBeforePageResult) {
        this.render(onBeforePageResult);
      }
    }

    // 数据加载和页面加载同时进行，以保证尽可能快的加载页面
    const [page] = await Promise.all([
      this.loadPage(pathinfo),
      this.loadData(pathinfo),
    ]);

    // 如果页面不存在，调用onNotFound
    if (!page) {
      const onNotFound = this.option.onNotFound;
      if (onNotFound && typeof onNotFound === "function") {
        const onNotFoundResult = await onNotFound(pathinfo);
        this.render(onNotFoundResult);
      } else {
        this.render(null);
      }
      return;
    }

    // 渲染页面，保证页面数据能读取
    this.render(page);

    // 页面渲染结束后回调
    this.option.onAfterPage?.(pathinfo);
  }
}
