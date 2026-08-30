# 汽车记账 WXML 解析失败修复总结

## 报错
```
app.json: 未找到 ["pages"][6] 对应的 pages/car/car.wxml 文件
模拟器启动失败
```

## 根因
`pages/car/car.wxml` 的 WXML 表达式里使用了 `{{cycles[cycleIndex].name}}` 这种「数组索引访问」语法。**WeChat WXML 不支持 `[ ]` 索引访问表达式**，导致 WXML 解析器抛出不可恢复错误，IDE 将整个文件标记为「未找到」。

## 修复内容
- `pages/car/car.wxml`
  - `{{cycles[cycleIndex].name}}` → `{{currentCycleName}}`（在 JS 中预先计算）
  - `class="x {{...}}"` 半拼接 → `class="{{'x ' + (cond ? 'active' : '')}}"` 全表达式
  - `catchtap=""` 空字符串 → `catchtap="noop"` + JS 中添加 `noop()` 函数
  - 嵌套 `wx:for` 内层用 `wx:for-item="expense"` 显式重命名
- `pages/car/car.js`
  - `reload()` 中计算并 setData `currentCycleName`
  - 新增 `noop()` 占位函数
- 顺手把 `pages/car/other/other.wxml`、`pages/car/energy/energy.wxml`、`pages/car/detail/detail.wxml` 里的同类 `class="x {{...}}"` 拼接也统一改成完整 `{{}}` 表达式。

## 经验
**WXML 表达式限制清单**：
- 不支持 `arr[index]` 数组索引访问
- 不支持函数调用
- 不支持对象方法
- 不支持 `===` / `!==`（老版本基础库）
- 条件分支必须用三元运算符或 `wx:if`
