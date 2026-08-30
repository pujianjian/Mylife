const STORAGE_KEYS = {
  WEIGHT: 'weight_records',
  HEIGHT: 'user_height',
  EXERCISES: 'exercise_records',
  EXERCISE_GOAL: 'exercise_weekly_goal',
  // 财务记账（原资产管理）
  BILL_ACCOUNTS: 'asset_accounts',
  BILL_TRANSACTIONS: 'bill_transactions',
  BILL_SNAPSHOTS: 'asset_snapshots',
  BILL_ACCOUNT_LOGS: 'bill_account_logs',
  // 实物资产管理
  PHYSICAL_ASSETS: 'physical_assets',
  WISHLIST: 'wishlist_records',
  PHYSICAL_SNAPSHOTS: 'physical_asset_snapshots',
  // 汽车记账
  CAR_EXPENSES: 'car_expenses',
  CAR_SNAPSHOTS: 'car_expense_snapshots',
  // 重要日子
  IMPORTANT_DAYS: 'important_days',
  // 家庭记账
  FAMILY_INCOMES: 'family_incomes',
  FAMILY_EXPENSES: 'family_expenses',
  FAMILY_ASSETS: 'family_assets',
  FAMILY_SNAPSHOTS: 'family_snapshots',
  // 需求反馈
  FEEDBACK_REQUESTS: 'feedback_requests',
  // 待办事项
  TODO_ITEMS: 'todo_items',
  TODO_COMPLETIONS: 'todo_completions',
  // 个人爱好
  HOBBY_ITEMS: 'hobby_items'
};

// 重要日子 - 分类
const IMPORTANT_DAY_CATEGORIES = [
  { key: 'birthday', name: '生日', icon: '🎂', color: '#F472B6' },
  { key: 'anniversary', name: '纪念日', icon: '💝', color: '#EC4899' },
  { key: 'festival', name: '节日', icon: '🎉', color: '#F59E0B' },
  { key: 'other', name: '其他', icon: '📌', color: '#6B7280' }
];

// 重要日子 - 频率
const IMPORTANT_DAY_FREQUENCIES = [
  { key: 'yearly', name: '每年一次' },
  { key: 'monthly', name: '每月一次' },
  { key: 'once', name: '仅一次' }
];

// 重要日子 - 日历类型
const IMPORTANT_DAY_CALENDARS = [
  { key: 'solar', name: '公历' },
  { key: 'lunar', name: '农历' }
];

// 汽车记账 - 支出类型
const CAR_EXPENSE_TYPES = [
  { key: 'fuel', name: '燃油费', icon: '⛽', color: '#F59E0B', group: 'energy' },
  { key: 'ev', name: '新能源', icon: '🔌', color: '#10B981', group: 'energy' },
  { key: 'parking', name: '停车费', icon: '🅿️', color: '#3B82F6', group: 'other' },
  { key: 'toll', name: '路桥费', icon: '🛣', color: '#6366F1', group: 'other' },
  { key: 'maintain', name: '维修保养', icon: '🔧', color: '#0EA5E9', group: 'other' },
  { key: 'insurance', name: '车险', icon: '🛡', color: '#06B6D4', group: 'other' },
  { key: 'wash', name: '洗车美容', icon: '🚿', color: '#22D3EE', group: 'other' },
  { key: 'fine', name: '交通罚单', icon: '🚓', color: '#EF4444', group: 'other' },
  { key: 'decorate', name: '装饰', icon: '🎀', color: '#EC4899', group: 'other' },
  { key: 'other', name: '其他', icon: '♾️', color: '#6B7280', group: 'other' }
];

// 周期筛选
const CAR_CYCLE_TYPES = [
  { key: 'all', name: '全部周期' },
  { key: 'month', name: '本月' },
  { key: 'last-month', name: '上月' },
  { key: 'year', name: '本年' }
];

// 运动类型定义
const EXERCISE_TYPES = [
  { key: 'run', name: '跑步', icon: '🏃', color: '#F59E0B', unit: 'km' },
  { key: 'cycling', name: '骑行', icon: '🚴', color: '#3B82F6', unit: 'km' },
  { key: 'custom', name: '自定义运动', icon: '💪', color: '#8B5CF6', unit: 'min' }
];

// 账单账户类型（原资产分类）
const BILL_ACCOUNT_TYPES = [
  { key: 'cash', name: '现金', type: 'asset', icon: '💵', color: '#10B981' },
  { key: 'savings', name: '储蓄卡', type: 'asset', icon: '💳', color: '#3B82F6' },
  { key: 'investment', name: '投资账户', type: 'asset', icon: '📈', color: '#F59E0B' },
  { key: 'liability', name: '负债', type: 'liability', icon: '📋', color: '#EF4444' },
  { key: 'claim', name: '债权', type: 'claim', icon: '🤝', color: '#06B6D4' },
  { key: 'custom', name: '自定义', type: 'asset', icon: '📦', color: '#8B5CF6' }
];

// 财务记账分类（支出/收入）
const BILL_CATEGORIES = {
  expense: [
    { key: 'food', name: '餐饮', icon: '🍜', color: '#F59E0B' },
    { key: 'transport', name: '交通', icon: '🚇', color: '#3B82F6' },
    { key: 'shopping', name: '购物', icon: '🛍', color: '#EC4899' },
    { key: 'entertainment', name: '娱乐', icon: '🎬', color: '#8B5CF6' },
    { key: 'housing', name: '居住', icon: '🏠', color: '#10B981' },
    { key: 'medical', name: '医疗', icon: '💊', color: '#EF4444' },
    { key: 'education', name: '学习', icon: '📚', color: '#06B6D4' },
    { key: 'other', name: '其他', icon: '📦', color: '#6B7280' }
  ],
  income: [
    { key: 'salary', name: '工资', icon: '💰', color: '#10B981' },
    { key: 'bonus', name: '奖金', icon: '🎁', color: '#F59E0B' },
    { key: 'investment', name: '理财', icon: '📈', color: '#3B82F6' },
    { key: 'gift', name: '礼金', icon: '🧧', color: '#EC4899' },
    { key: 'other', name: '其他', icon: '📦', color: '#6B7280' }
  ]
};

// 实物资产状态
const ASSET_STATUS = [
  { key: 'active', name: '服役中', color: '#84CC16', colorLight: '#ECFCCB' },
  { key: 'retired', name: '已退役', color: '#F59E0B', colorLight: '#FEF3C7' },
  { key: 'sold', name: '已卖出', color: '#6B7280', colorLight: '#F3F4F6' }
];

// 实物资产分类
const ASSET_CATEGORIES = [
  { key: 'electronics', name: '数码', icon: '💻', color: '#3B82F6' },
  { key: 'vehicle', name: '交通工具', icon: '🚲', color: '#10B981' },
  { key: 'property', name: '房产', icon: '🏠', color: '#F59E0B' },
  { key: 'appliance', name: '家电', icon: '📺', color: '#8B5CF6' },
  { key: 'furniture', name: '家具', icon: '🛋', color: '#EC4899' },
  { key: 'other', name: '其他', icon: '📦', color: '#6B7280' }
];

// 家庭收入类型
const FAMILY_INCOME_TYPES = [
  { key: 'salary', name: '工资', icon: '💰', color: '#10B981' },
  { key: 'rent', name: '收租', icon: '🏠', color: '#F59E0B' },
  { key: 'other', name: '其他收入', icon: '📦', color: '#6B7280' }
];

// 家庭收入来源
const FAMILY_INCOME_SOURCES = [
  { key: 'husband', name: '男方' },
  { key: 'wife', name: '女方' },
  { key: 'family', name: '家庭共同' }
];

// 家庭开支类型
const FAMILY_EXPENSE_TYPES = [
  { key: 'mortgage', name: '房贷', icon: '🏠', color: '#EF4444' },
  { key: 'living', name: '生活费', icon: '🍚', color: '#F59E0B' },
  { key: 'child', name: '小孩', icon: '👶', color: '#EC4899' },
  { key: 'other', name: '其他', icon: '📦', color: '#6B7280' }
];

// 家庭开支支付方
const FAMILY_EXPENSE_PAYERS = [
  { key: 'husband', name: '男方' },
  { key: 'wife', name: '女方' },
  { key: 'shared', name: '共同' }
];

// 家庭资产类型
const FAMILY_ASSET_TYPES = [
  { key: 'savings', name: '存款', icon: '🏦', color: '#10B981', isLiability: false },
  { key: 'fund', name: '小孩基金', icon: '📊', color: '#3B82F6', isLiability: false },
  { key: 'debt', name: '负债', icon: '📋', color: '#EF4444', isLiability: true },
  { key: 'other', name: '其他', icon: '📦', color: '#6B7280', isLiability: false }
];

// 需求反馈 - 分类
const FEEDBACK_CATEGORIES = [
  { key: 'feature', name: '功能建议', icon: '✨', color: '#3B82F6' },
  { key: 'bug', name: 'Bug反馈', icon: '🐛', color: '#EF4444' },
  { key: 'improvement', name: '体验优化', icon: '🎨', color: '#F59E0B' },
  { key: 'new_demand', name: '新需求', icon: '📝', color: '#8B5CF6' },
  { key: 'other', name: '其他', icon: '📌', color: '#6B7280' }
];

// 需求反馈 - 优先级
const FEEDBACK_PRIORITIES = [
  { key: 'high', name: '高', color: '#EF4444' },
  { key: 'medium', name: '中', color: '#F59E0B' },
  { key: 'low', name: '低', color: '#6B7280' }
];

// 需求反馈 - 状态
const FEEDBACK_STATUSES = [
  { key: 'pending', name: '待处理', color: '#6B7280' },
  { key: 'in_progress', name: '进行中', color: '#3B82F6' },
  { key: 'done', name: '已完成', color: '#10B981' },
  { key: 'closed', name: '已关闭', color: '#9CA3AF' }
];

// 待办事项 - 频率
const TODO_FREQUENCIES = [
  { key: 'daily', name: '每日', icon: '☀️', color: '#3B82F6', lightColor: '#DBEAFE' },
  { key: 'weekly', name: '每周', icon: '📊', color: '#8B5CF6', lightColor: '#EDE9FE' },
  { key: 'monthly', name: '每月', icon: '🌙', color: '#EC4899', lightColor: '#FCE7F3' },
  { key: 'yearly', name: '每年', icon: '🎉', color: '#F59E0B', lightColor: '#FEF3C7' }
];

// 待办事项 - 优先级
const TODO_PRIORITIES = [
  { key: 'high', name: '高', color: '#EF4444' },
  { key: 'medium', name: '中', color: '#F59E0B' },
  { key: 'low', name: '低', color: '#6B7280' }
];

// 待办事项 - 状态
const TODO_STATUSES = [
  { key: 'active', name: '进行中', color: '#10B981' },
  { key: 'paused', name: '已暂停', color: '#F59E0B' },
  { key: 'archived', name: '已归档', color: '#9CA3AF' }
];

// 个人爱好 - 分类
const HOBBY_CATEGORIES = [
  { key: 'sports', name: '运动', icon: '⚽', color: '#10B981' },
  { key: 'music', name: '音乐', icon: '🎵', color: '#8B5CF6' },
  { key: 'reading', name: '阅读', icon: '📚', color: '#3B82F6' },
  { key: 'art', name: '艺术', icon: '🎨', color: '#EC4899' },
  { key: 'craft', name: '手工', icon: '✂️', color: '#F59E0B' },
  { key: 'game', name: '游戏', icon: '🎮', color: '#6366F1' },
  { key: 'cooking', name: '烹饪', icon: '🍳', color: '#EF4444' },
  { key: 'travel', name: '旅行', icon: '✈️', color: '#06B6D4' },
  { key: 'other', name: '其他', icon: '🌟', color: '#6B7280' }
];

// 个人爱好 - 状态
const HOBBY_STATUSES = [
  { key: 'learning', name: '学习中', color: '#3B82F6' },
  { key: 'proficient', name: '熟练', color: '#10B981' },
  { key: 'paused', name: '暂停中', color: '#F59E0B' },
  { key: 'abandoned', name: '已放弃', color: '#9CA3AF' }
];

