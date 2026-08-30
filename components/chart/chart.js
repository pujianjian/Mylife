Component({
  properties: {
    // 单线模式（现有，向后兼容）
    data: {
      type: Array,
      value: []
    },
    lineColor: {
      type: String,
      value: '#4A90D9'
    },
    gradientStart: {
      type: String,
      value: 'rgba(74, 144, 217, 0.3)'
    },
    gradientEnd: {
      type: String,
      value: 'rgba(74, 144, 217, 0.05)'
    },
    valueKey: {
      type: String,
      value: 'value'
    },
    unit: {
      type: String,
      value: ''
    },
    // 多线模式（新增）
    // 格式: [{ name: '男方', color: '#3B82F6', data: [{ month: '2026-01', value: 1000 }, ...] }]
    lines: {
      type: Array,
      value: null
    }
  },

  data: {
    showTooltip: false,
    tooltipX: 0,
    tooltipY: 0,
    tooltipDate: '',
    tooltipValue: '',
    tooltipValues: null, // 多线模式下的值列表
    isEmpty: false,
    isMulti: false
  },

  lifetimes: {
    ready() {
      this.initCanvas();
    }
  },

  observers: {
    'data': function(newVal) {
      if (this.ctx && !this.properties.lines) {
        this.renderChart(newVal);
      }
    },
    'lines': function(newVal) {
      if (this.ctx && newVal && newVal.length > 0) {
        this.renderMultiLine(newVal);
      }
    }
  },

  methods: {
    initCanvas() {
      const query = wx.createSelectorQuery().in(this);
      query.select('#lineChart')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0]) return;

          const canvas = res[0].node;
          const { width, height } = res[0];
          const dpr = wx.getSystemInfoSync().pixelRatio;

          canvas.width = width * dpr;
          canvas.height = height * dpr;

          this.ctx = canvas.getContext('2d');
          this.ctx.scale(dpr, dpr);
          this.canvasWidth = width;
          this.canvasHeight = height;
          this.dpr = dpr;

          // 判断渲染模式
          if (this.properties.lines && this.properties.lines.length > 0) {
            this.renderMultiLine(this.properties.lines);
          } else {
            this.renderChart(this.properties.data);
          }
        });
    },

    // ========== 单线渲染（原有逻辑不变） ==========

    renderChart(data) {
      if (!this.ctx || !this.canvasWidth || !this.canvasHeight) return;

      this.setData({ isMulti: false });

      const ctx = this.ctx;
      const width = this.canvasWidth;
      const height = this.canvasHeight;

      ctx.clearRect(0, 0, width, height);

      if (!data || data.length === 0) {
        this.setData({ isEmpty: true });
        return;
      }

      this.setData({ isEmpty: false });

      const dateField = data[0] && data[0].month ? 'month' : 'date';
      const sortedData = [...data].sort((a, b) => a[dateField].localeCompare(b[dateField]));

      const padding = {
        top: 30,
        right: 24,
        bottom: 50,
        left: 56
      };

      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      const values = sortedData.map(item => parseFloat(item[this.properties.valueKey]) || 0);
      let minValue = Math.min(...values);
      let maxValue = Math.max(...values);

      if (maxValue - minValue < 1) {
        const mid = (maxValue + minValue) / 2;
        minValue = mid - 0.5;
        maxValue = mid + 0.5;
      }

      const range = maxValue - minValue;
      minValue = Math.max(0, minValue - range * 0.1);
      maxValue = maxValue + range * 0.1;

      const getX = (index) => {
        if (sortedData.length === 1) return padding.left + chartWidth / 2;
        return padding.left + (index / (sortedData.length - 1)) * chartWidth;
      };

      const getY = (value) => {
        return padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
      };

      this._drawGrid(ctx, width, padding, chartHeight, minValue, maxValue, getY);
      this._drawXLabels(ctx, sortedData, getX, padding, chartHeight, dateField);

      // 折线
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

      // 渐变填充
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
      ctx.lineTo(getX(sortedData.length - 1), padding.top + chartHeight);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
      gradient.addColorStop(0, this.properties.gradientStart);
      gradient.addColorStop(1, this.properties.gradientEnd);
      ctx.fillStyle = gradient;
      ctx.fill();

      // 数据点
      sortedData.forEach((item, index) => {
        const x = getX(index);
        const y = getY(item[this.properties.valueKey]);

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = this.properties.lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      this.chartData = {
        sortedData,
        getX,
        getY,
        padding,
        chartWidth
      };
    },

    // ========== 多线渲染（新增） ==========

    renderMultiLine(lines) {
      if (!this.ctx || !this.canvasWidth || !this.canvasHeight) return;

      this.setData({ isMulti: true });

      const ctx = this.ctx;
      const width = this.canvasWidth;
      const height = this.canvasHeight;

      ctx.clearRect(0, 0, width, height);

      if (!lines || lines.length === 0) {
        this.setData({ isEmpty: true });
        return;
      }

      // 收集所有月份（并集，按时间排序）
      const monthSet = {};
      lines.forEach(line => {
        (line.data || []).forEach(item => {
          if (item.month) monthSet[item.month] = true;
        });
      });
      const months = Object.keys(monthSet).sort();

      if (months.length === 0) {
        this.setData({ isEmpty: true });
        return;
      }

      this.setData({ isEmpty: false });

      const padding = { top: 30, right: 24, bottom: 50, left: 56 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      // 计算所有线所有点的值范围
      let allValues = [];
      lines.forEach(line => {
        months.forEach(month => {
          const item = (line.data || []).find(d => d.month === month);
          if (item) allValues.push(parseFloat(item.value) || 0);
        });
      });

      let minValue = 0;
      let maxValue = Math.max(...allValues, 1);
      const range = maxValue - minValue;
      maxValue = maxValue + range * 0.1;

      const getX = (index) => {
        if (months.length === 1) return padding.left + chartWidth / 2;
        return padding.left + (index / (months.length - 1)) * chartWidth;
      };

      const getY = (value) => {
        return padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
      };

      this._drawGrid(ctx, width, padding, chartHeight, minValue, maxValue, getY);
      this._drawMonthLabels(ctx, months, getX, padding, chartHeight);

      // 绘制每条线
      lines.forEach(line => {
        if (!line.data || line.data.length === 0) return;

        // 按月份对齐构建值数组
        const monthValues = months.map(month => {
          const item = line.data.find(d => d.month === month);
          return item ? (parseFloat(item.value) || 0) : 0;
        });

        // 折线
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        monthValues.forEach((value, index) => {
          const x = getX(index);
          const y = getY(value);
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            const prevX = getX(index - 1);
            const prevY = getY(monthValues[index - 1]);
            const cpX = (prevX + x) / 2;
            ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
          }
        });
        ctx.stroke();

        // 数据点
        monthValues.forEach((value, index) => {
          const x = getX(index);
          const y = getY(value);
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();
          ctx.strokeStyle = line.color;
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      });

      // 保存数据供交互使用
      this.multiChartData = {
        months,
        lines,
        getX,
        getY,
        padding,
        chartWidth
      };
    },

    // ========== 公共绘制方法 ==========

    _drawGrid(ctx, width, padding, chartHeight, minValue, maxValue, getY) {
      ctx.strokeStyle = '#F0F0F0';
      ctx.lineWidth = 1;
      ctx.fillStyle = '#999999';
      ctx.font = 'normal 20rpx sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const gridCount = 5;
      for (let i = 0; i <= gridCount; i++) {
        const value = minValue + (maxValue - minValue) * (i / gridCount);
        const y = getY(value);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        ctx.fillText(value.toFixed(0), padding.left - 12, y);
      }
    },

    _drawXLabels(ctx, sortedData, getX, padding, chartHeight, dateField) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#999999';
      ctx.font = 'normal 18rpx sans-serif';

      const labelCount = Math.min(sortedData.length, 5);
      const step = Math.ceil(sortedData.length / labelCount);

      sortedData.forEach((item, index) => {
        if (index % step === 0 || index === sortedData.length - 1) {
          const x = getX(index);
          let label = item.date ? item.date.substring(5) : item.month;
          if (item.month && item.month.indexOf('-') > -1) {
            const parts = item.month.split('-');
            label = parseInt(parts[1], 10) + '月';
          }
          ctx.fillText(label, x, padding.top + chartHeight + 12);
        }
      });
    },

    _drawMonthLabels(ctx, months, getX, padding, chartHeight) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#999999';
      ctx.font = 'normal 18rpx sans-serif';

      const labelCount = Math.min(months.length, 6);
      const step = Math.ceil(months.length / labelCount);

      months.forEach((month, index) => {
        if (index % step === 0 || index === months.length - 1) {
          const x = getX(index);
          const parts = month.split('-');
          const label = parseInt(parts[1], 10) + '月';
          ctx.fillText(label, x, padding.top + chartHeight + 12);
        }
      });
    },

    // ========== 交互 ==========

    onTouch(e) {
      if (this.properties.lines && this.properties.lines.length > 0) {
        return this.onMultiTouch(e);
      }

      if (!this.chartData || this.chartData.sortedData.length === 0) return;

      const touch = e.touches[0];
      const x = touch.x;
      const { sortedData, getX, padding, chartWidth } = this.chartData;

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
        tooltipDate: item.date || item.month || '',
        tooltipValue: `${item[this.properties.valueKey]}${this.properties.unit}`
      });
    },

    onMultiTouch(e) {
      if (!this.multiChartData) return;

      const touch = e.touches[0];
      const x = touch.x;
      const { months, lines, getX, getY, padding, chartWidth } = this.multiChartData;

      let closestIndex = 0;
      let minDistance = Infinity;

      months.forEach((month, index) => {
        const pointX = getX(index);
        const distance = Math.abs(pointX - x);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      if (months.length > 1 && minDistance > chartWidth / months.length / 2 + 20) return;

      const month = months[closestIndex];
      const values = lines.map(line => {
        const item = (line.data || []).find(d => d.month === month);
        const val = item ? (parseFloat(item.value) || 0) : 0;
        return {
          name: line.name,
          color: line.color,
          valueStr: val.toFixed(2)
        };
      });

      const pointX = getX(closestIndex);
      // 取最大值的位置作为 tooltip 锚点
      const maxVal = Math.max(...values.map(v => parseFloat(v.valueStr) || 0));
      const pointY = getY(maxVal);

      this.setData({
        showTooltip: true,
        tooltipX: pointX,
        tooltipY: pointY,
        tooltipDate: month,
        tooltipValues: values
      });
    },

    onTouchEnd() {
      this.setData({ showTooltip: false });
    }
  }
});
