const {
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
  getHobbySummary
} = require('../../utils/storage');

const HOBBY_TABS = [
  { key: 'daily', name: '每日', icon: '☀️', color: '#3B82F6', lightColor: '#DBEAFE' },
  { key: 'weekly', name: '每周', icon: '📊', color: '#8B5CF6', lightColor: '#EDE9FE' },
  { key: 'monthly', name: '每月', icon: '🌙', color: '#EC4899', lightColor: '#FCE7F3' },
  { key: 'yearly', name: '每年', icon: '🎉', color: '#F59E0B', lightColor: '#FEF3C7' },
  { key: 'hobby', name: '爱好', icon: '🌟', color: '#10B981', lightColor: '#D1FAE5' }
];

// hex转rgba
const hexToRgba = (hex, alpha) => {
  if (!hex || hex.length < 7) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

// 生成月份选项 1-12
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => (i + 1) + '月');
// 生成日期选项 1-31
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => (i + 1) + '日');
const WEEKDAY_NAMES = TODO_WEEKDAYS.map(w => w.name);
const PRIORITY_NAMES = TODO_PRIORITIES.map(p => p.name);
const FREQUENCY_NAMES = TODO_FREQUENCIES.map(f => f.name);

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
};

Page({
  data: {
    // Tab
    activeTab: 'daily',
    frequencyTabs: HOBBY_TABS,
    // 今日概览
    todaySummary: {},
    // 今日待办
    todayTodos: [],
    // 当前频率列表
    list: [],
    // 弹窗
    showModal: false,
    isEditing: false,
    editingId: null,
    form: {
      title: '',
      frequency: 'daily',
      time: '',
      weekday: 1,
      monthDay: 1,
      yearMonth: 1,
      yearDay: 1,
      priority: 'medium',
      description: ''
    },
    // 预计算
    frequencyLabel: '每日',
    frequencyIndex: 0,
    frequencyColor: '#3B82F6',
    priorityLabel: '中',
    priorityIndex: 1,
    weekdayLabel: '周一',
    weekdayIndex: 0,
    monthDayLabel: '1日',
    monthDayIndex: 0,
    yearMonthLabel: '1月',
    yearMonthIndex: 0,
    yearDayLabel: '1日',
    yearDayIndex: 0,
    // picker 数据
    frequencyNames: FREQUENCY_NAMES,
    priorityNames: PRIORITY_NAMES,
    weekdayNames: WEEKDAY_NAMES,
    monthOptions: MONTH_OPTIONS,
    dayOptions: DAY_OPTIONS,
    TODO_FREQUENCIES,
    TODO_PRIORITIES,
    TODO_WEEKDAYS,
    // 今日日期显示
    todayDate: '',
    // 爱好相关
    hobbySummary: {},
    hobbyList: [],
    hobbyForm: {
      title: '',
      category: 'other',
      description: '',
      goal: '',
      status: 'learning',
      progress: 0,
      startDate: ''
    },
    hobbyCategoryLabel: '其他',
    hobbyCategoryIndex: 8,
    hobbyStatusLabel: '学习中',
    hobbyStatusIndex: 0,
    HOBBY_CATEGORIES,
    HOBBY_STATUSES,
    categoryNames: HOBBY_CATEGORIES.map(c => c.name),
    hobbyStatusNames: HOBBY_STATUSES.map(s => s.name)
  },

  onShow() {
    this.setData({
      todayDate: formatDate(new Date().toISOString())
    });
    this.loadData();
  },

  loadData() {
    const { activeTab } = this.data;
    const todaySummary = getTodayOverallSummary();
    const todayTodos = getTodayTodos().map(item => this.enrichItem(item));

    // 根据 activeTab 加载不同数据
    if (activeTab === 'hobby') {
      // 爱好 Tab
      const hobbySummary = getHobbySummary();
      const hobbyList = getHobbyItems().map(item => this.enrichHobbyItem(item));
      this.setData({ todaySummary, todayTodos, hobbySummary, hobbyList, list: [] });
    } else {
      // 待办 Tab
      const items = getTodoItems({ frequency: activeTab }).map(item => ({
        ...item,
        ...this.buildDisplayFields(item)
      }));
      this.setData({ todaySummary, todayTodos, list: items, hobbySummary: {}, hobbyList: [] });
    }
  },

  // 爱好数据预处理
  enrichHobbyItem(item) {
    const cat = HOBBY_CATEGORIES.find(c => c.key === item.category);
    const sta = HOBBY_STATUSES.find(s => s.key === item.status);
    return {
      ...item,
      categoryIcon: cat ? cat.icon : '🌟',
      categoryColor: cat ? cat.color : '#6B7280',
      categoryName: cat ? cat.name : '其他',
      statusColor: sta ? sta.color : '#6B7280',
      statusName: sta ? sta.name : '未知'
    };
  },

  enrichItem(item) {
    const enriched = {
      ...item,
      ...this.buildDisplayFields(item)
    };
    enriched.completed = item.completed || false;
    return enriched;
  },

  buildDisplayFields(item) {
    const freq = TODO_FREQUENCIES.find(f => f.key === item.frequency);
    const pri = TODO_PRIORITIES.find(p => p.key === item.priority);
    const freqColor = freq ? freq.color : '#6B7280';
    const freqName = freq ? freq.name : '';
    const priColor = pri ? pri.color : '#6B7280';
    const priName = pri ? pri.name : '';

    // 构建周期描述
    let scheduleText = '';
    if (item.frequency === 'daily') {
      scheduleText = '每天';
    } else if (item.frequency === 'weekly') {
      const wd = TODO_WEEKDAYS.find(w => w.key === item.weekday);
      scheduleText = wd ? '每' + wd.name : '每周';
    } else if (item.frequency === 'monthly') {
      scheduleText = '每月' + item.monthDay + '日';
    } else if (item.frequency === 'yearly') {
      scheduleText = '每年' + item.yearMonth + '月' + item.yearDay + '日';
    }

    return {
      freqColor,
      freqBgColor: hexToRgba(freqColor, 0.1),
      freqName,
      priColor,
      priBgColor: hexToRgba(priColor, 0.1),
      priName,
      scheduleText,
      timeText: item.time || ''
    };
  },

  // Tab 切换
  onTabChange(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ activeTab: key }, () => {
      this.loadData();
    });
  },

  // 勾选完成
  onToggle(e) {
    const id = e.currentTarget.dataset.id;
    toggleTodoComplete(id);
    this.loadData();
  },

  // 打开新增弹窗
  openAddModal() {
    const { activeTab } = this.data;
    // 如果是爱好 Tab，打开爱好弹窗
    if (activeTab === 'hobby') {
      this.openAddHobbyModal();
      return;
    }
    // 否则打开待办弹窗
    this.setData({
      showModal: true,
      isEditing: false,
      editingId: null,
      form: {
        title: '',
        frequency: 'daily',
        time: '',
        weekday: 1,
        monthDay: 1,
        yearMonth: 1,
        yearDay: 1,
        priority: 'medium',
        description: ''
      },
      frequencyLabel: '每日',
      frequencyIndex: 0,
      frequencyColor: '#3B82F6',
      priorityLabel: '中',
      priorityIndex: 1,
      weekdayLabel: '周一',
      weekdayIndex: 0,
      monthDayLabel: '1日',
      monthDayIndex: 0,
      yearMonthLabel: '1月',
      yearMonthIndex: 0,
      yearDayLabel: '1日',
      yearDayIndex: 0
    });
  },

  // 打开编辑弹窗
  openEditModal(e) {
    const id = e.currentTarget.dataset.id;
    const { activeTab } = this.data;
    // 如果是爱好 Tab，打开爱好编辑弹窗
    if (activeTab === 'hobby') {
      this.openEditHobbyModal(e);
      return;
    }
    // 否则打开待办编辑弹窗
    const item = getTodoItemById(id);
    if (!item) return;
    const freqIdx = TODO_FREQUENCIES.findIndex(f => f.key === item.frequency);
    const priIdx = TODO_PRIORITIES.findIndex(p => p.key === item.priority);
    const wdIdx = TODO_WEEKDAYS.findIndex(w => w.key === item.weekday);
    this.setData({
      showModal: true,
      isEditing: true,
      editingId: id,
      form: {
        title: item.title,
        frequency: item.frequency,
        time: item.time || '',
        weekday: item.weekday || 1,
        monthDay: item.monthDay || 1,
        yearMonth: item.yearMonth || 1,
        yearDay: item.yearDay || 1,
        priority: item.priority,
        description: item.description || ''
      },
      frequencyLabel: freqIdx >= 0 ? TODO_FREQUENCIES[freqIdx].name : '每日',
      frequencyIndex: freqIdx >= 0 ? freqIdx : 0,
      frequencyColor: freqIdx >= 0 ? TODO_FREQUENCIES[freqIdx].color : '#3B82F6',
      priorityLabel: priIdx >= 0 ? TODO_PRIORITIES[priIdx].name : '中',
      priorityIndex: priIdx >= 0 ? priIdx : 1,
      weekdayLabel: wdIdx >= 0 ? TODO_WEEKDAYS[wdIdx].name : '周一',
      weekdayIndex: wdIdx >= 0 ? wdIdx : 0,
      monthDayLabel: (item.monthDay || 1) + '日',
      monthDayIndex: (item.monthDay || 1) - 1,
      yearMonthLabel: (item.yearMonth || 1) + '月',
      yearMonthIndex: (item.yearMonth || 1) - 1,
      yearDayLabel: (item.yearDay || 1) + '日',
      yearDayIndex: (item.yearDay || 1) - 1
    });
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  noop() {},

  // 表单输入
  onTitleInput(e) {
    this.setData({ 'form.title': e.detail.value });
  },
  onDescInput(e) {
    this.setData({ 'form.description': e.detail.value });
  },
  onTimeChange(e) {
    this.setData({ 'form.time': e.detail.value });
  },
  onFrequencyChange(e) {
    const idx = parseInt(e.detail.value);
    if (idx >= 0 && idx < TODO_FREQUENCIES.length) {
      const f = TODO_FREQUENCIES[idx];
      this.setData({
        'form.frequency': f.key,
        frequencyLabel: f.name,
        frequencyIndex: idx,
        frequencyColor: f.color
      });
    }
  },
  onWeekdayChange(e) {
    const idx = parseInt(e.detail.value);
    if (idx >= 0 && idx < TODO_WEEKDAYS.length) {
      this.setData({
        'form.weekday': TODO_WEEKDAYS[idx].key,
        weekdayLabel: TODO_WEEKDAYS[idx].name,
        weekdayIndex: idx
      });
    }
  },
  onMonthDayChange(e) {
    const idx = parseInt(e.detail.value);
    const day = idx + 1;
    this.setData({
      'form.monthDay': day,
      monthDayLabel: day + '日',
      monthDayIndex: idx
    });
  },
  onYearMonthChange(e) {
    const idx = parseInt(e.detail.value);
    const month = idx + 1;
    this.setData({
      'form.yearMonth': month,
      yearMonthLabel: month + '月',
      yearMonthIndex: idx
    });
  },
  onYearDayChange(e) {
    const idx = parseInt(e.detail.value);
    const day = idx + 1;
    this.setData({
      'form.yearDay': day,
      yearDayLabel: day + '日',
      yearDayIndex: idx
    });
  },
  onPriorityChange(e) {
    const idx = parseInt(e.detail.value);
    if (idx >= 0 && idx < TODO_PRIORITIES.length) {
      this.setData({
        'form.priority': TODO_PRIORITIES[idx].key,
        priorityLabel: TODO_PRIORITIES[idx].name,
        priorityIndex: idx
      });
    }
  },

  // 根据 activeTab 判断保存类型
  onSave() {
    const { form, hobbyForm, isEditing, editingId, activeTab } = this.data;
    if (activeTab === 'hobby') {
      // 保存爱好 — 检查 hobbyForm.title
      if (!hobbyForm.title || !hobbyForm.title.trim()) {
        wx.showToast({ title: '请输入爱好名称', icon: 'none' });
        return;
      }
      this.saveHobby();
    } else {
      // 保存待办 — 检查 form.title
      if (!form.title.trim()) {
        wx.showToast({ title: '请输入待办标题', icon: 'none' });
        return;
      }
      if (isEditing) {
        updateTodoItem(editingId, form);
        wx.showToast({ title: '已更新', icon: 'success' });
      } else {
        addTodoItem(form);
        wx.showToast({ title: '已添加', icon: 'success' });
      }
      this.setData({ showModal: false });
      this.loadData();
    }
  },

  // 爱好保存
  saveHobby() {
    const { hobbyForm, isEditing, editingId } = this.data;
    if (isEditing) {
      updateHobbyItem(editingId, hobbyForm);
      wx.showToast({ title: '已更新', icon: 'success' });
    } else {
      addHobbyItem(hobbyForm);
      wx.showToast({ title: '已添加', icon: 'success' });
    }
    this.setData({ showModal: false });
    this.loadData();
  },

  // 爱好删除
  onDeleteHobby(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复，确定删除这个爱好？',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          deleteHobbyItem(id);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.loadData();
        }
      }
    });
  },

  // 爱好进度更新
  onProgressChange(e) {
    const id = e.currentTarget.dataset.id;
    const progress = parseInt(e.detail.value);
    updateHobbyItem(id, { progress });
    this.loadData();
  },

  // 打开新增爱好弹窗
  openAddHobbyModal() {
    const today = new Date().toISOString().slice(0, 10);
    this.setData({
      showModal: true,
      isEditing: false,
      editingId: null,
      hobbyForm: {
        title: '',
        category: 'other',
        description: '',
        goal: '',
        status: 'learning',
        progress: 0,
        startDate: today
      },
      hobbyCategoryLabel: '其他',
      hobbyCategoryIndex: 8,
      hobbyStatusLabel: '学习中',
      hobbyStatusIndex: 0
    });
  },

  // 打开编辑爱好弹窗
  openEditHobbyModal(e) {
    const id = e.currentTarget.dataset.id;
    const item = getHobbyItemById(id);
    if (!item) return;
    const catIdx = HOBBY_CATEGORIES.findIndex(c => c.key === item.category);
    const staIdx = HOBBY_STATUSES.findIndex(s => s.key === item.status);
    this.setData({
      showModal: true,
      isEditing: true,
      editingId: id,
      hobbyForm: {
        title: item.title,
        category: item.category,
        description: item.description || '',
        goal: item.goal || '',
        status: item.status,
        progress: item.progress || 0,
        startDate: item.startDate || ''
      },
      hobbyCategoryLabel: catIdx >= 0 ? HOBBY_CATEGORIES[catIdx].name : '其他',
      hobbyCategoryIndex: catIdx >= 0 ? catIdx : 8,
      hobbyStatusLabel: staIdx >= 0 ? HOBBY_STATUSES[staIdx].name : '学习中',
      hobbyStatusIndex: staIdx >= 0 ? staIdx : 0
    });
  },

  // 爱好表单输入
  onHobbyTitleInput(e) {
    this.setData({ 'hobbyForm.title': e.detail.value });
  },
  onHobbyDescInput(e) {
    this.setData({ 'hobbyForm.description': e.detail.value });
  },
  onHobbyGoalInput(e) {
    this.setData({ 'hobbyForm.goal': e.detail.value });
  },
  onHobbyCategoryChange(e) {
    const idx = parseInt(e.detail.value);
    if (idx >= 0 && idx < HOBBY_CATEGORIES.length) {
      const c = HOBBY_CATEGORIES[idx];
      this.setData({
        'hobbyForm.category': c.key,
        hobbyCategoryLabel: c.name,
        hobbyCategoryIndex: idx
      });
    }
  },
  onHobbyStatusChange(e) {
    const idx = parseInt(e.detail.value);
    if (idx >= 0 && idx < HOBBY_STATUSES.length) {
      const s = HOBBY_STATUSES[idx];
      this.setData({
        'hobbyForm.status': s.key,
        hobbyStatusLabel: s.name,
        hobbyStatusIndex: idx
      });
    }
  },
  onHobbyProgressChange(e) {
    const progress = parseInt(e.detail.value);
    this.setData({ 'hobbyForm.progress': progress });
  },

  // 删除
  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    const { activeTab } = this.data;
    // 如果是爱好 Tab，删除爱好
    if (activeTab === 'hobby') {
      this.onDeleteHobby(e);
      return;
    }
    // 否则删除待办
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复，确定删除这条待办？',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          deleteTodoItem(id);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.loadData();
        }
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '待办事项 - 让生活更有节奏',
      path: '/pages/todo/todo'
    };
  }
});
