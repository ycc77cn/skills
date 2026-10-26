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
    if (__y < 1900 || __y > 2100) {
      console.error('日期超出支持范围（1900-2100）: "' + __args[__i] + '"——请核对后重试');
      process.exit(1);
    }
  }
})();
/**
 * nongli.js —— 农历⇄公历换算与干支查询引擎（1900–2100）
 *
 * 模式：
 *   node nongli.js 今天                       → 今日公历/农历/干支/时辰/旬空（小六壬起课、择日用）
 *   node nongli.js 公历 2026-10-18           → 该日公历→农历、干支四柱级（年月日干支）、旬空
 *   node nongli.js 农历 2026-九-初八          → 农历→公历（闰月格式：闰四月）
 *   node nongli.js 农历 2026-9-8             → 数字月日版本
 *   node nongli.js 干支 2026-10-18           → 该日干支+旬空+月建+建除（择日校验用）
 *
 * 数据表：与 script/liuyao.js 内嵌农历库同源（1900–2100 儒略日基准数据）。
 * 算法注：农历年数据为位压缩年表（位含义：1–4闰月月份；5–16逐月大小月；16闰月大小）。
 */

'use strict';

/* ============ 农历数据表（1900–2100，与 liuyao.js 同源） ============ */
const LUNAR_INFO = [19416,19168,42352,21717,53856,55632,91476,22176,39632,21970,19168,42422,42192,53840,119381,46400,54944,44450,38320,84343,18800,42160,46261,27216,27968,109396,11104,38256,21234,18800,25958,54432,59984,28309,23248,11104,100067,37600,116951,51536,54432,120998,46416,22176,107956,9680,37584,53938,43344,46423,27808,46416,86869,19872,42416,83315,21168,43432,59728,27296,44710,43856,19296,43748,42352,21088,62051,55632,23383,22176,38608,19925,19152,42192,54484,53840,54616,46400,46752,103846,38320,18864,43380,42160,45690,27216,27968,44870,43872,38256,19189,18800,25776,29859,59984,27480,23232,43872,38613,37600,51552,55636,54432,55888,30034,22176,43959,9680,37584,51893,43344,46240,47780,44368,21977,19360,42416,86390,21168,43312,31060,27296,44368,23378,19296,42726,42208,53856,60005,54576,23200,30371,38608,19195,19152,42192,118966,53840,54560,56645,46496,22224,21938,18864,42359,42160,43600,111189,27936,44448,84835,37744,18936,18800,25776,92326,59984,27424,108228,43744,37600,53987,51552,54615,54432,55888,23893,22176,42704,21972,21200,43448,43344,46240,46758,44368,21920,43940,42416,21168,45683,26928,29495,27296,44368,84821,19296,42352,21732,53600,59752,54560,55968,92838,22224,19168,43476,42192,53584,62034,54560];

const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const SHENGXIAO = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
const YUE_MING = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
const RI_MING = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];

