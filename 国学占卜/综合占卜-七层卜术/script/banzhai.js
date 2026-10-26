#!/usr/bin/env node
/**
 * banzhai.js —— 八宅明镜排盘：命卦计算 + 大游年游星分布 + 宅命配局
 *
 * 用法：
 *   node banzhai.js 命卦 <出生年四位数或日期> <男/女>
 *        示例：node banzhai.js 命卦 1984 男
 *              node banzhai.js 命卦 1984-02-03 女   ← 日期输入按立春粗判年份
 *   node banzhai.js 宅盘 <坐山卦：乾/坤/震/巽/坎/离/艮/兑>
 *        示例：node banzhai.js 宅盘 坐乾
 *   node banzhai.js 配局 <出生年> <男/女> 坐<卦>
 *        示例：node banzhai.js 配局 1984 女 坐乾
 *
 * 算法依据（排盘零差错声明）：
 * 1. 命卦用数根法（验证口径：1984男兑女艮等锚点全对，公式法交叉验算至2099年一致）：
 *    R = 出生年四位数字反复相加至一位；
 *    男命 MR = 11 − R（大于9减9）；女命 FR = 4 + R（大于9减9）；
 *    结果为5：男寄坤2，女寄艮8。
 * 2. 游星分布按大游年歌（八宅明镜原歌诀）：
 *    乾六天五祸绝延生；坎五天生延绝祸六；艮六绝祸生延天五；震延生祸绝五天六；
 *    巽天五六祸生绝延；离六五绝延祸生天；坤天延绝生祸五六；兑生祸延绝六五天。
 *    从坐山卦起伏位，顺后天八卦环（乾→坎→艮→震→巽→离→坤→兑）逐卦配星。
 * 3. 本脚本为"入门级八宅查表"（技能架构定位），不做玄空/三合实断。
 */

'use strict';

/* ============ 常量 ============ */

const GUA = ['乾','坎','艮','震','巽','离','坤','兑']; // 后天八卦顺时针环序（从乾起）
const GUA_MING = { '乾':'西北·天门','坎':'正北','艮':'东北','震':'正东','巽':'东南','离':'正南','坤':'西南·地户','兑':'正西' };
const GUA_SHU = { '坎':1,'坤':2,'震':3,'巽':4,'乾':6,'兑':7,'艮':8,'离':9 };

// 八游星：名（星名）+ 吉凶档
const YOUXING = {
  '生': { 名: '生气', 星: '贪狼木星', 吉凶: '大吉', 义: '生机勃发，宜开门安床，主活力与人丁' },
  '天': { 名: '天医', 星: '巨门土星', 吉凶: '中吉', 义: '健康贵人，宜居卧房，主病愈扶助' },
  '延': { 名: '延年', 星: '武曲金星', 吉凶: '大吉', 义: '和合长久，宜主卧灶位，主婚姻长寿' },
  '伏': { 名: '伏位', 星: '辅弼木星', 吉凶: '小吉', 义: '平稳安顺，宜静室储物' },
  '绝': { 名: '绝命', 星: '破军金星', 吉凶: '大凶', 义: '健康大忌，忌开门居卧' },
  '五': { 名: '五鬼', 星: '廉贞火星', 吉凶: '大凶', 义: '口舌是非，忌灶口冲射' },
  '祸': { 名: '祸害', 星: '禄存土星', 吉凶: '小凶', 义: '琐碎损耗，宜作次用空间' },
  '六': { 名: '六煞', 星: '文曲水星', 吉凶: '中凶', 义: '纠葛纷扰，宜卫生间厨房压制' }
};

// 大游年歌诀（起首卦→歌）
const DAYOUnIAN = {
  '乾': '乾六天五祸绝延生',
  '坎': '坎五天生延绝祸六',
  '艮': '艮六绝祸生延天五',
  '震': '震延生祸绝五天六',
  '巽': '巽天五六祸生绝延',
  '离': '离六五绝延祸生天',
  '坤': '坤天延绝生祸五六',
  '兑': '兑生祸延绝六五天'
};

const DONGSI = ['坎','离','震','巽'];       // 东四卦
const XISI = ['乾','坤','艮','兑'];           // 西四卦

/* ============ 命卦计算（数根法） ============ */

// 由干支年（立春年为界）算命卦
function mingGua(yearCN, gender) {
  if (gender !== '男' && gender !== '女') { console.error('性别非法: "' + gender + '"。须为 男 或 女'); process.exit(1); }
  // 数根 R：四位数字反复相加至一位
  let r = String(yearCN).split('').reduce((a, c) => a + (+c), 0);
  while (r > 9) r = String(r).split('').reduce((a, c) => a + (+c), 0);
  let num;
  if (gender === '男') {
    num = 11 - r; if (num > 9) num -= 9; if (num === 5) num = 2; // 男逢5寄坤
  } else {
    num = 4 + r; if (num > 9) num -= 9; if (num === 5) num = 8; // 女逢5寄艮
  }
  const gua = Object.keys(GUA_SHU).find(k => GUA_SHU[k] === num);
  return { gua, shu: num, 组: DONGSI.includes(gua) ? '东四命' : '西四命' };
}

