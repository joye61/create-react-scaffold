import React from "react";
import type { CRSOption } from "./types";
import { Resolver } from "./Resolver";

export class ViteApp extends Resolver {
  preloadModules: Record<string, () => Promise<any>>;

  constructor(public option: CRSOption) {
    super(option);

    this.preloadModules = (import.meta as any).glob([
      "@/pages/**/index.jsx",
      "@/pages/**/data.js?(x)",
    ]);
  }

  /**
   * 设置页面内容
   * @param pathname 页面路径
   */
  public async setPageContent(pathname: string) {
    // 如果加载中回调存在，先展示加载中间回调
    if (this.option.onLoading) {
      this.render(await this.option.onLoading());
    }

    pathname = this.normalize(pathname);
    if (!pathname) {
      pathname = this.normalize(this.option.defaultEntry!);
    }

    // 首先查找页面是否存在，如果不存在，调用onNotFound
    const pageLoader = this.preloadModules[`/src/pages/${pathname}/index.jsx`];
    if (!pageLoader) {
      this.render(await this.option.onNotFound?.());
      return;
    }

    let page: React.ReactNode | null = null;

    // 开始加载页面
    await this.log(async () => {
      const pageModule = await pageLoader();
      if (pageModule.default) {
        page = <pageModule.default />;
      }
    });

    // 如果页面不存在，调用onNotFound
    if (!page) {
      this.render(await this.option.onNotFound?.());
      return;
    }

    // 如果有onFind回调，调用
    if (this.option.onFind) {
      page = await this.option.onFind(page);
    }

    // 只有页面确认存在才加载页面数据
    const dataLoader =
      this.preloadModules[`/src/pages/${pathname}/data.js`] ||
      this.preloadModules[`/src/pages/${pathname}/data.jsx`];

    if (dataLoader) {
      await this.log(async () => {
        const dataModule = await dataLoader();
        if (typeof dataModule.default === "function") {
          await dataModule.default();
        }
      });
    }

    // 渲染页面
    this.render(page);

    // 结束回调
    this.option.onLoaded?.();
  }
}
