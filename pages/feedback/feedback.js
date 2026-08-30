const {
  FEEDBACK_CATEGORIES,
  FEEDBACK_PRIORITIES,
  FEEDBACK_STATUSES,
  getFeedbackRequests,
  addFeedbackRequest,
  updateFeedbackRequest,
  deleteFeedbackRequest,
  getFeedbackSummary
} = require('../../utils/storage');

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const h = d.getHours().toString().padStart(2, '0');
  const min = d.getMinutes().toString().padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}`;
};

const CATEGORY_NAMES = FEEDBACK_CATEGORIES.map(c => c.name);
const PRIORITY_NAMES = FEEDBACK_PRIORITIES.map(p => p.name);
const STATUS_NAMES = FEEDBACK_STATUSES.map(s => s.name);

// hex颜色转rgba背景色
const hexToRgba = (hex, alpha) => {
  if (!hex || hex.length < 7) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

Page({
  data: {
    // 列表
    list: [],
    summary: {},
    // 筛选
    filterStatus: '',
    filterCategory: '',
    // 弹窗
    showModal: false,
    isEditing: false,
    editingId: null,
    form: {
      title: '',
      category: 'feature',
      priority: 'medium',
      status: 'pending',
      description: ''
    },
    // 预计算标签
    categoryLabel: '功能建议',
    categoryIndex: 0,
    priorityLabel: '中',
    priorityIndex: 1,
    statusLabel: '待处理',
    statusIndex: 0,
    // picker 选项
    categoryNames: CATEGORY_NAMES,
    priorityNames: PRIORITY_NAMES,
    statusNames: STATUS_NAMES,
    FEEDBACK_CATEGORIES,
    // 统计筛选
    filterTabs: [
      { key: '', name: '全部' },
      { key: 'pending', name: '待处理' },
      { key: 'in_progress', name: '进行中' },
      { key: 'done', name: '已完成' },
      { key: 'closed', name: '已关闭' }
    ],
    activeFilter: ''
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const summary = getFeedbackSummary();
    const filters = {};
    if (this.data.activeFilter) filters.status = this.data.activeFilter;
    const list = getFeedbackRequests(filters).map(item => {
      const catColor = item.color || '#6B7280';
      const priColor = item.priorityColor || '#F59E0B';
      const staColor = item.statusColor || '#6B7280';
      return {
        ...item,
        formattedTime: formatDate(item.createTime),
        catName: item.categoryName || '其他',
        catColor,
        catBgColor: hexToRgba(catColor, 0.1),
        priName: item.priorityName || '中',
        priColor,
        priBgColor: hexToRgba(priColor, 0.1),
        statusName: item.statusName || '待处理',
        statusColor: staColor,
        statusBgColor: hexToRgba(staColor, 0.1)
      };
    });
    this.setData({ summary, list });
  },

  // 筛选 Tab
  onFilterTab(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ activeFilter: key }, () => {
      this.loadData();
    });
  },

  // 新增
  openAddModal() {
    this.setData({
      showModal: true,
      isEditing: false,
      editingId: null,
      form: {
        title: '',
        category: 'feature',
        priority: 'medium',
        status: 'pending',
        description: ''
      },
      categoryLabel: '功能建议',
      categoryIndex: 0,
      priorityLabel: '中',
      priorityIndex: 1,
      statusLabel: '待处理',
      statusIndex: 0
    });
  },

  // 编辑
  openEditModal(e) {
    const id = e.currentTarget.dataset.id;
    const item = getFeedbackRequests().find(r => r.id === id);
    if (!item) return;
    const catIdx = FEEDBACK_CATEGORIES.findIndex(c => c.key === item.category);
    const priIdx = FEEDBACK_PRIORITIES.findIndex(p => p.key === item.priority);
    const staIdx = FEEDBACK_STATUSES.findIndex(s => s.key === item.status);
    this.setData({
      showModal: true,
      isEditing: true,
      editingId: id,
      form: {
        title: item.title,
        category: item.category,
        priority: item.priority,
        status: item.status,
        description: item.description
      },
      categoryLabel: catIdx >= 0 ? FEEDBACK_CATEGORIES[catIdx].name : '功能建议',
      categoryIndex: catIdx >= 0 ? catIdx : 0,
      priorityLabel: priIdx >= 0 ? FEEDBACK_PRIORITIES[priIdx].name : '中',
      priorityIndex: priIdx >= 0 ? priIdx : 1,
      statusLabel: staIdx >= 0 ? FEEDBACK_STATUSES[staIdx].name : '待处理',
      statusIndex: staIdx >= 0 ? staIdx : 0
    });
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  noop() {},

  // 表单输入
  onTitleInput(e) {
    this.setData({ 'form.title': e.detail.value });
  },

  onDescInput(e) {
    this.setData({ 'form.description': e.detail.value });
  },

  onCategoryChange(e) {
    const idx = parseInt(e.detail.value);
    if (idx >= 0 && idx < FEEDBACK_CATEGORIES.length) {
      const cat = FEEDBACK_CATEGORIES[idx];
      this.setData({
        'form.category': cat.key,
        categoryLabel: cat.name,
        categoryIndex: idx
      });
    }
  },

  onPriorityChange(e) {
    const idx = parseInt(e.detail.value);
    if (idx >= 0 && idx < FEEDBACK_PRIORITIES.length) {
      const pri = FEEDBACK_PRIORITIES[idx];
      this.setData({
        'form.priority': pri.key,
        priorityLabel: pri.name,
        priorityIndex: idx
      });
    }
  },

  onStatusChange(e) {
    const idx = parseInt(e.detail.value);
    if (idx >= 0 && idx < FEEDBACK_STATUSES.length) {
      const sta = FEEDBACK_STATUSES[idx];
      this.setData({
        'form.status': sta.key,
        statusLabel: sta.name,
        statusIndex: idx
      });
    }
  },

  // 保存
  onSave() {
    const { form, isEditing, editingId } = this.data;
    if (!form.title.trim()) {
      wx.showToast({ title: '请输入需求标题', icon: 'none' });
      return;
    }
    if (isEditing) {
      updateFeedbackRequest(editingId, form);
      wx.showToast({ title: '已更新', icon: 'success' });
    } else {
      addFeedbackRequest(form);
      wx.showToast({ title: '已添加', icon: 'success' });
    }
    this.setData({ showModal: false });
    this.loadData();
  },

  // 删除
  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复，确定删除这条需求？',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          deleteFeedbackRequest(id);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.loadData();
        }
      }
    });
  },

  // 快速修改状态
  onQuickStatus(e) {
    const id = e.currentTarget.dataset.id;
    const status = e.currentTarget.dataset.status;
    updateFeedbackRequest(id, { status });
    wx.showToast({ title: '状态已更新', icon: 'success' });
    this.loadData();
  },

  onShareAppMessage() {
    return {
      title: '健康理财小助手',
      path: '/pages/index/index'
    };
  }
});