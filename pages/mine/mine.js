const { getWeightRecords, getBillAccounts, getCarExpenses } = require('../../utils/storage');

Page({
  data: {
    weightCount: 0,
    assetCount: 0,
    carCount: 0
  },

  onShow() {
    this.refreshStats();
  },

  refreshStats() {
    const weightRecords = getWeightRecords();
    const billAccounts = getBillAccounts();
    const carExpenses = getCarExpenses();

    this.setData({
      weightCount: weightRecords.length,
      assetCount: billAccounts.length,
      carCount: carExpenses.length
    });
  },

  goToBackup() {
    wx.navigateTo({
      url: '/pages/backup/backup'
    });
  },

  goToFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    });
  },

  onShareAppMessage() {
    return {
      title: '健康理财小助手',
      path: '/pages/index/index'
    };
  }
});