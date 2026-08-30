// pages/car/detail/detail.js
const { getCarExpenseById, updateCarExpense, deleteCarExpense, CAR_EXPENSE_TYPES } = require('../../../utils/storage');

const formatMoney = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

Page({
  data: {
    item: null,
    loaded: false
  },

  onLoad(options) {
    this.expenseId = parseInt(options.id, 10);
    this.loadItem();
  },

  onShow() {
    if (this.data.loaded) this.loadItem();
  },

  loadItem() {
    const item = getCarExpenseById(this.expenseId);
    if (!item) {
      wx.showToast({ title: '记录不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }
    const enriched = {
      ...item,
      amountStr: formatMoney(item.amount),
      dateLabel: (item.date || '').replace(/-/g, '/')
    };
    this.setData({ item: enriched, loaded: true });
  },

  onEdit() {
    if (!this.data.item) return;
    const type = this.data.item.type;
    if (type === 'fuel' || type === 'ev') {
      wx.navigateTo({ url: `/pages/car/energy/energy?id=${this.expenseId}` });
    } else {
      wx.navigateTo({ url: `/pages/car/other/other?id=${this.expenseId}` });
    }
  },

  onDelete() {
    if (!this.data.item) return;
    wx.showModal({
      title: '删除记录',
      content: `确定要删除「${this.data.item.typeName} ¥${this.data.item.amountStr}」吗？`,
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          const ok = deleteCarExpense(this.expenseId);
          if (ok) {
            wx.showToast({ title: '已删除', icon: 'success' });
            setTimeout(() => wx.navigateBack(), 500);
          } else {
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  }
});
