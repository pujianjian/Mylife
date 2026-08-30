App({
  onLaunch() {
    // 检查并初始化本地存储数据
    this.initStorage();
    console.log('小程序启动');
  },

  initStorage() {
    const { setStorage, getStorage } = require('./utils/storage');
    
    if (!getStorage('weight_records')) {
      setStorage('weight_records', []);
    }
    if (!getStorage('savings_records')) {
      setStorage('savings_records', []);
    }
  },

  globalData: {
    userInfo: null
  }
});
