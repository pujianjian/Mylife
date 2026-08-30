const { exportAllData, importAllData, getWeightRecords, getBillAccounts } = require('../../utils/storage');

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const h = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
};

Page({
  data: {
    exportText: '',
    importText: '',
    lastBackupTime: '',
    showPreview: false,
    previewData: null,
    importMode: 'merge'
  },

  onLoad() {
    this.generateExportText();
  },

  generateExportText() {
    const data = exportAllData();
    const text = JSON.stringify(data, null, 2);
    this.setData({
      exportText: text,
      lastBackupTime: formatDateTime(data.exportTime)
    });
    return text;
  },

  // 复制备份数据到剪贴板
  copyToClipboard() {
    const text = this.data.exportText || this.generateExportText();

    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        this.setData({ lastBackupTime: formatDateTime(new Date().toISOString()) });
      },
      fail: () => {
        wx.showToast({ title: '复制失败', icon: 'none' });
      }
    });
  },

  // 导出为文件并分享到微信
  exportToFile() {
    const text = this.data.exportText || this.generateExportText();
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/health-finance-backup.json`;

    try {
      fs.writeFileSync(filePath, text, 'utf8');

      if (wx.shareFileMessage) {
        wx.shareFileMessage({
          filePath,
          title: '健康理财小助手数据备份',
          success: () => {
            wx.showToast({ title: '文件已发送', icon: 'success' });
          },
          fail: (err) => {
            console.log('shareFileMessage fail', err);
            this.fallbackToCopy(text);
          }
        });
      } else {
        this.fallbackToCopy(text);
      }
    } catch (e) {
      console.error('writeFile error', e);
      this.fallbackToCopy(text);
    }
  },

  fallbackToCopy(text) {
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showModal({
          title: '已复制备份数据',
          content: '当前环境不支持直接发送文件，已将 JSON 文本复制到剪贴板，你可以粘贴到微信文件传输助手或备忘录保存。',
          showCancel: false
        });
      }
    });
  },

  // 从剪贴板导入
  importFromClipboard() {
    wx.getClipboardData({
      success: (res) => {
        const text = res.data;
        if (!text || !text.trim()) {
          wx.showToast({ title: '剪贴板为空', icon: 'none' });
          return;
        }
        this.parseAndPreview(text);
      },
      fail: () => {
        wx.showToast({ title: '读取剪贴板失败', icon: 'none' });
      }
    });
  },

  // 从聊天记录选择文件
  chooseFile() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['json', 'txt'],
      success: (res) => {
        const file = res.tempFiles[0];
        this.readFileContent(file.path);
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('cancel')) return;
        wx.showToast({ title: '选择文件失败', icon: 'none' });
      }
    });
  },

  readFileContent(filePath) {
    const fs = wx.getFileSystemManager();
    fs.readFile({
      filePath,
      encoding: 'utf8',
      success: (res) => {
        this.parseAndPreview(res.data);
      },
      fail: () => {
        wx.showToast({ title: '读取文件失败', icon: 'none' });
      }
    });
  },

  onImportTextInput(e) {
    this.setData({ importText: e.detail.value });
  },

  parseManualInput() {
    const text = this.data.importText.trim();
    if (!text) {
      wx.showToast({ title: '请输入备份数据', icon: 'none' });
      return;
    }
    this.parseAndPreview(text);
  },

  parseAndPreview(text) {
    let backup;
    try {
      backup = JSON.parse(text);
    } catch (e) {
      wx.showToast({ title: 'JSON 格式错误', icon: 'none' });
      return;
    }

    const weightCount = backup.data?.weight_records?.length || 0;
    const assetCount = (backup.data?.asset_accounts?.length || 0) + (backup.data?.savings_records?.length || 0);
    const physicalCount = backup.data?.physical_assets?.length || 0;
    const wishlistCount = backup.data?.wishlist?.length || 0;
    const carCount = backup.data?.car_expenses?.length || 0;
    const totalCount = weightCount + assetCount + physicalCount + wishlistCount + carCount;

    if (totalCount === 0) {
      wx.showToast({ title: '备份数据为空', icon: 'none' });
      return;
    }

    this.setData({
      showPreview: true,
      previewData: {
        backup,
        weightCount,
        assetCount,
        physicalCount,
        wishlistCount,
        carCount,
        exportTime: backup.exportTime ? formatDateTime(backup.exportTime) : '未知'
      }
    });
  },

  onImportModeChange(e) {
    this.setData({ importMode: e.currentTarget.dataset.mode });
  },

  cancelImport() {
    this.setData({ showPreview: false, previewData: null });
  },

  preventBubble() {},

  confirmImport() {
    const { previewData, importMode } = this.data;
    if (!previewData) return;

    const result = importAllData(previewData.backup, importMode);

    if (result.success) {
      wx.showToast({ title: '导入成功', icon: 'success' });
      this.setData({
        showPreview: false,
        previewData: null,
        importText: ''
      });
      this.generateExportText();
    } else {
      wx.showToast({ title: result.message || '导入失败', icon: 'none' });
    }
  }
});
