// pages/car/other/other.js
const { CAR_EXPENSE_TYPES, addCarExpense, updateCarExpense, getCarExpenseById } = require('../../../utils/storage');

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function buildTypeList(types, selectedKey) {
  return types.map(t => {
    const active = t.key === selectedKey;
    return {
      key: t.key,
      name: t.name,
      icon: t.icon,
      color: t.color,
      itemClass: 'type-item' + (active ? ' active' : ''),
      itemStyle: active
        ? `border-color: ${t.color}; background: ${t.color}15;`
        : '',
      iconStyle: `color: ${active ? t.color : '#6B7280'};`,
      nameClass: 'type-name' + (active ? ' active' : '')
    };
  });
}

Page({
  data: {
    types: buildTypeList(CAR_EXPENSE_TYPES, 'parking'),
    selectedType: 'parking',
    amount: '',
    date: todayStr(),
    note: '',
    editId: null,
    formValid: false,
    saveBtnClass: 'save-btn'
  },

  onLoad(options) {
    if (options.id) {
      const item = getCarExpenseById(parseInt(options.id, 10));
      if (item) {
        this.setData({
          editId: item.id,
          selectedType: item.type || 'other',
          amount: item.amount ? item.amount.toString() : '',
          date: item.date || todayStr(),
          note: item.note || ''
        });
        wx.setNavigationBarTitle({ title: '编辑用车支出' });
        this.refreshTypeList();
      }
    }
  },

  refreshTypeList() {
    this.setData({ types: buildTypeList(CAR_EXPENSE_TYPES, this.data.selectedType) });
  },

  onShow() {
    this.validate();
  },

  onTypeSelect(e) {
    const { type } = e.currentTarget.dataset;
    if (type === this.data.selectedType) return;

    // 油费/新能源 → 跳转到能源明细页（记油量×油价 / 度数×电价）
    if (type === 'fuel' || type === 'ev') {
      const url = type === 'ev'
        ? '/pages/car/energy/energy?category=ev'
        : '/pages/car/energy/energy?category=fuel';
      wx.navigateTo({ url });
      return;
    }

    this.setData({ selectedType: type }, () => this.refreshTypeList());
  },

  onPickDate(e) {
    this.setData({ date: e.detail.value }, () => this.validate());
  },

  onAmountInput(e) {
    this.setData({ amount: e.detail.value }, () => this.validate());
  },

  onNoteInput(e) {
    this.setData({ note: e.detail.value });
  },

  validate() {
    const valid = parseFloat(this.data.amount) > 0 && !!this.data.date;
    this.setData({ formValid: valid, saveBtnClass: 'save-btn' + (valid ? ' active' : '') });
  },

  getCurrentTypeMeta() {
    return this.data.types.find(t => t.key === this.data.selectedType) || this.data.types[this.data.types.length - 1];
  },

  onSave() {
    if (!this.data.formValid) {
      wx.showToast({ title: '请填写金额', icon: 'none' });
      return;
    }
    const meta = this.getCurrentTypeMeta();
    const payload = {
      type: meta.key,
      amount: parseFloat(this.data.amount) || 0,
      date: this.data.date,
      note: (this.data.note || '').slice(0, 10)
    };

    if (this.data.editId) {
      const ok = updateCarExpense(this.data.editId, payload);
      if (ok) {
        wx.showToast({ title: '已更新', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 600);
      } else {
        wx.showToast({ title: '更新失败', icon: 'none' });
      }
    } else {
      const r = addCarExpense(payload);
      if (r) {
        wx.showToast({ title: '保存成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 600);
      } else {
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    }
  }
});
