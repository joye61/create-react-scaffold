import { type HistoryMode } from "./Navigation";

export type ReactNodeResult = React.ReactNode | Promise<React.ReactNode>;

export interface CRSOption {
  // 挂载目标
  root?: string | HTMLElement;
  // 路由模式，默认history
  mode?: HistoryMode;
  // 默认页面
  entry?: string;
  // 应用启动时触发，最先触发的回调
  onStart?: () => void | Promise<void>;
  // 开始加载页面时触发，在数据加载之前
  onLoading?: (pathname?: string) => ReactNodeResult;
  // 找到页面触发，此函数可以将找到的页面进行二次包装
  onFound?: (content?: React.ReactNode) => ReactNodeResult;
  // 页面渲染结束时触发
  onLoaded?: () => void | Promise<void>;
  // 页面未找到时触发
  onNotFound?: () => ReactNodeResult;
  // 页面路由变化时触发，初始化也会触发一次
  onChange?: (pathname?: string) => void | Promise<void>;
}