/* ============ 农历核心 ============ */
function lYearDays(y) { // 农历年总天数
  let s = 348;
  const t = LUNAR_INFO[y - 1900];
  for (let b = 0x8000; b > 0x8; b >>= 1) s += (t & b) ? 1 : 0;
  return s + leapDays(y);
}
function leapMonth(y) { return LUNAR_INFO[y - 1900] & 0xf; }          // 闰几月（0=无闰）
function leapDays(y) { if (!leapMonth(y)) return 0; return (LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29; }
function monthDays(y, m) { return (LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29; } // m:1-12

// 基准：1900-01-31 为农历1900年正月初一
const BASE_DATE = Date.UTC(1900, 0, 31);

/** 公历UTC毫秒 → {年,月,日,闰月?,年天,生肖}；越界抛错 */
function solar2lunar(ms) {
  if (ms < BASE_DATE) throw new Error('超出农历表范围（该日在1900-01-31前，无农历数据）');
  let offset = Math.floor((ms - BASE_DATE) / 86400000);
  let y = 1900, temp = 0;
  for (; y < 2101 && offset > 0; y++) { temp = lYearDays(y); offset -= temp; }
  if (offset < 0) { offset += temp; y--; }
  const leap = leapMonth(y);
  let isLeap = false, m = 1;
  for (; m < 13 && offset > 0; m++) {
    if (leap > 0 && m === leap + 1 && !isLeap) { m--; isLeap = true; temp = leapDays(y); }
    else { temp = monthDays(y, m); }
    if (isLeap && m === leap + 1) isLeap = false;
    offset -= temp;
  }
  if (offset === 0 && leap > 0 && m === leap + 1) {
    if (isLeap) { isLeap = false; } else { isLeap = true; m--; }
  }
  if (offset < 0) { offset += temp; m--; }
  const d = offset + 1;
  return { 年: y, 月: m, 日: d, 闰: isLeap, 月名: (isLeap ? '闰' : '') + YUE_MING[m - 1] + '月', 日名: RI_MING[d - 1], 生肖: SHENGXIAO[(y - 4) % 12] };
}

/** 农历{年,月(1-12),日,闰} → 公历UTC毫秒 */
function lunar2solar(y, m, d, isLeap) {
  if (y < 1901 || y > 2099) throw new Error('农历年支持范围 1901–2099');
  if (!Number.isInteger(m) || m < 1 || m > 12) throw new Error('农历月份须为正月至腊月（1–12），无"十三月"');
  if (!Number.isInteger(d) || d < 1 || d > 30) throw new Error('农历日须为初一至三十');
  const leap = leapMonth(y);
  if (isLeap && leap !== m) throw new Error(`${y}年无闰${YUE_MING[m-1]}月`);
  // 本年月份序列：普通月1..12，闰M 插在 M 之后（序号 M+0.5，用 isLeap 标记）
  // 目标：offset = 1900-01-31 至目标月初一的天数
  let offset = 0;
  for (let i = 1900; i < y; i++) offset += lYearDays(i);
  // 逐月推进：走到目标月（含闰月区分）之前
  let mm = 1, isL = false;
  while (true) {
    if (mm === m && isL === isLeap) break; // 到达目标月
    if (!isL) {
      offset += monthDays(y, mm);
      if (leap === mm) { isL = true; } else { mm++; } // 进入闰mm月
      if (mm > 12) break; // 防御
    } else {
      offset += leapDays(y);
      isL = false; mm++;
    }
  }
  // 防御：若月份序列走完未匹配（如请求闰月但当年无闰）
  if (!(mm === m && isL === isLeap)) {
    if (isLeap) throw new Error(`${y}年无闰${YUE_MING[m-1]}月`);
    throw new Error('农历月份越界');
  }
  const monthLen = isL ? leapDays(y) : monthDays(y, m);
  if (d < 1 || d > monthLen) throw new Error(`${y}年${isLeap?'闰':''}${YUE_MING[m-1]}月无${RI_MING[d-1]||d+'日'}（该月仅${monthLen}天）`);
  offset += d - 1;
  return BASE_DATE + offset * 86400000;
}

/* ============ 干支 ============ */
function dayGZ(ms) { // 日干支：以 1949-10-01 甲子 日序=0 锚
  const days = Math.floor(ms / 86400000); // UTC天数
  const anchor = Math.floor(Date.UTC(1949, 9, 1) / 86400000);
  return ((days - anchor) % 60 + 60) % 60;
}
function yearGZ(ms) { // 年干支（立春分界由调用方处理，此处按农历年正月初一起—供显示）
  const L = solar2lunar(ms);
  return ((L.年 - 1984) % 60 + 60) % 60;
}
function xunKong(dayIdx) { // 日旬空
  const xunStart = Math.floor(dayIdx / 10) * 10;
  const startZhi = (xunStart % 12 + 12) % 12; // 旬首（甲X）的地支
  const kongs = [];
  for (let i = 10; i < 12; i++) kongs.push(ZHI[(startZhi + i) % 12]);
  return kongs.join('');
}

// 简易农历月干支（按农历年五虎遁，只用于参考显示；八字月柱以节气为准不在此算）
function lunarMonthGZ(lunar) {
  const yearGan = ((lunar.年 - 4) % 10 + 10) % 10; // 4=甲（公元前？简化：1984甲子，(y-1984)%60）
  const ygz = ((lunar.年 - 1984) % 60 + 60) % 60;
  const gan = ygz % 10;
  const start = [2, 4, 6, 8, 0][gan % 5]; // 五虎遁
  const mg = (start + (lunar.月 - 1)) % 10; // 正月=寅...简化以正月起
  const zhi = (lunar.月 + 1) % 12;         // 寅=2
  return GAN[mg] + ZHI[zhi];
}

/* ============ 解析工具 ============ */
const p2 = n => String(n).padStart(2, '0');
function parseCnNum(s) { // 中文月日解析："九"→9、"廿三"→23、"三十"→30、数字直通
  if (/^\d+$/.test(s)) return +s;
  const simple = { '正': 1, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10, '冬': 11, '十一': 11, '腊': 12, '十二': 12 };
  if (simple[s] !== undefined) return simple[s];
  if (/^初[一二三四五六七八九十]$/.test(s)) return parseCnNum(s[1]);
  if (/^十[一二三四五六七八九]$/.test(s)) return 10 + parseCnNum(s[1]);
  if (/^廿[一二三四五六七八九]$/.test(s)) return 20 + parseCnNum(s[1]);
  if (s === '二十') return 20; if (s === '三十') return 30;
  if (/^二?十[一二三四五六七八九]?$/.test(s)) { // 十X / 二十X 兜底
    const base = s.startsWith('二') ? 20 : 10;
    const rest = s.replace(/^二?十/, '');
    return base + (rest ? parseCnNum(rest) : 0);
  }
  throw new Error('无法解析农历月/日: ' + s);
}

/* ============ 主流程 ============ */
function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('用法: node nongli.js 今天 | 公历 YYYY-MM-DD | 农历 YYYY-月-日 | 干支 YYYY-MM-DD');
    console.log('   农历示例: node nongli.js 农历 2026-九-初八 | node nongli.js 农历 2026-9-8');
    process.exit(0);
  }
  const mode = args[0];

  if (mode === '今天') {
    const now = new Date();
    // ms = 本地钟表字段按UTC拼的数值（"假UTC"）：日序直接等于本地日历日，日干支/农历与此口径自洽
    const ms = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(),
      now.getHours(), now.getMinutes(), now.getSeconds());
    const L = solar2lunar(ms);
    const dIdx = dayGZ(ms); // 按"本地日历日"取日柱（注意不能再减8h——否则本地00:00-08:00查询会退回前一日日柱）
    const hourZhi = ZHI[Math.floor(((now.getHours() + 1) % 24) / 2)];
    console.log(JSON.stringify({
      公历: `${now.getFullYear()}-${p2(now.getMonth() + 1)}-${p2(now.getDate())}`,
      时间: `${p2(now.getHours())}:${p2(now.getMinutes())}`,
      农历: `${L.年}年${L.月名}${L.日名}${L.闰 ? '（闰月）' : ''}`,
      生肖年: L.生肖,
      日干支: GAN[dIdx % 10] + ZHI[dIdx % 12],
      旬空: xunKong(dIdx),
      当前时支: hourZhi,
      说明: '小六壬起课用农历月日时（本字段）；六爻/八字排盘用对应专脚本'
    }, null, 2));
    return;
  }

  if (mode === '公历') {
    const m = (args[1] || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!m) { console.error('公历格式: YYYY-MM-DD'); process.exit(1); }
    const ms = Date.UTC(+m[1], +m[2] - 1, +m[3], 12); // 取当日正午（UTC时基），避免时区日界歧义
    let L;
    try { L = solar2lunar(ms); } catch (e) {
      console.log(JSON.stringify({ 公历: `${m[1]}-${p2(+m[2])}-${p2(+m[3])}`, 错误: e.message, 日干支: (() => { const di = dayGZ(ms - 8 * 3600000); return GAN[di % 10] + ZHI[di % 12]; })(), 说明: '日干支基于日期序计算仍可用（已对拍史锚）；农历部分超出表范围' }, null, 2));
      process.exit(0);
    }
    const dIdx = dayGZ(ms - 8 * 3600000);
    console.log(JSON.stringify({
      公历: `${m[1]}-${p2(+m[2])}-${p2(+m[3])}`,
      农历: `${L.年}年${L.月名}${L.日名}`,
      闰月: L.闰 ? `闰${YUE_MING[L.月 - 1]}月` : '无',
      生肖: L.生肖,
      日干支: GAN[dIdx % 10] + ZHI[dIdx % 12],
      旬空: xunKong(dIdx),
      农历月干支参考: lunarMonthGZ(L),
      说明: '八字月柱/年柱以节气为准（ganzhi.js）；此日干支可与排盘软件对拍'
    }, null, 2));
    return;
  }

  if (mode === '农历') {
    const raw = args[1] || '';
    const m = raw.match(/^(\d{4})[-/](闰?)([^-/]+)[-/]([^-/]+)$/);
    if (!m) { console.error('农历格式: YYYY-[闰]月-日，如 2026-九-初八 或 2026-闰四-十五'); process.exit(1); }
    const y = +m[1];
    const isLeap = m[2] === '闰';
    const mon = parseCnNum(m[3]);
    const dd = parseCnNum(m[4]);
    try {
      const ms = lunar2solar(y, mon, dd, isLeap) + 12 * 3600000; // 当日正午，避免日界歧义
      const back = solar2lunar(ms); // 回环校验
      const dIdx = dayGZ(ms - 8 * 3600000);
      const dt = new Date(ms);
      console.log(JSON.stringify({
        输入农历: `${y}年${isLeap ? '闰' : ''}${YUE_MING[mon - 1]}月${RI_MING[dd - 1]}`,
        公历: `${dt.getUTCFullYear()}-${p2(dt.getUTCMonth() + 1)}-${p2(dt.getUTCDate())}`,
        回环校验: back.月 === mon && back.日 === dd && back.闰 === isLeap ? '通过' : `不一致(实为${back.年}年${back.月名}${back.日名})——请核对输入`,
        日干支: GAN[dIdx % 10] + ZHI[dIdx % 12],
        旬空: xunKong(dIdx),
        用法: '以此公历日期+出生时辰进 ganzhi.js 排四柱'
      }, null, 2));
    } catch (e) { console.error(e.message); process.exit(1); }
    return;
  }

  if (mode === '干支') {
    const m = (args[1] || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!m) { console.error('公历格式: YYYY-MM-DD'); process.exit(1); }
    // 全部用"北京时"口径：正午=UTC+8的12点(=UTC 4点)。日柱按北京日界。
    const msDayStart = Date.UTC(+m[1], +m[2] - 1, +m[3]) - 8 * 3600000;   // 北京0:00
    const msNoon = msDayStart + 12 * 3600000;                              // 北京正午
    const msDayEnd = msDayStart + 24 * 3600000 - 60000;                     // 北京23:59
    const dIdx = dayGZ(msNoon);
    let L = null;
    try { L = solar2lunar(msNoon); } catch (e) { /* 越界时农历字段留空 */ }
    // 局层线索：阳遁/阴遁 + 局数（时家奇门节气三元粗判）
    const jieqiHint = qiHou(msNoon);
    // 建除十二神：由节气月建起"建"，数至日支（建除满平定执破危成收开闭）
    const JIANCHU = ['建','除','满','平','定','执','破','危','成','收','开','闭'];
    const jianchuIdx = (dIdx % 12 - ZHI.indexOf(jieqiHint.月建) + 12) % 12;
    // 交节日检测：当日 0:00 与 23:59 的月建不同 → 今日交节，节前节后双口径
    const jStart = qiHou(msDayStart).月建, jEnd = qiHou(msDayEnd).月建;
    let jianchuOut, yuepoOut;
    if (jStart !== jEnd) {
      const jcOld = JIANCHU[(dIdx % 12 - ZHI.indexOf(jStart) + 12) % 12];
      const jcNew = JIANCHU[(dIdx % 12 - ZHI.indexOf(jEnd) + 12) % 12];
      const poOld = (dIdx % 12 === (ZHI.indexOf(jStart) + 6) % 12) ? '是' : '否';
      const poNew = (dIdx % 12 === (ZHI.indexOf(jEnd) + 6) % 12) ? '是' : '否';
      jianchuOut = `今日节气交节（月建由${jStart}换${jEnd}）：节前=${jStart}建·${jcOld}日；节后=${jEnd}建·${jcNew}日（建除随交节时刻切换——协纪体系按时刻分界；交节为何节及精确时刻用 ganzhi.js 月令字段查询）`;
      yuepoOut = `节前${poOld} / 节后${poNew}（交节精确时刻用 ganzhi.js 月令字段查询）`;
    } else {
      jianchuOut = JIANCHU[jianchuIdx];
      yuepoOut = (dIdx % 12 === (ZHI.indexOf(jieqiHint.月建) + 6) % 12) ? '是（此日与月建相冲，即月破日，百事不宜——协纪通行忌例）' : '否';
    }
    console.log(JSON.stringify({
      公历: `${m[1]}-${p2(+m[2])}-${p2(+m[3])}`,
      日干支: GAN[dIdx % 10] + ZHI[dIdx % 12],
      旬空: xunKong(dIdx),
      月建: jieqiHint.月建 + '（' + jieqiHint.当前节气 + '段，北京正午口径）',
      建除十二神: jianchuOut,
      月破判断: yuepoOut,
      四离四绝: siLiSiJue(msNoon),
      农历: L ? `${L.年}年${L.月名}${L.日名}` : '超出农历表范围',
      局层线索: jieqiHint,
      说明: '择日硬筛专用：冲生肖（日支冲年支）、旬空、月破（见"月破判断"字段）、建除（建满平收黑、除危定执黄、成开皆可用、破闭不相当）；交节日建除已分节前节后双口径；局层起局线索见"局层线索"字段'
    }, null, 2));
    return;
  }

  console.error('未知模式: ' + mode);
  process.exit(1);
}

