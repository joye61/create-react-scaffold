import { ViteApp } from "./ViteApp";
import type { CreateReactScaffoldOption } from "./types";
import { getHistory } from "./history";

/**
 * 创建一个react项目的脚手架
 * @param option
 */
export async function createReactScaffold(option?: CreateReactScaffoldOption) {
  let config: CreateReactScaffoldOption = {
    root: "#root",
    mode: "browser",
    entry: "home",
  };

  if (option && typeof option === "object") {
    config = {
      ...config,
      ...option,
    };
  }

  // 创建历史记录实例
  const history = getHistory(config.mode);

  // 应用启动事件
  await config.onStart?.();

  // 创建解析程序
  const resolver = new ViteApp(config);

  // 监听历史数据变化
  history.listen(({ location }) => {
    resolver.setPageContent(location.pathname);
  });

  // 页面初始化需要渲染一次
  await resolver.setPageContent(history.location.pathname);
}

// 重新导出
export { getHistory, goto } from "./history";
