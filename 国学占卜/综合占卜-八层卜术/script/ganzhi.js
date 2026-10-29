#!/usr/bin/env node
;(function () {
  /* 日期严格校验门卫（2026-10-21 追加）：非法公历日期（如2月30日、4月31日、超1900-2100范围）直接报错退出，禁止静默进位 */
  var __args = process.argv.slice(2);
  for (var __i = 0; __i < __args.length; __i++) {
    var __m = /^(\d{4})-(\d{1,2})-(\d{1,2})(T[\d:.]+)?$/.exec(__args[__i]);
    if (!__m) continue;
    var __y = +__m[1], __mo = +__m[2], __d = +__m[3];
    var __leap = (__y % 4 === 0 && __y % 100 !== 0) || (__y % 400 === 0);
    var __md = [31, __leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (__mo < 1 || __mo > 12 || __d < 1 || __d > __md[__mo - 1]) {
      console.error('日期非法: "' + __args[__i] + '"——' + __y + '年' + __mo + '月无' + __d + '日。请核对后重试');
      process.exit(1);
    }
  }
})();
/**
 * ganzhi.js —— 四柱八字排盘脚本（确定性排盘，杜绝真差错；真太阳时为准）
 *
 * 用法：node ganzhi.js <公历日期时间> <性别：男/女> [出生地东经度数，默认120]
 * 示例：node ganzhi.js 1990-05-20T14:30 男 116.4
 *       node ganzhi.js "1990-05-20 14:30" 女
 *
 * 输出：json（含"北京时间四柱"与"真太阳时四柱"双对照、藏干、十神、纳音、大运、月令、校正明细）
 *
 * 【真太阳时排盘（默认主口径）】
 *   排盘以真太阳时为准：真太阳时 = 北京时间 +（出生地经度−120°）×4分钟 + 均时差。
 *   时柱、日柱23点换日、节气（月柱/年柱）边界判断、大运 全部基于真太阳时。
 *   同时输出北京时间四柱对照；缺省经度时按东经120°校准并警告。跨时辰/跨日时明示差异。
 *
 * 实现说明：
 * 1. 节气：Meeus《Astronomical Algorithms》低精度太阳黄经（误差约±0.01°，对应交节时刻±15分钟内），
 *    二分法收敛；交节边界半小时内出生提示人工复核。
 * 2. 日柱锚：儒略日 J2000（2000-01-01）为戊午（序54），与史锚 1949-10-01 甲子（序0）互证。
 * 3. 子时换日：主流软件口径，23:00 起日柱进位（基于真太阳时）；0:00 换日流派复核提示。
 * 4. 十神/藏干/纳音表与《公共库/干支五行.md》《公共库/liuqin.md》一致。
 */

'use strict';

/* ============ 基础常量表 ============ */
const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const GAN_WUXING = ['木','木','火','火','土','土','金','金','水','水'];
const GAN_YINYANG = [0,1,0,1,0,1,0,1,0,1];
const ZHI_WUXING = ['水','土','木','木','土','火','火','土','金','金','土','水'];
const ZHI_CANG = {
  '子': ['癸'],'丑': ['己','癸','辛'],'寅': ['甲','丙','戊'],'卯': ['乙'],
  '辰': ['戊','乙','癸'],'巳': ['丙','庚','戊'],'午': ['丁','己'],'未': ['己','丁','乙'],
  '申': ['庚','壬','戊'],'酉': ['辛'],'戌': ['戊','辛','丁'],'亥': ['壬','甲']
};
const NAYIN = [
  ['甲子乙丑','海中金'],['丙寅丁卯','炉中火'],['戊辰己巳','大林木'],['庚午辛未','路旁土'],
  ['壬申癸酉','剑锋金'],['甲戌乙亥','山头火'],['丙子丁丑','涧下水'],['戊寅己卯','城头土'],
  ['庚辰辛巳','白蜡金'],['壬午癸未','杨柳木'],['甲申乙酉','泉中水'],['丙戌丁亥','屋上土'],
  ['戊子己丑','霹雳火'],['庚寅辛卯','松柏木'],['壬辰癸巳','长流水'],['甲午乙未','砂中金'],
  ['丙申丁酉','山下火'],['戊戌己亥','平地木'],['庚子辛丑','壁上土'],['壬寅癸卯','金箔金'],
  ['甲辰乙巳','覆灯火'],['丙午丁未','天河水'],['戊申己酉','大驿土'],['庚戌辛亥','钗钏金'],
  ['壬子癸丑','桑柘木'],['甲寅乙卯','大溪水'],['丙辰丁巳','沙中土'],['戊午己未','天上火'],
  ['庚申辛酉','石榴木'],['壬戌癸亥','大海水']
];

/* ============ 干支工具 ============ */
function gz(idx) { return GAN[idx % 10] + ZHI[idx % 12]; }
function nayinOf(str) { for (const [pair, ny] of NAYIN) { if (pair.includes(str)) return ny; } return null; }
function shiShen(dayGan, otherGan) {
  const dw = GAN_WUXING[dayGan], ow = GAN_WUXING[otherGan];
  const sameYY = GAN_YINYANG[dayGan] === GAN_YINYANG[otherGan];
  if (dw === ow) return sameYY ? '比肩' : '劫财';
  const sheng = {'木':'火','火':'土','土':'金','金':'水','水':'木'};
  const ke = {'木':'土','土':'水','水':'火','火':'金','金':'木'};
  if (sheng[dw] === ow) return sameYY ? '食神' : '伤官';
  if (ke[dw] === ow) return sameYY ? '偏财' : '正财';
  if (ke[ow] === dw) return sameYY ? '七杀' : '正官';
  if (sheng[ow] === dw) return sameYY ? '偏印' : '正印';
  return '?';
}

/* ============ 天文：太阳视黄经与节气（Meeus 低精度） ============ */
function rad(d) { return d * Math.PI / 180; }
function norm360(d) { const r = d % 360; return r < 0 ? r + 360 : r; }
function solarApparentLongitude(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(rad(M))
          + (0.019993 - 0.000101 * T) * Math.sin(rad(2 * M))
          + 0.000289 * Math.sin(rad(3 * M));
  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  return norm360(trueLong - 0.00569 - 0.00478 * Math.sin(rad(omega)));
}
function jdFromDateUTC(dateUTC) { return dateUTC.getTime() / 86400000 + 2440587.5; }
function findSolarTerm(year, targetDeg) {
  const deltaDeg = ((targetDeg + 540) % 360) - 180;
  const refJD = 2451623.817 + (deltaDeg / 360) * 365.2422;
  let jd = refJD + (year - 2000) * 365.2422;
  const wrapped = (j) => { const v = norm360(solarApparentLongitude(j) - targetDeg); return v > 180 ? v - 360 : v; };
  let lo = jd - 20, hi = jd + 20;
  let prev = wrapped(lo), prevJ = lo, crossLo = null, crossHi = null;
  for (let t = lo + 0.25; t <= hi; t += 0.25) {
    const cur = wrapped(t);
    if (prev < 0 && cur >= 0) { crossLo = prevJ; crossHi = t; break; }
    prev = cur; prevJ = t;
  }
  if (crossLo === null) return null;
  let a = crossLo, b = crossHi;
  for (let i = 0; i < 45; i++) { const mid = (a + b) / 2; if (wrapped(mid) < 0) a = mid; else b = mid; }
  return (a + b) / 2;
}
function fmtBJ(jdUT) {
  const dt = new Date((jdUT - 2440587.5) * 86400000 + 8 * 3600000);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getUTCFullYear()}-${p(dt.getUTCMonth() + 1)}-${p(dt.getUTCDate())} ${p(dt.getUTCHours())}:${p(dt.getUTCMinutes())}`;
}
const JIE_TABLE = [
  { name: '立春', deg: 315, monthZhi: '寅' }, { name: '惊蛰', deg: 345, monthZhi: '卯' },
  { name: '清明', deg: 15,  monthZhi: '辰' }, { name: '立夏', deg: 45,  monthZhi: '巳' },
  { name: '芒种', deg: 75,  monthZhi: '午' }, { name: '小暑', deg: 105, monthZhi: '未' },
  { name: '立秋', deg: 135, monthZhi: '申' }, { name: '白露', deg: 165, monthZhi: '酉' },
  { name: '寒露', deg: 195, monthZhi: '戌' }, { name: '立冬', deg: 225, monthZhi: '亥' },
  { name: '大雪', deg: 255, monthZhi: '子' }, { name: '小寒', deg: 285, monthZhi: '丑' }
];
function monthSegment(birthJD_UT, yearCN) {
  const terms = [];
  for (const y of [yearCN - 1, yearCN, yearCN + 1]) {
    for (const j of JIE_TABLE) {
      const jdUT = findSolarTerm(y, j.deg);
      if (jdUT !== null) terms.push({ name: j.name, monthZhi: j.monthZhi, jdUT });
    }
  }
  terms.sort((a, b) => a.jdUT - b.jdUT);
  let prev = null, next = null;
  for (let i = 0; i < terms.length - 1; i++) {
    if (terms[i].jdUT <= birthJD_UT && birthJD_UT < terms[i + 1].jdUT) { prev = terms[i]; next = terms[i + 1]; break; }
  }
  return { prev, next };
}
function dayGZIndex(jdUT) {
  const daySerial = Math.floor((jdUT + 8 / 24) - 0.5);
  const anchor = Math.floor(2451544.5);
  let idx = ((daySerial - anchor) % 60 + 54) % 60;
  return (idx + 60) % 60;
}

/* ============ 晚子时备选（子正0点换日派，仅真太阳时23点生人用） ============ */
/**
 * lateZiZhengZiAlt(ms)
 * ms 为真太阳时23点时刻（数字，语义=真太阳时）。按《三命通会》子正（0点）换日派：
 * 晚子时（23-24点）日柱仍属当日（不进位），时柱按当日日干起子时。
 * 返回 { 日柱, 时柱, 日干 }。主口径为23点换日（日柱进位），本函数给"另一派"备选。
 */
function lateZiZhengZiAlt(ms) {
  const jdUT = jdFromDateUTC(new Date(ms - 8 * 3600000)); // 真太阳时23点日序仍为当日
  const dayGZ = dayGZIndex(jdUT);                          // 当日，不进位
  const dayGan = dayGZ % 10;
  const hourGanStart = [0, 2, 4, 6, 8][dayGan % 5];        // 当日日干起五鼠遁
  let hz = 0;
  for (let s = 0; s < 60; s++) { if (s % 10 === hourGanStart && s % 12 === 0) { hz = s; break; } } // 子时支0
  return { 日柱: gz(dayGZ), 时柱: gz(hz), 日干: GAN[dayGan] };
}

/* ============ 核心：对某"北京时数值"做完整排盘 ============ */
/**
 * buildFor(ms, gender, clockJD_opt)
 * ms 语义 = 用于时柱/日柱判定的时刻（钟表或真太阳时数字均可，语义由调用方定）。
 * clockJD_opt = 月柱/年柱节气判定所用的儒禄日（**区时口径**）。缺省时用 ms 自身。
 * —— 口径铁律：节气（月柱/年柱/大运）按钟表（东八区区时）与节气时刻比较；时辰/日界（时柱/日柱）按传入 ms（调用方传真太阳时则为真太阳时）。
 * 节气时刻是全国统一的天文区时时刻，与出生地经度无关，故月柱年柱必须用钟表比较。
 */
function buildFor(ms, gender, clockJD_opt) {
  const dt = new Date(ms);
  const y = dt.getUTCFullYear(), mo = dt.getUTCMonth() + 1, d = dt.getUTCDate();
  const h = dt.getUTCHours(), mi = dt.getUTCMinutes(), se = dt.getUTCSeconds();
  const jdUT = jdFromDateUTC(new Date(ms - 8 * 3600000));
  const clockJD = (clockJD_opt !== undefined) ? clockJD_opt : jdUT; // 月柱/年柱/大运专用（区时口径）

  // 年柱（立春为界，钟表口径）
  const lichun = findSolarTerm(y, 315);
  let yearCN = y, yearShifted = false;
  if (clockJD < lichun) { yearCN = y - 1; yearShifted = true; }
  const yearGZ = ((yearCN - 1984) % 60 + 60) % 60;

  // 月柱（节气区间，钟表口径）
  const seg = monthSegment(clockJD, y);
  if (!seg.prev) throw new Error('节气区间计算失败');
  const monthZhiIdx = ZHI.indexOf(seg.prev.monthZhi);
  const monthGanStart = [2, 4, 6, 8, 0][GAN.indexOf(GAN[yearGZ % 10]) % 5];
  const monthGanIdx = (monthGanStart + (monthZhiIdx - 2 + 12) % 12) % 10;
  let mz = 0;
  for (let s = 0; s < 60; s++) { if (s % 10 === monthGanIdx && s % 12 === monthZhiIdx) { mz = s; break; } }

  // 日柱（23:00 换日，按 beijingMs 小时）
  const lateZi = (h === 23);
  const dayGZ = dayGZIndex(lateZi ? jdUT + 1 : jdUT);

  // 时柱
  const hourZhiIdx = Math.floor(((h + 1) % 24) / 2);
  const dayGanIdx = dayGZ % 10;
  const hourGanStart = [0, 2, 4, 6, 8][dayGanIdx % 5];
  const hourGanIdx = (hourGanStart + hourZhiIdx) % 10;
  let hz = 0;
  for (let s = 0; s < 60; s++) { if (s % 10 === hourGanIdx && s % 12 === hourZhiIdx) { hz = s; break; } }

  const pillars = [
    { name: '年柱', gz: gz(yearGZ), gan: yearGZ % 10, zhi: yearGZ % 12 },
    { name: '月柱', gz: gz(mz), gan: mz % 10, zhi: mz % 12 },
    { name: '日柱', gz: gz(dayGZ), gan: dayGZ % 10, zhi: dayGZ % 12 },
    { name: '时柱', gz: gz(hz), gan: hz % 10, zhi: hz % 12 }
  ];
  const dayGan = dayGZ % 10;
  const detail = pillars.map(p => {
    const zhiStr = ZHI[p.zhi];
    return {
      名称: p.name, 干支: p.gz, 干五行: GAN_WUXING[p.gan], 支五行: ZHI_WUXING[p.zhi],
      十神对日主: p.name === '日柱' ? '日主' : shiShen(dayGan, p.gan),
      藏干: ZHI_CANG[zhiStr].map(hh => hh + '（' + shiShen(dayGan, GAN.indexOf(hh)) + '）'),
      纳音: nayinOf(p.gz)
    };
  });

  // 大运（顺逆由年定；折算距离用钟表口径——出生钟表时刻到节气区时时刻）
  const yangYear = GAN_YINYANG[yearGZ % 10] === 0;
  const forward = (yangYear && gender === '男') || (!yangYear && gender === '女');
  const targetJD = forward ? seg.next.jdUT : seg.prev.jdUT;
  const startAge = Math.abs(targetJD - clockJD) / 3;
  const dayunList = [];
  for (let i = 1; i <= 8; i++) {
    const step = forward ? mz + i : mz - i;
    const s = ((step % 60) + 60) % 60;
    const stepAge = startAge + (i - 1) * 10;
    dayunList.push({ 序: i, 干支: gz(s), 起运虚岁: Math.round(stepAge) + 1, 起运公历年约: Math.round(y + stepAge) });
  }

  return {
    四柱: { 年柱: gz(yearGZ), 月柱: gz(mz), 日柱: gz(dayGZ), 时柱: gz(hz) },
    四柱详解: detail,
    月令: { 当令: seg.prev.monthZhi + '月', 上一节: seg.prev.name + ' ' + fmtBJ(seg.prev.jdUT), 下一节: seg.next.name + ' ' + fmtBJ(seg.next.jdUT) },
    大运: { 排法: forward ? '顺排（阳年男/阴年女）' : '逆排（阴年男/阳年女）', 起运岁数: Math.round(startAge * 100) / 100 + '（3天折1年，实足周龄近似）', 序列: dayunList },
    年柱备注: yearShifted ? '生于立春前，年柱取前一年' : '',
    节边预警小时: Math.abs(clockJD - seg.prev.jdUT) * 24
  };
}

/* ============ 农历对照（内置同 nongli.js 的农历表，避免子进程依赖） ============ */
const LUNAR_INFO = [19416,19168,42352,21717,53856,55632,91476,22176,39632,21970,19168,42422,42192,53840,119381,46400,54944,44450,38320,84343,18800,42160,46261,27216,27968,109396,11104,38256,21234,18800,25958,54432,59984,28309,23248,11104,100067,37600,116951,51536,54432,120998,46416,22176,107956,9680,37584,53938,43344,46423,27808,46416,86869,19872,42416,83315,21168,43432,59728,27296,44710,43856,19296,43748,42352,21088,62051,55632,23383,22176,38608,19925,19152,42192,54484,53840,54616,46400,46752,103846,38320,18864,43380,42160,45690,27216,27968,44870,43872,38256,19189,18800,25776,29859,59984,27480,23232,43872,38613,37600,51552,55636,54432,55888,30034,22176,43959,9680,37584,51893,43344,46240,47780,44368,21977,19360,42416,86390,21168,43312,31304,27296,44368,23378,19296,42726,42208,53856,60005,54576,23200,30371,38608,19195,19152,42192,118966,53840,54560,56645,46496,22224,21938,18864,42359,42160,43600,111189,27936,44448,84835,37744,18936,18800,25776,92326,59984,27424,108228,43744,37600,53987,51552,54615,54432,55888,23893,22176,42704,21972,21200,43448,43344,46240,46758,44368,21920,43940,42416,21168,45683,26928,29495,27296,44368,84821,19296,42352,21732,53600,59752,54560,55968,92838,22224,19168,43476,42192,53584,62034,54560];
const YUE_MING = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
const RI_MING = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
const SHENGXIAO = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
function lYearDaysG(y) { let s = 348; const t = LUNAR_INFO[y - 1900]; for (let b = 0x8000; b > 0x8; b >>= 1) s += (t & b) ? 1 : 0; return s + (leapMonthG(y) ? ((LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29) : 0); }
function leapMonthG(y) { return LUNAR_INFO[y - 1900] & 0xf; }
function monthDaysG(y, m) { return (LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29; }
/** 公历UTC毫秒 → 农历字符串（与 nongli.js 同源算法；表范围 1900–2100，超界返回提示） */
function lunarOf(ms) {
  const BASE = Date.UTC(1900, 0, 31);
  if (ms < BASE) return '超出农历表范围（1900前），无农历对照';
  if (ms > Date.UTC(2100, 11, 31)) return '超出农历表范围（2100后），无农历对照';
  let offset = Math.floor((ms - BASE) / 86400000);
  let y = 1900, temp = 0;
  for (; y < 2101 && offset > 0; y++) { temp = lYearDaysG(y); offset -= temp; }
  if (offset < 0) { offset += temp; y--; }
  if (y > 2100) y = 2100;
  const leap = leapMonthG(y);
  let isLeap = false, m = 1;
  for (; m < 13 && offset > 0; m++) {
    if (leap > 0 && m === leap + 1 && !isLeap) { m--; isLeap = true; temp = (LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29; }
    else { temp = monthDaysG(y, m); }
    if (isLeap && m === leap + 1) isLeap = false;
    offset -= temp;
  }
  if (offset === 0 && leap > 0 && m === leap + 1) { if (isLeap) { isLeap = false; } else { isLeap = true; m--; } }
  if (offset < 0) { offset += temp; m--; }
  const d = offset + 1;
  return `${y}年${isLeap ? '闰' : ''}${YUE_MING[m - 1]}月${RI_MING[d - 1]}（${SHENGXIAO[(y - 4) % 12]}年）`;
}

/* ============ 主流程 ============ */
function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === '--help' || args[0] === 'help') {
    console.log('用法: node ganzhi.js <公历或农历日期时间> <男/女> [出生地东经度，默认120]');
    console.log('  公历: node ganzhi.js 1990-05-20T14:30 男 116.4');
    console.log('  农历: node ganzhi.js 农历:1990-闰五-初六T14:30 男 116.4  （日期用农历，时辰仍为钟表时）');
    console.log('输出: 真太阳时四柱（主）+北京时间对照+农历对照+流年+大运（JSON）');
    process.exit(args.length === 0 ? 1 : 0);
  }
  let dateStr = args[0].replace(' ', 'T');
  const gender = args[1] === '女' ? '女' : '男';
  const hasLon = args.length >= 3;
  const lon = hasLon ? parseFloat(args[2]) : 120;

  // 农历输入支持：'农历:'前缀 → 先换公历（同目录 nongli.js 同源表）
  let lunarInput = null;
  if (dateStr.startsWith('农历:')) {
    const core = dateStr.slice(3); // 如 1990-闰五-初六T14:30
    const tPart = core.match(/T\d{2}:\d{2}/) ? core.replace(/^.*T/, '') : '12:00';
    const dPart = core.replace(/T.*$/, '');
    const { execSync } = require('child_process');
    const nl = JSON.parse(execSync(`node "${__dirname}/nongli.js" 农历 "${dPart}"`, { encoding: 'utf8' }));
    if (nl['回环校验'] !== '通过') { console.error('农历输入校验失败: ' + nl['回环校验']); process.exit(1); }
    lunarInput = { 输入: nl['输入农历'], 公历: nl['公历'] };
    dateStr = nl['公历'] + 'T' + tPart;
  }

  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) { console.error('日期格式错误，示例：1990-05-20T14:30 或 农历:1990-闰五-初六T14:30'); process.exit(1); }
  const y = +m[1], mo = +m[2], d = +m[3], h = +m[4], mi = +m[5], se = +(m[6] || 0);
  const beijingMs = Date.UTC(y, mo - 1, d, h, mi, se);
  const p2 = (n) => String(n).padStart(2, '0');

  // 真太阳时校正：经度差 + 均时差（Spencer 标准近似，精度约±1分钟；冬至约0、11月约+16分、2月约−14分）
  const dayOfYear = Math.floor((beijingMs - Date.UTC(y, 0, 1)) / 86400000) + 1;
  const N = (2 * Math.PI * (dayOfYear - 1)) / 365; // 太阳均时差标准角参数
  const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(N) - 0.032077 * Math.sin(N)
                - 0.014615 * Math.cos(2 * N) - 0.040849 * Math.sin(2 * N)); // 分钟（正=真太阳时超前）
  const lonFixMin = (lon - 120) * 4;
  const totalFixMin = lonFixMin + eqTime;
  const solarMs = beijingMs + Math.round(totalFixMin * 60000);

  const bj = buildFor(beijingMs, gender);
  const solar = buildFor(solarMs, gender, jdFromDateUTC(new Date(beijingMs - 8 * 3600000))); // 月柱年柱用钟表口径，日时柱用真太阳时

  const crossShichen = bj.四柱.时柱 !== solar.四柱.时柱;
  const crossDay = bj.四柱.日柱 !== solar.四柱.日柱;
  const sd = new Date(solarMs);
  const solarH = sd.getUTCHours();

  // 晚子时备选：仅当真太阳时为23点（晚子时）时，输出《三命通会》子正0点换日派备选
  let lateZiAlt = null;
  if (solarH === 23) {
    const alt = lateZiZhengZiAlt(solarMs);
    lateZiAlt = {
      说明: '真太阳时23点生（晚子时）。主口径=23点换日（日柱已进位）；若按《三命通会》子正0点换日派（晚子时属当日），则日柱不进位',
      备选日柱: alt.日柱,
      备选时柱: alt.时柱,
      主口径日柱: solar.四柱.日柱,
      主口径时柱: solar.四柱.时柱,
      选用提示: '两派日柱时柱不同，按求测者师承/排盘习惯选用；本技能默认主口径为23点换日'
    };
  }

  const out = {
    出生: { 公历北京时: `${y}-${p2(mo)}-${p2(d)} ${p2(h)}:${p2(mi)}`, ...(lunarInput ? { 输入农历: lunarInput.输入 } : {}), 性别: gender, 出生地东经: lon, 已提供经度: hasLon },
    四柱校验行: `${solar.四柱.年柱}年 ${solar.四柱.月柱}月 ${solar.四柱.日柱}日 ${solar.四柱.时柱}时`,
    农历对照: lunarInput ? `${lunarInput.输入} → 公历${lunarInput.公历}` : lunarOf(beijingMs),
    真太阳时校正: {
      经度差分钟: Math.round(lonFixMin * 10) / 10,
      均时差分钟: Math.round(eqTime * 10) / 10,
      合计校正分钟: Math.round(totalFixMin * 10) / 10,
      真太阳时时刻: `${p2(sd.getUTCMonth() + 1)}-${p2(sd.getUTCDate())} ${p2(sd.getUTCHours())}:${p2(sd.getUTCMinutes())}`,
      未提供经度提示: hasLon ? '' : '未提供出生地经度，按东经120°校准；出生地偏离120°较远时须补经度重排'
    },
    四柱_主口径: solar.四柱, // 年月柱按钟表（区时）判节气；日时柱按真太阳时
    四柱_北京时间对照: bj.四柱,
    时辰差异: crossDay
      ? `真太阳时与北京时间 日柱、时柱均不同（跨日+跨时辰）：北京${bj.四柱.日柱}${bj.四柱.时柱} / 真太阳${solar.四柱.日柱}${solar.四柱.时柱}`
      : (crossShichen
          ? `真太阳时与北京时间 时柱不同（跨时辰）：北京${bj.四柱.时柱} / 真太阳${solar.四柱.时柱}（日柱同）`
          : '真太阳时与北京时间 未穿越，时柱一致'),
    四柱基准: '主口径说明：年柱/月柱按钟表（东八区区时）与节气时刻比较切换（节气是全国统一区时时刻）；日柱（含23点换日）/时柱按真太阳时（钟表+经度差+均时差）判定；晚子时另备《三命通会》子正0点换日派选项',
    ...(lateZiAlt ? { 晚子时备选_子正0点换日派: lateZiAlt } : {}),
    详解: solar.四柱详解,
    月令: solar.月令,
    大运: solar.大运,
    流年表: (() => { // 未未10年流年干支（从当前年份起）
      const nowY = new Date().getUTCFullYear() + 8 > 24 ? new Date().getUTCFullYear() : 2026;
      const startYear = Math.max(nowY, y); // 不早于出生年
      const list = [];
      for (let i = 0; i < 10; i++) {
        const yy = startYear + i;
        const g = ((yy - 1984) % 60 + 60) % 60;
        list.push({ 年: yy, 干支: gz(g), 生肖: SHENGXIAO[(yy - 4) % 12] });
      }
      return { 说明: '流年干支以立春换年（ganzhi 年柱口径）；冲合断法见命层规则第七节', 序列: list };
    })(),
    排盘提示: [
      '年柱以立春为界' + (solar.年柱备注 ? '（' + solar.年柱备注 + '）' : ''),
      '子时换日主口径：23点进位（基于真太阳时）；真太阳时23点生人多一条《三命通会》子正0点换日派备选（见 晚子时备选字段），按师承选用',
      solar.节边预警小时 < 0.5 ? `警告：真太阳时距节气交节不足半小时（${Math.round(solar.节边预警小时 * 60)}分钟），月柱边界强烈建议人工复核`
        : (solar.节边预警小时 < 6 ? `真太阳时距节气交节约${Math.round(solar.节边预警小时)}小时，月柱可靠` : '真太阳时距节气边界充足，月柱可靠'),
      '节气时刻为Meeus低精度算法（误差约±15分钟）；均时差为近似（约±1分钟）'
    ]
  };
  console.log(JSON.stringify(out, null, 2));
}

main();