const {
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
  addFamilyAsset,
  updateFamilyAsset,
  deleteFamilyAsset,
  getFamilySummary,
  getFamilyAssetsByType,
  getFamilyIncomesByType,
  getFamilyExpensesByType,
  getFamilySnapshots
} = require('../../utils/storage');

const formatMoney = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (date = new Date()) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

Page({
  data: {
    activeTab: 0,
    tabs: [
      { label: '收入', icon: '💰' },
      { label: '开支', icon: '🏠' },
      { label: '资产', icon: '📊' },
      { label: '趋势', icon: '📈' }
    ],

    // 概览
    summary: {
      monthIncome: '0.00',
      monthExpense: '0.00',
      monthBalance: '0.00',
      totalAssets: '0.00',
      totalLiabilities: '0.00',
      netWorth: '0.00'
    },

    // 收入 Tab
    incomeGroups: [],
    incomeCycle: 'month',
    incomeCycleOptions: [
      { key: 'month', name: '本月' },
      { key: 'year', name: '本年' },
      { key: 'all', name: '全部' }
    ],

    // 开支 Tab
    expenseGroups: [],
    expenseCycle: 'month',
    expenseCycleOptions: [
      { key: 'month', name: '本月' },
      { key: 'year', name: '本年' },
      { key: 'all', name: '全部' }
    ],

    // 资产 Tab
    assetGroups: [],

    // 趋势 Tab
    chartRange: 'all',
    chartRanges: [
      { key: 'year', name: '本年' },
      { key: 'all', name: '全部' }
    ],
    incomeTrendData: [],
    incomeLines: [],
    expenseTrendData: [],
    assetTrendData: [],
    liabilityTrendData: [],
    netWorthTrendData: [],

    // 弹窗
    modalType: '',
    modalTitle: '',
    editingId: null,

    // 收入表单
    incomeForm: {
      typeIndex: 0,
      sourceIndex: 0,
      amount: '',
      date: formatDate(),
      recurring: false,
      note: ''
    },
    incomeTypeOptions: [],
    incomeSourceOptions: [],

    // 开支表单
    expenseForm: {
      typeIndex: 0,
      payerIndex: 0,
      amount: '',
      date: formatDate(),
      recurring: false,
      note: ''
    },
    expenseTypeOptions: [],
    expensePayerOptions: [],

    // 资产表单
    assetForm: {
      typeIndex: 0,
      name: '',
      amount: '',
      note: ''
    },
    assetTypeOptions: []
  },

  onLoad() {
    this.setData({
      incomeTypeOptions: FAMILY_INCOME_TYPES.map(t => t.name),
      incomeSourceOptions: FAMILY_INCOME_SOURCES.map(s => s.name),
      expenseTypeOptions: FAMILY_EXPENSE_TYPES.map(t => t.name),
      expensePayerOptions: FAMILY_EXPENSE_PAYERS.map(p => p.name),
      assetTypeOptions: FAMILY_ASSET_TYPES.map(t => t.name)
    });
    this.loadSummary();
    this.loadIncomeTab();
    this.loadExpenseTab();
    this.loadAssetTab();
    this.loadTrendTab();
  },

  onShow() {
    this.loadSummary();
    this.loadCurrentTab();
  },

  noop() {},

  // ==================== Tab ====================
  onTabChange(e) {
    const idx = e.currentTarget.dataset.index;
    if (idx === this.data.activeTab) return;
    this.setData({ activeTab: idx }, () => this.loadCurrentTab());
  },

  loadCurrentTab() {
    const { activeTab } = this.data;
    if (activeTab === 0) this.loadIncomeTab();
    else if (activeTab === 1) this.loadExpenseTab();
    else if (activeTab === 2) this.loadAssetTab();
    else if (activeTab === 3) this.loadTrendTab();
    this.loadSummary();
  },

  // ==================== 概览 ====================
  loadSummary() {
    const s = getFamilySummary();
    this.setData({
      summary: {
        monthIncome: formatMoney(s.monthIncome),
        monthExpense: formatMoney(s.monthExpense),
        monthBalance: formatMoney(s.monthBalance),
        totalAssets: formatMoney(s.totalAssets),
        totalLiabilities: formatMoney(s.totalLiabilities),
        netWorth: formatMoney(s.netWorth)
      }
    });
  },

  // ==================== 收入 Tab ====================
  onIncomeCycleChange(e) {
    const cycle = e.currentTarget.dataset.cycle;
    this.setData({ incomeCycle: cycle }, () => this.loadIncomeTab());
  },

  loadIncomeTab() {
    const { incomeCycle } = this.data;
    const grouped = getFamilyIncomesByType(incomeCycle);
    const incomeGroups = FAMILY_INCOME_TYPES.map(type => {
      const g = grouped[type.key] || { items: [], total: 0 };
      return {
        ...type,
        items: g.items.map(r => ({
          ...r,
          amountStr: formatMoney(r.amount),
          sourceLabel: (FAMILY_INCOME_SOURCES.find(s => s.key === r.source) || {}).name || '家庭',
          dateShort: (r.date || '').slice(5)
        })),
        totalStr: formatMoney(g.total),
        count: g.items.length
      };
    }).filter(g => g.count > 0);

    this.setData({ incomeGroups });
  },

  openAddIncomeModal() {
    this.setData({
      modalType: 'income',
      modalTitle: '添加收入',
      editingId: null,
      incomeForm: {
        typeIndex: 0,
        sourceIndex: 0,
        amount: '',
        date: formatDate(),
        recurring: false,
        note: ''
      }
    });
  },

  openEditIncomeModal(e) {
    const id = e.currentTarget.dataset.id;
    const incomes = getFamilyIncomes();
    const item = incomes.find(r => r.id === id);
    if (!item) return;
    const typeIndex = FAMILY_INCOME_TYPES.findIndex(t => t.key === item.type);
    const sourceIndex = FAMILY_INCOME_SOURCES.findIndex(s => s.key === item.source);
    this.setData({
      modalType: 'income',
      modalTitle: '编辑收入',
      editingId: id,
      incomeForm: {
        typeIndex: typeIndex > -1 ? typeIndex : 0,
        sourceIndex: sourceIndex > -1 ? sourceIndex : 0,
        amount: String(item.amount),
        date: item.date || formatDate(),
        recurring: !!item.recurring,
        note: item.note || ''
      }
    });
  },

  onIncomeTypeChange(e) {
    this.setData({ 'incomeForm.typeIndex': parseInt(e.detail.value) });
  },

  onIncomeSourceChange(e) {
    this.setData({ 'incomeForm.sourceIndex': parseInt(e.detail.value) });
  },

  onIncomeAmountInput(e) {
    this.setData({ 'incomeForm.amount': e.detail.value });
  },

  onIncomeDateChange(e) {
    this.setData({ 'incomeForm.date': e.detail.value });
  },

  onIncomeRecurringChange(e) {
    this.setData({ 'incomeForm.recurring': e.detail.value });
  },

  onIncomeNoteInput(e) {
    this.setData({ 'incomeForm.note': e.detail.value });
  },

  saveIncome() {
    const { incomeForm, editingId } = this.data;
    const amount = parseFloat(incomeForm.amount);
    if (isNaN(amount) || amount <= 0) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }
    const payload = {
      type: FAMILY_INCOME_TYPES[incomeForm.typeIndex].key,
      source: FAMILY_INCOME_SOURCES[incomeForm.sourceIndex].key,
      amount,
      date: incomeForm.date,
      recurring: incomeForm.recurring,
      note: incomeForm.note.trim()
    };
    if (editingId) {
      updateFamilyIncome(editingId, payload);
      wx.showToast({ title: '更新成功', icon: 'success' });
    } else {
      addFamilyIncome(payload);
      wx.showToast({ title: '添加成功', icon: 'success' });
    }
    this.closeModal();
    this.loadSummary();
    this.loadIncomeTab();
    this.loadTrendTab();
  },

  deleteIncome() {
    const { editingId } = this.data;
    if (!editingId) return;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，是否继续？',
      confirmColor: '#FA5151',
      success: (res) => {
        if (res.confirm) {
          deleteFamilyIncome(editingId);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.closeModal();
          this.loadSummary();
          this.loadIncomeTab();
          this.loadTrendTab();
        }
      }
    });
  },

  // ==================== 开支 Tab ====================
  onExpenseCycleChange(e) {
    const cycle = e.currentTarget.dataset.cycle;
    this.setData({ expenseCycle: cycle }, () => this.loadExpenseTab());
  },

  loadExpenseTab() {
    const { expenseCycle } = this.data;
    const grouped = getFamilyExpensesByType(expenseCycle);
    const expenseGroups = FAMILY_EXPENSE_TYPES.map(type => {
      const g = grouped[type.key] || { items: [], total: 0 };
      return {
        ...type,
        items: g.items.map(r => ({
          ...r,
          amountStr: formatMoney(r.amount),
          payerLabel: (FAMILY_EXPENSE_PAYERS.find(p => p.key === r.payer) || {}).name || '共同',
          dateShort: (r.date || '').slice(5)
        })),
        totalStr: formatMoney(g.total),
        count: g.items.length
      };
    }).filter(g => g.count > 0);

    this.setData({ expenseGroups });
  },

  openAddExpenseModal() {
    this.setData({
      modalType: 'expense',
      modalTitle: '添加开支',
      editingId: null,
      expenseForm: {
        typeIndex: 0,
        payerIndex: 0,
        amount: '',
        date: formatDate(),
        recurring: false,
        note: ''
      }
    });
  },

  openEditExpenseModal(e) {
    const id = e.currentTarget.dataset.id;
    const expenses = getFamilyExpenses();
    const item = expenses.find(r => r.id === id);
    if (!item) return;
    const typeIndex = FAMILY_EXPENSE_TYPES.findIndex(t => t.key === item.type);
    const payerIndex = FAMILY_EXPENSE_PAYERS.findIndex(p => p.key === item.payer);
    this.setData({
      modalType: 'expense',
      modalTitle: '编辑开支',
      editingId: id,
      expenseForm: {
        typeIndex: typeIndex > -1 ? typeIndex : 0,
        payerIndex: payerIndex > -1 ? payerIndex : 0,
        amount: String(item.amount),
        date: item.date || formatDate(),
        recurring: !!item.recurring,
        note: item.note || ''
      }
    });
  },

  onExpenseTypeChange(e) {
    this.setData({ 'expenseForm.typeIndex': parseInt(e.detail.value) });
  },

  onExpensePayerChange(e) {
    this.setData({ 'expenseForm.payerIndex': parseInt(e.detail.value) });
  },

  onExpenseAmountInput(e) {
    this.setData({ 'expenseForm.amount': e.detail.value });
  },

  onExpenseDateChange(e) {
    this.setData({ 'expenseForm.date': e.detail.value });
  },

  onExpenseRecurringChange(e) {
    this.setData({ 'expenseForm.recurring': e.detail.value });
  },

  onExpenseNoteInput(e) {
    this.setData({ 'expenseForm.note': e.detail.value });
  },

  saveExpense() {
    const { expenseForm, editingId } = this.data;
    const amount = parseFloat(expenseForm.amount);
    if (isNaN(amount) || amount <= 0) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }
    const payload = {
      type: FAMILY_EXPENSE_TYPES[expenseForm.typeIndex].key,
      payer: FAMILY_EXPENSE_PAYERS[expenseForm.payerIndex].key,
      amount,
      date: expenseForm.date,
      recurring: expenseForm.recurring,
      note: expenseForm.note.trim()
    };
    if (editingId) {
      updateFamilyExpense(editingId, payload);
      wx.showToast({ title: '更新成功', icon: 'success' });
    } else {
      addFamilyExpense(payload);
      wx.showToast({ title: '添加成功', icon: 'success' });
    }
    this.closeModal();
    this.loadSummary();
    this.loadExpenseTab();
    this.loadTrendTab();
  },

  deleteExpense() {
    const { editingId } = this.data;
    if (!editingId) return;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，是否继续？',
      confirmColor: '#FA5151',
      success: (res) => {
        if (res.confirm) {
          deleteFamilyExpense(editingId);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.closeModal();
          this.loadSummary();
          this.loadExpenseTab();
          this.loadTrendTab();
        }
      }
    });
  },

  // ==================== 资产 Tab ====================
  loadAssetTab() {
    const grouped = getFamilyAssetsByType();
    const assetGroups = FAMILY_ASSET_TYPES.map(type => {
      const g = grouped[type.key] || { assets: [], total: 0 };
      return {
        ...type,
        assets: g.assets.map(a => ({
          ...a,
          amountStr: formatMoney(a.amount)
        })),
        totalStr: formatMoney(g.total),
        count: g.assets.length
      };
    }).filter(g => g.count > 0);

    this.setData({ assetGroups });
  },

  openAddAssetModal() {
    this.setData({
      modalType: 'asset',
      modalTitle: '添加资产',
      editingId: null,
      assetForm: {
        typeIndex: 0,
        name: '',
        amount: '',
        note: ''
      }
    });
  },

  openEditAssetModal(e) {
    const id = e.currentTarget.dataset.id;
    const assets = getFamilyAssets();
    const item = assets.find(a => a.id === id);
    if (!item) return;
    const typeIndex = FAMILY_ASSET_TYPES.findIndex(t => t.key === item.type);
    this.setData({
      modalType: 'asset',
      modalTitle: '编辑资产',
      editingId: id,
      assetForm: {
        typeIndex: typeIndex > -1 ? typeIndex : 0,
        name: item.name,
        amount: String(item.amount),
        note: item.note || ''
      }
    });
  },

  onAssetTypeChange(e) {
    this.setData({ 'assetForm.typeIndex': parseInt(e.detail.value) });
  },

  onAssetNameInput(e) {
    this.setData({ 'assetForm.name': e.detail.value });
  },

  onAssetAmountInput(e) {
    this.setData({ 'assetForm.amount': e.detail.value });
  },

  onAssetNoteInput(e) {
    this.setData({ 'assetForm.note': e.detail.value });
  },

  saveAsset() {
    const { assetForm, editingId } = this.data;
    const name = assetForm.name.trim();
    const amount = parseFloat(assetForm.amount);
    if (!name) {
      wx.showToast({ title: '请输入名称', icon: 'none' });
      return;
    }
    if (isNaN(amount)) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }
    const payload = {
      type: FAMILY_ASSET_TYPES[assetForm.typeIndex].key,
      name,
      amount,
      note: assetForm.note.trim()
    };
    if (editingId) {
      updateFamilyAsset(editingId, payload);
      wx.showToast({ title: '更新成功', icon: 'success' });
    } else {
      addFamilyAsset(payload);
      wx.showToast({ title: '添加成功', icon: 'success' });
    }
    this.closeModal();
    this.loadSummary();
    this.loadAssetTab();
    this.loadTrendTab();
  },

  deleteAsset() {
    const { editingId } = this.data;
    if (!editingId) return;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，是否继续？',
      confirmColor: '#FA5151',
      success: (res) => {
        if (res.confirm) {
          deleteFamilyAsset(editingId);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.closeModal();
          this.loadSummary();
          this.loadAssetTab();
          this.loadTrendTab();
        }
      }
    });
  },

  // ==================== 趋势 Tab ====================
  onChartRangeChange(e) {
    const range = e.currentTarget.dataset.range;
    this.setData({ chartRange: range }, () => this.loadTrendTab());
  },

  loadTrendTab() {
    const { chartRange } = this.data;
    const today = new Date().toISOString().split('T')[0];
    const currentYear = today.slice(0, 4);

    let snapshots = getFamilySnapshots();
    if (chartRange === 'year') {
      snapshots = snapshots.filter(s => s.month.startsWith(currentYear));
    }
    snapshots.sort((a, b) => a.month.localeCompare(b.month));

    if (snapshots.length === 0) {
      const s = getFamilySummary();
      const currentMonth = today.slice(0, 7);
      snapshots = [{
        month: currentMonth,
        income: s.monthIncome,
        expense: s.monthExpense,
        assets: s.totalAssets,
        liabilities: s.totalLiabilities,
        netWorth: s.netWorth
      }];
    }

    const incomeTrendData = snapshots.map(s => ({ month: s.month, value: s.income || 0 }));
    const expenseTrendData = snapshots.map(s => ({ month: s.month, value: s.expense || 0 }));
    const assetTrendData = snapshots.map(s => ({ month: s.month, value: s.assets || 0 }));
    const liabilityTrendData = snapshots.map(s => ({ month: s.month, value: s.liabilities || 0 }));
    const netWorthTrendData = snapshots.map(s => ({ month: s.month, value: s.netWorth || 0 }));

    // 构建收入多线趋势数据（从实际收入记录按月按来源汇总）
    const allIncomes = getFamilyIncomes();
    const monthData = {};
    allIncomes.forEach(record => {
      const month = (record.date || '').slice(0, 7);
      if (!month) return;
      if (chartRange === 'year' && !month.startsWith(currentYear)) return;
      if (!monthData[month]) monthData[month] = { husband: 0, wife: 0, family: 0 };
      const source = record.source || 'family';
      monthData[month][source] = (monthData[month][source] || 0) + (parseFloat(record.amount) || 0);
    });

    const incomeMonths = Object.keys(monthData).sort();
    const incomeLines = incomeMonths.length > 0 ? [
      {
        name: '男方',
        color: '#3B82F6',
        data: incomeMonths.map(m => ({ month: m, value: parseFloat((monthData[m].husband || 0).toFixed(2)) }))
      },
      {
        name: '女方',
        color: '#EC4899',
        data: incomeMonths.map(m => ({ month: m, value: parseFloat((monthData[m].wife || 0).toFixed(2)) }))
      },
      {
        name: '家庭共同',
        color: '#10B981',
        data: incomeMonths.map(m => ({ month: m, value: parseFloat((monthData[m].family || 0).toFixed(2)) }))
      },
      {
        name: '合计',
        color: '#F59E0B',
        data: incomeMonths.map(m => ({
          month: m,
          value: parseFloat(((monthData[m].husband || 0) + (monthData[m].wife || 0) + (monthData[m].family || 0)).toFixed(2))
        }))
      }
    ] : [];

    this.setData({
      incomeTrendData,
      incomeLines,
      expenseTrendData,
      assetTrendData,
      liabilityTrendData,
      netWorthTrendData
    });
  },

  // ==================== 弹窗 ====================
  closeModal() {
    this.setData({ modalType: '', editingId: null });
  },

  onShareAppMessage() {
    return { title: '家庭记账', path: '/pages/family/family' };
  }
});
