# 汽车记账模块总览

## 改动总览

### 1. 重命名：财务记账 → 储存记账
- `pages/index/index.js` / `index.wxml`：首页入口
- `pages/mine/mine.wxml` / `mine.js`：我的页 stat
- `pages/backup/backup.wxml` / `backup.js`：备份预览
- **保留不动**：`pages/savings/*` 所有内部逻辑

### 2. 新增汽车记账模块

**目录结构**
```
pages/car/
├── car.js / car.wxml / car.wxss / car.json         # 主页（用车记账）
├── energy/
│   ├── energy.js / .wxml / .wxss / .json           # 能耗支出（油费+新能源）
├── other/
│   ├── other.js / .wxml / .wxss / .json            # 用车支出（其他 8 种）
└── detail/
    ├── detail.js / .wxml / .wxss / .json           # 详情（编辑+删除）
```

**storage 新增**（`utils/storage.js`）
- `CAR_EXPENSES` / `CAR_SNAPSHOTS` 存储键
- `CAR_EXPENSE_TYPES`：10 种类型（fuel / ev / parking / toll / maintain / insurance / wash / fine / decorate / other）
- CRUD：getCarExpenses / getCarExpenseById / addCarExpense / updateCarExpense / deleteCarExpense
- 查询：getCarSummaryByCycle / getCarExpensesByType / getCarExpensesGroupedByMonth / getCarExpensesGroupedByDate
- 月度快照：recordCarSnapshot / getCarSnapshots

**备份**
- schema 升级到 `3.1.0`
- 导出：`car_expenses` / `car_snapshots`
- 导入：merge / replace 都支持

## 视觉设计

### 主页（用车记账）
- 蓝色渐变统计卡：支出统计 + 周期筛选 + 金额 + 共 N 笔
- 白色账目卡：按日期分组（06月29日 ¥xxx.xx），每条左侧图标 + 名称/备注 + 金额
- 底部双按钮：白色描边「新增能源支出」+ 蓝色实心「新增其他支出」

### 能耗支出
- 蓝色 header：「油费支出」/「新能源支出」+ ⇄ 切换 + 日期
- 模式：记总价（¥xxx） / 记明细（油量×油价=元 或 度数×电价=元）
- 备注（10 字以内）
- 底部蓝色「保存」按钮

### 用车支出
- 蓝色 header：「用车支出」+ 日期
- 支出费用 ¥0.00 概览
- 支出类型 9 宫格：停车费/路桥费/维修保养/车险/洗车美容/交通罚单/装饰/其他/新能源（多出 1 个「新能源」让用户直接从这里添加新能源支出）
- 金额 + 备注
- 底部蓝色「保存」按钮

### 详情
- 蓝色 header：图标 + 类型 + 金额
- 信息卡：日期 / 油量 / 油价 / 度数 / 电价 / 备注 / 创建时间
- 编辑 + 删除按钮

## 文件清单
- 新增：`pages/car/car.{js,wxml,wxss,json}`
- 新增：`pages/car/energy/energy.{js,wxml,wxss,json}`
- 新增：`pages/car/other/other.{js,wxml,wxss,json}`
- 新增：`pages/car/detail/detail.{js,wxml,wxss,json}`
- 修改：`utils/storage.js`（新增 ~150 行汽车记账代码 + 备份 schema 升级）
- 修改：`app.json`（注册 4 个新页面）
- 修改：`pages/index/index.js` / `index.wxml`（重命名 + 新增汽车记账卡片）
- 修改：`pages/mine/mine.js` / `mine.wxml`（重命名 + 新增汽车账目统计）
- 修改：`pages/backup/backup.js` / `backup.wxml`（重命名 + 新增汽车账目预览）