// 星期
const TODO_WEEKDAYS = [
  { key: 1, name: '周一', short: '一' },
  { key: 2, name: '周二', short: '二' },
  { key: 3, name: '周三', short: '三' },
  { key: 4, name: '周四', short: '四' },
  { key: 5, name: '周五', short: '五' },
  { key: 6, name: '周六', short: '六' },
  { key: 7, name: '周日', short: '日' }
];

const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value);
    return true;
  } catch (e) {
    console.error('Storage set error:', e);
    return false;
  }
};

const getStorage = (key, defaultValue = null) => {
  try {
    return wx.getStorageSync(key) || defaultValue;
  } catch (e) {
    console.error('Storage get error:', e);
    return defaultValue;
  }
};

const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key);
    return true;
  } catch (e) {
    console.error('Storage remove error:', e);
    return false;
  }
};

// ========== 身高 / 体重 / 健康相关 ==========

const getHeight = () => {
  const height = getStorage(STORAGE_KEYS.HEIGHT, 0);
  return parseFloat(height) || 0;
};

const setHeight = (height) => {
  return setStorage(STORAGE_KEYS.HEIGHT, parseFloat(height) || 0);
};

const calculateBMI = (weight, heightCm) => {
  const w = parseFloat(weight);
  const h = parseFloat(heightCm);
  if (!w || !h || h <= 0) return null;
  const hM = h / 100;
  return parseFloat((w / (hM * hM)).toFixed(1));
};

const BODY_FAT_RANGES = { low: 18, high: 28 };
const MUSCLE_RANGES = { low: 30, high: 40 };
const BMI_RANGES = { underweight: 18.5, normal: 24, overweight: 28 };

const getLevel = (value, low, high) => {
  const num = parseFloat(value);
  if (isNaN(num)) return 'normal';
  if (num < low) return 'low';
  if (num > high) return 'high';
  return 'normal';
};

const buildHealthMetrics = (record) => {
  const height = getHeight();
  const weight = parseFloat(record.weight) || 0;
  const bmi = calculateBMI(weight, height);

  return {
    height,
    bmi,
    bodyFatRate: record.bodyFatRate || null,
    subcutaneousFat: record.subcutaneousFat || null,
    visceralFat: record.visceralFat || null,
    obesity: record.obesity || null,
    muscleRate: record.muscleRate || null,
    boneMass: record.boneMass || null,
    waterRate: record.waterRate || null,
    bmr: record.bmr || null,
    bodyFatLevel: getLevel(record.bodyFatRate, BODY_FAT_RANGES.low, BODY_FAT_RANGES.high),
    muscleLevel: getLevel(record.muscleRate, MUSCLE_RANGES.low, MUSCLE_RANGES.high),
    bmiLevel: (() => {
      if (bmi === null) return 'normal';
      if (bmi < BMI_RANGES.underweight) return 'low';
      if (bmi > BMI_RANGES.overweight) return 'high';
      if (bmi > BMI_RANGES.normal) return 'high';
      return 'normal';
    })()
  };
};

const getWeightRecords = () => {
  const records = getStorage(STORAGE_KEYS.WEIGHT, []);
  return records.sort((a, b) => b.date.localeCompare(a.date));
};

const addWeightRecord = (record) => {
  const records = getStorage(STORAGE_KEYS.WEIGHT, []);
  const newRecord = {
    id: Date.now(),
    date: record.date,
    weight: parseFloat(record.weight).toFixed(1),
    note: record.note || '',
    bodyFatRate: record.bodyFatRate ? parseFloat(record.bodyFatRate).toFixed(1) : null,
    subcutaneousFat: record.subcutaneousFat ? parseFloat(record.subcutaneousFat).toFixed(1) : null,
    visceralFat: record.visceralFat ? parseInt(record.visceralFat) : null,
    obesity: record.obesity ? parseFloat(record.obesity).toFixed(1) : null,
    muscleRate: record.muscleRate ? parseFloat(record.muscleRate).toFixed(1) : null,
    boneMass: record.boneMass ? parseFloat(record.boneMass).toFixed(1) : null,
    waterRate: record.waterRate ? parseFloat(record.waterRate).toFixed(1) : null,
    bmr: record.bmr ? parseInt(record.bmr) : null,
    createTime: new Date().toISOString()
  };
  
  const existIndex = records.findIndex(r => r.date === record.date);
  if (existIndex > -1) {
    const existing = records[existIndex];
    records[existIndex] = {
      ...existing,
      ...newRecord,
      bodyFatRate: newRecord.bodyFatRate || existing.bodyFatRate || null,
      subcutaneousFat: newRecord.subcutaneousFat || existing.subcutaneousFat || null,
      visceralFat: newRecord.visceralFat || existing.visceralFat || null,
      obesity: newRecord.obesity || existing.obesity || null,
      muscleRate: newRecord.muscleRate || existing.muscleRate || null,
      boneMass: newRecord.boneMass || existing.boneMass || null,
      waterRate: newRecord.waterRate || existing.waterRate || null,
      bmr: newRecord.bmr || existing.bmr || null
    };
  } else {
    records.push(newRecord);
  }
  
  return setStorage(STORAGE_KEYS.WEIGHT, records) ? newRecord : null;
};

const deleteWeightRecord = (id) => {
  const records = getStorage(STORAGE_KEYS.WEIGHT, []);
  const filtered = records.filter(r => r.id !== id);
  return setStorage(STORAGE_KEYS.WEIGHT, filtered);
};

// ========== 运动记录 ==========

const getExerciseRecords = () => {
  return getStorage(STORAGE_KEYS.EXERCISES, [])
    .sort((a, b) => b.date.localeCompare(a.date));
};

const addExerciseRecord = (record) => {
  const records = getStorage(STORAGE_KEYS.EXERCISES, []);
  const newRecord = {
    id: Date.now(),
    date: record.date,
    type: record.type || 'custom',
    duration: record.duration ? parseFloat(record.duration) : null,
    distance: record.distance ? parseFloat(record.distance) : null,
    calories: record.calories ? parseInt(record.calories) : null,
    note: record.note || '',
    createTime: new Date().toISOString()
  };
  records.push(newRecord);
  return setStorage(STORAGE_KEYS.EXERCISES, records) ? newRecord : null;
};

const deleteExerciseRecord = (id) => {
  const records = getStorage(STORAGE_KEYS.EXERCISES, []);
  const filtered = records.filter(r => r.id !== id);
  return setStorage(STORAGE_KEYS.EXERCISES, filtered);
};

const getWeeklyGoal = () => {
  const stored = getStorage(STORAGE_KEYS.EXERCISE_GOAL, 3);
  const parsed = parseInt(stored, 10);
  if (isNaN(parsed) || parsed < 1 || parsed > 7) return 3;
  return parsed;
};

const setWeeklyGoal = (days) => {
  const d = parseInt(days) || 3;
  if (d < 1 || d > 7) return false;
  return setStorage(STORAGE_KEYS.EXERCISE_GOAL, d);
};

const getExerciseCalendar = (year, month) => {
  const records = getStorage(STORAGE_KEYS.EXERCISES, []);
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  const dayMap = {};
  records.forEach(r => {
    if (r.date && r.date.startsWith(monthStr)) {
      const day = parseInt(r.date.split('-')[2]);
      dayMap[day] = true;
    }
  });
  return { year, month, activeDays: dayMap };
};

const getWeekProgress = () => {
  const records = getStorage(STORAGE_KEYS.EXERCISES, []);
  const now = new Date();
  const today = now.getDay();
  const mondayOffset = today === 0 ? -6 : 1 - today;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  let exercisedDays = 0;
  for (let i = 0; i <= (today === 0 ? 6 : today - 1); i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const hasExercise = records.some(r => r.date === dateKey);
    if (hasExercise) exercisedDays++;
  }

  const goal = getWeeklyGoal();
  return {
    goal,
    completed: exercisedDays,
    remaining: Math.max(0, goal - exercisedDays),
    percent: Math.min(100, Math.round((exercisedDays / goal) * 100))
  };
};

// ========== 财务记账（原资产管理） ==========

const getBillAccounts = () => {
  const accounts = getStorage(STORAGE_KEYS.BILL_ACCOUNTS, []);
  return accounts.sort((a, b) => b.createTime.localeCompare(a.createTime));
};

const getBillAccountById = (id) => {
  const accounts = getStorage(STORAGE_KEYS.BILL_ACCOUNTS, []);
  return accounts.find(a => a.id === id) || null;
};

const addBillAccount = (account) => {
  const accounts = getStorage(STORAGE_KEYS.BILL_ACCOUNTS, []);
  const now = new Date().toISOString();
  const amount = parseFloat(account.amount) || 0;
  const newAccount = {
    id: Date.now(),
    category: account.category || 'custom',
    name: account.name || '',
    amount,
    note: account.note || '',
    createTime: now,
    updateTime: now
  };
  accounts.push(newAccount);
  const ok = setStorage(STORAGE_KEYS.BILL_ACCOUNTS, accounts);
  if (ok) recordBillSnapshot();
  return ok ? newAccount : null;
};

// 账户字段中文名映射，用于变更记录展示
const ACCOUNT_FIELD_LABELS = {
  name: '账户名称',
  category: '账户分类',
  amount: '金额',
  note: '备注'
};

// 金额格式化（用于变更记录）
const formatMoneyInline = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return '0.00';
  return num.toFixed(2);
};

const updateBillAccount = (id, updates) => {
  const accounts = getStorage(STORAGE_KEYS.BILL_ACCOUNTS, []);
  const index = accounts.findIndex(a => a.id === id);
  if (index === -1) return null;
  const oldAccount = { ...accounts[index] };
  const oldAmount = parseFloat(oldAccount.amount) || 0;
  const newAmount = typeof updates.amount !== 'undefined' ? (parseFloat(updates.amount) || 0) : oldAmount;

  // 计算字段变化
  const changes = [];
  const trackedFields = ['name', 'category', 'note', 'amount'];
  trackedFields.forEach(field => {
    if (typeof updates[field] !== 'undefined' && String(oldAccount[field] || '') !== String(updates[field])) {
      let oldVal = oldAccount[field];
      let newVal = updates[field];
      let extra = {};
      if (field === 'amount') {
        const oldNum = parseFloat(oldVal) || 0;
        const newNum = parseFloat(newVal) || 0;
        const diff = parseFloat((newNum - oldNum).toFixed(2));
        oldVal = formatMoneyInline(oldVal);
        newVal = formatMoneyInline(newVal);
        if (diff !== 0) {
          extra.changeAmount = Math.abs(diff).toFixed(2);
          extra.changeType = diff > 0 ? 'increase' : 'decrease';
          extra.changeAmountStr = (diff > 0 ? '+' : '-') + Math.abs(diff).toFixed(2);
        }
      } else if (field === 'category') {
        const oldType = BILL_ACCOUNT_TYPES.find(t => t.key === oldVal);
        const newType = BILL_ACCOUNT_TYPES.find(t => t.key === newVal);
        oldVal = oldType ? oldType.name : oldVal;
        newVal = newType ? newType.name : newVal;
      }
      changes.push({
        field,
        label: ACCOUNT_FIELD_LABELS[field] || field,
        oldValue: String(oldVal || ''),
        newValue: String(newVal || ''),
        ...extra
      });
    }
  });

  accounts[index] = {
    ...accounts[index],
    ...updates,
    amount: newAmount,
    updateTime: new Date().toISOString()
  };

  const ok = setStorage(STORAGE_KEYS.BILL_ACCOUNTS, accounts);

  // 有变化才记录日志
  if (ok && changes.length > 0) {
    const logs = getStorage(STORAGE_KEYS.BILL_ACCOUNT_LOGS, []);
    logs.push({
      id: Date.now(),
      accountId: id,
      accountName: accounts[index].name,
      date: new Date().toISOString(),
      changes
    });
    setStorage(STORAGE_KEYS.BILL_ACCOUNT_LOGS, logs);
  }

  if (ok) recordBillSnapshot();
  return ok ? accounts[index] : null;
};

