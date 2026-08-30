const {
  BILL_ACCOUNT_TYPES,
  getBillAccountById,
  updateBillAccount,
  deleteBillAccount,
  getBillTransactions,
  deleteBillTransaction,
  getBillSummary,
  getBillAccountLogs
} = require('../../../utils/storage');

const formatMoney = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDateTime = (isoStr) => {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

Page({
  data: {
    accountId: null,
    account: null,
    accountIcon: '',
    accountColor: '',
    accountType: '',
    summary: {
      totalAssets: '0.00',
      totalLiabilities: '0.00',
      netWorth: '0.00'
    },
    transactions: [],

    // 编辑账户弹窗
    showEditModal: false,
    editForm: {
      name: '',
      amount: '',
      note: ''
    },
    editCategoryIndex: 0,
    categoryOptions: [],

    // 调整余额弹窗
    showAdjustModal: false,
    adjustAmount: '',

    // 删除确认
    showDeleteConfirm: false,

    // 修改历史记录
    changeLogs: []
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ accountId: parseInt(options.id) });
    }
  },

  onShow() {
    this.loadAccount();
    this.loadTransactions();
    this.loadSummary();
    this.loadChangeLogs();
  },

  loadAccount() {
    const { accountId } = this.data;
    if (!accountId) return;
    const account = getBillAccountById(accountId);
    if (!account) {
      wx.showToast({ title: '账户不存在', icon: 'none' });
      wx.navigateBack();
      return;
    }
    const typeObj = BILL_ACCOUNT_TYPES.find(t => t.key === account.category) || {};
    this.setData({
      account: {
        ...account,
        amountStr: formatMoney(account.amount),
        categoryName: typeObj.name || account.category
      },
      accountIcon: typeObj.icon || '📦',
      accountColor: typeObj.color || '#6B7280',
      accountType: typeObj.type || 'asset'
    });
  },

  loadTransactions() {
    const { accountId } = this.data;
    const txs = getBillTransactions({ accountId });
    const groups = {};
    txs.forEach(tx => {
      if (!groups[tx.date]) {
        groups[tx.date] = {
          date: tx.date,
          displayDate: tx.date,
          items: [],
          income: 0,
          expense: 0
        };
      }
      const item = {
        ...tx,
        amountStr: (tx.type === 'expense' ? '-' : '+') + formatMoney(tx.amount),
        isExpense: tx.type === 'expense'
      };
      groups[tx.date].items.push(item);
      if (tx.type === 'income') groups[tx.date].income += tx.amount;
      if (tx.type === 'expense') groups[tx.date].expense += tx.amount;
    });
    const transactionGroups = Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
    transactionGroups.forEach(g => {
      g.incomeStr = g.income > 0 ? '+' + formatMoney(g.income) : '';
      g.expenseStr = g.expense > 0 ? '-' + formatMoney(g.expense) : '';
    });
    this.setData({ transactions: transactionGroups });
  },

  loadSummary() {
    const summary = getBillSummary();
    this.setData({
      summary: {
        totalAssets: formatMoney(summary.totalAssets + summary.totalClaims),
        totalLiabilities: formatMoney(summary.totalLiabilities),
        netWorth: formatMoney(summary.netWorth)
      }
    });
  },

  loadChangeLogs() {
    const { accountId } = this.data;
    const logs = getBillAccountLogs(accountId);
    const enriched = logs.map(log => ({
      ...log,
      displayDate: formatDateTime(log.date)
    }));
    this.setData({ changeLogs: enriched });
  },

  // ==================== 编辑账户 ====================
  openEditModal() {
    const { account } = this.data;
    if (!account) return;
    const catIdx = BILL_ACCOUNT_TYPES.findIndex(t => t.key === account.category);
    this.setData({
      showEditModal: true,
      editForm: {
        name: account.name,
        amount: account.amount.toString(),
        note: account.note || ''
      },
      editCategoryIndex: catIdx > -1 ? catIdx : 0,
      categoryOptions: BILL_ACCOUNT_TYPES.map(t => t.name)
    });
  },

  closeEditModal() {
    this.setData({ showEditModal: false });
  },

  onEditCategoryChange(e) {
    this.setData({ editCategoryIndex: parseInt(e.detail.value, 10) });
  },

  onEditNameInput(e) {
    this.setData({ 'editForm.name': e.detail.value });
  },

  onEditAmountInput(e) {
    this.setData({ 'editForm.amount': e.detail.value });
  },

  onEditNoteInput(e) {
    this.setData({ 'editForm.note': e.detail.value });
  },

  saveEdit() {
    const { accountId, editForm, editCategoryIndex } = this.data;
    const name = editForm.name.trim();
    const amount = parseFloat(editForm.amount);
    if (!name) { wx.showToast({ title: '请输入账户名称', icon: 'none' }); return; }
    if (isNaN(amount)) { wx.showToast({ title: '请输入有效金额', icon: 'none' }); return; }
    const category = BILL_ACCOUNT_TYPES[editCategoryIndex].key;
    const result = updateBillAccount(accountId, { name, amount, category, note: editForm.note });
    if (result) {
      wx.showToast({ title: '修改成功', icon: 'success' });
      this.setData({ showEditModal: false });
      this.loadAccount();
      this.loadSummary();
      this.loadChangeLogs();
    } else {
      wx.showToast({ title: '修改失败', icon: 'none' });
    }
  },

  // ==================== 调整余额 ====================
  openAdjustModal() {
    this.setData({ showAdjustModal: true, adjustAmount: this.data.account.amount.toString() });
  },

  closeAdjustModal() {
    this.setData({ showAdjustModal: false, adjustAmount: '' });
  },

  onAdjustInput(e) {
    this.setData({ adjustAmount: e.detail.value });
  },

  saveAdjust() {
    const { accountId, adjustAmount } = this.data;
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount)) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }
    const result = updateBillAccount(accountId, { amount });
    if (result) {
      wx.showToast({ title: '调整成功', icon: 'success' });
      this.setData({ showAdjustModal: false });
      this.loadAccount();
      this.loadSummary();
      this.loadChangeLogs();
    } else {
      wx.showToast({ title: '调整失败', icon: 'none' });
    }
  },

  // ==================== 删除账户 ====================
  confirmDelete() {
    this.setData({ showDeleteConfirm: true });
  },

  cancelDelete() {
    this.setData({ showDeleteConfirm: false });
  },

  doDelete() {
    const { accountId } = this.data;
    deleteBillAccount(accountId);
    wx.showToast({ title: '已删除', icon: 'success' });
    wx.navigateBack();
  },

  // ==================== 删除流水 ====================
  onTxLongPress(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '删除记录',
      content: '删除后账户余额将回滚，是否继续？',
      confirmColor: '#FA5151',
      success: (res) => {
        if (res.confirm) {
          deleteBillTransaction(id);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.loadAccount();
          this.loadTransactions();
          this.loadSummary();
        }
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '储存记账',
      path: '/pages/savings/savings'
    };
  },

  noop() {}
});
