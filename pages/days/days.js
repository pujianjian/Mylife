// pages/days/days.js
const {
  IMPORTANT_DAY_CATEGORIES,
  getImportantDays
} = require('../../utils/storage');
const { solar2Lunar, lunar2Solar } = require('../../utils/lunar');

const pad = n => String(n).padStart(2, '0');
const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// 用午夜时间计算天数差，避免时分秒影响结果
const daysBetween = (a, b) => {
  const aMidnight = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bMidnight = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((aMidnight - bMidnight) / 86400000);
};

const weekdayCN = (dateStr) => {
  const d = new Date(dateStr);
  return ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
};

// 计算下一次该日子出现的公历日期（用于排序/倒计时）
// todayMidnight: 传入午夜时间，避免时分秒干扰比较
const computeNextDate = (item, todayMidnight) => {
  const t = todayMidnight;
  const solarYear = t.getFullYear();

  if (item.frequency === 'once') {
    if (item.calendar === 'lunar') {
      // 农历「仅一次」：用存储的农历年份转换
      const parts = item.date.split('-').map(Number);
      const d = lunar2Solar(parts[0], parts[1], parts[2], item.isLeap || false);
      return d && d >= t ? d : null;
    }
    const d = new Date(item.date);
    return d >= t ? d : null;
  }

  if (item.calendar === 'solar') {
    const parts = item.date.split('-').map(Number);
    const m = parts[1];
    const day = parts[2];
    let candidate = new Date(solarYear, m - 1, day);
    if (item.frequency === 'yearly') {
      if (candidate < t) candidate = new Date(solarYear + 1, m - 1, day);
    } else {
      // monthly
      candidate = new Date(solarYear, t.getMonth(), day);
      if (candidate < t) candidate = new Date(solarYear, t.getMonth() + 1, day);
    }
    return candidate;
  }

  // lunar — 农历每年/每月
  const parts = item.date.split('-').map(Number);
  const lm = parts[1];
  const ld = parts[2];

  // 确定当前对应的农历年份
  // 公历年初（春节前），农历年还是上一年的
  const todayLunar = solar2Lunar(solarYear, t.getMonth() + 1, t.getDate());
  let lunarYearBase = todayLunar ? todayLunar.year : solarYear;

  if (item.frequency === 'yearly') {
    // 尝试当前农历年、下一年、再下一年（覆盖春节前后边界）
    for (let delta = 0; delta <= 2; delta++) {
      const lYear = lunarYearBase + delta;
      // 如果该年没有闰月且用户标记了闰月，跳过（isLeap 无效时当作正常月）
      const next = lunar2Solar(lYear, lm, ld, item.isLeap || false);
      if (next && next >= t) return next;
    }
    return null;
  }

  // monthly lunar — 每月一次
  let probe = new Date(solarYear, t.getMonth(), 1);
  let found = null;
  for (let i = 0; i < 70; i++) {
    const test = new Date(probe.getFullYear(), probe.getMonth(), probe.getDate() + i);
    const lunar = solar2Lunar(test.getFullYear(), test.getMonth() + 1, test.getDate());
    if (lunar && lunar.month === lm && lunar.day === ld && lunar.isLeap === (item.isLeap || false)) {
      if (test >= t) { found = test; break; }
    }
  }
  if (!found) {
    const startNext = new Date(solarYear, t.getMonth() + 1, 1);
    for (let i = 0; i < 70; i++) {
      const test = new Date(startNext.getFullYear(), startNext.getMonth(), startNext.getDate() + i);
      const lunar = solar2Lunar(test.getFullYear(), test.getMonth() + 1, test.getDate());
      if (lunar && lunar.month === lm && lunar.day === ld && lunar.isLeap === (item.isLeap || false)) {
        if (test >= t) { found = test; break; }
      }
    }
  }
  return found;
};

const getCategoryMeta = (key) => {
  return IMPORTANT_DAY_CATEGORIES.find(c => c.key === key) || IMPORTANT_DAY_CATEGORIES[3];
};

const TABS = [
  { key: 'all', name: '全部' },
  { key: 'birthday', name: '生日' },
  { key: 'anniversary', name: '纪念日' },
  { key: 'festival', name: '节日' },
  { key: 'other', name: '其他' }
];

function buildTabs(activeKey) {
  return TABS.map(t => ({
    key: t.key,
    name: t.name,
    tabClass: 'tab' + (t.key === activeKey ? ' active' : '')
  }));
}