const deleteBillAccount = (id) => {
  const accounts = getStorage(STORAGE_KEYS.BILL_ACCOUNTS, []);
  const filtered = accounts.filter(a => a.id !== id);
  const ok = setStorage(STORAGE_KEYS.BILL_ACCOUNTS, filtered);
  if (ok) recordBillSnapshot();
  return ok;
};

const adjustBillAccount = (id, changeAmount, note = '手动调整') => {
  const accounts = getStorage(STORAGE_KEYS.BILL_ACCOUNTS, []);
  const index = accounts.findIndex(a => a.id === id);
  if (index === -1) return null;
  const account = accounts[index];
  const oldAmount = parseFloat(account.amount) || 0;
  const newAmount = parseFloat((oldAmount + changeAmount).toFixed(2));
  account.amount = newAmount;
  account.updateTime = new Date().toISOString();
  const ok = setStorage(STORAGE_KEYS.BILL_ACCOUNTS, accounts);
  if (ok) recordBillSnapshot();
  return ok ? { oldAmount, newAmount, changeAmount } : null;
};

// 获取账户修改历史
const getBillAccountLogs = (accountId) => {
  const logs = getStorage(STORAGE_KEYS.BILL_ACCOUNT_LOGS, []);
  let result = logs.filter(l => l.accountId === accountId);
  result.sort((a, b) => b.date.localeCompare(a.date));
  return result;
};

const getBillSummary = () => {
  const accounts = getStorage(STORAGE_KEYS.BILL_ACCOUNTS, []);
  let totalAssets = 0;
  let totalLiabilities = 0;
  let totalClaims = 0;

  accounts.forEach(account => {
    const amount = parseFloat(account.amount) || 0;
    const typeObj = BILL_ACCOUNT_TYPES.find(c => c.key === account.category);
    if (!typeObj) return;

    if (typeObj.type === 'liability') {
      totalLiabilities += amount;
    } else if (typeObj.type === 'claim') {
      totalClaims += amount;
    } else {
      totalAssets += amount;
    }
  });

  return {
    totalAssets: parseFloat(totalAssets.toFixed(2)),
    totalLiabilities: parseFloat(totalLiabilities.toFixed(2)),
    totalClaims: parseFloat(totalClaims.toFixed(2)),
    netWorth: parseFloat((totalAssets + totalClaims - totalLiabilities).toFixed(2))
  };
};

const getBillAccountsByType = () => {
  const accounts = getBillAccounts();
  const result = {};
  BILL_ACCOUNT_TYPES.forEach(type => {
    result[type.key] = {
      ...type,
      accounts: accounts.filter(a => a.category === type.key),
      total: 0
    };
    result[type.key].total = parseFloat(result[type.key].accounts.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0).toFixed(2));
  });
  return result;
};

// 记账流水
const getBillTransactions = (filters = {}) => {
  const records = getStorage(STORAGE_KEYS.BILL_TRANSACTIONS, []);
  let result = records.sort((a, b) => b.date.localeCompare(a.date) || b.createTime.localeCompare(a.createTime));
  if (filters.type) result = result.filter(r => r.type === filters.type);
  if (filters.startDate) result = result.filter(r => r.date >= filters.startDate);
  if (filters.endDate) result = result.filter(r => r.date <= filters.endDate);
  if (filters.accountId) result = result.filter(r => r.accountId === filters.accountId);
  return result;
};

const addBillTransaction = (tx) => {
  const accounts = getStorage(STORAGE_KEYS.BILL_ACCOUNTS, []);
  const accountIndex = accounts.findIndex(a => a.id === tx.accountId);
  if (accountIndex === -1) return null;

  const account = accounts[accountIndex];
  const amount = parseFloat(tx.amount) || 0;
  const oldAmount = parseFloat(account.amount) || 0;
  const type = tx.type; // 'expense' | 'income' | 'transfer'
  let changeAmount = 0;
  let newAmount = oldAmount;

  if (type === 'expense') {
    changeAmount = -amount;
    newAmount = oldAmount - amount;
  } else if (type === 'income') {
    changeAmount = amount;
    newAmount = oldAmount + amount;
  }
  // transfer 不影响账户总额，由外部处理

  account.amount = parseFloat(newAmount.toFixed(2));
  account.updateTime = new Date().toISOString();

  const newTx = {
    id: Date.now(),
    type,
    date: tx.date || new Date().toISOString().split('T')[0],
    category: tx.category || 'other',
    amount,
    accountId: tx.accountId,
    accountName: account.name,
    accountCategory: account.category,
    note: tx.note || '',
    changeAmount: parseFloat(changeAmount.toFixed(2)),
    balanceAfter: account.amount,
    createTime: new Date().toISOString()
  };

  const records = getStorage(STORAGE_KEYS.BILL_TRANSACTIONS, []);
  records.push(newTx);

  const ok1 = setStorage(STORAGE_KEYS.BILL_TRANSACTIONS, records);
  const ok2 = setStorage(STORAGE_KEYS.BILL_ACCOUNTS, accounts);
  if (ok1 && ok2) recordBillSnapshot();
  return (ok1 && ok2) ? newTx : null;
};

const deleteBillTransaction = (id) => {
  const records = getStorage(STORAGE_KEYS.BILL_TRANSACTIONS, []);
  const index = records.findIndex(r => r.id === id);
  if (index === -1) return false;
  const tx = records[index];
  
  // 回滚账户余额
  const accounts = getStorage(STORAGE_KEYS.BILL_ACCOUNTS, []);
  const accountIndex = accounts.findIndex(a => a.id === tx.accountId);
  if (accountIndex > -1) {
    const account = accounts[accountIndex];
    account.amount = parseFloat((account.amount - tx.changeAmount).toFixed(2));
    account.updateTime = new Date().toISOString();
    setStorage(STORAGE_KEYS.BILL_ACCOUNTS, accounts);
  }
  
  records.splice(index, 1);
  const ok = setStorage(STORAGE_KEYS.BILL_TRANSACTIONS, records);
  if (ok) recordBillSnapshot();
  return ok;
};

const getBillStats = (range = 'month') => {
  const now = new Date();
  let startDate = '';
  const today = now.toISOString().split('T')[0];
  
  if (range === 'week') {
    const day = now.getDay() || 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - day + 1);
    startDate = monday.toISOString().split('T')[0];
  } else if (range === 'month') {
    startDate = `${today.slice(0, 7)}-01`;
  } else if (range === 'year') {
    startDate = `${today.slice(0, 4)}-01-01`;
  } else {
    startDate = '1970-01-01';
  }

  const transactions = getBillTransactions({ startDate, endDate: today });
  let income = 0;
  let expense = 0;
  const categoryMap = {};

  transactions.forEach(tx => {
    if (tx.type === 'income') income += tx.amount;
    if (tx.type === 'expense') expense += tx.amount;
    const key = `${tx.type}_${tx.category}`;
    if (!categoryMap[key]) categoryMap[key] = { type: tx.type, category: tx.category, amount: 0 };
    categoryMap[key].amount += tx.amount;
  });

  return {
    income: parseFloat(income.toFixed(2)),
    expense: parseFloat(expense.toFixed(2)),
    balance: parseFloat((income - expense).toFixed(2)),
    categories: Object.values(categoryMap).sort((a, b) => b.amount - a.amount)
  };
};

// 财务月度快照
const recordBillSnapshot = () => {
  const summary = getBillSummary();
  const snapshots = getStorage(STORAGE_KEYS.BILL_SNAPSHOTS, []);
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const existingIndex = snapshots.findIndex(s => s.month === monthKey);
  const snapshot = {
    month: monthKey,
    year: now.getFullYear(),
    assets: summary.totalAssets + summary.totalClaims,
    liabilities: summary.totalLiabilities,
    netWorth: summary.netWorth,
    updateTime: now.toISOString()
  };

  if (existingIndex > -1) {
    snapshots[existingIndex] = snapshot;
  } else {
    snapshots.push(snapshot);
  }

  setStorage(STORAGE_KEYS.BILL_SNAPSHOTS, snapshots);
  return snapshot;
};

const getBillSnapshots = () => {
  return getStorage(STORAGE_KEYS.BILL_SNAPSHOTS, [])
    .sort((a, b) => a.month.localeCompare(b.month));
};

// 兼容旧接口名（保持旧调用可用）
const getAssetAccounts = getBillAccounts;
const getAccountById = getBillAccountById;
const addAssetAccount = addBillAccount;
const updateAssetAccount = updateBillAccount;
const deleteAssetAccount = deleteBillAccount;
const getAssetSummary = getBillSummary;
const getAccountsByCategory = getBillAccountsByType;
const getAssetSnapshots = getBillSnapshots;
const getAssetSnapshotsByYear = (year) => getBillSnapshots().filter(s => s.year === year);
const addTransaction = adjustBillAccount;

// ========== 实物资产管理 ==========

const getPhysicalAssets = () => {
  return getStorage(STORAGE_KEYS.PHYSICAL_ASSETS, [])
    .sort((a, b) => b.createTime.localeCompare(a.createTime));
};

const getPhysicalAssetById = (id) => {
  const assets = getStorage(STORAGE_KEYS.PHYSICAL_ASSETS, []);
  return assets.find(a => a.id === id) || null;
};

const addPhysicalAsset = (asset) => {
  const assets = getStorage(STORAGE_KEYS.PHYSICAL_ASSETS, []);
  const now = new Date();
  const purchaseDate = asset.purchaseDate || now.toISOString().split('T')[0];
  const price = parseFloat(asset.price) || 0;
  const days = Math.max(1, Math.floor((now - new Date(purchaseDate)) / (1000 * 60 * 60 * 24)));
  const dailyCost = parseFloat((price / days).toFixed(2));

  const newAsset = {
    id: Date.now(),
    name: asset.name || '',
    category: asset.category || 'other',
    status: asset.status || 'active',
    purchaseDate,
    price,
    currentValue: parseFloat(asset.currentValue) || price,
    dailyCost,
    days,
    icon: asset.icon || '',
    image: asset.image || '',
    note: asset.note || '',
    createTime: now.toISOString(),
    updateTime: now.toISOString()
  };

  assets.push(newAsset);
  const ok = setStorage(STORAGE_KEYS.PHYSICAL_ASSETS, assets);
  if (ok) recordPhysicalSnapshot();
  return ok ? newAsset : null;
};

const updatePhysicalAsset = (id, updates) => {
  const assets = getStorage(STORAGE_KEYS.PHYSICAL_ASSETS, []);
  const index = assets.findIndex(a => a.id === id);
  if (index === -1) return null;
  const now = new Date();
  const asset = assets[index];

  const purchaseDate = updates.purchaseDate || asset.purchaseDate;
  const price = typeof updates.price !== 'undefined' ? (parseFloat(updates.price) || 0) : asset.price;
  const days = Math.max(1, Math.floor((now - new Date(purchaseDate)) / (1000 * 60 * 60 * 24)));
  const dailyCost = parseFloat((price / days).toFixed(2));

  assets[index] = {
    ...asset,
    ...updates,
    purchaseDate,
    price,
    currentValue: typeof updates.currentValue !== 'undefined' ? (parseFloat(updates.currentValue) || price) : asset.currentValue,
    days,
    dailyCost,
    updateTime: now.toISOString()
  };

  const ok = setStorage(STORAGE_KEYS.PHYSICAL_ASSETS, assets);
  if (ok) recordPhysicalSnapshot();
  return ok ? assets[index] : null;
};

const deletePhysicalAsset = (id) => {
  const assets = getStorage(STORAGE_KEYS.PHYSICAL_ASSETS, []);
  const filtered = assets.filter(a => a.id !== id);
  const ok = setStorage(STORAGE_KEYS.PHYSICAL_ASSETS, filtered);
  if (ok) recordPhysicalSnapshot();
  return ok;
};

