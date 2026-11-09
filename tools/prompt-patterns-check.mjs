// Each pattern's own example must tick that pattern, and an empty draft must tick none.
// Run: node tools/prompt-patterns-check.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../groundtron-side-tree");
const sandbox = { globalThis: null };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for (const file of ["lang-default.js", "i18n/base.js", "i18n/pl.js", "i18n/en.js", "prompts.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), sandbox, { filename: file });
}
// The same stripping content.js does before it tests a draft.
const strip = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l").replace(/Ł/g, "L");

let bad = 0;
for (const lang of ["pl", "en"]) {
  for (const pattern of sandbox.CST_DOCS.patterns) {
    const entry = sandbox.CST_I18N[lang].patterns[pattern.id];
    if (!entry) {
      bad += 1;
      console.log(`MISSING   ${lang}/${pattern.id}: no text`);
      continue;
    }
    if (!pattern.test(strip(entry[2]))) {
      bad += 1;
      console.log(`NOT TICKED  ${lang}/${pattern.id}: ${entry[2]}`);
    }
  }
}
// A plain sentence should not tick the new checks by accident.
const plain = "napraw ten blad w logowaniu";
for (const id of ["scope", "stop", "length", "unknown"]) {
  const pattern = sandbox.CST_DOCS.patterns.find((p) => p.id === id);
  if (pattern.test(plain)) {
    bad += 1;
    console.log(`FALSE TICK  ${id}: ${plain}`);
  }
}
console.log(`patterns checked, problems ${bad}`);
process.exit(bad === 0 ? 0 : 1);
