const {
  BILL_ACCOUNT_TYPES,
  getBillAccounts,
  getBillAccountById,
  addBillAccount,
  updateBillAccount,
  deleteBillAccount,
  getBillSummary,
  getBillAccountsByType,
  getBillSnapshots
} = require('../../utils/storage');

const formatMoney = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

Page({
  data: {
    activeTab: 0,
    tabs: [
      { label: '资产', icon: '💰' },
      { label: '图表', icon: '📈' }
    ],

    // ─── 资产 Tab ───
    summary: {
      netWorth: '0.00',
      totalAssets: '0.00',
      totalLiabilities: '0.00'
    },
    accountGroups: [],

    // ─── 图表 Tab ───
    chartRange: 'all',
    chartRanges: [
      { key: 'year', name: '本年' },
      { key: 'all', name: '全部' }
    ],
    trendLabels: [],
    assetTrendData: [],
    liabilityTrendData: [],
    netWorthTrendData: [],
    chartSummary: {
      latestAssets: '0.00',
      latestLiabilities: '0.00',
      latestNetWorth: '0.00'
    },

    // ─── 账户弹窗 ───
    showAccountModal: false,
    accountModalTitle: '',
    editAccountId: null,
    accountForm: { name: '', amount: '', note: '' },
    accountFormCategoryIndex: 0,
    accountCategoryOptions: []
  },

  onLoad() {
    this.loadAccountTab();
    this.loadChartTab();
  },

  onShow() {
    this.loadCurrentTab();
  },

  // ==================== Tab 切换 ====================
  onTabChange(e) {
    const idx = e.currentTarget.dataset.index;
    if (idx === this.data.activeTab) return;
    this.setData({ activeTab: idx }, () => this.loadCurrentTab());
  },

  loadCurrentTab() {
    const { activeTab } = this.data;
    if (activeTab === 0) this.loadAccountTab();
    else if (activeTab === 1) this.loadChartTab();
  },

  // ==================== 资产 Tab ====================
  loadAccountTab() {
    const summary = getBillSummary();
    const grouped = getBillAccountsByType();
    const accountGroups = BILL_ACCOUNT_TYPES.map(type => ({
      ...type,
      ...grouped[type.key],
      totalStr: formatMoney(grouped[type.key].total),
      accounts: (grouped[type.key].accounts || []).map(a => ({
        ...a,
        amountStr: formatMoney(a.amount),
        isLiability: type.type === 'liability',
        isClaim: type.type === 'claim'
      }))
    })).filter(g => g.accounts.length > 0);

    this.setData({
      summary: {
        netWorth: formatMoney(summary.netWorth),
        totalAssets: formatMoney(summary.totalAssets + summary.totalClaims),
        totalLiabilities: formatMoney(summary.totalLiabilities)
      },
      accountGroups
    });
  },

  onAccountTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/savings/detail/detail?id=${id}` });
  },

  onAccountLongPress(e) {
    const { id } = e.currentTarget.dataset;
    const account = getBillAccountById(id);
    if (!account) return;
    const catIdx = BILL_ACCOUNT_TYPES.findIndex(t => t.key === account.category);
    this.setData({
      showAccountModal: true,
      accountModalTitle: '编辑账户',
      editAccountId: id,
      accountFormCategoryIndex: catIdx > -1 ? catIdx : 0,
      accountForm: {
        name: account.name,
        amount: account.amount.toString(),
        note: account.note || ''
      },
      accountCategoryOptions: BILL_ACCOUNT_TYPES.map(t => t.name)
    });
  },

  openAddAccountModal() {
    this.setData({
      showAccountModal: true,
      accountModalTitle: '添加账户',
      editAccountId: null,
      accountFormCategoryIndex: 0,
      accountForm: { name: '', amount: '', note: '' },
      accountCategoryOptions: BILL_ACCOUNT_TYPES.map(t => t.name)
    });
  },

  closeAccountModal() {
    this.setData({ showAccountModal: false });
  },

  onAccountCategoryChange(e) {
    this.setData({ accountFormCategoryIndex: parseInt(e.detail.value) });
  },

  onAccountNameInput(e) {
    this.setData({ 'accountForm.name': e.detail.value });
  },

  onAccountAmountInput(e) {
    this.setData({ 'accountForm.amount': e.detail.value });
  },

  onAccountNoteInput(e) {
    this.setData({ 'accountForm.note': e.detail.value });
  },

  saveAccount() {
    const { accountForm, accountFormCategoryIndex, editAccountId } = this.data;
    const name = accountForm.name.trim();
    const amount = parseFloat(accountForm.amount);
    if (!name) { wx.showToast({ title: '请输入账户名称', icon: 'none' }); return; }
    if (isNaN(amount)) { wx.showToast({ title: '请输入有效金额', icon: 'none' }); return; }
    const category = BILL_ACCOUNT_TYPES[accountFormCategoryIndex].key;
    if (editAccountId) {
      updateBillAccount(editAccountId, { name, amount, category, note: accountForm.note });
      wx.showToast({ title: '更新成功', icon: 'success' });
    } else {
      addBillAccount({ name, amount, category, note: accountForm.note });
      wx.showToast({ title: '添加成功', icon: 'success' });
    }
    this.setData({ showAccountModal: false });
    this.loadAccountTab();
    this.loadChartTab();
  },

  deleteAccount() {
    const { editAccountId } = this.data;
    if (!editAccountId) return;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，是否继续？',
      confirmColor: '#FA5151',
      success: (res) => {
        if (res.confirm) {
          deleteBillAccount(editAccountId);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.setData({ showAccountModal: false });
          this.loadAccountTab();
          this.loadChartTab();
        }
      }
    });
  },

  // ==================== 图表 Tab ====================
  loadChartTab() {
    this.loadTrendData();
  },

  onChartRangeChange(e) {
    const range = e.currentTarget.dataset.range;
    this.setData({ chartRange: range }, () => {
      this.loadTrendData();
    });
  },

  loadTrendData() {
    const { chartRange } = this.data;
    const today = new Date().toISOString().split('T')[0];
    const currentYear = today.slice(0, 4);

    // 获取快照并按月份升序排列
    let snapshots = getBillSnapshots();
    if (chartRange === 'year') {
      snapshots = snapshots.filter(s => s.month.startsWith(currentYear));
    }
    snapshots.sort((a, b) => a.month.localeCompare(b.month));

    // 如果没有任何快照，用当前汇总生成一个当月数据点
    if (snapshots.length === 0) {
      const summary = getBillSummary();
      const currentMonth = today.slice(0, 7);
      snapshots = [{
        month: currentMonth,
        assets: summary.totalAssets + summary.totalClaims,
        liabilities: summary.totalLiabilities,
        netWorth: summary.netWorth
      }];
    }

    const labels = snapshots.map(s => {
      const parts = s.month.split('-');
      return `${parseInt(parts[1], 10)}月`;
    });

    const assetTrendData = snapshots.map(s => ({ month: s.month, value: s.assets || 0 }));
    const liabilityTrendData = snapshots.map(s => ({ month: s.month, value: s.liabilities || 0 }));
    const netWorthTrendData = snapshots.map(s => ({ month: s.month, value: s.netWorth || 0 }));

    const latest = snapshots[snapshots.length - 1] || {};

    this.setData({
      trendLabels: labels,
      assetTrendData,
      liabilityTrendData,
      netWorthTrendData,
      chartSummary: {
        latestAssets: formatMoney(latest.assets || 0),
        latestLiabilities: formatMoney(latest.liabilities || 0),
        latestNetWorth: formatMoney(latest.netWorth || 0)
      }
    });
  },

  onShareAppMessage() {
    return { title: '资产管理', path: '/pages/savings/savings' };
  },

  noop() {}
});