const getPhysicalAssetSummary = () => {
  const assets = getPhysicalAssets();
  const total = parseFloat(assets.reduce((sum, a) => sum + (parseFloat(a.price) || 0), 0).toFixed(2));
  const totalCurrent = parseFloat(assets.reduce((sum, a) => sum + (parseFloat(a.currentValue) || parseFloat(a.price) || 0), 0).toFixed(2));
  const activeCount = assets.filter(a => a.status === 'active').length;
  const retiredCount = assets.filter(a => a.status === 'retired').length;
  const soldCount = assets.filter(a => a.status === 'sold').length;
  const totalDailyCost = parseFloat(assets.filter(a => a.status === 'active').reduce((sum, a) => sum + (parseFloat(a.dailyCost) || 0), 0).toFixed(2));

  return {
    total,
    totalCurrent,
    activeCount,
    retiredCount,
    soldCount,
    totalCount: assets.length,
    totalDailyCost
  };
};

const getPhysicalAssetsByStatus = (status) => {
  return getPhysicalAssets().filter(a => a.status === status);
};

const getPhysicalAssetsByCategory = () => {
  const assets = getPhysicalAssets();
  const result = {};
  ASSET_CATEGORIES.forEach(cat => {
    result[cat.key] = {
      ...cat,
      assets: assets.filter(a => a.category === cat.key),
      total: 0
    };
    result[cat.key].total = parseFloat(result[cat.key].assets.reduce((sum, a) => sum + (parseFloat(a.price) || 0), 0).toFixed(2));
  });
  return result;
};

const recordPhysicalSnapshot = () => {
  const summary = getPhysicalAssetSummary();
  const snapshots = getStorage(STORAGE_KEYS.PHYSICAL_SNAPSHOTS, []);
  const now = new Date();
  const dateKey = now.toISOString().split('T')[0];
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const existingIndex = snapshots.findIndex(s => s.date === dateKey);
  const snapshot = {
    date: dateKey,
    month: monthKey,
    year: now.getFullYear(),
    total: summary.total,
    totalCurrent: summary.totalCurrent,
    activeCount: summary.activeCount,
    retiredCount: summary.retiredCount,
    soldCount: summary.soldCount,
    totalDailyCost: summary.totalDailyCost,
    updateTime: now.toISOString()
  };

  if (existingIndex > -1) {
    snapshots[existingIndex] = snapshot;
  } else {
    snapshots.push(snapshot);
  }

  setStorage(STORAGE_KEYS.PHYSICAL_SNAPSHOTS, snapshots);
  return snapshot;
};

const getPhysicalSnapshots = (range = 'all') => {
  const snapshots = getStorage(STORAGE_KEYS.PHYSICAL_SNAPSHOTS, [])
    .sort((a, b) => a.date.localeCompare(b.date));
  if (range === 'all') return snapshots;
  
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  let startDate = '';
  
  if (range === 'month') {
    startDate = `${today.slice(0, 7)}-01`;
  } else if (range === '7d') {
    const d = new Date(now);
    d.setDate(now.getDate() - 6);
    startDate = d.toISOString().split('T')[0];
  } else if (range === '30d') {
    const d = new Date(now);
    d.setDate(now.getDate() - 29);
    startDate = d.toISOString().split('T')[0];
  } else if (range === '90d') {
    const d = new Date(now);
    d.setDate(now.getDate() - 89);
    startDate = d.toISOString().split('T')[0];
  } else if (range === 'year') {
    startDate = `${today.slice(0, 4)}-01-01`;
  }
  
  return snapshots.filter(s => s.date >= startDate);
};

// ========== 心愿单 ==========

const getWishlist = () => {
  return getStorage(STORAGE_KEYS.WISHLIST, [])
    .sort((a, b) => b.createTime.localeCompare(a.createTime));
};

const addWishlistItem = (item) => {
  const items = getStorage(STORAGE_KEYS.WISHLIST, []);
  const newItem = {
    id: Date.now(),
    name: item.name || '',
    targetPrice: parseFloat(item.targetPrice) || 0,
    savedAmount: parseFloat(item.savedAmount) || 0,
    priority: item.priority || 'normal', // low, normal, high
    icon: item.icon || '',
    note: item.note || '',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  };
  items.push(newItem);
  return setStorage(STORAGE_KEYS.WISHLIST, items) ? newItem : null;
};

const updateWishlistItem = (id, updates) => {
  const items = getStorage(STORAGE_KEYS.WISHLIST, []);
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return null;
  items[index] = {
    ...items[index],
    ...updates,
    targetPrice: typeof updates.targetPrice !== 'undefined' ? (parseFloat(updates.targetPrice) || 0) : items[index].targetPrice,
    savedAmount: typeof updates.savedAmount !== 'undefined' ? (parseFloat(updates.savedAmount) || 0) : items[index].savedAmount,
    updateTime: new Date().toISOString()
  };
  return setStorage(STORAGE_KEYS.WISHLIST, items) ? items[index] : null;
};

const deleteWishlistItem = (id) => {
  const items = getStorage(STORAGE_KEYS.WISHLIST, []);
  const filtered = items.filter(i => i.id !== id);
  return setStorage(STORAGE_KEYS.WISHLIST, filtered);
};

const getWishlistSummary = () => {
  const items = getWishlist();
  const total = parseFloat(items.reduce((sum, i) => sum + (parseFloat(i.targetPrice) || 0), 0).toFixed(2));
  const saved = parseFloat(items.reduce((sum, i) => sum + (parseFloat(i.savedAmount) || 0), 0).toFixed(2));
  return { total, saved, count: items.length, remaining: parseFloat((total - saved).toFixed(2)) };
};

// ========== 汽车记账 ==========

// 标准化日期为 YYYY-MM-DD
const normalizeCarDate = (date) => {
  if (!date) return new Date().toISOString().split('T')[0];
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) return date.slice(0, 10);
  return new Date(date).toISOString().split('T')[0];
};

const getCarExpenses = (filters = {}) => {
  const records = getStorage(STORAGE_KEYS.CAR_EXPENSES, []);
  let result = records.slice();
  if (filters.type) result = result.filter(r => r.type === filters.type);
  if (filters.group) result = result.filter(r => r.group === filters.group);
  if (filters.startDate) result = result.filter(r => r.date >= filters.startDate);
  if (filters.endDate) result = result.filter(r => r.date <= filters.endDate);
  // 倒序：日期新的在前
  result.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createTime || '').localeCompare(a.createTime || ''));
  return result;
};

const getCarExpenseById = (id) => {
  const records = getStorage(STORAGE_KEYS.CAR_EXPENSES, []);
  return records.find(r => r.id === id) || null;
};

const addCarExpense = (item) => {
  const records = getStorage(STORAGE_KEYS.CAR_EXPENSES, []);
  const typeMeta = CAR_EXPENSE_TYPES.find(t => t.key === (item.type || 'other')) || CAR_EXPENSE_TYPES[CAR_EXPENSE_TYPES.length - 1];
  const newItem = {
    id: Date.now(),
    type: typeMeta.key,
    typeName: typeMeta.name,
    group: typeMeta.group,
    icon: typeMeta.icon,
    amount: parseFloat(item.amount) || 0,
    date: normalizeCarDate(item.date),
    note: item.note || '',
    // 能耗类可选明细
    fuelLiters: parseFloat(item.fuelLiters) || 0,
    fuelPrice: parseFloat(item.fuelPrice) || 0,
    // 兼容新能源汽车：充电度数 / 充电单价
    evKwh: parseFloat(item.evKwh) || 0,
    evPrice: parseFloat(item.evPrice) || 0,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  };
  records.push(newItem);
  const ok = setStorage(STORAGE_KEYS.CAR_EXPENSES, records);
  if (ok) recordCarSnapshot();
  return ok ? newItem : null;
};

const updateCarExpense = (id, updates) => {
  const records = getStorage(STORAGE_KEYS.CAR_EXPENSES, []);
  const index = records.findIndex(r => r.id === id);
  if (index === -1) return null;
  const old = { ...records[index] };

  // 若 type 改了，重新设置 group/icon/typeName
  let typeMeta = null;
  if (typeof updates.type !== 'undefined' && updates.type !== old.type) {
    typeMeta = CAR_EXPENSE_TYPES.find(t => t.key === updates.type) || CAR_EXPENSE_TYPES[CAR_EXPENSE_TYPES.length - 1];
  }

  records[index] = {
    ...old,
    ...updates,
    amount: typeof updates.amount !== 'undefined' ? (parseFloat(updates.amount) || 0) : old.amount,
    date: typeof updates.date !== 'undefined' ? normalizeCarDate(updates.date) : old.date,
    fuelLiters: typeof updates.fuelLiters !== 'undefined' ? (parseFloat(updates.fuelLiters) || 0) : (old.fuelLiters || 0),
    fuelPrice: typeof updates.fuelPrice !== 'undefined' ? (parseFloat(updates.fuelPrice) || 0) : (old.fuelPrice || 0),
    evKwh: typeof updates.evKwh !== 'undefined' ? (parseFloat(updates.evKwh) || 0) : (old.evKwh || 0),
    evPrice: typeof updates.evPrice !== 'undefined' ? (parseFloat(updates.evPrice) || 0) : (old.evPrice || 0),
    type: typeMeta ? typeMeta.key : old.type,
    typeName: typeMeta ? typeMeta.name : old.typeName,
    group: typeMeta ? typeMeta.group : old.group,
    icon: typeMeta ? typeMeta.icon : old.icon,
    updateTime: new Date().toISOString()
  };

  const ok = setStorage(STORAGE_KEYS.CAR_EXPENSES, records);
  if (ok) recordCarSnapshot();
  return ok ? records[index] : null;
};

const deleteCarExpense = (id) => {
  const records = getStorage(STORAGE_KEYS.CAR_EXPENSES, []);
  const filtered = records.filter(r => r.id !== id);
  const ok = setStorage(STORAGE_KEYS.CAR_EXPENSES, filtered);
  if (ok) recordCarSnapshot();
  return ok;
};

// 按周期获取汇总
const getCarSummaryByCycle = (cycle = 'all') => {
  const records = getCarExpenses();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const currentYear = todayStr.slice(0, 4);
  const currentMonth = todayStr.slice(0, 7);

  let filtered = records;
  if (cycle === 'month') {
    filtered = records.filter(r => (r.date || '').startsWith(currentMonth));
  } else if (cycle === 'last-month') {
    const last = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonth = `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, '0')}`;
    filtered = records.filter(r => (r.date || '').startsWith(lastMonth));
  } else if (cycle === 'year') {
    filtered = records.filter(r => (r.date || '').startsWith(currentYear));
  }

  const total = parseFloat(filtered.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0).toFixed(2));
  return { total, count: filtered.length, items: filtered };
};

// 按类型汇总（用于账目查询）
const getCarExpensesByType = () => {
  const records = getCarExpenses();
  const result = {};
  CAR_EXPENSE_TYPES.forEach(t => {
    result[t.key] = {
      ...t,
      count: 0,
      total: 0,
      items: []
    };
  });
  records.forEach(r => {
    const key = CAR_EXPENSE_TYPES.find(t => t.key === r.type) ? r.type : 'other';
    if (!result[key]) {
      result[key] = {
        key,
        name: r.typeName || '其他',
        icon: r.icon || '📦',
        color: '#6B7280',
        group: r.group || 'other',
        count: 0,
        total: 0,
        items: []
      };
    }
    result[key].count += 1;
    result[key].total = parseFloat((result[key].total + (parseFloat(r.amount) || 0)).toFixed(2));
    result[key].items.push(r);
  });
  return result;
};

// 按月份分组
const getCarExpensesGroupedByMonth = (cycle = 'all') => {
  const { items } = getCarSummaryByCycle(cycle);
  const groups = {};
  items.forEach(r => {
    const month = (r.date || '').slice(0, 7);
    if (!groups[month]) groups[month] = { month, total: 0, count: 0, items: [] };
    groups[month].total = parseFloat((groups[month].total + (parseFloat(r.amount) || 0)).toFixed(2));
    groups[month].count += 1;
    groups[month].items.push(r);
  });
  return Object.values(groups).sort((a, b) => b.month.localeCompare(a.month));
};

// 按日期分组（用于主页账目列表）
const getCarExpensesGroupedByDate = (cycle = 'all') => {
  const { items } = getCarSummaryByCycle(cycle);
  const groups = {};
  items.forEach(r => {
    const date = r.date || '';
    if (!groups[date]) groups[date] = { date, total: 0, count: 0, items: [] };
    groups[date].total = parseFloat((groups[date].total + (parseFloat(r.amount) || 0)).toFixed(2));
    groups[date].count += 1;
    groups[date].items.push(r);
  });
  return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
};

