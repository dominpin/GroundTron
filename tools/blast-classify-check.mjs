// Quick check of the risk classifier in groundtron-combo/hooks/blast/blast-radius.mjs.
// Run: node tools/blast-classify-check.mjs
// It loads a copy of the file without its theme import, so it runs outside the engine.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(here, "../groundtron-combo/hooks/blast/blast-radius.mjs"), "utf8")
  .replace(/^import .*$/m, "const palette = () => ({});");
const copy = path.join(os.tmpdir(), "blast-radius-check.mjs");
fs.writeFileSync(copy, `${source}\nexport { classify, measureFind };`);
const { classify, measureFind } = await import(pathToFileURL(copy).href);

// command -> should it be held?
const cases = {
  "ls -la": false,
  "rm file.txt": false,
  "rm *.log": true,
  "rm -rf build": true,
  "rm -f a": true,
  'find . -name "*.tmp" -delete': true,
  "find . -exec rm {} + -delete": true,
  "find . -name x": false,
  "shred -u secret": true,
  "truncate -s 0 app.log": true,
  "unlink x": true,
  "dd if=a of=/dev/null": false,
  "dd if=/dev/zero of=disk.img": true,
  'bash -c "rm -rf x"': true,
  'sh -lc "ls"': false,
  'eval "rm -rf x"': true,
  'eval "$(ssh-agent)"': false,
  "ls | xargs rm": true,
  "git ls-files | xargs -n1 rm -f": true,
  "echo a | xargs echo": false,
  "cat f | xargs -I{} cp {} d": false,
  "git reset --hard": true,
  "cd sub && rm -rf x": true,
};

let bad = 0;
for (const [command, want] of Object.entries(cases)) {
  const risk = classify(command);
  if ((risk !== null) !== want) {
    bad += 1;
    console.log(`MISMATCH  ${command}  want ${want}  got ${risk && risk.kind}`);
  }
}
console.log(`checked ${Object.keys(cases).length}, mismatches ${bad}`);
for (const command of ["find . -name x -delete", "find . -exec rm {} + -delete", "rm *.log", "ls | xargs rm", "truncate -s 0 a"]) {
  console.log(`${command}  =>  ${JSON.stringify(classify(command))}`);
}
// The find measurement must count what -delete would remove, and remove nothing itself.
const { spawnSync } = await import("node:child_process");
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "blast-find-"));
for (const name of ["a.tmp", "b.tmp", "keep.txt", "has space.tmp"]) fs.writeFileSync(path.join(dir, name), "");
const fake = { process: { run: async (argv, opts) => { const r = spawnSync(argv[0], argv.slice(1), { cwd: opts.cwd, encoding: "utf8" }); return { stdout: r.stdout, stderr: r.stderr, exitCode: r.status }; } } };
for (const [args, wantCount] of [[[".", "-name", "*.tmp", "-delete"], 3], [[".", "-name", "*.zzz", "-delete"], 0], [[".", "-name", "has space.tmp", "-delete"], 1]]) {
  const report = await measureFind(fake, { args }, dir);
  const count = /nothing matches/.test(report.summary) ? 0 : Number(report.summary.match(/delete (\d+)/)?.[1]);
  if (count !== wantCount) {
    bad += 1;
    console.log(`MISMATCH  find measure ${args[2]} ${args[3]}  want ${wantCount}  got ${count}  ${report.summary}`);
  }
}
const left = fs.readdirSync(dir).sort().join(",");
if (left !== "a.tmp,b.tmp,has space.tmp,keep.txt") {
  bad += 1;
  console.log(`MISMATCH  measuring changed the folder: ${left}`);
}
console.log(`find measure checked, mismatches ${bad}`);
process.exit(bad === 0 ? 0 : 1);
