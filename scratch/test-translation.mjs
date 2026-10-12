import fs from 'fs';
import path from 'path';

const dict = JSON.parse(fs.readFileSync('d:/Developer/DilshadSir/DeltaOne/delta_one_vip_react/public/i18n/ui_es.json', 'utf8'));

function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
function tpl(s) { var i = 0; return s.replace(/\d[\d.,]*/g, function () { i += 1; return '{n' + i + '}'; }); }
function nums(s) { return s.match(/\d[\d.,]*/g) || []; }
function fill(t, ns) { return t.replace(/\{n(\d+)\}/g, function (_, k) { return ns[+k - 1] || ''; }); }

function lookup(k, isTsel) {
  if (dict[k]) return dict[k];
  if (isTsel) {
    const t = tpl(k);
    if (dict[t]) return fill(dict[t], nums(k));
  }
  return null;
}

const tests = [
  "Delta One VIP · Your classroom",
  "Learn the Momentum Plan in <em>three steps</em>.",
  "Start at Step 1",
  "The plan as a film · 4 or 10 min",
  "<span class=\"ic\">▶</span>&nbsp; Aria, my teacher, walks me through · 2:49",
  "Three things to keep in mind",
  "Which document do I need?",
  "The Skill Shop · learn from the greats",
  "Documents available in this language: The Plan in Simple Words and the Module Key Facts. Every other document opens in English. Translations are drafts awaiting native-speaker review."
];

for (const text of tests) {
  const isTsel = text.includes("Aria, my teacher") || text.includes("Start");
  const res = lookup(norm(text), isTsel);
  console.log(`"${text}" => ${res ? `MATCH: "${res.slice(0, 40)}..."` : "NO MATCH"}`);
}