// 月度快照
const recordCarSnapshot = () => {
  const records = getCarExpenses();
  const today = new Date();
  const month = today.toISOString().slice(0, 7);
  const monthItems = records.filter(r => (r.date || '').startsWith(month));
  const total = parseFloat(monthItems.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0).toFixed(2));
  const snapshots = getStorage(STORAGE_KEYS.CAR_SNAPSHOTS, []);
  const existing = snapshots.findIndex(s => s.month === month);
  const snap = { month, total, count: monthItems.length, date: today.toISOString() };
  if (existing > -1) snapshots[existing] = snap; else snapshots.push(snap);
  setStorage(STORAGE_KEYS.CAR_SNAPSHOTS, snapshots);
};

const getCarSnapshots = () => {
  return getStorage(STORAGE_KEYS.CAR_SNAPSHOTS, []);
};

// ========== 重要日子 ==========

const getImportantDays = () => {
  return getStorage(STORAGE_KEYS.IMPORTANT_DAYS, []);
};

const getImportantDayById = (id) => {
  const items = getImportantDays();
  return items.find(i => i.id === id) || null;
};

const addImportantDay = (payload) => {
  const items = getImportantDays();
  const newItem = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...payload
  };
  items.push(newItem);
  setStorage(STORAGE_KEYS.IMPORTANT_DAYS, items);
  return newItem;
};

const updateImportantDay = (id, patch) => {
  const items = getImportantDays();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch, updatedAt: new Date().toISOString() };
  setStorage(STORAGE_KEYS.IMPORTANT_DAYS, items);
  return items[idx];
};

const deleteImportantDay = (id) => {
  const items = getImportantDays();
  const filtered = items.filter(i => i.id !== id);
  setStorage(STORAGE_KEYS.IMPORTANT_DAYS, filtered);
  return true;
};

// ========== 家庭记账 ==========

// ---- 家庭收入 ----

const getFamilyIncomes = (filters = {}) => {
  const records = getStorage(STORAGE_KEYS.FAMILY_INCOMES, []);
  let result = records.slice();
  if (filters.type) result = result.filter(r => r.type === filters.type);
  if (filters.source) result = result.filter(r => r.source === filters.source);
  if (filters.startDate) result = result.filter(r => r.date >= filters.startDate);
  if (filters.endDate) result = result.filter(r => r.date <= filters.endDate);
  result.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createTime || '').localeCompare(a.createTime || ''));
  return result;
};

const addFamilyIncome = (item) => {
  const records = getStorage(STORAGE_KEYS.FAMILY_INCOMES, []);
  const typeMeta = FAMILY_INCOME_TYPES.find(t => t.key === (item.type || 'other')) || FAMILY_INCOME_TYPES[FAMILY_INCOME_TYPES.length - 1];
  const sourceMeta = FAMILY_INCOME_SOURCES.find(s => s.key === (item.source || 'family')) || FAMILY_INCOME_SOURCES[2];
  const newItem = {
    id: Date.now(),
    type: typeMeta.key,
    typeName: typeMeta.name,
    icon: typeMeta.icon,
    color: typeMeta.color,
    source: sourceMeta.key,
    sourceName: sourceMeta.name,
    amount: parseFloat(item.amount) || 0,
    date: item.date || new Date().toISOString().split('T')[0],
    note: item.note || '',
    recurring: !!item.recurring,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  };
  records.push(newItem);
  const ok = setStorage(STORAGE_KEYS.FAMILY_INCOMES, records);
  if (ok) recordFamilySnapshot();
  return ok ? newItem : null;
};

const updateFamilyIncome = (id, updates) => {
  const records = getStorage(STORAGE_KEYS.FAMILY_INCOMES, []);
  const index = records.findIndex(r => r.id === id);
  if (index === -1) return null;
  const old = { ...records[index] };
  let typeMeta = null;
  if (typeof updates.type !== 'undefined' && updates.type !== old.type) {
    typeMeta = FAMILY_INCOME_TYPES.find(t => t.key === updates.type) || FAMILY_INCOME_TYPES[FAMILY_INCOME_TYPES.length - 1];
  }
  let sourceMeta = null;
  if (typeof updates.source !== 'undefined' && updates.source !== old.source) {
    sourceMeta = FAMILY_INCOME_SOURCES.find(s => s.key === updates.source) || FAMILY_INCOME_SOURCES[2];
  }
  records[index] = {
    ...old,
    ...updates,
    amount: typeof updates.amount !== 'undefined' ? (parseFloat(updates.amount) || 0) : old.amount,
    date: typeof updates.date !== 'undefined' ? updates.date : old.date,
    type: typeMeta ? typeMeta.key : old.type,
    typeName: typeMeta ? typeMeta.name : old.typeName,
    icon: typeMeta ? typeMeta.icon : old.icon,
    color: typeMeta ? typeMeta.color : old.color,
    source: sourceMeta ? sourceMeta.key : old.source,
    sourceName: sourceMeta ? sourceMeta.name : old.sourceName,
    updateTime: new Date().toISOString()
  };
  const ok = setStorage(STORAGE_KEYS.FAMILY_INCOMES, records);
  if (ok) recordFamilySnapshot();
  return ok ? records[index] : null;
};

const deleteFamilyIncome = (id) => {
  const records = getStorage(STORAGE_KEYS.FAMILY_INCOMES, []);
  const filtered = records.filter(r => r.id !== id);
  const ok = setStorage(STORAGE_KEYS.FAMILY_INCOMES, filtered);
  if (ok) recordFamilySnapshot();
  return ok;
};

// ---- 家庭开支 ----

const getFamilyExpenses = (filters = {}) => {
  const records = getStorage(STORAGE_KEYS.FAMILY_EXPENSES, []);
  let result = records.slice();
  if (filters.type) result = result.filter(r => r.type === filters.type);
  if (filters.payer) result = result.filter(r => r.payer === filters.payer);
  if (filters.startDate) result = result.filter(r => r.date >= filters.startDate);
  if (filters.endDate) result = result.filter(r => r.date <= filters.endDate);
  result.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createTime || '').localeCompare(a.createTime || ''));
  return result;
};

const addFamilyExpense = (item) => {
  const records = getStorage(STORAGE_KEYS.FAMILY_EXPENSES, []);
  const typeMeta = FAMILY_EXPENSE_TYPES.find(t => t.key === (item.type || 'other')) || FAMILY_EXPENSE_TYPES[FAMILY_EXPENSE_TYPES.length - 1];
  const payerMeta = FAMILY_EXPENSE_PAYERS.find(p => p.key === (item.payer || 'shared')) || FAMILY_EXPENSE_PAYERS[2];
  const newItem = {
    id: Date.now(),
    type: typeMeta.key,
    typeName: typeMeta.name,
    icon: typeMeta.icon,
    color: typeMeta.color,
    payer: payerMeta.key,
    payerName: payerMeta.name,
    amount: parseFloat(item.amount) || 0,
    date: item.date || new Date().toISOString().split('T')[0],
    note: item.note || '',
    recurring: !!item.recurring,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  };
  records.push(newItem);
  const ok = setStorage(STORAGE_KEYS.FAMILY_EXPENSES, records);
  if (ok) recordFamilySnapshot();
  return ok ? newItem : null;
};

const updateFamilyExpense = (id, updates) => {
  const records = getStorage(STORAGE_KEYS.FAMILY_EXPENSES, []);
  const index = records.findIndex(r => r.id === id);
  if (index === -1) return null;
  const old = { ...records[index] };
  let typeMeta = null;
  if (typeof updates.type !== 'undefined' && updates.type !== old.type) {
    typeMeta = FAMILY_EXPENSE_TYPES.find(t => t.key === updates.type) || FAMILY_EXPENSE_TYPES[FAMILY_EXPENSE_TYPES.length - 1];
  }
  let payerMeta = null;
  if (typeof updates.payer !== 'undefined' && updates.payer !== old.payer) {
    payerMeta = FAMILY_EXPENSE_PAYERS.find(p => p.key === updates.payer) || FAMILY_EXPENSE_PAYERS[2];
  }
  records[index] = {
    ...old,
    ...updates,
    amount: typeof updates.amount !== 'undefined' ? (parseFloat(updates.amount) || 0) : old.amount,
    date: typeof updates.date !== 'undefined' ? updates.date : old.date,
    type: typeMeta ? typeMeta.key : old.type,
    typeName: typeMeta ? typeMeta.name : old.typeName,
    icon: typeMeta ? typeMeta.icon : old.icon,
    color: typeMeta ? typeMeta.color : old.color,
    payer: payerMeta ? payerMeta.key : old.payer,
    payerName: payerMeta ? payerMeta.name : old.payerName,
    updateTime: new Date().toISOString()
  };
  const ok = setStorage(STORAGE_KEYS.FAMILY_EXPENSES, records);
  if (ok) recordFamilySnapshot();
  return ok ? records[index] : null;
};

const deleteFamilyExpense = (id) => {
  const records = getStorage(STORAGE_KEYS.FAMILY_EXPENSES, []);
  const filtered = records.filter(r => r.id !== id);
  const ok = setStorage(STORAGE_KEYS.FAMILY_EXPENSES, filtered);
  if (ok) recordFamilySnapshot();
  return ok;
};

// ---- 家庭资产 ----

const getFamilyAssets = () => {
  return getStorage(STORAGE_KEYS.FAMILY_ASSETS, [])
    .sort((a, b) => b.createTime.localeCompare(a.createTime));
};

const getFamilyAssetById = (id) => {
  const assets = getStorage(STORAGE_KEYS.FAMILY_ASSETS, []);
  return assets.find(a => a.id === id) || null;
};

const addFamilyAsset = (item) => {
  const assets = getStorage(STORAGE_KEYS.FAMILY_ASSETS, []);
  const typeMeta = FAMILY_ASSET_TYPES.find(t => t.key === (item.type || 'savings')) || FAMILY_ASSET_TYPES[0];
  const now = new Date().toISOString();
  const newAsset = {
    id: Date.now(),
    type: typeMeta.key,
    typeName: typeMeta.name,
    icon: typeMeta.icon,
    color: typeMeta.color,
    isLiability: typeMeta.isLiability,
    name: item.name || '',
    amount: parseFloat(item.amount) || 0,
    note: item.note || '',
    createTime: now,
    updateTime: now
  };
  assets.push(newAsset);
  const ok = setStorage(STORAGE_KEYS.FAMILY_ASSETS, assets);
  if (ok) recordFamilySnapshot();
  return ok ? newAsset : null;
};

const updateFamilyAsset = (id, updates) => {
  const assets = getStorage(STORAGE_KEYS.FAMILY_ASSETS, []);
  const index = assets.findIndex(a => a.id === id);
  if (index === -1) return null;
  const old = { ...assets[index] };
  let typeMeta = null;
  if (typeof updates.type !== 'undefined' && updates.type !== old.type) {
    typeMeta = FAMILY_ASSET_TYPES.find(t => t.key === updates.type) || FAMILY_ASSET_TYPES[0];
  }
  assets[index] = {
    ...old,
    ...updates,
    amount: typeof updates.amount !== 'undefined' ? (parseFloat(updates.amount) || 0) : old.amount,
    type: typeMeta ? typeMeta.key : old.type,
    typeName: typeMeta ? typeMeta.name : old.typeName,
    icon: typeMeta ? typeMeta.icon : old.icon,
    color: typeMeta ? typeMeta.color : old.color,
    isLiability: typeMeta ? typeMeta.isLiability : old.isLiability,
    updateTime: new Date().toISOString()
  };
  const ok = setStorage(STORAGE_KEYS.FAMILY_ASSETS, assets);
  if (ok) recordFamilySnapshot();
  return ok ? assets[index] : null;
};

const deleteFamilyAsset = (id) => {
  const assets = getStorage(STORAGE_KEYS.FAMILY_ASSETS, []);
  const filtered = assets.filter(a => a.id !== id);
  const ok = setStorage(STORAGE_KEYS.FAMILY_ASSETS, filtered);
  if (ok) recordFamilySnapshot();
  return ok;
};

