import { type HistoryMode } from "./Navigation";

export type ReactNodeResult = React.ReactNode | Promise<React.ReactNode>;

export interface CRSOption {
  // 挂载目标
  root?: string | HTMLElement;
  // 路由模式，默认history
  historyMode?: HistoryMode;
  // 构建工具，默认vite
  buildTool?: "create-react-app" | "vite";
  // 默认页面
  defaultEntry?: string;
  // 应用启动时触发，最先触发的回调
  onStart?: () => void | Promise<void>;
  // 开始加载页面时触发，在数据加载之前
  onLoading?: () => ReactNodeResult;
  // 找到页面触发
  onFind?: (content?: React.ReactNode) => ReactNodeResult;
  // 找到页面结束时触发
  onFindEnd?: () => void | Promise<void>;
  // 页面未找到时触发
  onNotFound?: () => ReactNodeResult;
}
