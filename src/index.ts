import { HistoryMode, JumpType, Navigation } from "./Navigation";

export interface CRSOption {
  // 路由模式，默认history
  historyMode: HistoryMode;
  // 构建工具，默认vite
  buildTool: "create-react-app" | "vite";
  // 应用启动时触发，最先触发的回调
  onStart?: () => void | Promise<void>;
  // 开始加载页面时触发，在数据加载之前
  onFindStart?: () => void | Promise<void>;
  // 找到页面触发
  onFind?: () => void | Promise<void>;
  // 找到页面结束时触发
  onFindEnd?: () => void | Promise<void>;
  // 页面未找到时触发
  onNotFound?: () => void | Promise<void>;
}

export let navigation: Navigation | undefined;

export function goto(
  path: string,
  params?: Record<string, any> | undefined,
  type?: JumpType
) {
  navigation?.to(path, params, type);
}
export async function createReactScaffold(option: CRSOption) {
  const {
    historyMode = "browser",
    buildTool = "vite",
    onStart,
    onFindStart,
    onFind,
    onFindEnd,
    onNotFound,
  } = option;
  navigation = new Navigation(historyMode);
}
