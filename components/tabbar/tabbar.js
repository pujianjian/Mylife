Component({
  properties: {
    active: {
      type: Number,
      value: 0
    }
  },

  data: {
    tabs: [
      {
        key: 'home',
        text: '主页',
        icon: '🏠',
        path: '/pages/index/index'
      },
      {
        key: 'mine',
        text: '我的',
        icon: '👤',
        path: '/pages/mine/mine'
      }
    ]
  },

  methods: {
    onTabTap(e) {
      const { index, path } = e.currentTarget.dataset;
      if (index === this.data.active) return;
      wx.reLaunch({ url: path });
    }
  }
});
