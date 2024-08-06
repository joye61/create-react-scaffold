# create-react-scaffold

创建 `React` 应用程序模板，支持 `vite` 构建工具

## 安装

```
npm install create-react-scaffold
```

## 使用

```js
// 导入库
import { createReactScaffold } from "create-react-scaffold";

// 创建应用
const app = await createReactScaffold({
  /** options */
});
```

## 查找规则

假设 URL 为 `https://example.com/path/to/app`，则路由查找规则为：

- 查找本地 `./pages/path/to/app/index.jsx` 文件，该文件的默认导出为页面组件

## 约定

1. 约定 `pages` 为页面组件的目录名
2. 约定 `/path/to/app` 为路由路径
3. 约定 `./pages/path/to/app/index.jsx` 为页面组件文件
4. 约定 `./pages/path/to/app/data.js[x]` 为数据文件
5. 约定 `@` 作为 `src` 目录别名
6. 约定 `src` 目录为源码目录（需要在构建工具中配置）
