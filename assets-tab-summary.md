# 实物资产页面 Tab 改造总结

## 改动内容

实物资产页面的 Tab 切换从**底部内联 TabBar**改为**顶部 Tab 切换**，与财务记账页面风格保持一致。

### 修改的文件

- `pages/assets/assets.wxml` — 结构改造
- `pages/assets/assets.wxss` — 样式改造
- `pages/assets/assets.js` — 逻辑清理

### 具体改动

#### WXML（结构）
- ✅ 顶部加入 `top-tabs` 切换栏（资产 / 心愿 / 趋势）
- ✅ 移除底部 `inline-tabbar`
- ✅ 移除悬浮加号按钮 `+`
- ✅ 每个 Tab 内容底部加入「+ 添加资产」/ 「+ 添加心愿」按钮

#### WXSS（样式）
- ✅ 新增 `.page`、`.top-tabs`、`.top-tab`、`.tab-content` 样式
- ✅ 新增 `.add-btn-wrap`、`.add-btn`、`.add-btn-green`、`.add-btn-pink` 样式
- ✅ 移除 `.inline-tabbar`、`.float-btn`、`.bottom-spacer` 样式
- ✅ 资产总览卡片改为绿色渐变背景

#### JS（逻辑）
- ✅ `tabs` 数据更新（name 改为「资产/心愿/趋势」，移除 icon）
- ✅ 移除 `onLoad` 中 `settings` 保护逻辑
- ✅ 移除 `showClearConfirm` 数据
- ✅ 移除 `clearAllData` 函数

## 使用说明

用微信开发者工具重新编译后，进入实物资产页面即可看到：
- 顶部有三个 Tab：**资产、心愿、趋势**
- 点击 Tab 可切换内容
- 每个 Tab 内容底部有对应的添加按钮
