const {
  getWeightRecords,
  addWeightRecord,
  deleteWeightRecord,
  getHeight,
  setHeight,
  buildHealthMetrics,
  getExerciseRecords,
  addExerciseRecord,
  deleteExerciseRecord,
  getWeeklyGoal,
  setWeeklyGoal,
  getExerciseCalendar,
  getWeekProgress,
  EXERCISE_TYPES
} = require('../../utils/storage');

const formatDate = (date = new Date()) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatShortDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

// 健康指标项定义
const FAT_METRICS = [
  { key: 'bmi', label: 'BMI', unit: '', format: 'fixed' },
  { key: 'bodyFatRate', label: '体脂率', unit: '%', format: 'percent' },
  { key: 'subcutaneousFat', label: '皮下脂肪率', unit: '%', format: 'percent' },
  { key: 'visceralFat', label: '内脏脂肪等级', unit: '级', format: 'int' },
  { key: 'obesity', label: '肥胖度', unit: '%', format: 'percent' }
];

const MUSCLE_METRICS = [
  { key: 'muscleRate', label: '肌肉率', unit: '%', format: 'percent' },
  { key: 'boneMass', label: '骨量', unit: 'kg', format: 'fixed' },
  { key: 'waterRate', label: '水分率', unit: '%', format: 'percent' },
  { key: 'bmr', label: '基础代谢', unit: 'kcal', format: 'int' }
];

