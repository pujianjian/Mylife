const {
  ASSET_CATEGORIES,
  getAccountById,
  addTransaction,
  deleteTransaction,
  deleteAssetAccount,
  updateAssetAccount
} = require('../../utils/storage');

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

const formatMoney = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (isoStr) => {
  const d = new Date(isoStr);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${m}月${day}日`;
};

const formatWeekday = (isoStr) => {
  const d = new Date(isoStr);
  return WEEKDAYS[d.getDay()];
};

const formatMonthLabel = (isoStr) => {
  const d = new Date(isoStr);
  return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月`;
};

Page({
  data: {
    accountId: null,
    account: null,
    categoryInfo: null,

    // 头部
    displayName: '',
    displayAmount: '0.00',
    typeLabel: '',

    // 收支明细
    txGroups: [],       // 按 月 分组
    currentMonthIndex: 0,
    monthOptions: [],
    showMonthPicker: false,

    // 调整弹窗
    showAdjustModal: false,
    adjustMode: 'increment',  // 'increment' 增量 | 'absolute' 全量
    adjustAmount: '',
    adjustNote: '',
    adjustPreview: '',        // 全量模式下预览变动金额
    adjustPreviewClass: 'positive',

    // 操作菜单
    showActionSheet: false
  },

  onLoad(options) {
    const id = parseInt(options.id);
    if (!id) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    this.setData({ accountId: id });
    this.loadDetail();
  },

  onShow() {
    if (this.data.accountId) {
      this.loadDetail();
    }
  },

  loadDetail() {
    const account = getAccountById(this.data.accountId);
    if (!account) {
      wx.showToast({ title: '账户不存在', icon: 'none' });
      return;
    }

    const cat = ASSET_CATEGORIES.find(c => c.key === account.category) || ASSET_CATEGORIES[5];
    let typeLabel = cat.name;
    if (cat.type === 'liability') typeLabel = '欠款';
    else if (cat.type === 'claim') typeLabel = '债权';
    else typeLabel = cat.name;

    // 构建交易分组（按月倒序）
    const txList = (account.transactions || []).slice().sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const monthMap = {};
    txList.forEach(tx => {
      const key = formatMonthLabel(tx.date);
      if (!monthMap[key]) {
        monthMap[key] = { label: key, items: [] };
      }
      monthMap[key].items.push({
        ...tx,
        displayDate: formatDate(tx.date),
        weekday: formatWeekday(tx.date),
        changeFormatted: (tx.changeAmount >= 0 ? '+' : '') + formatMoney(tx.changeAmount),
        beforeFmt: formatMoney(tx.beforeAmount),
        afterFmt: formatMoney(tx.afterAmount)
      });
    });

    const txGroups = Object.values(monthMap);
    const monthOptions = txGroups.map(g => g.label);

    this.setData({
      account,
      categoryInfo: cat,
      displayName: account.name || '未命名账户',
      displayAmount: formatMoney(account.amount),
      typeLabel,
      txGroups,
      monthOptions,
      currentMonthIndex: 0,
      currentMonthItems: txGroups.length > 0 ? (txGroups[0].items || []) : []
    });

    // 设置导航栏标题
    wx.setNavigationBarTitle({ title: account.name || '资产详情' });
  },

  // ========== 月份切换 ==========
  onMonthPickerTap() {
    if (this.data.monthOptions.length <= 1) return;
    wx.showActionSheet({
      itemList: this.data.monthOptions,
      success: (res) => {
        const idx = res.tapIndex;
        const items = this.data.txGroups.length > idx ? (this.data.txGroups[idx].items || []) : [];
        this.setData({ currentMonthIndex: idx, currentMonthItems: items });
      }
    });
  },

  // ========== 调整金额 ==========
  openAdjustModal() {
    this.setData({
      showAdjustModal: true,
      adjustMode: 'increment',
      adjustAmount: '',
      adjustNote: '',
      adjustPreview: ''
    });
  },

  closeAdjustModal() {
    this.setData({ showAdjustModal: false });
  },

  preventBubble() {},

  onAdjustModeChange(e) {
    const mode = e.currentTarget.dataset.mode;
    if (mode === this.data.adjustMode) return;
    this.setData({ adjustMode: mode, adjustAmount: '', adjustPreview: '' });
  },

  onAdjustInput(e) {
    let val = e.detail.value;
    if (/^-?\d*\.?\d{0,2}$/.test(val)) {
      const preview = this.calcPreview(val);
      const previewClass = preview && preview.charAt(0) === '-' ? 'negative' : 'positive';
      this.setData({ adjustAmount: val, adjustPreview: preview, adjustPreviewClass: previewClass });
    }
  },

  calcPreview(val) {
    if (this.data.adjustMode !== 'absolute') return '';
    const target = parseFloat(val);
    if (isNaN(target)) return '';
    const current = parseFloat(this.data.account.amount) || 0;
    const diff = target - current;
    const sign = diff >= 0 ? '+' : '';
    return `${sign}${diff.toFixed(2)}`;
  },

  onAdjustNoteInput(e) {
    this.setData({ adjustNote: e.detail.value });
  },

  confirmAdjust() {
    const inputVal = parseFloat(this.data.adjustAmount);
    if (isNaN(inputVal)) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }

    let changeAmount;
    if (this.data.adjustMode === 'absolute') {
      // 全量模式：差额 = 目标金额 - 当前金额
      const current = parseFloat(this.data.account.amount) || 0;
      changeAmount = inputVal - current;
    } else {
      // 增量模式：输入值即为变动额
      changeAmount = inputVal;
    }

    if (Math.abs(changeAmount) < 0.001) {
      wx.showToast({ title: '金额无变化', icon: 'none' });
      return;
    }

    const note = (this.data.adjustNote.trim() || '手动调整').trim();

    addTransaction(this.data.accountId, {
      changeAmount,
      type: 'adjust',
      note,
      txNote: note
    });

    wx.showToast({ title: '调整成功', icon: 'success' });
    this.setData({ showAdjustModal: false });
    this.loadDetail();
  },

  // ========== 删除变动记录 ==========
  onDeleteTx(e) {
    const txId = parseInt(e.currentTarget.dataset.txd);
    wx.showModal({
      title: '确认删除',
      content: '删除后将回滚该笔变动的金额，是否继续？',
      confirmColor: '#FA5151',
      success: (res) => {
        if (res.confirm) {
          deleteTransaction(this.data.accountId, txId);
          wx.showToast({ title: '已删除并回滚', icon: 'success' });
          this.loadDetail();
        }
      }
    });
  },

  // ========== 底部操作栏 ==========
  onTransferTap() {
    wx.showToast({ title: '转账功能开发中', icon: 'none' });
  },

  onSettingsTap() {
    // 跳转编辑（复用 savings 页面的弹窗逻辑不太方便，这里直接用简单方式）
    const { account } = this.data;
    if (!account) return;

    wx.showModal({
      title: '编辑账户',
      editable: true,
      placeholderText: account.name,
      content: account.name,
      success: (res) => {
        if (res.confirm && res.content && res.content !== account.name) {
          updateAssetAccount(account.id, { name: res.content.trim(), txType: 'note', txNote: '修改名称' });
          wx.showToast({ title: '已更新', icon: 'success' });
          this.loadDetail();
        }
      }
    });
  },

  onDeleteAssetTap() {
    wx.showModal({
      title: '确认删除资产',
      content: `确定要删除「${this.data.displayName}」吗？所有变动记录将一并清除。`,
      confirmText: '删除',
      confirmColor: '#FA5151',
      success: (res) => {
        if (res.confirm) {
          deleteAssetAccount(this.data.accountId);
          wx.showToast({ title: '已删除', icon: 'success' });
          setTimeout(() => wx.navigateBack(), 1000);
        }
      }
    });
  }
});