// ---- 家庭汇总 ----

const getFamilySummary = () => {
  const assets = getStorage(STORAGE_KEYS.FAMILY_ASSETS, []);
  let totalAssets = 0;
  let totalLiabilities = 0;
  assets.forEach(a => {
    const amount = parseFloat(a.amount) || 0;
    if (a.isLiability) {
      totalLiabilities += amount;
    } else {
      totalAssets += amount;
    }
  });
  // 本月收支
  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const incomes = getStorage(STORAGE_KEYS.FAMILY_INCOMES, []).filter(r => (r.date || '').startsWith(monthPrefix));
  const expenses = getStorage(STORAGE_KEYS.FAMILY_EXPENSES, []).filter(r => (r.date || '').startsWith(monthPrefix));
  const monthIncome = parseFloat(incomes.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0).toFixed(2));
  const monthExpense = parseFloat(expenses.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0).toFixed(2));

  return {
    totalAssets: parseFloat(totalAssets.toFixed(2)),
    totalLiabilities: parseFloat(totalLiabilities.toFixed(2)),
    netWorth: parseFloat((totalAssets - totalLiabilities).toFixed(2)),
    monthIncome,
    monthExpense,
    monthBalance: parseFloat((monthIncome - monthExpense).toFixed(2))
  };
};

const getFamilyAssetsByType = () => {
  const assets = getFamilyAssets();
  const result = {};
  FAMILY_ASSET_TYPES.forEach(type => {
    result[type.key] = {
      ...type,
      assets: assets.filter(a => a.type === type.key),
      total: 0
    };
    result[type.key].total = parseFloat(result[type.key].assets.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0).toFixed(2));
  });
  return result;
};

const getFamilyIncomesByType = (cycle = 'month') => {
  const { items } = getFamilyIncomeSummaryByCycle(cycle);
  const result = {};
  FAMILY_INCOME_TYPES.forEach(type => {
    result[type.key] = { ...type, total: 0, count: 0, items: [] };
  });
  items.forEach(r => {
    if (!result[r.type]) result[r.type] = { key: r.type, name: r.typeName, icon: r.icon, color: r.color, total: 0, count: 0, items: [] };
    result[r.type].total = parseFloat((result[r.type].total + (parseFloat(r.amount) || 0)).toFixed(2));
    result[r.type].count += 1;
    result[r.type].items.push(r);
  });
  return result;
};

const getFamilyExpensesByType = (cycle = 'month') => {
  const { items } = getFamilyExpenseSummaryByCycle(cycle);
  const result = {};
  FAMILY_EXPENSE_TYPES.forEach(type => {
    result[type.key] = { ...type, total: 0, count: 0, items: [] };
  });
  items.forEach(r => {
    if (!result[r.type]) result[r.type] = { key: r.type, name: r.typeName, icon: r.icon, color: r.color, total: 0, count: 0, items: [] };
    result[r.type].total = parseFloat((result[r.type].total + (parseFloat(r.amount) || 0)).toFixed(2));
    result[r.type].count += 1;
    result[r.type].items.push(r);
  });
  return result;
};

const getFamilyIncomeSummaryByCycle = (cycle = 'month') => {
  const records = getFamilyIncomes();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const currentYear = todayStr.slice(0, 4);
  const currentMonth = todayStr.slice(0, 7);
  let filtered = records;
  if (cycle === 'month') {
    filtered = records.filter(r => (r.date || '').startsWith(currentMonth));
  } else if (cycle === 'year') {
    filtered = records.filter(r => (r.date || '').startsWith(currentYear));
  }
  const total = parseFloat(filtered.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0).toFixed(2));
  return { total, count: filtered.length, items: filtered };
};

const getFamilyExpenseSummaryByCycle = (cycle = 'month') => {
  const records = getFamilyExpenses();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const currentYear = todayStr.slice(0, 4);
  const currentMonth = todayStr.slice(0, 7);
  let filtered = records;
  if (cycle === 'month') {
    filtered = records.filter(r => (r.date || '').startsWith(currentMonth));
  } else if (cycle === 'year') {
    filtered = records.filter(r => (r.date || '').startsWith(currentYear));
  }
  const total = parseFloat(filtered.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0).toFixed(2));
  return { total, count: filtered.length, items: filtered };
};

// ---- 家庭月度快照 ----

const recordFamilySnapshot = () => {
  const summary = getFamilySummary();
  const snapshots = getStorage(STORAGE_KEYS.FAMILY_SNAPSHOTS, []);
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const existingIndex = snapshots.findIndex(s => s.month === monthKey);
  const snapshot = {
    month: monthKey,
    year: now.getFullYear(),
    income: summary.monthIncome,
    expense: summary.monthExpense,
    balance: summary.monthBalance,
    assets: summary.totalAssets,
    liabilities: summary.totalLiabilities,
    netWorth: summary.netWorth,
    updateTime: now.toISOString()
  };

  if (existingIndex > -1) {
    snapshots[existingIndex] = snapshot;
  } else {
    snapshots.push(snapshot);
  }

  setStorage(STORAGE_KEYS.FAMILY_SNAPSHOTS, snapshots);
  return snapshot;
};

const getFamilySnapshots = () => {
  return getStorage(STORAGE_KEYS.FAMILY_SNAPSHOTS, [])
    .sort((a, b) => a.month.localeCompare(b.month));
};

// ========== 需求反馈 ==========

const getFeedbackRequests = (filters = {}) => {
  const records = getStorage(STORAGE_KEYS.FEEDBACK_REQUESTS, []);
  let result = records.slice();
  if (filters.category) result = result.filter(r => r.category === filters.category);
  if (filters.priority) result = result.filter(r => r.priority === filters.priority);
  if (filters.status) result = result.filter(r => r.status === filters.status);
  result.sort((a, b) => (b.createTime || '').localeCompare(a.createTime || ''));
  return result;
};

const getFeedbackById = (id) => {
  const records = getStorage(STORAGE_KEYS.FEEDBACK_REQUESTS, []);
  return records.find(r => r.id === id) || null;
};

const addFeedbackRequest = (item) => {
  const records = getStorage(STORAGE_KEYS.FEEDBACK_REQUESTS, []);
  const catMeta = FEEDBACK_CATEGORIES.find(c => c.key === (item.category || 'other')) || FEEDBACK_CATEGORIES[FEEDBACK_CATEGORIES.length - 1];
  const priMeta = FEEDBACK_PRIORITIES.find(p => p.key === (item.priority || 'medium')) || FEEDBACK_PRIORITIES[1];
  const statusMeta = FEEDBACK_STATUSES.find(s => s.key === (item.status || 'pending')) || FEEDBACK_STATUSES[0];
  const now = new Date().toISOString();
  const newItem = {
    id: Date.now(),
    title: item.title || '',
    category: catMeta.key,
    categoryName: catMeta.name,
    icon: catMeta.icon,
    color: catMeta.color,
    priority: priMeta.key,
    priorityName: priMeta.name,
    priorityColor: priMeta.color,
    status: statusMeta.key,
    statusName: statusMeta.name,
    statusColor: statusMeta.color,
    description: item.description || '',
    createTime: now,
    updateTime: now
  };
  records.push(newItem);
  return setStorage(STORAGE_KEYS.FEEDBACK_REQUESTS, records) ? newItem : null;
};

const updateFeedbackRequest = (id, updates) => {
  const records = getStorage(STORAGE_KEYS.FEEDBACK_REQUESTS, []);
  const index = records.findIndex(r => r.id === id);
  if (index === -1) return null;
  const old = { ...records[index] };
  let catMeta = null;
  if (typeof updates.category !== 'undefined' && updates.category !== old.category) {
    catMeta = FEEDBACK_CATEGORIES.find(c => c.key === updates.category) || FEEDBACK_CATEGORIES[FEEDBACK_CATEGORIES.length - 1];
  }
  let priMeta = null;
  if (typeof updates.priority !== 'undefined' && updates.priority !== old.priority) {
    priMeta = FEEDBACK_PRIORITIES.find(p => p.key === updates.priority) || FEEDBACK_PRIORITIES[1];
  }
  let statusMeta = null;
  if (typeof updates.status !== 'undefined' && updates.status !== old.status) {
    statusMeta = FEEDBACK_STATUSES.find(s => s.key === updates.status) || FEEDBACK_STATUSES[0];
  }
  records[index] = {
    ...old,
    ...updates,
    category: catMeta ? catMeta.key : old.category,
    categoryName: catMeta ? catMeta.name : old.categoryName,
    icon: catMeta ? catMeta.icon : old.icon,
    color: catMeta ? catMeta.color : old.color,
    priority: priMeta ? priMeta.key : old.priority,
    priorityName: priMeta ? priMeta.name : old.priorityName,
    priorityColor: priMeta ? priMeta.color : old.priorityColor,
    status: statusMeta ? statusMeta.key : old.status,
    statusName: statusMeta ? statusMeta.name : old.statusName,
    statusColor: statusMeta ? statusMeta.color : old.statusColor,
    updateTime: new Date().toISOString()
  };
  return setStorage(STORAGE_KEYS.FEEDBACK_REQUESTS, records) ? records[index] : null;
};

const deleteFeedbackRequest = (id) => {
  const records = getStorage(STORAGE_KEYS.FEEDBACK_REQUESTS, []);
  const filtered = records.filter(r => r.id !== id);
  return setStorage(STORAGE_KEYS.FEEDBACK_REQUESTS, filtered);
};

const getFeedbackSummary = () => {
  const records = getStorage(STORAGE_KEYS.FEEDBACK_REQUESTS, []);
  const total = records.length;
  const pending = records.filter(r => r.status === 'pending').length;
  const inProgress = records.filter(r => r.status === 'in_progress').length;
  const done = records.filter(r => r.status === 'done').length;
  const closed = records.filter(r => r.status === 'closed').length;
  return { total, pending, inProgress, done, closed };
};

// ========== 待办事项 ==========

const getTodoItems = (filters = {}) => {
  let records = getStorage(STORAGE_KEYS.TODO_ITEMS, []);
  if (filters.frequency) {
    records = records.filter(r => r.frequency === filters.frequency);
  }
  if (filters.status) {
    records = records.filter(r => r.status === filters.status);
  } else {
    records = records.filter(r => r.status !== 'archived');
  }
  // 按优先级排序：高 > 中 > 低，同优先级按创建时间
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  records.sort((a, b) => {
    const pa = priorityOrder[a.priority] !== undefined ? priorityOrder[a.priority] : 3;
    const pb = priorityOrder[b.priority] !== undefined ? priorityOrder[b.priority] : 3;
    if (pa !== pb) return pa - pb;
    return (a.createTime || '').localeCompare(b.createTime || '');
  });
  return records;
};

const getTodoItemById = (id) => {
  const records = getStorage(STORAGE_KEYS.TODO_ITEMS, []);
  return records.find(r => r.id === id) || null;
};

const addTodoItem = (data) => {
  const records = getStorage(STORAGE_KEYS.TODO_ITEMS, []);
  const now = new Date().toISOString();
  const newItem = {
    id: 'todo_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
    title: data.title || '',
    description: data.description || '',
    frequency: data.frequency || 'daily',
    time: data.time || '',
    weekday: data.frequency === 'weekly' ? (data.weekday || 1) : null,
    monthDay: data.frequency === 'monthly' ? (data.monthDay || 1) : null,
    yearMonth: data.frequency === 'yearly' ? (data.yearMonth || 1) : null,
    yearDay: data.frequency === 'yearly' ? (data.yearDay || 1) : null,
    priority: data.priority || 'medium',
    status: data.status || 'active',
    sortOrder: records.length,
    createTime: now,
    updateTime: now
  };
  records.push(newItem);
  return setStorage(STORAGE_KEYS.TODO_ITEMS, records) ? newItem : null;
};

