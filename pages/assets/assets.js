const {
  getPhysicalAssets,
  getPhysicalAssetById,
  addPhysicalAsset,
  updatePhysicalAsset,
  deletePhysicalAsset,
  getPhysicalAssetSummary,
  getPhysicalAssetsByStatus,
  getPhysicalAssetsByCategory,
  getPhysicalSnapshots,
  recordPhysicalSnapshot,
  getWishlist,
  addWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
  getWishlistSummary,
  ASSET_STATUS,
  ASSET_CATEGORIES
} = require('../../utils/storage');

const formatDate = (date = new Date()) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// 预计算分类/状态标签和索引，避免在 WXML 中使用嵌套三元
const CATEGORY_NAMES = ASSET_CATEGORIES.map(c => c.name);
const STATUS_NAMES = ASSET_STATUS.map(s => s.name);

const getCategoryLabel = (key) => {
  const cat = ASSET_CATEGORIES.find(c => c.key === key);
  return cat ? cat.name : '其他';
};

const getCategoryIndex = (key) => {
  const idx = ASSET_CATEGORIES.findIndex(c => c.key === key);
  return idx >= 0 ? idx : 0;
};

const getStatusLabel = (key) => {
  const st = ASSET_STATUS.find(s => s.key === key);
  return st ? st.name : '服役中';
};

const getStatusIndex = (key) => {
  const idx = ASSET_STATUS.findIndex(s => s.key === key);
  return idx >= 0 ? idx : 0;
};

