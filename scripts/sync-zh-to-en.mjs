import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  EXACT_TEXT_MAP,
  KEY_ALIASES,
  NAV_SEMANTIC_EN,
  PHRASE_MAP,
  TERM_MAP,
} from "./translation-glossary.mjs";

const FORCE = process.argv.includes("--force");

const ROOT = process.cwd();
const CHINESE_RE = /[\u3400-\u9fff]/;

const CONTENT_PAIRS = [
  { kind: "nav", zh: "src/content/nav/zh", en: "src/content/nav/en" },
  { kind: "cards", zh: "src/content/cards/zh", en: "src/content/cards/en" },
  { kind: "pages", zh: "src/content/pages/zh", en: "src/content/pages/en" },
  { kind: "home", zhFile: "src/content/home/zh.json", enFile: "src/content/home/en.json" },
];

function isObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function stable(value) {
  if (Array.isArray(value)) return value.map((v) => stable(v));
  if (!isObject(value)) return value;
  const keys = Object.keys(value).sort();
  const out = {};
  for (const key of keys) out[key] = stable(value[key]);
  return out;
}

function sourceHash(payload) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(stable(payload)))
    .digest("hex")
    .slice(0, 16);
}

function mapHref(value) {
  if (typeof value !== "string") return value;
  return value.replace(/^\/zh(?=\/|$)/, "/en");
}

function containsChinese(text) {
  return typeof text === "string" && CHINESE_RE.test(text);
}

function normalizeSemantic(raw) {
  if (typeof raw !== "string") return "";
  const clean = raw.replace(/^\d+[-_]?/, "").trim();
  const lower = clean.toLowerCase();
  return KEY_ALIASES[clean] || KEY_ALIASES[lower] || lower;
}

function translateText(input, context = {}) {
  if (typeof input !== "string") return input;
  if (!containsChinese(input)) return input;

  if (context.isNavTitle) {
    const semantic = normalizeSemantic(context.semantic || "");
    if (semantic && NAV_SEMANTIC_EN[semantic]) {
      return NAV_SEMANTIC_EN[semantic];
    }
  }

  if (EXACT_TEXT_MAP[input]) return EXACT_TEXT_MAP[input];

  let out = input;

  const phraseKeys = Object.keys(PHRASE_MAP).sort((a, b) => b.length - a.length);
  for (const key of phraseKeys) {
    if (out.includes(key)) {
      out = out.split(key).join(PHRASE_MAP[key]);
    }
  }

  const termKeys = Object.keys(TERM_MAP).sort((a, b) => b.length - a.length);
  for (const key of termKeys) {
    if (out.includes(key)) {
      out = out.split(key).join(TERM_MAP[key]);
    }
  }

  return out;
}

function getSemanticForNav(obj, fileStem) {
  return normalizeSemantic(obj?.key || obj?.href || obj?.title || fileStem);
}

function translateNode(node, keyName, context = {}) {
  if (Array.isArray(node)) {
    return node.map((item) => translateNode(item, keyName, context));
  }

  if (isObject(node)) {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === "translation") continue;
      out[k] = translateNode(v, k, context);
    }
    return out;
  }

  if (typeof node === "string") {
    if (keyName === "key" || keyName === "pageKey") return node;
    if (keyName === "href" || keyName.endsWith("Href")) return mapHref(node);
    if (keyName === "image" || keyName === "cover" || keyName === "bgImage" || keyName === "heroBgImage" || keyName === "legacyImage") {
      return node;
    }
    if (keyName === "title" && context.kind === "nav") {
      return translateText(node, { isNavTitle: true, semantic: context.semantic });
    }
    return translateText(node, context);
  }

  return node;
}

function mergeTranslationMeta(existingMeta, hash, status, shouldSetTime) {
  const mode = existingMeta?.mode === "manual_locked" ? "manual_locked" : "auto";
  return {
    mode,
    sourceHash: hash,
    status,
    lastTranslatedAt: shouldSetTime ? new Date().toISOString() : existingMeta?.lastTranslatedAt || "",
  };
}

function shouldWrite(oldValue, newValue) {
  return JSON.stringify(oldValue) !== JSON.stringify(newValue);
}

function syncRecord({ kind, zhPath, enPath, fileStem }) {
  const zhData = readJson(zhPath);
  if (!isObject(zhData)) return { updated: false, skipped: true, reason: "invalid_zh", enPath };

  const existingEn = readJson(enPath);
  const existingMeta = isObject(existingEn?.translation) ? existingEn.translation : {};
  const mode = existingMeta.mode === "manual_locked" ? "manual_locked" : "auto";

  const zhHash = sourceHash(zhData);
  const sameHash = existingMeta.sourceHash === zhHash;

  if (mode === "manual_locked" && !FORCE) {
    const nextStatus = sameHash ? "synced" : "outdated";
    const next = isObject(existingEn) ? { ...existingEn } : {};
    next.translation = mergeTranslationMeta(existingMeta, zhHash, nextStatus, false);
    if (shouldWrite(existingEn, next)) {
      writeJson(enPath, next);
      return { updated: true, skipped: false, reason: "locked_meta_updated", enPath };
    }
    return { updated: false, skipped: true, reason: "locked_no_change", enPath };
  }

  const semantic = kind === "nav" ? getSemanticForNav(zhData, fileStem) : "";
  const translated = translateNode(zhData, "", { kind, semantic });
  translated.translation = mergeTranslationMeta(existingMeta, zhHash, "synced", true);

  if (shouldWrite(existingEn, translated)) {
    writeJson(enPath, translated);
    return { updated: true, skipped: false, reason: "translated", enPath };
  }

  return { updated: false, skipped: true, reason: "no_change", enPath };
}

function listJsonFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter((n) => n.endsWith(".json"));
}

function run() {
  const logs = [];

  for (const pair of CONTENT_PAIRS) {
    if (pair.kind === "home") {
      const zhPath = path.resolve(ROOT, pair.zhFile);
      const enPath = path.resolve(ROOT, pair.enFile);
      logs.push(syncRecord({ kind: "home", zhPath, enPath, fileStem: "home" }));
      continue;
    }

    const zhDir = path.resolve(ROOT, pair.zh);
    const enDir = path.resolve(ROOT, pair.en);
    const files = listJsonFiles(zhDir);

    for (const name of files) {
      const zhPath = path.join(zhDir, name);
      const enPath = path.join(enDir, name);
      const fileStem = name.replace(/\.json$/i, "");
      logs.push(syncRecord({ kind: pair.kind, zhPath, enPath, fileStem }));
    }
  }

  const updated = logs.filter((i) => i.updated).length;
  const skipped = logs.filter((i) => i.skipped).length;
  const total = logs.length;

  console.log(`[content:translate] total=${total} updated=${updated} skipped=${skipped} force=${FORCE}`);

  const lockedOutdated = logs.filter((i) => i.reason === "locked_meta_updated").length;
  if (lockedOutdated > 0) {
    console.log(`[content:translate] locked entries marked/updated: ${lockedOutdated}`);
  }
}

run();
