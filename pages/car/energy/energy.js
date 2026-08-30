// pages/car/energy/energy.js
const { addCarExpense, updateCarExpense, getCarExpenseById } = require('../../../utils/storage');

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatDateLabel = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.replace(/-/g, '/');
};

Page({
  data: {
    // 类别：fuel | ev
    category: 'fuel',
    mode: 'total', // total | detail
    date: todayStr(),
    amount: '',
    fuelLiters: '',
    fuelPrice: '',
    evKwh: '',
    evPrice: '',
    note: '',
    editId: null,
    formValid: false
  },

  onLoad(options) {
    // 支持通过参数指定类别
    if (options.category === 'ev') {
      this.setData({ category: 'ev' });
    } else if (options.category === 'fuel') {
      this.setData({ category: 'fuel' });
    }

    if (options.id) {
      // 编辑模式
      const item = getCarExpenseById(parseInt(options.id, 10));
      if (item) {
        const isDetail = (item.fuelLiters && item.fuelPrice) || (item.evKwh && item.evPrice);
        this.setData({
          editId: item.id,
          category: item.type === 'ev' ? 'ev' : 'fuel',
          mode: isDetail ? 'detail' : 'total',
          date: item.date || todayStr(),
          amount: item.amount ? item.amount.toString() : '',
          fuelLiters: item.fuelLiters ? item.fuelLiters.toString() : '',
          fuelPrice: item.fuelPrice ? item.fuelPrice.toString() : '',
          evKwh: item.evKwh ? item.evKwh.toString() : '',
          evPrice: item.evPrice ? item.evPrice.toString() : '',
          note: item.note || ''
        });
        wx.setNavigationBarTitle({ title: '编辑能源支出' });
      }
    }
  },

  onShow() {
    this.validate();
  },

  // 切换类别：油费 / 新能源
  onCategorySwap() {
    const next = this.data.category === 'fuel' ? 'ev' : 'fuel';
    this.setData({ category: next }, () => this.validate());
  },

  onModeChange(e) {
    const mode = e.currentTarget.dataset.mode;
    if (mode === this.data.mode) return;
    this.setData({ mode, amount: '' }, () => this.validate());
  },

  onPickDate(e) {
    this.setData({ date: e.detail.value }, () => this.validate());
  },

  onAmountInput(e) {
    this.setData({ amount: e.detail.value }, () => this.validate());
  },

  onLitersInput(e) {
    this.setData({ fuelLiters: e.detail.value }, () => this.validate());
  },

  onPriceInput(e) {
    this.setData({ fuelPrice: e.detail.value }, () => this.validate());
  },

  onKwhInput(e) {
    this.setData({ evKwh: e.detail.value }, () => this.validate());
  },

  onEvPriceInput(e) {
    this.setData({ evPrice: e.detail.value }, () => this.validate());
  },

  onNoteInput(e) {
    this.setData({ note: e.detail.value });
  },

  validate() {
    const { mode, amount, fuelLiters, fuelPrice, evKwh, evPrice, date } = this.data;
    let valid = !!date;
    if (mode === 'total') {
      valid = valid && parseFloat(amount) > 0;
    } else {
      const liters = parseFloat(fuelLiters);
      const price = parseFloat(fuelPrice);
      const kwh = parseFloat(evKwh);
      const evp = parseFloat(evPrice);
      if (this.data.category === 'fuel') {
        valid = valid && liters > 0 && price > 0;
      } else {
        valid = valid && kwh > 0 && evp > 0;
      }
    }
    this.setData({ formValid: valid });
  },

  // 计算预览金额
  getComputedAmount() {
    const { mode, amount, fuelLiters, fuelPrice, evKwh, evPrice, category } = this.data;
    if (mode === 'total') {
      const n = parseFloat(amount);
      return isNaN(n) ? 0 : n;
    }
    if (category === 'fuel') {
      return (parseFloat(fuelLiters) || 0) * (parseFloat(fuelPrice) || 0);
    }
    return (parseFloat(evKwh) || 0) * (parseFloat(evPrice) || 0);
  },

  onSave() {
    if (!this.data.formValid) {
      wx.showToast({ title: '请完整填写', icon: 'none' });
      return;
    }
    const finalAmount = parseFloat(this.getComputedAmount().toFixed(2));
    if (finalAmount <= 0) {
      wx.showToast({ title: '金额必须大于 0', icon: 'none' });
      return;
    }

    const note = (this.data.note || '').slice(0, 10);
    const payload = {
      type: this.data.category === 'fuel' ? 'fuel' : 'ev',
      amount: finalAmount,
      date: this.data.date,
      note
    };
    if (this.data.mode === 'detail') {
      if (this.data.category === 'fuel') {
        payload.fuelLiters = parseFloat(this.data.fuelLiters) || 0;
        payload.fuelPrice = parseFloat(this.data.fuelPrice) || 0;
      } else {
        payload.evKwh = parseFloat(this.data.evKwh) || 0;
        payload.evPrice = parseFloat(this.data.evPrice) || 0;
      }
    }

    if (this.data.editId) {
      const ok = updateCarExpense(this.data.editId, payload);
      if (ok) {
        wx.showToast({ title: '已更新', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 600);
      } else {
        wx.showToast({ title: '更新失败', icon: 'none' });
      }
    } else {
      const result = addCarExpense(payload);
      if (result) {
        wx.showToast({ title: '保存成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 600);
      } else {
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    }
  }
});
