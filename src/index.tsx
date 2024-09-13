import { Navigation } from "./Navigation";
import { Resolver } from "./Resolver";
import { ViteApp } from "./ViteApp";
import type { CRSOption } from "./types";

/**
 * 初始化Navigation对象
 */
export const navigation = new Navigation();

/**
 * 创建一个react项目的脚手架
 * @param option
 */
export async function createReactScaffold(option?: CRSOption) {
  let config: CRSOption = {
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
  const history = navigation.getHistory(config.mode);

  // 应用启动事件
  await config.onStart?.();

  // 创建解析程序
  const resolver: Resolver = new ViteApp(config);

  // 开始路由
  const onPathChange = async (pathname: string) => {
    const finalPath = await config.onChange?.(pathname);
    await resolver.setPageContent(finalPath ?? pathname);
  };

  // 监听历史数据变化
  history.listen(({ location }) => {
    onPathChange(location.pathname);
  });

  // 页面初始化需要渲染一次
  await onPathChange(history.location.pathname);
}
