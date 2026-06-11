export const COLORS = {
  red: "#d94d31",
  orange: "#e98b38",
  yellow: "#f3bd3e",
  green: "#4f8b49",
  blue: "#2f5f9d",
  cyan: "#1a8ca1",
  purple: "#7660a8",
  pink: "#df6f90",
  black: "#161713",
  white: "#fffaf0",
  gray: "#7b7c75",
  brown: "#8a5a35",
  sky: "#8fd1d8",
  navy: "#1d3557",
  gold: "#e7ad2f"
};

const COLOR_ALIASES = {
  crimson: "red",
  scarlet: "red",
  rose: "pink",
  violet: "purple",
  indigo: "blue",
  azure: "blue",
  teal: "cyan",
  turquoise: "cyan",
  skyblue: "sky",
  lime: "green",
  emerald: "green",
  grey: "gray",
  dark: "black",
  light: "white",
  红: "red",
  红色: "red",
  橙: "orange",
  橙色: "orange",
  黄色: "yellow",
  黄: "yellow",
  绿色: "green",
  绿: "green",
  蓝色: "blue",
  蓝: "blue",
  青色: "cyan",
  天蓝: "sky",
  天蓝色: "sky",
  紫色: "purple",
  紫: "purple",
  粉色: "pink",
  粉: "pink",
  粉红: "pink",
  黑色: "black",
  白色: "white",
  灰色: "gray",
  棕色: "brown",
  金色: "gold"
};

const NUMBER_WORDS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  十一: 11,
  十二: 12,
  一: 1,
  二: 2,
  两: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10
};

const NUMBER_PATTERN = [
  "\\d{1,2}",
  "eleven",
  "twelve",
  "three",
  "seven",
  "eight",
  "four",
  "five",
  "nine",
  "one",
  "two",
  "six",
  "ten",
  "十一",
  "十二",
  "两",
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十"
].join("|");