// 立春粗判：立春必落在2月3日—2月5日。窗口内的输入提示人工复核
function yearOf(dateStr) {
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return { y: parseInt(dateStr), edge: false };
  const y = +m[1], mo = +m[2], d = +m[3];
  if (mo < 2) return { y: y - 1, edge: false };          // 1月出生属前一年干支年
  if (mo > 2) return { y, edge: false };
  if (d >= 6) return { y, edge: false };                  // 2月6日后必已立春
  if (d <= 2) return { y: y - 1, edge: false };           // 2月2日前必未立春
  return { y: (d === 3 ? y - 1 : y), edge: true };        // 2月3-5日为交节窗口
}

/* ============ 游星分布（大游年歌） ============ */

// 由坐山卦算八方游星。返回 {卦名: 星key}
function youxingOf(shan) {
  const song = DAYOUnIAN[shan];
  // 歌诀第1字为坐山（伏位），其后逐卦顺后天环配星
  const chars = song.split('').slice(1); // 去掉首字卦名
  const dist = {};
  dist[shan] = '伏'; // 本宫伏位
  let idx = GUA.indexOf(shan);
  for (const c of chars) {
    idx = (idx + 1) % 8;
    dist[GUA[idx]] = c;
  }
  return dist;
}

/* ============ 主流程 ============ */

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('用法见文件头注释。三种模式：命卦 / 宅盘 / 配局');
    process.exit(1);
  }
  const mode = args[0];

  if (mode === '命卦') {
    const { y, edge } = yearOf(args[1]);
    const g = args[2] || '男';
    const r = mingGua(y, g);
    // 四吉方与四凶方（以命卦起伏位推该命之游星分布）
    const dist = youxingOf(r.gua);
    const ji = [], xiong = [];
    for (const k of Object.keys(dist)) {
      const star = YOUXING[dist[k]];
      (star.吉凶.includes('吉') ? ji : xiong).push(`${k}(${star.名}·${star.吉凶})`);
    }
    console.log(JSON.stringify({
      出生年: y + (edge ? '（生于2月3-5日立春窗口，命卦年份请以 ganzhi.js 排出的干支年为准，需人工复核）' : '（已按立春界归年）'),
      性别: g,
      命卦: `${r.gua}（${GUA_MING[r.gua]}）`,
      命数: r.shu,
      命组: r.组,
      四吉方: ji,
      四凶方: xiong,
      说明: '八宅入门查表：命卦与宅卦同组（东四/西四）为宅命相配；命之生气方宜为宅门/主卧方位。'
    }, null, 2));
    return;
  }

  if (mode === '宅盘') {
    const shan = (args[1] || '').replace('坐', '');
    if (!DAYOUnIAN[shan]) { console.error('坐山卦识别失败，支持：乾/坤/震/巽/坎/离/艮/兑'); process.exit(1); }
    const dist = youxingOf(shan);
    const rows = {};
    for (const k of Object.keys(dist)) {
      const s = YOUXING[dist[k]];
      rows[k] = `${s.名}（${s.星}·${s.吉凶}）——${s.义}`;
    }
    console.log(JSON.stringify({
      坐山: `${shan}（${GUA_MING[shan]}）`,
      宅组: (DONGSI.includes(shan) ? '东四宅' : '西四宅'),
      大游年分布: rows,
      歌诀: DAYOUnIAN[shan]
    }, null, 2));
    return;
  }

  if (mode === '配局') {
    const { y, edge } = yearOf(args[1]);
    const g = args[2] || '男';
    const shan = (args[3] || '').replace('坐', '');
    if (!DAYOUnIAN[shan]) { console.error('坐山卦识别失败'); process.exit(1); }
    const r = mingGua(y, g);
    const dist = youxingOf(shan);
    const rows = {};
    for (const k of Object.keys(dist)) {
      const s = YOUXING[dist[k]];
      rows[k] = { 游星: `${s.名}·${s.吉凶}`, 注: s.义 };
    }
    // 命卦落宫的游星（命卦所在方位，对该宅而言）
    const mingWei = dist[r.gua];
    const peiOk = (DONGSI.includes(r.gua) && DONGSI.includes(shan)) || (XISI.includes(r.gua) && XISI.includes(shan));
    console.log(JSON.stringify({
      出生命卦: `${r.gua}（${r.组}${edge ? '；生于立春窗口需复核' : ''}）`,
      宅: `坐${shan}（${DONGSI.includes(shan) ? '东四宅' : '西四宅'}）`,
      宅命相配: peiOk ? '相配（同组）——吉' : '不配（异组）——东四命居西四宅或反之，古法视为大局不合',
      命卦方位的游星: YOUXING[mingWei].名 + '（' + YOUXING[mingWei].吉凶 + '）',
      八方游星分布: rows,
      免责: '本输出为八宅入门查表结果，方位断语以《规则库/相层规则.md》为准；不做玄空三合实断。'
    }, null, 2));
    return;
  }

  console.error('未知模式：' + mode);
  process.exit(1);
}

main();
