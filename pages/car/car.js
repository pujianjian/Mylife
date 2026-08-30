// pages/car/car.js
const {
  CAR_CYCLE_TYPES,
  getCarSummaryByCycle,
  getCarExpensesGroupedByDate
} = require('../../utils/storage');

const formatMoney = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatMonth = (month) => {
  if (!month) return '';
  const parts = month.split('-');
  return `${parseInt(parts[1], 10)}月`;
};

const formatDayLabel = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  return `${parseInt(parts[1], 10)}月${parseInt(parts[2], 10)}日`;
};

Page({
  data: {
    cycle: 'all',
    cycles: CAR_CYCLE_TYPES,
    showCyclePicker: false,
    totalStr: '0.00',
    summaryCount: 0,
    monthGroups: [],
    flatList: []
  },

  onLoad() {
    this.reload();
  },

  onShow() {
    this.reload();
  },

  reload() {
    const { cycle, cycles } = this.data;
    const summary = getCarSummaryByCycle(cycle);
    const grouped = getCarExpensesGroupedByDate(cycle);
    const monthGroups = grouped.map(g => ({
      ...g,
      dateLabel: formatDayLabel(g.date),
      totalStr: formatMoney(g.total),
      items: g.items.map(i => ({
        ...i,
        amountStr: formatMoney(i.amount)
      }))
    }));
    const cur = cycles.find(c => c.key === cycle);
    const currentCycleName = cur ? cur.name : '全部周期';

    this.setData({
      totalStr: formatMoney(summary.total),
      summaryCount: summary.count,
      monthGroups,
      currentCycleName
    });
  },

  onCycleTap() {
    this.setData({ showCyclePicker: true });
  },

  onCycleClose() {
    this.setData({ showCyclePicker: false });
  },

  onCycleSelect(e) {
    const { cycle } = e.currentTarget.dataset;
    this.setData({ cycle, showCyclePicker: false }, () => this.reload());
  },

  onQueryTap() {
    wx.showActionSheet({
      itemList: ['按时间倒序', '按类型分组', '按金额排序'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.showToast({ title: '已是时间倒序', icon: 'none' });
        } else if (res.tapIndex === 1) {
          this.groupByType();
        } else {
          this.sortByAmount();
        }
      }
    });
  },

  groupByType() {
    const { getCarExpensesByType } = require('../../utils/storage');
    const grouped = getCarExpensesByType();
    const lines = Object.values(grouped)
      .filter(g => g.count > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
      .map(g => `${g.icon} ${g.name}：¥${formatMoney(g.total)} (${g.count}笔)`);
    wx.showModal({
      title: '按类型分组',
      content: lines.join('\n') || '暂无数据',
      showCancel: false
    });
  },

  sortByAmount() {
    const { monthGroups } = this.data;
    const flat = [];
    monthGroups.forEach(g => {
      g.items.forEach(i => flat.push(i));
    });
    flat.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    wx.showModal({
      title: '按金额排序 Top 5',
      content: flat.slice(0, 5).map(i => `${i.icon || ''} ${i.typeName || '其他'} ¥${i.amountStr}`).join('\n') || '暂无数据',
      showCancel: false
    });
  },

  onItemTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/car/detail/detail?id=${id}` });
  },

  onAddOther() {
    wx.navigateTo({ url: '/pages/car/other/other' });
  },

  noop() {}
});