const updateTodoItem = (id, updates) => {
  const records = getStorage(STORAGE_KEYS.TODO_ITEMS, []);
  const index = records.findIndex(r => r.id === id);
  if (index === -1) return null;
  records[index] = {
    ...records[index],
    ...updates,
    updateTime: new Date().toISOString()
  };
  return setStorage(STORAGE_KEYS.TODO_ITEMS, records) ? records[index] : null;
};

const deleteTodoItem = (id) => {
  const records = getStorage(STORAGE_KEYS.TODO_ITEMS, []);
  const filtered = records.filter(r => r.id !== id);
  // 同时删除相关完成记录
  const completions = getStorage(STORAGE_KEYS.TODO_COMPLETIONS, []);
  const filteredCompletions = completions.filter(c => c.todoId !== id);
  setStorage(STORAGE_KEYS.TODO_COMPLETIONS, filteredCompletions);
  return setStorage(STORAGE_KEYS.TODO_ITEMS, filtered);
};

// 获取当前周期的标识 key（用于判断是否已完成）
const getCurrentPeriodKey = (frequency, date = new Date()) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const weekday = date.getDay() === 0 ? 7 : date.getDay(); // 1-7, 周一=1
  if (frequency === 'daily') return `${y}-${m}-${d}`;
  if (frequency === 'weekly') return `${y}-W${getWeekNumber(date)}`;
  if (frequency === 'monthly') return `${y}-${m}`;
  if (frequency === 'yearly') return `${y}`;
  return `${y}-${m}-${d}`;
};

// 获取 ISO 周数
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// 检查某待办在当前周期是否已完成
const isTodoCompleted = (todoId, frequency) => {
  const completions = getStorage(STORAGE_KEYS.TODO_COMPLETIONS, []);
  const periodKey = getCurrentPeriodKey(frequency);
  return completions.some(c => c.todoId === todoId && c.periodKey === periodKey);
};

// 切换完成状态
const toggleTodoComplete = (todoId) => {
  const todo = getTodoItemById(todoId);
  if (!todo) return false;
  const completions = getStorage(STORAGE_KEYS.TODO_COMPLETIONS, []);
  const periodKey = getCurrentPeriodKey(todo.frequency);
  const existingIndex = completions.findIndex(c => c.todoId === todoId && c.periodKey === periodKey);
  if (existingIndex >= 0) {
    // 已完成 → 取消完成
    completions.splice(existingIndex, 1);
    setStorage(STORAGE_KEYS.TODO_COMPLETIONS, completions);
    return false;
  } else {
    // 未完成 → 标记完成
    completions.push({
      id: 'comp_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
      todoId,
      periodKey,
      completedAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    });
    setStorage(STORAGE_KEYS.TODO_COMPLETIONS, completions);
    return true;
  }
};

// 获取待办完成历史
const getTodoCompletions = (todoId, limit = 30) => {
  const completions = getStorage(STORAGE_KEYS.TODO_COMPLETIONS, []);
  return completions
    .filter(c => c.todoId === todoId)
    .sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''))
    .slice(0, limit);
};

// 判断待办今天是否需要执行
const isTodoDueToday = (todo) => {
  if (!todo || todo.status !== 'active') return false;
  const now = new Date();
  const weekday = now.getDay() === 0 ? 7 : now.getDay();
  const monthDay = now.getDate();
  const month = now.getMonth() + 1;

  if (todo.frequency === 'daily') return true;
  if (todo.frequency === 'weekly') return todo.weekday === weekday;
  if (todo.frequency === 'monthly') return todo.monthDay === monthDay;
  if (todo.frequency === 'yearly') return todo.yearMonth === month && todo.yearDay === monthDay;
  return false;
};

// 获取今日待办列表（所有频率中今天需要做的）
const getTodayTodos = () => {
  const records = getStorage(STORAGE_KEYS.TODO_ITEMS, []);
  const dueToday = records.filter(r => isTodoDueToday(r));
  // 按时间排序，无时间的排在后面
  dueToday.sort((a, b) => {
    const ta = a.time || '99:99';
    const tb = b.time || '99:99';
    return ta.localeCompare(tb);
  });
  // 附加完成状态
  return dueToday.map(item => ({
    ...item,
    completed: isTodoCompleted(item.id, item.frequency)
  }));
};

// 获取待办统计（按频率）
const getTodoSummary = (frequency) => {
  const records = getTodoItems({ frequency, status: 'active' });
  const dueToday = records.filter(r => isTodoDueToday(r));
  const completedToday = dueToday.filter(r => isTodoCompleted(r.id, r.frequency));
  return {
    total: records.length,
    dueToday: dueToday.length,
    completedToday: completedToday.length,
    pendingToday: dueToday.length - completedToday.length,
    completionRate: dueToday.length > 0 ? Math.round((completedToday.length / dueToday.length) * 100) : 0
  };
};

// 获取今日完成率（跨所有频率）
const getTodayOverallSummary = () => {
  const todayTodos = getTodayTodos();
  const completed = todayTodos.filter(t => t.completed).length;
  const total = todayTodos.length;
  return {
    total,
    completed,
    pending: total - completed,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  };
};

// ========== 个人爱好 ==========

// 获取所有爱好
const getHobbyItems = (filters = {}) => {
  let records = getStorage(STORAGE_KEYS.HOBBY_ITEMS, []);
  if (filters.category) {
    records = records.filter(r => r.category === filters.category);
  }
  if (filters.status) {
    records = records.filter(r => r.status === filters.status);
  }
  // 按创建时间倒序
  records.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  return records;
};

// 获取单个爱好
const getHobbyItemById = (id) => {
  const records = getStorage(STORAGE_KEYS.HOBBY_ITEMS, []);
  return records.find(r => r.id === id) || null;
};

// 添加爱好
const addHobbyItem = (data) => {
  const records = getStorage(STORAGE_KEYS.HOBBY_ITEMS, []);
  const now = new Date().toISOString();
  const newItem = {
    id: 'hobby_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
    title: data.title || '',
    category: data.category || 'other',
    description: data.description || '',
    goal: data.goal || '',  // 想要达成的目标
    status: data.status || 'learning',
    progress: data.progress || 0,  // 0-100 进度
    startDate: data.startDate || now.slice(0, 10),
    createTime: now,
    updateTime: now
  };
  records.push(newItem);
  return setStorage(STORAGE_KEYS.HOBBY_ITEMS, records) ? newItem : null;
};

// 更新爱好
const updateHobbyItem = (id, updates) => {
  const records = getStorage(STORAGE_KEYS.HOBBY_ITEMS, []);
  const index = records.findIndex(r => r.id === id);
  if (index === -1) return null;
  records[index] = {
    ...records[index],
    ...updates,
    updateTime: new Date().toISOString()
  };
  return setStorage(STORAGE_KEYS.HOBBY_ITEMS, records) ? records[index] : null;
};

// 删除爱好
const deleteHobbyItem = (id) => {
  const records = getStorage(STORAGE_KEYS.HOBBY_ITEMS, []);
  const filtered = records.filter(r => r.id !== id);
  return setStorage(STORAGE_KEYS.HOBBY_ITEMS, filtered);
};

// 获取爱好统计
const getHobbySummary = () => {
  const records = getStorage(STORAGE_KEYS.HOBBY_ITEMS, []);
  const total = records.length;
  const learning = records.filter(r => r.status === 'learning').length;
  const proficient = records.filter(r => r.status === 'proficient').length;
  const paused = records.filter(r => r.status === 'paused').length;
  const abandoned = records.filter(r => r.status === 'abandoned').length;
  return { total, learning, proficient, paused, abandoned };
};

// ========== 数据备份 ==========

const exportAllData = () => {
  return {
    version: '3.5.0',
    app: 'health-finance-helper',
    exportTime: new Date().toISOString(),
    data: {
      weight_records: getStorage(STORAGE_KEYS.WEIGHT, []),
      user_height: getStorage(STORAGE_KEYS.HEIGHT, 0),
      exercise_records: getStorage(STORAGE_KEYS.EXERCISES, []),
      exercise_weekly_goal: getStorage(STORAGE_KEYS.EXERCISE_GOAL, 3),
      asset_accounts: getStorage(STORAGE_KEYS.BILL_ACCOUNTS, []),
      bill_transactions: getStorage(STORAGE_KEYS.BILL_TRANSACTIONS, []),
      asset_snapshots: getStorage(STORAGE_KEYS.BILL_SNAPSHOTS, []),
      bill_account_logs: getStorage(STORAGE_KEYS.BILL_ACCOUNT_LOGS, []),
      physical_assets: getStorage(STORAGE_KEYS.PHYSICAL_ASSETS, []),
      wishlist: getStorage(STORAGE_KEYS.WISHLIST, []),
      physical_snapshots: getStorage(STORAGE_KEYS.PHYSICAL_SNAPSHOTS, []),
      car_expenses: getStorage(STORAGE_KEYS.CAR_EXPENSES, []),
      car_snapshots: getStorage(STORAGE_KEYS.CAR_SNAPSHOTS, []),
      important_days: getStorage(STORAGE_KEYS.IMPORTANT_DAYS, []),
      family_incomes: getStorage(STORAGE_KEYS.FAMILY_INCOMES, []),
      family_expenses: getStorage(STORAGE_KEYS.FAMILY_EXPENSES, []),
      family_assets: getStorage(STORAGE_KEYS.FAMILY_ASSETS, []),
      family_snapshots: getStorage(STORAGE_KEYS.FAMILY_SNAPSHOTS, []),
      feedback_requests: getStorage(STORAGE_KEYS.FEEDBACK_REQUESTS, []),
      todo_items: getStorage(STORAGE_KEYS.TODO_ITEMS, []),
      todo_completions: getStorage(STORAGE_KEYS.TODO_COMPLETIONS, []),
      hobby_items: getStorage(STORAGE_KEYS.HOBBY_ITEMS, [])
    }
  };
};

const validateBackupData = (backup) => {
  if (!backup || typeof backup !== 'object') {
    return { valid: false, message: '数据格式不正确' };
  }
  
  if (!backup.data || typeof backup.data !== 'object') {
    return { valid: false, message: '缺少 data 字段' };
  }
  
  const weightRecords = backup.data.weight_records || [];
  const assetAccounts = backup.data.asset_accounts || backup.data.savings_records || [];
  
  if (!Array.isArray(weightRecords)) {
    return { valid: false, message: '健康记录格式不正确' };
  }
  
  for (const record of weightRecords) {
    if (!record.date || typeof record.weight === 'undefined') {
      return { valid: false, message: '健康记录缺少必要字段' };
    }
  }
  
  for (const record of assetAccounts) {
    if (typeof record.amount === 'undefined' || (!record.name && !record.category)) {
      return { valid: false, message: '账户记录缺少必要字段' };
    }
  }
  
  return { valid: true };
};

