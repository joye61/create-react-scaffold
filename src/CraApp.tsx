import React from "react";
import { Resolver } from "./Resolver";
import { CRSOption } from "./types";

export class CraApp extends Resolver {
  constructor(public option: CRSOption) {
    super(option);
  }

  /**
   * 设置页面内容
   * @param pathname 页面路径
   */
  public async setPageContent(pathname: string): Promise<void> {
    // 如果加载中回调存在，先展示加载中间回调
    if (this.option.onLoading) {
      this.render(await this.option.onLoading());
    }

    pathname = this.normalize(pathname);
    if (!pathname) {
      pathname = this.normalize(this.option.defaultEntry!);
    }

    let page: React.ReactNode | null = null;

    // 查找页面
    await this.log(async () => {
      let pageModule = await import(`@/pages/${pathname}/index.jsx`);
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
    await this.log(async () => {
      let dataModule = await import(`@/pages/${pathname}/data.js`);
      if (typeof dataModule.default === "function") {
        await dataModule.default();
      }
    });

    // 渲染页面
    this.render(page);

    // 结束回调
    this.option.onLoaded?.();
  }
}
