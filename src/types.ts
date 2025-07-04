export type HistoryMode = "browser" | "hash" | "memory";

export type NavigationType = "push" | "replace";

export type ReactNodeResult = React.ReactNode | Promise<React.ReactNode>;

export type PathInfo = {
  // 原始路径，没有过滤base路径
  origin: string;
  // 真实路径，过滤了base路径
  real: string;
  // 移除前后反斜杠后的路径
  trim: string;
};

export interface CreateReactScaffoldOption {
  // 挂载目标
  root?: string | HTMLElement;
  // 路由模式，默认history
  mode?: HistoryMode;
  // 默认页面
  entry?: string;
  // 页面基础路径，如果设置了，会从路由路径中删除
  base?: string;
  // 应用启动时触发，最先触发的回调
  onStart?: () => void | Promise<void>;
  // 开始加载页面时触发，在数据加载之前
  // 一般这个钩子作为页面展示前加载的状态
  // 返回值为一个组件会进行渲染
  onBeforePage?: (pathinfo?: PathInfo) => ReactNodeResult;
  // 找到页面触发，此函数可以将找到的页面进行二次包装
  onPage?: (content?: React.ReactNode, pathinfo?: PathInfo) => ReactNodeResult;
  // 页面渲染结束时触发
  // 一般这个钩子用户页面加载后执行一些逻辑
  onAfterPage?: (pathinfo?: PathInfo) => void | Promise<void>;
  // 页面未找到时触发
  // 返回值会作为
  onNotFound?: (pathinfo?: PathInfo) => ReactNodeResult;
}