/** 节气候：返回当前所处节气（用于阳遁阴遁与局数线索） */
// 二十四节气太阳黄经（标准天文值，春分0°起每节气15°）
const JIE_DEG = [['春分',0],['清明',15],['谷雨',30],['立夏',45],['小满',60],['芒种',75],
                 ['夏至',90],['小暑',105],['大暑',120],['立秋',135],['处暑',150],['白露',165],
                 ['秋分',180],['寒露',195],['霜降',210],['立冬',225],['小雪',240],['大雪',255],
                 ['冬至',270],['小寒',285],['大寒',300],['立春',315],['雨水',330],['惊蛰',345]];
function qiHou(ms) {
  const jd = ms / 86400000 + 2440587.5;
  const lon = solarLon(jd);
  // 当前节气 = 黄经落在该节气起点后的 15° 区段（区段起点即节气名）
  let q = JIE_DEG[JIE_DEG.length - 1];
  for (const [name, deg] of JIE_DEG) {
    const diff = ((lon - deg) % 360 + 360) % 360;
    if (diff < 15) { q = [name, deg]; break; }
  }
  // 遁别与三元局数表（时家奇门口诀：冬至惊蛰一七四、小寒二八五…阳遁顺；夏至白露九三六…阴遁逆）
  const dunBiao = {
    '冬至': ['阳遁','一七四'],'小寒': ['阳遁','二八五'],'大寒': ['阳遁','三九六'],
    '立春': ['阳遁','八五二'],'雨水': ['阳遁','九六三'],'惊蛰': ['阳遁','一七四'],
    '春分': ['阳遁','三九六'],'清明': ['阳遁','四一七'],'谷雨': ['阳遁','五二八'],
    '立夏': ['阳遁','四一七'],'小满': ['阳遁','五二八'],'芒种': ['阳遁','六三九'],
    '夏至': ['阴遁','九三六'],'小暑': ['阴遁','八二五'],'大暑': ['阴遁','七一四'],
    '立秋': ['阴遁','二五八'],'处暑': ['阴遁','一四七'],'白露': ['阴遁','九三六'],
    '秋分': ['阴遁','七一四'],'寒露': ['阴遁','六九三'],'霜降': ['阴遁','五八二'],
    '立冬': ['阴遁','六九三'],'小雪': ['阴遁','五八二'],'大雪': ['阴遁','四七一']
  };
  const info = dunBiao[q[0]] || null;
  // 月建（节气月支，择日建除用）：以立春315°为寅月起算，每30°换支
  const monthJianIdx = (Math.floor(((lon + 45) % 360) / 30) + 2) % 12;
  return {
    当前节气: q[0],
    太阳黄经: Math.round(lon * 10) / 10,
    月建: ZHI[monthJianIdx],
    遁别: info ? info[0] : null,
    节气三元局数表: info ? `${q[0]}：上元${info[1][0]}局、中元${info[1][1]}局、下元${info[1][2]}局` : null,
    说明: '三元属上中下哪一元需按日辰符头（甲子/甲午/己卯/己酉为上元符头）判定，符头核局本工具不做（局层入门定位）；此表供起局参考'
  };
}
function siLiSiJue(ms) {
  /* 四离四绝判定：二分二至（春分/夏至/秋分/冬至）前一日=四离；四立（立春/立夏/立秋/立冬）前一日=四绝。
     按太阳黄经反解交节时刻（线性近似）：距交节小时数落在 12~36 即"明日交节、今日为前一日" */
  const KEY = [['立春',315,'四绝'],['春分',0,'四离'],['立夏',45,'四绝'],['夏至',90,'四离'],['立秋',135,'四绝'],['秋分',180,'四离'],['立冬',225,'四绝'],['冬至',270,'四离']];
  const jd = ms / 86400000 + 2440587.5;
  const lon = solarLon(jd);
  for (const [name, ang, type] of KEY) {
    const dAng = ((ang - lon) % 360 + 360) % 360;
    const hoursTo = dAng / 0.9856 * 24;
    if (hoursTo > 12 && hoursTo < 36) { return type + '（' + name + '前一日）'; }
  }
  return '否';
}
function solarLon(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C = (1.914602 - 0.004817 * T) * Math.sin(M * Math.PI / 180)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI / 180)
          + 0.000289 * Math.sin(3 * M * Math.PI / 180);
  return ((L0 + C - 0.00569) % 360 + 360) % 360;
}

main();
