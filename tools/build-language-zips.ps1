# Builds one ready-to-load zip of the claude-side-tree extension per language
# into dist/. A zip holds a single language and so shows no language picker.
#   powershell -File tools/build-language-zips.ps1
Add-Type -AssemblyName System.IO.Compression.FileSystem
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root 'claude-side-tree'
$dist = Join-Path $root 'dist'
New-Item -ItemType Directory -Force $dist | Out-Null
Get-ChildItem $dist -Filter '*.zip' | Remove-Item
$langs = [ordered]@{ pl = 'polski'; en = 'english'; csb = 'kaszubski'; szl = 'slaski'; gor = 'goralski' }
foreach ($code in $langs.Keys) {
  $zip = Join-Path $dist ("claude-side-tree-$code-$($langs[$code]).zip")
  # Built by hand so entry names use forward slashes; Compress-Archive in
  # Windows PowerShell 5.1 writes backslashes, which other unzippers keep.
  $archive = [IO.Compression.ZipFile]::Open($zip, 'Create')
  $utf8 = New-Object Text.UTF8Encoding $false
  function Add-Text($name, $text) {
    $entry = $archive.CreateEntry($name)
    $w = New-Object IO.StreamWriter($entry.Open(), $utf8)
    $w.Write($text); $w.Dispose()
  }
  Get-ChildItem $src -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($src.Length + 1).Replace('\', '/')
    if ($rel -like 'test/*' -or $rel -eq 'lang-default.js' -or $rel -eq 'manifest.json' -or $rel -eq 'README.md' -or $rel -like 'readme/*') { return }
    # Only this language's texts go in.
    if ($rel -like 'i18n/*' -and $rel -ne 'i18n/base.js' -and $rel -ne "i18n/$code.js") { return }
    [void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $rel)
  }
  # The README in this language, from claude-side-tree/readme/<code>.md.
  Add-Text 'README.md' ([IO.File]::ReadAllText((Join-Path $src "readme/$code.md")))
  Add-Text 'lang-default.js' "globalThis.CST_DEFAULT_LANG = '$code';`n"
  $manifest = [IO.File]::ReadAllText((Join-Path $src 'manifest.json'))
  $manifest = [regex]::Replace($manifest, '"js": \[[^\]]*\]', "`"js`": [`"lang-default.js`", `"i18n/base.js`", `"i18n/$code.js`", `"prompts.js`", `"content.js`"]")
  Add-Text 'manifest.json' $manifest
  $archive.Dispose()
  Write-Host "built $zip"
}
