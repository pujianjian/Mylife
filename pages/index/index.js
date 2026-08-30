Page({
  data: {
    modules: [
      {
        key: 'weight',
        title: '健康管理',
        desc: '记录体重、体脂、肌肉等身体数据',
        icon: '📉',
        color: '#4A90D9',
        lightColor: '#EBF3FC',
        path: '/pages/weight/weight'
      },
      {
        key: 'savings',
        title: '储存记账',
        desc: '管理账户余额，记录净资产走势',
        icon: '💰',
        color: '#10B981',
        lightColor: '#ECFDF5',
        path: '/pages/savings/savings'
      },
      {
        key: 'car',
        title: '汽车记账',
        desc: '记录用车支出，追踪能耗与开销',
        icon: '🚗',
        color: '#3B82F6',
        lightColor: '#DBEAFE',
        path: '/pages/car/car'
      },
      {
        key: 'assets',
        title: '实物资产',
        desc: '管理实物资产、心愿单和趋势',
        icon: '📦',
        color: '#84CC16',
        lightColor: '#ECFCCB',
        path: '/pages/assets/assets'
      },
      {
        key: 'days',
        title: '重要日子',
        desc: '记录生日、纪念日、农历节日等',
        icon: '📅',
        color: '#EC4899',
        lightColor: '#FCE7F3',
        path: '/pages/days/days'
      },
      {
        key: 'family',
        title: '家庭记账',
        desc: '记录家庭收入、开支、资产与趋势',
        icon: '🏠',
        color: '#F59E0B',
        lightColor: '#FEF3C7',
        path: '/pages/family/family'
      },
      {
        key: 'todo',
        title: '待办事项',
        desc: '每日每周每月每年待办管理',
        icon: '✅',
        color: '#06B6D4',
        lightColor: '#CFFAFE',
        path: '/pages/todo/todo'
      }
    ]
  },

  onLoad() {
    // 页面加载
  },

  navigateTo(e) {
    const { path } = e.currentTarget.dataset;
    wx.navigateTo({ url: path });
  },

  onShareAppMessage() {
    return {
      title: '健康理财小助手',
      path: '/pages/index/index'
    };
  }
});