Page({
  data: {
    // 当前 Tab
    currentTab: 'overview', // overview | wishlist | trend

    // 顶部 Tab 定义
    tabs: [
      { key: 'overview', name: '资产' },
      { key: 'wishlist', name: '心愿' },
      { key: 'trend', name: '趋势' }
    ],

    // ========== 有数（首页）==========
    summary: {
      total: 0,
      totalCurrent: 0,
      activeCount: 0,
      retiredCount: 0,
      soldCount: 0,
      totalCount: 0,
      totalDailyCost: 0
    },
    assets: [],
    filteredAssets: [],
    statusFilter: 'all', // all | active | retired | sold
    statusFilters: [
      { key: 'all', name: '全部' },
      { key: 'active', name: '服役中' },
      { key: 'retired', name: '已退役' },
      { key: 'sold', name: '已卖出' }
    ],

    // 添加/编辑资产弹窗
    showAssetModal: false,
    isEditing: false,
    editingAssetId: null,
    assetForm: {
      name: '',
      category: 'electronics',
      categoryLabel: '数码',
      categoryIndex: 0,
      status: 'active',
      statusLabel: '服役中',
      statusIndex: 0,
      purchaseDate: formatDate(),
      price: '',
      currentValue: '',
      icon: '',
      note: ''
    },
    // picker 选项数组
    categoryNames: CATEGORY_NAMES,
    statusNames: STATUS_NAMES,

    // ========== 心愿 ==========
    wishlistSummary: {
      total: 0,
      saved: 0,
      count: 0,
      remaining: 0
    },
    wishlist: [],

    // 添加/编辑心愿弹窗
    showWishModal: false,
    isEditingWish: false,
    editingWishId: null,
    wishForm: {
      name: '',
      targetPrice: '',
      savedAmount: '',
      icon: ''
    },

    // ========== 趋势 ==========
    trendRange: 'all',
    trendRanges: [
      { key: 'all', name: '全部' },
      { key: 'month', name: '本月' },
      { key: '7d', name: '近7天' },
      { key: '30d', name: '近30天' },
      { key: '90d', name: '近90天' },
      { key: 'year', name: '近1年' }
    ],
    trendSnapshots: [],
    trendChartData: [],
    statusChartData: [],
    purchaseChartData: [],
    dailyCostChartData: []
  },

  onLoad() {
    this.loadAllData();
  },

  onShow() {
    this.loadAllData();
  },

  loadAllData() {
    this.loadOverviewData();
    this.loadWishlistData();
    this.loadTrendData();
  },

  // ========== Tab 切换 ==========
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.currentTab) return;
    this.setData({ currentTab: tab });
  },

  // ==================== 有数（首页）====================
  loadOverviewData() {
    const summary = getPhysicalAssetSummary();
    const assets = getPhysicalAssets();
    const statusFilter = this.data.statusFilter;

    let filteredAssets = assets;
    if (statusFilter !== 'all') {
      filteredAssets = assets.filter(a => a.status === statusFilter);
    }

    // 预计算 statusLabel，避免 WXML 嵌套三元
    filteredAssets = filteredAssets.map(a => ({
      ...a,
      statusLabel: getStatusLabel(a.status)
    }));

    this.setData({
      summary,
      assets,
      filteredAssets
    });
  },

  onStatusFilterChange(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ statusFilter: filter });
    this.loadOverviewData();
  },

  openAssetModal() {
    this.setData({
      showAssetModal: true,
      isEditing: false,
      editingAssetId: null,
      assetForm: {
        name: '',
        category: 'electronics',
        categoryLabel: '数码',
        categoryIndex: 0,
        status: 'active',
        statusLabel: '服役中',
        statusIndex: 0,
        purchaseDate: formatDate(),
        price: '',
        currentValue: '',
        icon: '',
        note: ''
      }
    });
  },

  openEditAssetModal(e) {
    const id = e.currentTarget.dataset.id;
    const asset = getPhysicalAssetById(id);
    if (!asset) return;

    this.setData({
      showAssetModal: true,
      isEditing: true,
      editingAssetId: id,
      assetForm: {
        name: asset.name,
        category: asset.category,
        categoryLabel: getCategoryLabel(asset.category),
        categoryIndex: getCategoryIndex(asset.category),
        status: asset.status,
        statusLabel: getStatusLabel(asset.status),
        statusIndex: getStatusIndex(asset.status),
        purchaseDate: asset.purchaseDate,
        price: String(asset.price),
        currentValue: String(asset.currentValue),
        icon: asset.icon || '',
        note: asset.note || ''
      }
    });
  },

  closeAssetModal() {
    this.setData({ showAssetModal: false });
  },

  preventBubble() {},

  onAssetFieldChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`assetForm.${field}`]: e.detail.value
    });
  },

  onAssetDateChange(e) {
    this.setData({
      'assetForm.purchaseDate': e.detail.value
    });
  },

  onAssetCategoryChange(e) {
    const index = parseInt(e.detail.value);
    if (index >= 0 && index < ASSET_CATEGORIES.length) {
      const cat = ASSET_CATEGORIES[index];
      this.setData({
        'assetForm.category': cat.key,
        'assetForm.categoryLabel': cat.name,
        'assetForm.categoryIndex': index
      });
    }
  },

  onAssetStatusChange(e) {
    const index = parseInt(e.detail.value);
    if (index >= 0 && index < ASSET_STATUS.length) {
      const st = ASSET_STATUS[index];
      this.setData({
        'assetForm.status': st.key,
        'assetForm.statusLabel': st.name,
        'assetForm.statusIndex': index
      });
    }
  },

  saveAsset() {
    const { assetForm, isEditing, editingAssetId } = this.data;
    const { name, category, status, purchaseDate, price, currentValue, icon, note } = assetForm;

    if (!name) {
      wx.showToast({ title: '请输入资产名称', icon: 'none' });
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      wx.showToast({ title: '请输入有效价格', icon: 'none' });
      return;
    }

    const assetData = {
      name,
      category,
      status,
      purchaseDate,
      price: parseFloat(price),
      currentValue: currentValue ? parseFloat(currentValue) : parseFloat(price),
      icon,
      note
    };

    let result;
    if (isEditing) {
      result = updatePhysicalAsset(editingAssetId, assetData);
    } else {
      result = addPhysicalAsset(assetData);
    }

    if (result) {
      wx.showToast({
        title: isEditing ? '更新成功' : '添加成功',
        icon: 'success'
      });
      this.setData({ showAssetModal: false });
      this.loadOverviewData();
    } else {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  deleteAsset(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，是否继续？',
      confirmColor: '#FA5151',
      success: (res) => {
        if (res.confirm) {
          deletePhysicalAsset(id);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.loadOverviewData();
        }
      }
    });
  },

  // ==================== 心愿 ====================
  loadWishlistData() {
    const summary = getWishlistSummary();
    const wishlist = getWishlist();

    const enrichedWishlist = wishlist.map(item => {
      const targetPrice = parseFloat(item.targetPrice) || 0;
      const savedAmount = parseFloat(item.savedAmount) || 0;
      const progress = targetPrice > 0
        ? Math.min(100, Math.round((savedAmount / targetPrice) * 100))
        : 0;
      return {
        ...item,
        progress,
        remaining: Math.max(0, parseFloat((targetPrice - savedAmount).toFixed(2))),
        icon: item.icon || '💝'
      };
    });

    this.setData({
      wishlistSummary: summary,
      wishlist: enrichedWishlist
    });
  },

  openWishModal() {
    this.setData({
      showWishModal: true,
      isEditingWish: false,
      editingWishId: null,
      wishForm: {
        name: '',
        targetPrice: '',
        savedAmount: '',
        icon: ''
      }
    });
  },

  openEditWishModal(e) {
    const id = e.currentTarget.dataset.id;
    const items = getWishlist();
    const item = items.find(i => i.id === id);
    if (!item) return;

    this.setData({
      showWishModal: true,
      isEditingWish: true,
      editingWishId: id,
      wishForm: {
        name: item.name,
        targetPrice: String(item.targetPrice),
        savedAmount: String(item.savedAmount),
        icon: item.icon || ''
      }
    });
  },

  closeWishModal() {
    this.setData({ showWishModal: false });
  },

  onWishFieldChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`wishForm.${field}`]: e.detail.value
    });
  },

  saveWish() {
    const { wishForm, isEditingWish, editingWishId } = this.data;
    const { name, targetPrice, savedAmount, icon } = wishForm;

    if (!name) {
      wx.showToast({ title: '请输入心愿名称', icon: 'none' });
      return;
    }

    if (!targetPrice || parseFloat(targetPrice) <= 0) {
      wx.showToast({ title: '请输入目标价格', icon: 'none' });
      return;
    }

    const wishData = {
      name,
      targetPrice: parseFloat(targetPrice),
      savedAmount: savedAmount ? parseFloat(savedAmount) : 0,
      icon
    };

    let result;
    if (isEditingWish) {
      result = updateWishlistItem(editingWishId, wishData);
    } else {
      result = addWishlistItem(wishData);
    }

    if (result) {
      wx.showToast({
        title: isEditingWish ? '更新成功' : '添加成功',
        icon: 'success'
      });
      this.setData({ showWishModal: false });
      this.loadWishlistData();
    } else {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  deleteWish(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '删除此心愿？',
      confirmColor: '#FA5151',
      success: (res) => {
        if (res.confirm) {
          deleteWishlistItem(id);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.loadWishlistData();
        }
      }
    });
  },

  // ==================== 趋势 ====================
  loadTrendData() {
    const range = this.data.trendRange;
    const snapshots = getPhysicalSnapshots(range);

    const trendChartData = snapshots.map(s => ({
      date: s.date,
      value: s.totalCurrent || s.total
    }));

    const statusChartData = (() => {
      if (snapshots.length === 0) return [];
      const latest = snapshots[snapshots.length - 1];
      return [
        { name: '服役中', value: latest.activeCount || 0, color: '#84CC16' },
        { name: '已退役', value: latest.retiredCount || 0, color: '#F59E0B' },
        { name: '已卖出', value: latest.soldCount || 0, color: '#6B7280' }
      ];
    })();

    const purchaseChartData = snapshots.map(s => ({
      date: s.date,
      value: s.total
    }));

    const dailyCostChartData = snapshots.map(s => ({
      date: s.date,
      value: s.totalDailyCost || 0
    }));

    this.setData({
      trendSnapshots: snapshots,
      trendChartData,
      statusChartData,
      purchaseChartData,
      dailyCostChartData
    });
  },

  onTrendRangeChange(e) {
    const range = e.currentTarget.dataset.range;
    this.setData({ trendRange: range });
    this.loadTrendData();
  },

  onShareAppMessage() {
    return {
      title: '我的实物资产管理',
      path: '/pages/assets/assets'
    };
  }
});
