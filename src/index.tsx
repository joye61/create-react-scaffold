import { CraApp } from "./CraApp";
import { Navigation } from "./Navigation";
import { Resolver } from "./Resolver";
import { ViteApp } from "./ViteApp";
import type { CRSOption } from "./types";

export let navigation: Navigation | undefined;

/**
 * 创建一个react项目的脚手架
 * @param option
 */
export async function createReactScaffold(option: CRSOption) {
  if (!option.root) {
    option.root = "#root";
  }
  if (!option.historyMode) {
    option.historyMode = "browser";
  }
  if (!option.buildTool) {
    option.buildTool = "vite";
  }
  if (!option.defaultEntry) {
    option.defaultEntry = "home";
  }

  // 创建导航实例
  navigation = new Navigation(option.historyMode);

  // 应用启动事件
  await option.onStart?.();

  // 生成查找页面函数
  let resolver: Resolver;

  if (option.buildTool === "vite") {
    // 构建工具是vite
    resolver = new ViteApp(option);
  } else if (option.buildTool === "create-react-app") {
    // 构建工具是 create-react-app
    resolver = new CraApp(option);
  } else {
    // 不支持的构建工具
    throw new Error(`Unsupported build tool`);
  }

  // 监听历史数据变化
  navigation.onChange((location) => {
    resolver.setPageContent(location.pathname);
  });

  // 页面初始化需要渲染一次
  const currentPath = navigation.getHistory().location.pathname;
  await resolver.setPageContent(currentPath);
}