const importAllData = (backup, mode = 'merge') => {
  const validation = validateBackupData(backup);
  if (!validation.valid) {
    return { success: false, message: validation.message };
  }
  
  const newWeight = backup.data.weight_records || [];
  const newHeight = backup.data.user_height || 0;
  const newExercises = backup.data.exercise_records || [];
  const newGoal = backup.data.exercise_weekly_goal || 3;
  const newBillAccounts = backup.data.asset_accounts || backup.data.savings_records || [];
  const newBillTransactions = backup.data.bill_transactions || [];
  const newBillSnapshots = backup.data.asset_snapshots || [];
  const newBillLogs = backup.data.bill_account_logs || [];
  const newPhysicalAssets = backup.data.physical_assets || [];
  const newWishlist = backup.data.wishlist || [];
  const newPhysicalSnapshots = backup.data.physical_snapshots || [];
  const newCarExpenses = backup.data.car_expenses || [];
  const newCarSnapshots = backup.data.car_snapshots || [];
  const newImportantDays = backup.data.important_days || [];
  const newFamilyIncomes = backup.data.family_incomes || [];
  const newFamilyExpenses = backup.data.family_expenses || [];
  const newFamilyAssets = backup.data.family_assets || [];
  const newFamilySnapshots = backup.data.family_snapshots || [];
  const newFeedbackRequests = backup.data.feedback_requests || [];
  const newTodoItems = backup.data.todo_items || [];
  const newTodoCompletions = backup.data.todo_completions || [];
  const newHobbyItems = backup.data.hobby_items || [];

  const mergeRecords = (existing, incoming) => {
    const map = new Map();
    existing.forEach(r => map.set(r.id, r));
    incoming.forEach(r => map.set(r.id, r));
    return Array.from(map.values());
  };

  if (mode === 'replace') {
    setStorage(STORAGE_KEYS.WEIGHT, newWeight);
    setStorage(STORAGE_KEYS.HEIGHT, newHeight);
    setStorage(STORAGE_KEYS.EXERCISES, newExercises);
    setStorage(STORAGE_KEYS.EXERCISE_GOAL, newGoal);
    setStorage(STORAGE_KEYS.BILL_ACCOUNTS, newBillAccounts);
    setStorage(STORAGE_KEYS.BILL_TRANSACTIONS, newBillTransactions);
    setStorage(STORAGE_KEYS.BILL_SNAPSHOTS, newBillSnapshots);
    setStorage(STORAGE_KEYS.BILL_ACCOUNT_LOGS, newBillLogs);
    setStorage(STORAGE_KEYS.PHYSICAL_ASSETS, newPhysicalAssets);
    setStorage(STORAGE_KEYS.WISHLIST, newWishlist);
    setStorage(STORAGE_KEYS.PHYSICAL_SNAPSHOTS, newPhysicalSnapshots);
    setStorage(STORAGE_KEYS.CAR_EXPENSES, newCarExpenses);
    setStorage(STORAGE_KEYS.CAR_SNAPSHOTS, newCarSnapshots);
    setStorage(STORAGE_KEYS.IMPORTANT_DAYS, newImportantDays);
    setStorage(STORAGE_KEYS.FAMILY_INCOMES, newFamilyIncomes);
    setStorage(STORAGE_KEYS.FAMILY_EXPENSES, newFamilyExpenses);
    setStorage(STORAGE_KEYS.FAMILY_ASSETS, newFamilyAssets);
    setStorage(STORAGE_KEYS.FAMILY_SNAPSHOTS, newFamilySnapshots);
    setStorage(STORAGE_KEYS.FEEDBACK_REQUESTS, newFeedbackRequests);
    setStorage(STORAGE_KEYS.TODO_ITEMS, newTodoItems);
    setStorage(STORAGE_KEYS.TODO_COMPLETIONS, newTodoCompletions);
    setStorage(STORAGE_KEYS.HOBBY_ITEMS, newHobbyItems);
  } else {
    const existingWeight = getStorage(STORAGE_KEYS.WEIGHT, []);
    const existingBillAccounts = getStorage(STORAGE_KEYS.BILL_ACCOUNTS, []);
    const existingBillTransactions = getStorage(STORAGE_KEYS.BILL_TRANSACTIONS, []);
    const existingBillLogs = getStorage(STORAGE_KEYS.BILL_ACCOUNT_LOGS, []);
    const existingPhysicalAssets = getStorage(STORAGE_KEYS.PHYSICAL_ASSETS, []);
    const existingWishlist = getStorage(STORAGE_KEYS.WISHLIST, []);
    const existingExercises = getStorage(STORAGE_KEYS.EXERCISES, []);
    
    setStorage(STORAGE_KEYS.WEIGHT, mergeRecords(existingWeight, newWeight));
    setStorage(STORAGE_KEYS.BILL_ACCOUNTS, mergeRecords(existingBillAccounts, newBillAccounts));
    setStorage(STORAGE_KEYS.BILL_TRANSACTIONS, mergeRecords(existingBillTransactions, newBillTransactions));
    setStorage(STORAGE_KEYS.BILL_ACCOUNT_LOGS, mergeRecords(existingBillLogs, newBillLogs));
    setStorage(STORAGE_KEYS.PHYSICAL_ASSETS, mergeRecords(existingPhysicalAssets, newPhysicalAssets));
    setStorage(STORAGE_KEYS.WISHLIST, mergeRecords(existingWishlist, newWishlist));
    setStorage(STORAGE_KEYS.EXERCISES, mergeRecords(existingExercises, newExercises));

    const existingCarExpenses = getStorage(STORAGE_KEYS.CAR_EXPENSES, []);
    setStorage(STORAGE_KEYS.CAR_EXPENSES, mergeRecords(existingCarExpenses, newCarExpenses));

    const existingImportantDays = getStorage(STORAGE_KEYS.IMPORTANT_DAYS, []);
    setStorage(STORAGE_KEYS.IMPORTANT_DAYS, mergeRecords(existingImportantDays, newImportantDays));

    const existingFamilyIncomes = getStorage(STORAGE_KEYS.FAMILY_INCOMES, []);
    setStorage(STORAGE_KEYS.FAMILY_INCOMES, mergeRecords(existingFamilyIncomes, newFamilyIncomes));
    const existingFamilyExpenses = getStorage(STORAGE_KEYS.FAMILY_EXPENSES, []);
    setStorage(STORAGE_KEYS.FAMILY_EXPENSES, mergeRecords(existingFamilyExpenses, newFamilyExpenses));
    const existingFamilyAssets = getStorage(STORAGE_KEYS.FAMILY_ASSETS, []);
    setStorage(STORAGE_KEYS.FAMILY_ASSETS, mergeRecords(existingFamilyAssets, newFamilyAssets));

    const existingFeedbackRequests = getStorage(STORAGE_KEYS.FEEDBACK_REQUESTS, []);
    setStorage(STORAGE_KEYS.FEEDBACK_REQUESTS, mergeRecords(existingFeedbackRequests, newFeedbackRequests));

    const existingTodoItems = getStorage(STORAGE_KEYS.TODO_ITEMS, []);
    setStorage(STORAGE_KEYS.TODO_ITEMS, mergeRecords(existingTodoItems, newTodoItems));

    if (newTodoCompletions.length) setStorage(STORAGE_KEYS.TODO_COMPLETIONS, newTodoCompletions);

    if (newHobbyItems.length) {
      const existingHobbyItems = getStorage(STORAGE_KEYS.HOBBY_ITEMS, []);
      setStorage(STORAGE_KEYS.HOBBY_ITEMS, mergeRecords(existingHobbyItems, newHobbyItems));
    }

    if (newHeight) setStorage(STORAGE_KEYS.HEIGHT, newHeight);
    if (newGoal) setStorage(STORAGE_KEYS.EXERCISE_GOAL, newGoal);

    // 快照直接覆盖，避免重复
    if (newBillSnapshots.length) setStorage(STORAGE_KEYS.BILL_SNAPSHOTS, newBillSnapshots);
    if (newPhysicalSnapshots.length) setStorage(STORAGE_KEYS.PHYSICAL_SNAPSHOTS, newPhysicalSnapshots);
    if (newCarSnapshots.length) setStorage(STORAGE_KEYS.CAR_SNAPSHOTS, newCarSnapshots);
    if (newFamilySnapshots.length) setStorage(STORAGE_KEYS.FAMILY_SNAPSHOTS, newFamilySnapshots);
  }

  return {
    success: true,
    weightCount: newWeight.length,
    billCount: newBillAccounts.length,
    physicalCount: newPhysicalAssets.length,
    wishlistCount: newWishlist.length,
    carCount: newCarExpenses.length,
    familyCount: newFamilyIncomes.length + newFamilyExpenses.length + newFamilyAssets.length,
    feedbackCount: newFeedbackRequests.length,
    todoCount: newTodoItems.length,
    hobbyCount: newHobbyItems.length
  };
};

module.exports = {
  setStorage,
  getStorage,
  removeStorage,
  // 类型定义
  EXERCISE_TYPES,
  BILL_ACCOUNT_TYPES,
  BILL_CATEGORIES,
  ASSET_STATUS,
  ASSET_CATEGORIES,
  // 健康
  getWeightRecords,
  addWeightRecord,
  deleteWeightRecord,
  getHeight,
  setHeight,
  calculateBMI,
  getLevel,
  buildHealthMetrics,
  BODY_FAT_RANGES,
  MUSCLE_RANGES,
  // 运动
  getExerciseRecords,
  addExerciseRecord,
  deleteExerciseRecord,
  getWeeklyGoal,
  setWeeklyGoal,
  getExerciseCalendar,
  getWeekProgress,
  // 财务记账（兼容旧名）
  getBillAccounts,
  getBillAccountById,
  addBillAccount,
  updateBillAccount,
  deleteBillAccount,
  adjustBillAccount,
  getBillAccountLogs,
  getBillSummary,
  getBillAccountsByType,
  getBillTransactions,
  addBillTransaction,
  deleteBillTransaction,
  getBillStats,
  getBillSnapshots,
  recordBillSnapshot,
  // 旧接口别名
  getAssetAccounts,
  getAccountById,
  addAssetAccount,
  updateAssetAccount,
  deleteAssetAccount,
  getAssetSummary,
  getAccountsByCategory,
  getAssetSnapshots,
  getAssetSnapshotsByYear,
  addTransaction,
  // 实物资产管理
  getPhysicalAssets,
  getPhysicalAssetById,
  addPhysicalAsset,
  updatePhysicalAsset,
  deletePhysicalAsset,
  getPhysicalAssetSummary,
  getPhysicalAssetsByStatus,
  getPhysicalAssetsByCategory,
  getPhysicalSnapshots,
  recordPhysicalSnapshot,
  // 心愿
  getWishlist,
  addWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
  getWishlistSummary,
  // 汽车记账
  CAR_EXPENSE_TYPES,
  CAR_CYCLE_TYPES,
  getCarExpenses,
  getCarExpenseById,
  addCarExpense,
  updateCarExpense,
  deleteCarExpense,
  getCarSummaryByCycle,
  getCarExpensesByType,
  getCarExpensesGroupedByMonth,
  getCarExpensesGroupedByDate,
  getCarSnapshots,
  recordCarSnapshot,
  // 重要日子
  IMPORTANT_DAY_CATEGORIES,
  IMPORTANT_DAY_FREQUENCIES,
  IMPORTANT_DAY_CALENDARS,
  getImportantDays,
  getImportantDayById,
  addImportantDay,
  updateImportantDay,
  deleteImportantDay,
  // 家庭记账
  FAMILY_INCOME_TYPES,
  FAMILY_INCOME_SOURCES,
  FAMILY_EXPENSE_TYPES,
  FAMILY_EXPENSE_PAYERS,
  FAMILY_ASSET_TYPES,
  getFamilyIncomes,
  addFamilyIncome,
  updateFamilyIncome,
  deleteFamilyIncome,
  getFamilyExpenses,
  addFamilyExpense,
  updateFamilyExpense,
  deleteFamilyExpense,
  getFamilyAssets,
  getFamilyAssetById,
  addFamilyAsset,
  updateFamilyAsset,
  deleteFamilyAsset,
  getFamilySummary,
  getFamilyAssetsByType,
  getFamilyIncomesByType,
  getFamilyExpensesByType,
  getFamilyIncomeSummaryByCycle,
  getFamilyExpenseSummaryByCycle,
  getFamilySnapshots,
  recordFamilySnapshot,
  // 需求反馈
  FEEDBACK_CATEGORIES,
  FEEDBACK_PRIORITIES,
  FEEDBACK_STATUSES,
  getFeedbackRequests,
  getFeedbackById,
  addFeedbackRequest,
  updateFeedbackRequest,
  deleteFeedbackRequest,
  getFeedbackSummary,
  // 待办事项
  TODO_FREQUENCIES,
  TODO_PRIORITIES,
  TODO_STATUSES,
  TODO_WEEKDAYS,
  getTodoItems,
  getTodoItemById,
  addTodoItem,
  updateTodoItem,
  deleteTodoItem,
  toggleTodoComplete,
  isTodoCompleted,
  isTodoDueToday,
  getTodoCompletions,
  getTodayTodos,
  getTodoSummary,
  getTodayOverallSummary,
  // 个人爱好
  HOBBY_CATEGORIES,
  HOBBY_STATUSES,
  getHobbyItems,
  getHobbyItemById,
  addHobbyItem,
  updateHobbyItem,
  deleteHobbyItem,
  getHobbySummary,
  // 备份
  exportAllData,
  validateBackupData,
  importAllData
};