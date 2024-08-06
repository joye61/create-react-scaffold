import React from "react";
import type { CRSOption } from "./types";
import { Resolver } from "./Resolver";

export class ViteApp extends Resolver {
  modules: Record<string, () => Promise<any>>;

  constructor(public option: CRSOption) {
    super(option);

    this.modules = (import.meta as any).glob([
      "@/pages/**/index.[jt]sx",
      "@/pages/**/data.[jt]s?(x)",
    ]);
  }

  /**
   * 设置页面内容
   * @param pathname 页面路径
   */
  public async setPageContent(pathname: string) {
    // 如果加载中回调存在，先执行加载中间回调
    const onLoading = this.option.onLoading;
    if (onLoading) {
      const onLoadingResult = await onLoading(pathname);
      if (onLoadingResult) {
        this.render(onLoadingResult);
      }
    }

    // 处理路径
    pathname = this.normalize(pathname);
    if (!pathname) {
      pathname = this.normalize(this.option.entry!);
    }

    // 页面没找到时的渲染逻辑
    const renderNotFound = async () => {
      const onNotFoundResult = await this.option.onNotFound?.();
      if (onNotFoundResult) {
        this.render(onNotFoundResult);
      }
    };

    // 首先查找页面是否存在，如果不存在，调用onNotFound
    const pageLoader =
      this.modules[`/src/pages/${pathname}/index.jsx`] ||
      this.modules[`/src/pages/${pathname}/index.tsx`];
    if (!pageLoader) {
      await renderNotFound();
      return;
    }

    let page: React.ReactNode | null = null;

    // 开始加载页面
    try {
      const pageModule = await pageLoader();
      if (pageModule.default) {
        page = <pageModule.default />;
      }
    } catch (error) {
      this.logError(error);
    }

    // 如果页面不存在，调用onNotFound
    if (!page) {
      await renderNotFound();
      return;
    }

    // 如果有onFound回调，调用
    const onFound = this.option.onFound;
    if (onFound) {
      page = await onFound(page);
    }

    // 只有页面确认存在才加载页面数据
    const dataLoader =
      this.modules[`/src/pages/${pathname}/data.js`] ||
      this.modules[`/src/pages/${pathname}/data.jsx`] ||
      this.modules[`/src/pages/${pathname}/data.ts`] ||
      this.modules[`/src/pages/${pathname}/data.tsx`];

    if (dataLoader) {
      try {
        const dataModule = await dataLoader();
        if (typeof dataModule.default === "function") {
          await dataModule.default();
        }
      } catch (error) {
        this.logError(error);
      }
    }

    // 渲染页面
    this.render(page);

    // 结束回调
    this.option.onLoaded?.();
  }
}