Page({
  data: {
    // ========== 页面分组 Tab ==========
    mainTab: 'health', // 'health' | 'fitness'

    // ========== 健康数据（原体重模块）==========
    records: [],
    trendData: [],
    latestWeight: '--',
    latestDate: '',
    weightChange: 0,
    FAT_METRICS,
    MUSCLE_METRICS,
    activeMetricTab: 'fat',
    latestHealth: null,

    // 蓝牙相关
    showBleBanner: true,

    // 体重记录弹窗
    showHealthModal: false,
    healthDate: formatDate(),
    healthWeight: '',
    healthHeight: '',
    bodyFatRate: '',
    subcutaneousFat: '',
    visceralFat: '',
    obesity: '',
    muscleRate: '',
    boneMass: '',
    waterRate: '',
    bmr: '',

    // ========== 健身模块 ==========
    exerciseTypes: EXERCISE_TYPES,
    exercises: [],
    // 日历
    calYear: new Date().getFullYear(),
    calMonth: new Date().getMonth() + 1,
    calDays: [],        // 日历格子 [{day, isCurrentMonth, hasExercise}]
    calWeekdays: ['一', '二', '三', '四', '五', '六', '日'],
    // 周目标
    weekGoal: 3,
    weekProgress: { goal: 3, completed: 0, remaining: 3, percent: 0 },
    goalOptions: ['每周 1 天', '每周 2 天', '每周 3 天', '每周 4 天', '每周 5 天', '每周 6 天', '每天运动'],
    // 运动记录弹窗
    showExerciseModal: false,
    exDate: formatDate(),
    exType: 'run',
    exDuration: '',
    exDistance: '',
    exCalories: '',
    exNote: ''
  },

  onLoad() {
    this.loadAll();
  },

  onShow() {
    this.loadAll();
  },

  loadAll() {
    this.loadHealthData();
    this.loadFitnessData();
  },

  // ========== 分组 Tab 切换 ==========
  switchMainTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.mainTab) return;
    this.setData({ mainTab: tab });
    if (tab === 'fitness') {
      this.loadFitnessData();
    }
  },

  // ==================== 健康数据 ====================
  loadHealthData() {
    const records = getWeightRecords();
    const trendData = [...records]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(r => ({ date: r.date, value: parseFloat(r.weight) }));

    const latest = records[0] || null;
    const prev = records[1] || null;
    const latestWeight = latest ? latest.weight : '--';
    const latestDate = latest ? formatShortDate(latest.date) : '';
    const weightChange = latest && prev ? parseFloat((latest.weight - prev.weight).toFixed(1)) : 0;
    const latestHealth = latest ? buildHealthMetrics(latest) : null;

    // 预计算每个指标的等级和值，避免 WXML 中动态属性访问
    const levelMap = {
      bmi: latestHealth ? latestHealth.bmiLevel : 'normal',
      bodyFatRate: latestHealth ? latestHealth.bodyFatLevel : 'normal',
      subcutaneousFat: 'normal',
      visceralFat: 'normal',
      obesity: 'normal',
      muscleRate: latestHealth ? latestHealth.muscleLevel : 'normal',
      boneMass: 'normal',
      waterRate: 'normal',
      bmr: 'normal'
    };
    const valMap = latestHealth || {};
    const fatMetrics = FAT_METRICS.map(m => ({
      ...m,
      level: levelMap[m.key] || 'normal',
      value: valMap[m.key] != null ? valMap[m.key] : '',
      unit: m.unit
    }));
    const muscleMetrics = MUSCLE_METRICS.map(m => ({
      ...m,
      level: levelMap[m.key] || 'normal',
      value: valMap[m.key] != null ? valMap[m.key] : '',
      unit: m.unit
    }));

    this.setData({
      records,
      trendData,
      latestWeight,
      latestDate,
      weightChange,
      latestHealth,
      fatMetrics,
      muscleMetrics,
      healthHeight: String(getHeight() || '')
    });
  },

  onMetricTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.activeMetricTab) return;
    this.setData({ activeMetricTab: tab });
  },

  onTrendMore() {
    wx.showToast({ title: '更多历史功能开发中', icon: 'none' });
  },

  openHealthModal() {
    this.setData({
      showHealthModal: true,
      healthDate: formatDate(),
      healthWeight: '',
      healthHeight: String(getHeight() || ''),
      bodyFatRate: '',
      subcutaneousFat: '',
      visceralFat: '',
      obesity: '',
      muscleRate: '',
      boneMass: '',
      waterRate: '',
      bmr: ''
    });
  },

  closeHealthModal() {
    this.setData({ showHealthModal: false });
  },

  preventBubble() {},

  onHealthDateChange(e) {
    this.setData({ healthDate: e.detail.value });
  },

  onHealthHeightInput(e) {
    this.setData({ healthHeight: e.detail.value });
  },

  onHealthWeightInput(e) {
    const value = e.detail.value;
    if (/^\d*\.?\d{0,1}$/.test(value)) {
      this.setData({ healthWeight: value });
    }
  },

  onNumberInput(e) {
    const { field } = e.currentTarget.dataset;
    const value = e.detail.value;
    if (/^\d*\.?\d{0,1}$/.test(value)) {
      this.setData({ [field]: value });
    }
  },

  onIntInput(e) {
    const { field } = e.currentTarget.dataset;
    const value = e.detail.value;
    if (/^\d*$/.test(value)) {
      this.setData({ [field]: value });
    }
  },

  saveHealthRecord() {
    const { healthDate: date, healthWeight: weight, healthHeight: height } = this.data;

    if (!weight || parseFloat(weight) <= 0) {
      wx.showToast({ title: '请输入有效体重', icon: 'none' });
      return;
    }

    if (!height || parseFloat(height) <= 0) {
      wx.showToast({ title: '请先设置身高（cm）', icon: 'none' });
      return;
    }

    setHeight(height);

    const record = {
      date,
      weight,
      note: '',
      bodyFatRate: this.data.bodyFatRate,
      subcutaneousFat: this.data.subcutaneousFat,
      visceralFat: this.data.visceralFat,
      obesity: this.data.obesity,
      muscleRate: this.data.muscleRate,
      boneMass: this.data.boneMass,
      waterRate: this.data.waterRate,
      bmr: this.data.bmr
    };

    const result = addWeightRecord(record);
    if (result) {
      wx.showToast({ title: '记录成功', icon: 'success' });
      this.setData({ showHealthModal: false });
      this.loadHealthData();
    } else {
      wx.showToast({ title: '保存失败，请重试', icon: 'none' });
    }
  },

  deleteRecord(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，是否继续？',
      confirmColor: '#FA5151',
      success: (res) => {
        if (res.confirm) {
          deleteWeightRecord(id);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.loadHealthData();
        }
      }
    });
  },

  closeBleBanner() {
    this.setData({ showBleBanner: false });
  },

  scanBleScale() {
    wx.showModal({
      title: '蓝牙智能秤',
      content: '请在真机上使用此功能。开发环境中是否使用模拟数据体验？',
      confirmText: '模拟数据',
      cancelText: '知道了',
      success: (res) => {
        if (res.confirm) {
          this.simulateBleData();
        }
      }
    });
  },

  simulateBleData() {
    const weight = (55 + Math.random() * 25).toFixed(1);
    const bodyFatRate = (18 + Math.random() * 18).toFixed(1);
    const muscleRate = (30 + Math.random() * 12).toFixed(1);
    const subcutaneousFat = (12 + Math.random() * 14).toFixed(1);
    const visceralFat = Math.floor(3 + Math.random() * 12).toString();
    const obesity = (10 + Math.random() * 15).toFixed(1);
    const boneMass = (2 + Math.random() * 4).toFixed(1);
    const waterRate = (45 + Math.random() * 12).toFixed(1);
    const bmr = Math.floor(1100 + Math.random() * 700).toString();

    this.setData({
      showHealthModal: true,
      healthDate: formatDate(),
      healthWeight: weight,
      healthHeight: String(getHeight() || ''),
      bodyFatRate,
      subcutaneousFat,
      visceralFat,
      obesity,
      muscleRate,
      boneMass,
      waterRate,
      bmr
    });

    wx.showToast({ title: '模拟数据已填充', icon: 'success' });
  },

  // ==================== 健身模块 ====================
  loadFitnessData() {
    const exercises = getExerciseRecords();
    const goal = getWeeklyGoal();
    const progress = getWeekProgress();

    // 预计算每条运动记录的类型信息，避免 WXML 内联 .find() 导致 > 解析错误
    const typeMap = {};
    EXERCISE_TYPES.forEach(t => { typeMap[t.key] = t; });
    const enrichedExercises = exercises.map(item => {
      const t = typeMap[item.type] || EXERCISE_TYPES[2]; // 默认自定义
      return {
        ...item,
        _typeIcon: t.icon,
        _typeName: t.name,
        _typeColorBg: t.color + '20'
      };
    });

    this.buildCalendar(this.data.calYear, this.data.calMonth);

    this.setData({
      exercises: enrichedExercises,
      weekGoal: goal,
      weekProgress: progress
    });
  },

  // 构建日历网格数据
  buildCalendar(year, month) {
    const firstDay = new Date(year, month - 1, 1);
    const dayOfWeek = firstDay.getDay(); // 0=周日
    // 周一为第一天，偏移量
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    const calendar = getExerciseCalendar(year, month);

    const days = [];
    // 上月尾部
    const prevMonthDays = new Date(year, month - 1, 0).getDate();
    for (let i = offset - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        hasExercise: false
      });
    }
    // 本月
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        day: d,
        isCurrentMonth: true,
        hasExercise: !!calendar.activeDays[d]
      });
    }
    // 下月头部
    const remaining = 42 - days.length; // 6行 × 7列
    for (let d = 1; d <= remaining; d++) {
      days.push({
        day: d,
        isCurrentMonth: false,
        hasExercise: false
      });
    }

    this.setData({ calDays: days });
  },

  // 月份切换
  onCalPrevMonth() {
    let { calYear, calMonth } = this.data;
    calMonth--;
    if (calMonth < 1) {
      calMonth = 12;
      calYear--;
    }
    this.setData({ calYear, calMonth });
    this.buildCalendar(calYear, calMonth);
  },

  onCalNextMonth() {
    let { calYear, calMonth } = this.data;
    calMonth++;
    if (calMonth > 12) {
      calMonth = 1;
      calYear++;
    }
    this.setData({ calYear, calMonth });
    this.buildCalendar(calYear, calMonth);
  },

  // 选择运动类型快捷记录
  onQuickExercise(e) {
    const type = e.currentTarget.dataset.type;
    this.openExerciseModal(type);
  },

  // 打开运动记录弹窗
  openExerciseModal(type) {
    this.setData({
      showExerciseModal: true,
      exDate: formatDate(),
      exType: type || 'run',
      exDuration: '',
      exDistance: '',
      exCalories: '',
      exNote: ''
    });
  },

  closeExerciseModal() {
    this.setData({ showExerciseModal: false });
  },

  onExDateChange(e) {
    this.setData({ exDate: e.detail.value });
  },

  onExTypeChange(e) {
    this.setData({ exType: e.detail.dataset.type });
  },

  onExDurationInput(e) {
    const val = e.detail.value;
    if (/^\d{0,4}$/.test(val)) {
      this.setData({ exDuration: val });
    }
  },

  onExDistanceInput(e) {
    const val = e.detail.value;
    if (/^\d{0,3}(\.\d{0,2})?$/.test(val)) {
      this.setData({ exDistance: val });
    }
  },

  onExCaloriesInput(e) {
    const val = e.detail.value;
    if (/^\d{0,5}$/.test(val)) {
      this.setData({ exCalories: val });
    }
  },

  onExNoteInput(e) {
    this.setData({ exNote: e.detail.value });
  },

  saveExerciseRecord() {
    const { exDate: date, exType: type, exDuration: duration, exDistance: distance, exCalories: calories, exNote: note } = this.data;

    if (!duration || parseInt(duration) <= 0) {
      wx.showToast({ title: '请输入运动时长', icon: 'none' });
      return;
    }

    const result = addExerciseRecord({
      date,
      type,
      duration,
      distance,
      calories,
      note
    });

    if (result) {
      wx.showToast({ title: '运动已记录', icon: 'success' });
      this.setData({ showExerciseModal: false });
      this.loadFitnessData();
    } else {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  // 删除运动记录
  deleteExercise(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '删除此条运动记录？',
      confirmColor: '#FA5151',
      success: (res) => {
        if (res.confirm) {
          deleteExerciseRecord(id);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.loadFitnessData();
        }
      }
    });
  },

  // 周目标设置（picker 选择器）
  onGoalChange(e) {
    const index = parseInt(e.detail.value, 10);
    if (isNaN(index) || index < 0 || index > 6) return;

    const days = index + 1;
    const saved = setWeeklyGoal(days);
    if (!saved) {
      wx.showToast({ title: '设置失败，请重试', icon: 'none' });
      return;
    }

    this.setData({
      weekGoal: days,
      weekProgress: getWeekProgress()
    });
    wx.showToast({ title: days === 7 ? '已设为每天运动' : `已设为每周 ${days} 天`, icon: 'success' });
  },

  onShareAppMessage() {
    return {
      title: '我的健康管理',
      path: '/pages/weight/weight'
    };
  }
});