export function normalizeCommand(input) {
  return String(input || "")
    .trim()
    .replace(/[，。！？；：“”‘’（）()]/g, " ")
    .replace(/[,.!?;:]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function hasAny(text, words) {
  return words.some((word) => text.includes(word));
}

function numberFrom(text, fallback = 1) {
  const digit = text.match(/\b(\d{1,2})\b/);
  if (digit) return Math.max(1, Math.min(12, Number(digit[1])));
  const entries = Object.entries(NUMBER_WORDS).sort((a, b) => b[0].length - a[0].length);
  for (const [word, value] of entries) {
    if (text.includes(word)) return value;
  }
  return fallback;
}

function numberValue(token) {
  if (/^\d+$/.test(token)) return Math.max(1, Math.min(12, Number(token)));
  return NUMBER_WORDS[token] || 1;
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countFor(text, keywords, fallback = 1) {
  for (const keyword of keywords) {
    const escaped = escapeRegExp(keyword);
    const englishPattern = new RegExp(`\\b(${NUMBER_PATTERN})(?:\\s+\\w+){0,3}\\s+${escaped}s?\\b`, "i");
    const english = text.match(englishPattern);
    if (english) return numberValue(english[1].toLowerCase());

    const chinesePattern = new RegExp(`(${NUMBER_PATTERN})\\s*(?:个|颗|朵|棵|条|座|只)?[^\\d一二两三四五六七八九十,，。！？;；]{0,8}${escaped}`, "i");
    const chinese = text.match(chinesePattern);
    if (chinese) return numberValue(chinese[1].toLowerCase());
  }
  return fallback;
}

function colorFrom(text, fallback = "black") {
  const clean = normalizeCommand(text);
  for (const key of Object.keys(COLORS)) {
    if (clean.includes(key)) return key;
  }
  for (const [alias, color] of Object.entries(COLOR_ALIASES)) {
    if (clean.includes(alias)) return color;
  }
  return fallback;
}

function sizeFrom(text, fallback = 70) {
  const direct = text.match(/\b(?:radius|size|width|height|thickness)\s*(\d{1,3})\b/);
  if (direct) return Math.max(8, Math.min(220, Number(direct[1])));
  if (hasAny(text, ["tiny", "small", "小"])) return 32;
  if (hasAny(text, ["huge", "large", "big", "giant", "大"])) return 120;
  if (hasAny(text, ["thin", "细"])) return 16;
  if (hasAny(text, ["thick", "粗"])) return 110;
  return fallback;
}

function pointFrom(text, canvas) {
  const width = canvas.width;
  const height = canvas.height;
  let x = width / 2;
  let y = height / 2;

  if (hasAny(text, ["left", "左"])) x = width * 0.25;
  if (hasAny(text, ["right", "右"])) x = width * 0.75;
  if (hasAny(text, ["top", "upper", "上"])) y = height * 0.25;
  if (hasAny(text, ["bottom", "lower", "下"])) y = height * 0.75;
  if (hasAny(text, ["center", "middle", "中央", "中间"])) {
    x = width / 2;
    y = height / 2;
  }

  const at = text.match(/\b(?:at|位置)\s*(\d{2,4})\s*(?:,|and|x|\s)\s*(\d{2,4})\b/);
  if (at) {
    x = Math.max(0, Math.min(width, Number(at[1])));
    y = Math.max(0, Math.min(height, Number(at[2])));
  }

  return { x, y };
}

function baseStyle(text, fallback = "black") {
  const color = colorFrom(text, fallback);
  return {
    color,
    fill: COLORS[color] || COLORS.black,
    stroke: COLORS[color] || COLORS.black,
    width: hasAny(text, ["thin", "细"]) ? 4 : hasAny(text, ["thick", "粗"]) ? 14 : 8
  };
}

function op(type, text, canvas, extra = {}) {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    at: pointFrom(text, canvas),
    style: baseStyle(text, extra.defaultColor || "black"),
    size: sizeFrom(text, extra.defaultSize || 70),
    label: extra.label,
    meta: extra.meta || {}
  };
}

function repeatShape(type, text, canvas, count, extra = {}) {
  const start = pointFrom(text, canvas);
  const spread = Math.min(canvas.width * 0.55, 110 * Math.max(count - 1, 1));
  return Array.from({ length: count }, (_, index) => {
    const offset = count === 1 ? 0 : -spread / 2 + (spread / (count - 1)) * index;
    const next = op(type, text, canvas, extra);
    next.at = {
      x: Math.max(40, Math.min(canvas.width - 40, start.x + offset)),
      y: start.y + (index % 2 === 0 ? -8 : 10)
    };
    next.size = Math.max(26, Math.min(next.size, 90));
    return next;
  });
}

function scenePlan(text, canvas) {
  const ops = [];
  if (hasAny(text, ["night", "moon", "星空", "夜"])) {
    ops.push({ type: "background", theme: "night" });
    ops.push({ ...op("moon", "yellow upper right", canvas, { defaultColor: "yellow", defaultSize: 76 }), at: { x: canvas.width * 0.78, y: canvas.height * 0.2 } });
    ops.push(...repeatShape("star", "yellow top", canvas, countFor(text, ["star", "stars", "星"], 8), { defaultColor: "yellow", defaultSize: 38 }));
  }
  if (hasAny(text, ["sky", "blue sky", "天空", "蓝天"]) && !hasAny(text, ["night", "moon", "星空", "夜", "sunset", "夕阳", "日落"])) {
    ops.push({ type: "background", theme: "sky" });
  }
  if (hasAny(text, ["sunset", "sun", "夕阳", "日落"])) {
    ops.push({ type: "background", theme: "sunset" });
    ops.push({ ...op("sun", "orange upper right", canvas, { defaultColor: "orange", defaultSize: 95 }), at: { x: canvas.width * 0.78, y: canvas.height * 0.28 } });
  }
  if (hasAny(text, ["forest", "tree", "树林", "树"])) {
    const trees = countFor(text, ["tree", "trees", "树"], 3);
    ops.push(...repeatShape("tree", "green bottom", canvas, trees, { defaultColor: "green", defaultSize: 92 }));
  }
  if (hasAny(text, ["mountain", "山"])) {
    ops.push({ type: "mountains", style: baseStyle("gray", "gray") });
  }
  if (hasAny(text, ["river", "lake", "sea", "water", "河", "湖", "海"])) {
    ops.push({ type: "river", style: baseStyle("cyan", "cyan") });
  }
  if (hasAny(text, ["house", "home", "房子"])) {
    ops.push(op("house", text, canvas, { defaultColor: colorFrom(text, "blue"), defaultSize: 115 }));
  }
  if (hasAny(text, ["cloud", "云"])) {
    ops.push(...repeatShape("cloud", "white top", canvas, countFor(text, ["cloud", "clouds", "云"], 3), { defaultColor: "white", defaultSize: 76 }));
  }
  if (hasAny(text, ["flower", "花"])) {
    ops.push(...repeatShape("flower", "pink bottom", canvas, countFor(text, ["flower", "flowers", "花"], 4), { defaultColor: "pink", defaultSize: 54 }));
  }
  return ops;
}

function cleanTextLabel(raw) {
  const label = String(raw || "")
    .trim()
    .replace(/^(a|an|the|一个|一段|一句|写下|写出|文字|标签)\s*/i, "")
    .replace(/\b(?:near|at|on|in|to)\s+(?:the\s+)?(?:top|bottom|left|right|center|middle|upper|lower).*$/i, "")
    .replace(/(?:在|到)?(?:左上角|右上角|左下角|右下角|左边|右边|上方|下方|顶部|底部|中间|中央).*$/, "")
    .trim();
  return label || "hello";
}

function extractTextLabel(text) {
  const match = text.match(/\b(?:write|text|label|say)\s+(.+)$/);
  if (match) return cleanTextLabel(match[1]).slice(0, 42);
  const cn = text.match(/(?:写|文字|标签)(.+)$/);
  if (cn) return cleanTextLabel(cn[1]).slice(0, 20);
  return "hello";
}

export function createDrawingPlan(input, canvas = { width: 1280, height: 760 }) {
  const text = normalizeCommand(input);
  const started = Date.now();
  const operations = [];
  const repairs = [];

  if (!text) {
    return {
      transcript: input,
      operations,
      message: "No command detected.",
      confidence: 0,
      latencyMs: 0,
      repairs
    };
  }

  if (hasAny(text, ["clear", "reset", "erase all", "清空", "重置"])) {
    operations.push({ type: "clear" });
  } else if (hasAny(text, ["undo", "撤销"])) {
    operations.push({ type: "undo" });
  } else if (hasAny(text, ["redo", "重做"])) {
    operations.push({ type: "redo" });
  } else if (hasAny(text, ["save", "export", "download", "保存", "导出"])) {
    operations.push({ type: "export" });
  } else {
    operations.push(...scenePlan(text, canvas));
    const alreadyPlanned = (type) => operations.some((item) => item.type === type);

    if (hasAny(text, ["background", "make the sky", "背景"])) {
      const theme = hasAny(text, ["night", "夜"]) ? "night" : hasAny(text, ["ocean", "sea", "海"]) ? "ocean" : hasAny(text, ["sky", "天空", "蓝天"]) ? "sky" : hasAny(text, ["paper", "blank", "白纸"]) ? "paper" : "sunset";
      operations.push({ type: "background", theme });
    }
    if (hasAny(text, ["circle", "round shape", "圆"])) operations.push(op("circle", text, canvas, { defaultColor: "red" }));
    if (hasAny(text, ["rectangle", "square", "box", "正方形", "方形", "矩形"])) operations.push(op("rect", text, canvas, { defaultColor: "blue" }));
    if (hasAny(text, ["triangle", "三角"])) operations.push(op("triangle", text, canvas, { defaultColor: "green" }));
    if (hasAny(text, ["line", "stroke", "draw from", "线"])) operations.push(op("line", text, canvas, { defaultColor: "black", defaultSize: 180 }));
    if (hasAny(text, ["arrow", "箭头"])) operations.push(op("arrow", text, canvas, { defaultColor: "black", defaultSize: 180 }));
    if (!alreadyPlanned("star") && hasAny(text, ["star", "星"])) operations.push(...repeatShape("star", text, canvas, countFor(text, ["star", "stars", "星"], 1), { defaultColor: "yellow", defaultSize: 58 }));
    if (hasAny(text, ["heart", "爱心", "心形"])) operations.push(op("heart", text, canvas, { defaultColor: "red", defaultSize: 76 }));
    if (!alreadyPlanned("tree") && hasAny(text, ["tree", "树"])) operations.push(...repeatShape("tree", text, canvas, countFor(text, ["tree", "trees", "树"], 1), { defaultColor: "green", defaultSize: 92 }));
    if (!alreadyPlanned("house") && hasAny(text, ["house", "房子"])) operations.push(op("house", text, canvas, { defaultColor: "blue", defaultSize: 120 }));
    if (hasAny(text, ["face", "smile", "笑脸"])) operations.push(op("face", text, canvas, { defaultColor: "yellow", defaultSize: 92 }));
    if (hasAny(text, ["write", "text", "label", "say", "写", "文字"])) {
      operations.push(op("text", text, canvas, { defaultColor: colorFrom(text, "black"), defaultSize: 42, label: extractTextLabel(text) }));
    }
  }

  const drawableOps = operations.filter((item) => !["undo", "redo", "export"].includes(item.type));
  if (operations.length === 0) {
    repairs.push("No exact shape keyword found; fallback drew an abstract mark. Try adding shape, color, count, or position words.");
    operations.push(op("mark", text, canvas, { defaultColor: colorFrom(text, "cyan"), defaultSize: 86 }));
  }

  const unique = [];
  const seen = new Set();
  for (const item of operations) {
    const key = `${item.type}-${Math.round(item.at?.x || 0)}-${Math.round(item.at?.y || 0)}-${item.label || ""}-${item.theme || ""}`;
    if (!seen.has(key) || ["star", "tree", "cloud", "flower"].includes(item.type)) {
      unique.push(item);
      seen.add(key);
    }
  }

  const confidence = Math.min(0.98, 0.58 + Math.min(unique.length, 5) * 0.08 + (repairs.length ? -0.12 : 0.12));
  return {
    transcript: input,
    operations: unique,
    message: unique.length > 1 ? `Decomposed into ${unique.length} actions.` : `Executed ${unique[0]?.type || "command"}.`,
    confidence: Math.max(0.2, Number(confidence.toFixed(2))),
    latencyMs: Date.now() - started,
    repairs,
    drawableCount: drawableOps.length
  };
}

export class CommandEngine {
  constructor(canvas) {
    this.canvas = canvas;
  }

  plan(command) {
    return createDrawingPlan(command, this.canvas);
  }
}
