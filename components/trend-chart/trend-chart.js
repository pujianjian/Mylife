Component({
  properties: {
    data: {
      type: Array,
      value: []
    },
    lineColor: {
      type: String,
      value: '#34D399'
    },
    pointColor: {
      type: String,
      value: '#34D399'
    },
    lastPointColor: {
      type: String,
      value: '#FBBF24'
    },
    valueKey: {
      type: String,
      value: 'value'
    },
    unit: {
      type: String,
      value: ''
    }
  },

  data: {
    isEmpty: false,
    showTooltip: false,
    tooltipX: 0,
    tooltipY: 0,
    tooltipDate: '',
    tooltipValue: ''
  },

  lifetimes: {
    ready() {
      this.initCanvas();
    }
  },

  observers: {
    'data': function(newVal) {
      if (this.ctx) {
        this.renderChart(newVal);
      }
    }
  },

  methods: {
    initCanvas() {
      const query = wx.createSelectorQuery().in(this);
      query.select('#trendChart')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0]) return;

          const canvas = res[0].node;
          const { width, height } = res[0];
          const dpr = wx.getSystemInfoSync().pixelRatio;
          const windowWidth = wx.getSystemInfoSync().windowWidth;
          this.rpxRatio = windowWidth / 750;

          canvas.width = width * dpr;
          canvas.height = height * dpr;

          this.ctx = canvas.getContext('2d');
          this.ctx.scale(dpr, dpr);
          this.canvasWidth = width;
          this.canvasHeight = height;
          this.dpr = dpr;

          this.renderChart(this.properties.data);
        });
    },

    renderChart(data) {
      if (!this.ctx || !this.canvasWidth || !this.canvasHeight) return;

      const ctx = this.ctx;
      const width = this.canvasWidth;
      const height = this.canvasHeight;
      const rpx = (n) => n * (this.rpxRatio || 0.5);

      ctx.clearRect(0, 0, width, height);

      if (!data || data.length === 0) {
        this.setData({ isEmpty: true });
        return;
      }

      this.setData({ isEmpty: false });

      // 按日期升序
      const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));
      const lastIndex = sortedData.length - 1;

      const padding = {
        top: rpx(42),
        right: rpx(24),
        bottom: rpx(40),
        left: rpx(16)
      };

      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      // 计算 Y 轴范围
      const values = sortedData.map(item => parseFloat(item[this.properties.valueKey]) || 0);
      let minValue = Math.min(...values);
      let maxValue = Math.max(...values);

      if (maxValue - minValue < 0.5) {
        const mid = (maxValue + minValue) / 2;
        minValue = mid - 0.25;
        maxValue = mid + 0.25;
      }

      const range = maxValue - minValue;
      minValue = Math.max(0, minValue - range * 0.12);
      maxValue = maxValue + range * 0.12;

      const getX = (index) => {
        if (sortedData.length === 1) return padding.left + chartWidth / 2;
        return padding.left + (index / (sortedData.length - 1)) * chartWidth;
      };

      const getY = (value) => {
        return padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
      };

      // 绘制虚线网格
      ctx.strokeStyle = '#F0F0F0';
      ctx.lineWidth = 1;
      ctx.setLineDash([rpx(4), rpx(4)]);

      const gridCount = 4;
      for (let i = 0; i <= gridCount; i++) {
        const value = minValue + (maxValue - minValue) * (i / gridCount);
        const y = getY(value);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 绘制区域渐变填充
      ctx.beginPath();
      ctx.moveTo(getX(0), padding.top + chartHeight);
      sortedData.forEach((item, index) => {
        const x = getX(index);
        const y = getY(item[this.properties.valueKey]);
        if (index === 0) {
          ctx.lineTo(x, y);
        } else {
          const prevX = getX(index - 1);
          const prevY = getY(sortedData[index - 1][this.properties.valueKey]);
          const cpX = (prevX + x) / 2;
          ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
        }
      });
      ctx.lineTo(getX(lastIndex), padding.top + chartHeight);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
      gradient.addColorStop(0, 'rgba(52, 211, 153, 0.18)');
      gradient.addColorStop(1, 'rgba(52, 211, 153, 0.01)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // 绘制折线
      ctx.beginPath();
      ctx.strokeStyle = this.properties.lineColor;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      sortedData.forEach((item, index) => {
        const x = getX(index);
        const y = getY(item[this.properties.valueKey]);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevX = getX(index - 1);
          const prevY = getY(sortedData[index - 1][this.properties.valueKey]);
          const cpX = (prevX + x) / 2;
          ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
        }
      });
      ctx.stroke();

      // 绘制数据点和数值
      sortedData.forEach((item, index) => {
        const x = getX(index);
        const y = getY(item[this.properties.valueKey]);
        const isLast = index === lastIndex;
        const valueText = parseFloat(item[this.properties.valueKey]).toFixed(2);

        // 数值标签
        ctx.font = `normal ${isLast ? 'bold ' + rpx(24) + 'px' : rpx(22) + 'px'} sans-serif`;
        ctx.fillStyle = isLast ? this.properties.lastPointColor : '#9CA3AF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(valueText, x, y - rpx(14));

        // 数据点
        ctx.beginPath();
        ctx.arc(x, y, isLast ? rpx(6) : rpx(4), 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = isLast ? this.properties.lastPointColor : this.properties.pointColor;
        ctx.lineWidth = isLast ? rpx(3) : rpx(2);
        ctx.stroke();

        // 最后一个点内部加小圆点
        if (isLast) {
          ctx.beginPath();
          ctx.arc(x, y, rpx(3), 0, Math.PI * 2);
          ctx.fillStyle = this.properties.lastPointColor;
          ctx.fill();
        }
      });

      // 绘制 X 轴标签
      ctx.font = 'normal ' + rpx(20) + 'px sans-serif';
      ctx.fillStyle = '#9CA3AF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const labelCount = Math.min(sortedData.length, 6);
      const step = Math.ceil(sortedData.length / labelCount);

      sortedData.forEach((item, index) => {
        if (index % step === 0 || index === lastIndex) {
          const x = getX(index);
          const d = new Date(item.date);
          const label = `${d.getMonth() + 1}/${d.getDate()}`;
          ctx.fillText(label, x, padding.top + chartHeight + rpx(12));
        }
      });

      this.chartData = { sortedData, getX, getY, padding, chartWidth };
    },

    onTouch(e) {
      if (!this.chartData || this.chartData.sortedData.length === 0) return;

      const touch = e.touches[0];
      const x = touch.x;
      const { sortedData, getX, chartWidth } = this.chartData;

      let closestIndex = 0;
      let minDistance = Infinity;

      sortedData.forEach((item, index) => {
        const pointX = getX(index);
        const distance = Math.abs(pointX - x);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      if (minDistance > chartWidth / sortedData.length / 2 + 20) return;

      const item = sortedData[closestIndex];
      const pointX = getX(closestIndex);
      const pointY = this.chartData.getY(item[this.properties.valueKey]);

      this.setData({
        showTooltip: true,
        tooltipX: pointX,
        tooltipY: pointY,
        tooltipDate: item.date,
        tooltipValue: `${item[this.properties.valueKey]}${this.properties.unit}`
      });
    },

    onTouchEnd() {
      this.setData({ showTooltip: false });
    }
  }
});