Page({
  data: {
    tabs: buildTabs('all'),
    currentTab: 'all',
    daysList: [],
    totalCount: 0,
    monthCount: 0,
    nearestName: '—',
    nearestDays: null
  },

  onShow() {
    this.reload(this.data.currentTab);
  },

  onTabSelect(e) {
    // 直接从 dataset 取 tab key，不依赖 setData 回调读 this.data
    const tab = e.currentTarget.dataset.tab;
    if (!tab || tab === this.data.currentTab) return;
    this.setData({ currentTab: tab, tabs: buildTabs(tab) });
    this.reload(tab);
  },

  noop() {},
  onFilterTap() {},
  onFilterClose() {},
  onAddTap() {
    wx.navigateTo({ url: '/pages/days/edit/edit' });
  },
  onItemTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/days/edit/edit?id=${id}` });
  },

  reload(tabKey) {
    // tabKey 直接传入，避免 this.data.currentTab 时序问题
    const currentTab = tabKey || 'all';
    const items = getImportantDays();
    // 用午夜时间作为基准，避免时分秒导致天数差偏少
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    // 本月范围（用午夜时间）
    const monthStart = new Date(todayMidnight.getFullYear(), todayMidnight.getMonth(), 1);
    const monthEnd = new Date(todayMidnight.getFullYear(), todayMidnight.getMonth() + 1, 0, 23, 59, 59);

    // 1) 先给每条记录算好展示字段
    const enriched = items.map(it => {
      const next = computeNextDate(it, todayMidnight);
      const days = next ? daysBetween(next, todayMidnight) : null;
      const cat = getCategoryMeta(it.category);
      const nextStr = next ? toDateStr(next) : '';
      const nextLabel = nextStr ? nextStr + ' (周' + weekdayCN(nextStr) + ')' : '';
      let elapsedLabel = '';
      if (it.frequency === 'once' && it.date) {
        if (it.calendar === 'lunar') {
          const parts = it.date.split('-').map(Number);
          const targetDate = lunar2Solar(parts[0], parts[1], parts[2], it.isLeap || false);
          if (targetDate && targetDate < todayMidnight) {
            elapsedLabel = String(Math.abs(daysBetween(targetDate, todayMidnight)));
          }
        } else {
          const targetDate = new Date(it.date);
          if (targetDate < todayMidnight) {
            elapsedLabel = String(Math.abs(daysBetween(targetDate, todayMidnight)));
          }
        }
      }
      // 计算生日年龄 / 纪念日年数
      let ageLabel = '';
      if (it.category === 'birthday' && it.frequency === 'yearly' && next) {
        const birthYear = parseInt(it.date.split('-')[0], 10);
        const ageAtNext = next.getFullYear() - birthYear;
        // 农历生日：农历年份和公历年份差可能 ±1，取公历年份差更准确
        if (it.calendar === 'lunar') {
          // 用原始公历年份（存储时 year 字段是公历年）
          const realBirthYear = it.birthSolarYear || birthYear;
          ageLabel = '即将' + (next.getFullYear() - realBirthYear) + '岁';
        } else {
          ageLabel = ageAtNext > 0 ? '即将' + ageAtNext + '岁' : '';
        }
      }
      if (it.category === 'anniversary' && it.frequency === 'yearly' && next) {
        const startYear = parseInt(it.date.split('-')[0], 10);
        const yearsAtNext = next.getFullYear() - startYear;
        if (it.calendar === 'lunar') {
          const realStartYear = it.birthSolarYear || startYear;
          ageLabel = '即将第' + (next.getFullYear() - realStartYear) + '年';
        } else {
          ageLabel = yearsAtNext > 0 ? '即将第' + yearsAtNext + '年' : '';
        }
      }

      return {
        ...it,
        categoryName: cat.name,
        categoryIcon: cat.icon,
        categoryColor: cat.color,
        iconStyle: 'background: ' + cat.color + '20;',
        catStyle: 'color: ' + cat.color + ';',
        cardStyle: 'border-left: 8rpx solid ' + cat.color + ';',
        calendarLabel: it.calendar === 'lunar' ? '农历' : '公历',
        nextDateStr: nextStr,
        nextLabel,
        elapsedLabel,
        countdown: days,
        ageLabel
      };
    });

    // 2) 按 Tab 过滤
    const filtered = currentTab === 'all'
      ? enriched
      : enriched.filter(e => e.category === currentTab);

    // 3) 排序：有倒计时的在前，按天数升序
    filtered.sort((a, b) => {
      if (a.countdown == null && b.countdown == null) return 0;
      if (a.countdown == null) return 1;
      if (b.countdown == null) return -1;
      return a.countdown - b.countdown;
    });

    // 4) 统计卡 — 基于 filtered（当前 Tab 下的数据），而非全量
    const totalCount = filtered.length;
    const monthCount = filtered.filter(e => {
      if (!e.nextDateStr) return false;
      const d = new Date(e.nextDateStr + 'T00:00:00');
      return d >= monthStart && d <= monthEnd;
    }).length;
    const nearest = filtered.find(e => e.countdown != null);
    const nearestName = nearest ? nearest.name : '—';
    const nearestDays = nearest ? nearest.countdown : null;

    this.setData({
      daysList: filtered,
      totalCount,
      monthCount,
      nearestName,
      nearestDays
    });
  }
});
