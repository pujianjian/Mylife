// pages/days/edit/edit.js
const {
  IMPORTANT_DAY_CATEGORIES,
  IMPORTANT_DAY_FREQUENCIES,
  IMPORTANT_DAY_CALENDARS,
  addImportantDay,
  updateImportantDay,
  getImportantDayById
} = require('../../../utils/storage');
const { solar2Lunar, lunar2Solar, LUNAR_MONTH_NAMES, LUNAR_DAY_NAMES } = require('../../../utils/lunar');

const pad = n => String(n).padStart(2, '0');
const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// 给每条分类预算 class / style（WXML 不能内联三元拼接字符串）
function buildCategoryList(categories, selectedKey) {
  return categories.map(c => {
    const active = c.key === selectedKey;
    return {
      key: c.key,
      name: c.name,
      icon: c.icon,
      color: c.color,
      itemClass: 'cat-item' + (active ? ' active' : ''),
      itemStyle: active
        ? `border-color: ${c.color}; background: ${c.color}12;`
        : '',
      iconStyle: `color: ${active ? c.color : '#6B7280'};`,
      nameClass: 'cat-name' + (active ? ' active' : '')
    };
  });
}

Page({
  data: {
    isEdit: false,
    editId: null,
    name: '',
    categories: buildCategoryList(IMPORTANT_DAY_CATEGORIES, 'birthday'),
    category: 'birthday',
    calendars: IMPORTANT_DAY_CALENDARS,
    calendar: 'solar',
    calendarLabel: '公历',
    frequencies: IMPORTANT_DAY_FREQUENCIES,
    frequency: 'yearly',
    frequencyLabel: '每年一次',
    // 公历日期
    solarDate: '',
    // 农历日期
    lunarYear: 0,
    lunarYearRange: [],
    lunarMonth: 1,
    lunarDay: 1,
    isLeap: false,
    leapClass: 'leap-text',
    // 农历下拉
    lunarMonths: [],
    lunarDays: [],
    lunarMonthLabel: '',
    lunarDayLabel: '',
    // 仅一次 时只能选过去或未来，所以这里提示
    remindDays: 3,
    note: '',
    formValid: false,
    showDelete: false,
    saveBtnClass: 'save-btn',
    dateBlockLabel: '日期'
  },

  onLoad(options) {
    // 初始化公历默认今天
    this.setData({ solarDate: toDateStr(new Date()) });
    this.buildLunarPickers();
    this.syncLunarFromSolar();
    this.refreshLabels();
    this.validate();

    if (options.id) {
      const item = getImportantDayById(parseInt(options.id, 10));
      if (item) {
        wx.setNavigationBarTitle({ title: '编辑日子' });
        this.setData({
          isEdit: true,
          editId: item.id,
          name: item.name || '',
          category: item.category || 'birthday',
          calendar: item.calendar || 'solar',
          frequency: item.frequency || 'yearly',
          solarDate: item.date || toDateStr(new Date()),
          isLeap: !!item.isLeap,
          remindDays: item.remindDays != null ? item.remindDays : 3,
          note: item.note || '',
          showDelete: true
        });
        if (item.calendar === 'lunar') {
          const parts = item.date.split('-').map(Number);
          this.setData({ lunarYear: parts[0], lunarMonth: parts[1], lunarDay: parts[2] });
        } else {
          this.syncLunarFromSolar();
        }
        this.refreshLabels();
        this.validate();
        this.refreshCategoryList();
      }
    }
  },

  buildLunarPickers() {
    const years = [];
    for (let y = 1900; y <= 2100; y++) {
      years.push(y);
    }
    const months = [];
    for (let m = 1; m <= 12; m++) {
      months.push({ value: m, label: `${LUNAR_MONTH_NAMES[m - 1]}月` });
    }
    const days = [];
    for (let d = 1; d <= 30; d++) {
      days.push({ value: d, label: LUNAR_DAY_NAMES[d - 1] });
    }
    this.setData({ lunarYearRange: years, lunarMonths: months, lunarDays: days });
  },

  syncLunarFromSolar() {
    const d = new Date(this.data.solarDate);
    if (isNaN(d)) return;
    const lunar = solar2Lunar(d.getFullYear(), d.getMonth() + 1, d.getDate());
    if (!lunar) return;
    this.setData({
      lunarYear: lunar.year,
      lunarMonth: lunar.month,
      lunarDay: lunar.day,
      isLeap: lunar.isLeap
    });
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value }, () => this.validate());
  },

  refreshCategoryList() {
    this.setData({ categories: buildCategoryList(IMPORTANT_DAY_CATEGORIES, this.data.category) });
  },

  onCategorySelect(e) {
    const { cat } = e.currentTarget.dataset;
    this.setData({ category: cat }, () => this.refreshCategoryList());
  },

  onCalendarChange(e) {
    const idx = parseInt(e.detail.value, 10);
    const calendar = this.data.calendars[idx].key;
    this.setData({ calendar }, () => this.refreshLabels());
  },

  onFrequencyChange(e) {
    const idx = parseInt(e.detail.value, 10);
    const frequency = this.data.frequencies[idx].key;
    this.setData({ frequency }, () => this.refreshLabels());
  },

  onPickSolarDate(e) {
    this.setData({ solarDate: e.detail.value }, () => {
      this.syncLunarFromSolar();
      this.refreshLabels();
      this.validate();
    });
  },

  onPickLunarYear(e) {
    const idx = parseInt(e.detail.value, 10);
    const year = this.data.lunarYearRange[idx];
    if (year) {
      this.setData({ lunarYear: year }, () => this.refreshLabels());
    }
  },

  onPickLunarMonth(e) {
    const v = parseInt(e.detail.value, 10) + 1;
    this.setData({ lunarMonth: v }, () => {
      this.refreshLabels();
      this.validate();
    });
  },

  onPickLunarDay(e) {
    const v = parseInt(e.detail.value, 10) + 1;
    this.setData({ lunarDay: v }, () => {
      this.refreshLabels();
      this.validate();
    });
  },

  toggleLeap() {
    this.setData({ isLeap: !this.data.isLeap }, () => this.refreshLabels());
  },

  onRemindChange(e) {
    const idx = parseInt(e.detail.value, 10);
    const list = [1, 2, 3, 5, 7, 15, 30];
    this.setData({ remindDays: list[idx] || 3 });
  },

  onNoteInput(e) {
    this.setData({ note: e.detail.value });
  },

  // 集中刷新所有展示型字段（避免 WXML 内联三元）
  refreshLabels() {
    const { calendar, frequency, lunarMonth, lunarDay, isLeap } = this.data;
    const calendarLabel = calendar === 'solar' ? '公历' : '农历';
    const frequencyLabel =
      frequency === 'yearly' ? '每年一次' :
      frequency === 'monthly' ? '每月一次' : '仅一次';
    const monthItem = this.data.lunarMonths[lunarMonth - 1];
    const dayItem = this.data.lunarDays[lunarDay - 1];
    const lunarMonthLabel = monthItem ? monthItem.label : '';
    const lunarDayLabel = dayItem ? dayItem.label : '';
    const dateBlockLabel = calendar === 'solar' ? '日期' : '农历日期';
    const leapClass = 'leap-text' + (isLeap ? ' active' : '');
    this.setData({
      calendarLabel,
      frequencyLabel,
      lunarMonthLabel,
      lunarDayLabel,
      dateBlockLabel,
      leapClass
    });
  },

  validate() {
    const { name, calendar, lunarMonth, lunarDay } = this.data;
    const valid = !!name.trim() && (calendar === 'solar' ? !!this.data.solarDate : (lunarMonth >= 1 && lunarDay >= 1));
    this.setData({
      formValid: valid,
      saveBtnClass: 'save-btn' + (valid ? ' active' : '')
    });
  },

  buildDate() {
    if (this.data.calendar === 'solar') {
      return this.data.solarDate;
    }
    return `${this.data.lunarYear}-${pad(this.data.lunarMonth)}-${pad(this.data.lunarDay)}`;
  },

  onSave() {
    if (!this.data.formValid) {
      wx.showToast({ title: '请填写名称和日期', icon: 'none' });
      return;
    }
    const payload = {
      name: this.data.name.trim(),
      category: this.data.category,
      calendar: this.data.calendar,
      frequency: this.data.frequency,
      date: this.buildDate(),
      isLeap: this.data.calendar === 'lunar' ? this.data.isLeap : false,
      remindDays: this.data.remindDays,
      note: this.data.note.trim()
    };
    if (this.data.isEdit) {
      const ok = updateImportantDay(this.data.editId, payload);
      if (ok) {
        wx.showToast({ title: '已更新', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 600);
      } else {
        wx.showToast({ title: '更新失败', icon: 'none' });
      }
    } else {
      const result = addImportantDay(payload);
      if (result) {
        wx.showToast({ title: '保存成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 600);
      } else {
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    }
  },

  onDelete() {
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          const { deleteImportantDay } = require('../../../utils/storage');
          const ok = deleteImportantDay(this.data.editId);
          if (ok) {
            wx.showToast({ title: '已删除', icon: 'success' });
            setTimeout(() => wx.navigateBack(), 600);
          }
        }
      }
    });
  },

  onSubscribeTap() {
    // 微信提醒：引导用户开启订阅消息
    // 提示：实际发送需要后台配合，本地先做订阅授权并记录愿望
    wx.requestSubscribeMessage({
      tmplIds: ['PLACEHOLDER_TMPL_ID'], // 实际项目替换为申请到的模板 ID
      success: () => {
        wx.showToast({ title: '已开启提醒', icon: 'success' });
      },
      fail: () => {
        wx.showToast({ title: '未开启提醒，可在右上角设置中开启', icon: 'none' });
      }
    });
  }
});
