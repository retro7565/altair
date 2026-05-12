param(
    [string]$TemplatePath = 'template.docx',
    [string]$SourcePath = 'coursework_social_engineering.backup_before_ranepa_check.md',
    [string]$OutputPath = ''
)

$ErrorActionPreference = 'Stop'

function Escape-Xml {
    param([string]$Text)
    if ($null -eq $Text) { return '' }
    $escaped = [System.Security.SecurityElement]::Escape($Text)
    return $escaped -replace "`r?`n", '</w:t><w:br/><w:t xml:space="preserve">'
}

function New-Run {
    param(
        [string]$Text,
        [switch]$Bold,
        [int]$Size = 28
    )
    $boldXml = if ($Bold) { '<w:b/>' } else { '' }
    $txt = Escape-Xml $Text
    return "<w:r><w:rPr><w:rFonts w:ascii=`"Times New Roman`" w:hAnsi=`"Times New Roman`" w:cs=`"Times New Roman`"/><w:lang w:val=`"ru-RU`"/><w:sz w:val=`"$Size`"/><w:szCs w:val=`"$Size`"/>$boldXml</w:rPr><w:t xml:space=`"preserve`">$txt</w:t></w:r>"
}

function Add-Paragraph {
    param(
        [System.Text.StringBuilder]$Sb,
        [string]$Text,
        [string]$StyleId = 'a',
        [string]$Align = 'both',
        [switch]$Bold,
        [switch]$NoIndent,
        [int]$Size = 28,
        [int]$Before = 0,
        [int]$After = 120,
        [int]$Line = 360
    )
    $indent = if ($NoIndent) { '' } else { '<w:ind w:firstLine="709"/>' }
    $style = if ($StyleId) { "<w:pStyle w:val=`"$StyleId`"/>" } else { '' }
    [void]$Sb.AppendLine("<w:p><w:pPr>$style<w:spacing w:line=`"$Line`" w:lineRule=`"auto`" w:before=`"$Before`" w:after=`"$After`"/><w:jc w:val=`"$Align`"/>$indent</w:pPr>$(New-Run -Text $Text -Bold:$Bold -Size $Size)</w:p>")
}

function Add-PageBreak {
    param([System.Text.StringBuilder]$Sb)
    [void]$Sb.AppendLine('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')
}

function Add-Toc {
    param([System.Text.StringBuilder]$Sb)
    $tocTitle = -join @([char]0x041E,[char]0x0413,[char]0x041B,[char]0x0410,[char]0x0412,[char]0x041B,[char]0x0415,[char]0x041D,[char]0x0418,[char]0x0415)
    $tocPrompt = -join @(
        [char]0x041E,[char]0x0431,[char]0x043D,[char]0x043E,[char]0x0432,[char]0x0438,[char]0x0442,[char]0x0435,[char]0x0020,
        [char]0x043E,[char]0x0433,[char]0x043B,[char]0x0430,[char]0x0432,[char]0x043B,[char]0x0435,[char]0x043D,[char]0x0438,[char]0x0435,[char]0x0020,
        [char]0x0432,[char]0x0020,[char]0x0057,[char]0x006F,[char]0x0072,[char]0x0064
    )
    [void]$Sb.AppendLine("<w:p><w:pPr><w:pStyle w:val=`"1`"/><w:jc w:val=`"center`"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>$tocTitle</w:t></w:r></w:p>")
    $tocField = @'
<w:p><w:pPr><w:jc w:val="both"/></w:pPr><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \o "1-2" \h \z \u </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r>
'@
    [void]$Sb.AppendLine($tocField + (New-Run -Text $tocPrompt -Size 28) + '<w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>')
}

function Add-Table {
    param(
        [System.Text.StringBuilder]$Sb,
        [string[]]$Rows
    )
    $cells = @()
    foreach ($row in $Rows) {
        $parts = $row -split '\|' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
        if ($parts.Count -gt 0) { $cells += ,$parts }
    }
    if ($cells.Count -lt 2) { return }

    $colCount = $cells[0].Count
    if ($colCount -lt 2) { return }

    $usableWidth = 9300
    $baseWidth = [math]::Floor($usableWidth / $colCount)
    $widths = @()
    for ($i = 0; $i -lt $colCount; $i++) {
        if ($i -eq $colCount - 1) {
            $widths += ($usableWidth - ($baseWidth * ($colCount - 1)))
        } else {
            $widths += $baseWidth
        }
    }

    [void]$Sb.AppendLine('<w:tbl><w:tblPr><w:tblStyle w:val="a1"/><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="8" w:space="0" w:color="000000"/><w:left w:val="single" w:sz="8" w:space="0" w:color="000000"/><w:bottom w:val="single" w:sz="8" w:space="0" w:color="000000"/><w:right w:val="single" w:sz="8" w:space="0" w:color="000000"/><w:insideH w:val="single" w:sz="8" w:space="0" w:color="000000"/><w:insideV w:val="single" w:sz="8" w:space="0" w:color="000000"/></w:tblBorders></w:tblPr><w:tblGrid>')
    foreach ($width in $widths) {
        [void]$Sb.AppendLine("<w:gridCol w:w=`"$width`"/>")
    }
    [void]$Sb.AppendLine('</w:tblGrid>')

    for ($r = 0; $r -lt $cells.Count; $r++) {
        $row = $cells[$r]
        [void]$Sb.AppendLine('<w:tr>')
        for ($c = 0; $c -lt $colCount; $c++) {
            $txt = if ($c -lt $row.Count) { $row[$c] } else { '' }
            $txtEsc = Escape-Xml $txt
            $bold = if ($r -eq 0) { '<w:b/>' } else { '' }
            $align = if ($r -eq 0) { 'center' } else { 'both' }
            [void]$Sb.AppendLine("<w:tc><w:tcPr><w:tcW w:w=`"$($widths[$c])`" w:type=`"dxa`"/></w:tcPr><w:p><w:pPr><w:spacing w:line=`"300`" w:lineRule=`"auto`" w:after=`"60`"/><w:jc w:val=`"$align`"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii=`"Times New Roman`" w:hAnsi=`"Times New Roman`" w:cs=`"Times New Roman`"/><w:lang w:val=`"ru-RU`"/><w:sz w:val=`"24`"/><w:szCs w:val=`"24`"/>$bold</w:rPr><w:t xml:space=`"preserve`">$txtEsc</w:t></w:r></w:p></w:tc>")
        }
        [void]$Sb.AppendLine('</w:tr>')
    }
    [void]$Sb.AppendLine('</w:tbl><w:p/>')
}

function Write-MarkdownBlock {
    param(
        [System.Text.StringBuilder]$Sb,
        [string[]]$Lines,
        [switch]$TitlePage
    )

    for ($i = 0; $i -lt $Lines.Count; $i++) {
        $line = $Lines[$i].TrimEnd()
        if ([string]::IsNullOrWhiteSpace($line)) { continue }

        if ($line -match '^\s*---+\s*$') { continue }

        if ($TitlePage) {
            if ($line -match '^\s*#\s*(.+)$') {
                Add-Paragraph -Sb $Sb -Text $Matches[1] -StyleId '' -Align center -NoIndent -Bold -Size 34 -After 140
                continue
            }
            if ($line -match '^\s*##\s*(.+)$') {
                Add-Paragraph -Sb $Sb -Text $Matches[1] -StyleId '' -Align center -NoIndent -Bold -Size 28 -After 100
                continue
            }
            if ($line -match '^\s*###\s*(.+)$') {
                Add-Paragraph -Sb $Sb -Text $Matches[1] -StyleId '' -Align center -NoIndent -Bold -Size 28 -After 120
                continue
            }
            Add-Paragraph -Sb $Sb -Text $line -StyleId '' -Align center -NoIndent -Size 28 -After 50
            continue
        }

        if ($line -match '^\s*##\s*(.+)$') {
            Add-Paragraph -Sb $Sb -Text $Matches[1].Trim() -StyleId '1' -Align center -NoIndent -Bold -Size 32 -Before 120 -After 120 -Line 240
            continue
        }

        if ($line -match '^\s*###\s*(.+)$') {
            Add-Paragraph -Sb $Sb -Text $Matches[1].Trim() -StyleId '2' -Align left -NoIndent -Bold -Size 28 -Before 80 -After 60 -Line 240
            continue
        }

        if (($line -match '^\s*\d+\.\s+.+$') -or ($line -match '^\s*[\-\*]\s+.+$')) {
            Add-Paragraph -Sb $Sb -Text $line.Trim() -StyleId 'a3' -NoIndent -Size 28 -After 35
            continue
        }

        if ($line -match '^\s*\|.*\|\s*$') {
            $tableLines = @($line)
            while (($i + 1) -lt $Lines.Count) {
                $next = $Lines[$i + 1].TrimEnd()
                if ($next -match '^\s*\|.*\|\s*$') {
                    $i++
                    $tableLines += $next
                } else {
                    break
                }
            }
            if ($tableLines.Count -ge 2 -and ($tableLines[1] -match '^[\|\s:\-]+$')) {
                Add-Table -Sb $Sb -Rows $tableLines
                continue
            }
        }

        Add-Paragraph -Sb $Sb -Text $line.Trim() -StyleId 'a' -Align both -Size 28 -After 70
    }
}

Add-Type -AssemblyName System.IO.Compression.FileSystem

$templateFull = (Resolve-Path $TemplatePath).Path
$sourceFull = (Resolve-Path $SourcePath).Path

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
    $outName = -join @(
        [char]0x041A,[char]0x0443,[char]0x0440,[char]0x0441,[char]0x043E,[char]0x0432,[char]0x0430,[char]0x044F,[char]0x005F,
        [char]0x0410,[char]0x0431,[char]0x043B,[char]0x044F,[char]0x043A,[char]0x0438,[char]0x043C,[char]0x043E,[char]0x0432,
        [char]0x002E,[char]0x0064,[char]0x006F,[char]0x0063,[char]0x0078
    )
    $OutputPath = Join-Path $PSScriptRoot $outName
}

$workDir = Join-Path $PSScriptRoot 'template_based_build'
if (Test-Path $workDir) { Remove-Item -LiteralPath $workDir -Recurse -Force }
[System.IO.Compression.ZipFile]::ExtractToDirectory($templateFull, $workDir)

$templateDocument = Get-Content -LiteralPath (Join-Path $workDir 'word\document.xml') -Raw -Encoding UTF8
$docStart = [regex]::Match($templateDocument, '(?s)^.*?<w:body>').Value
$sectPr = [regex]::Match($templateDocument, '(?s)<w:sectPr\b.*?</w:sectPr>').Value
if (-not $docStart -or -not $sectPr) { throw 'Failed to read document wrapper from template.docx' }

$md = Get-Content -LiteralPath $sourceFull -Raw -Encoding UTF8
$sections = [regex]::Split($md, '(?m)^\s*---+\s*$')

$body = [System.Text.StringBuilder]::new()

if ($sections.Count -gt 0) {
    Write-MarkdownBlock -Sb $body -Lines ($sections[0] -split "`r?`n") -TitlePage
}

if ($sections.Count -gt 1) {
    Add-PageBreak -Sb $body
    Add-Toc -Sb $body
}

for ($s = 2; $s -lt $sections.Count; $s++) {
    Add-PageBreak -Sb $body
    Write-MarkdownBlock -Sb $body -Lines ($sections[$s] -split "`r?`n")
}

$documentXml = @"
$docStart
$($body.ToString())
$sectPr
</w:body></w:document>
"@

[System.IO.File]::WriteAllText((Join-Path $workDir 'word\document.xml'), $documentXml, [System.Text.UTF8Encoding]::new($false))

$tmpZip = Join-Path $PSScriptRoot 'template_based_build.zip'
if (Test-Path $tmpZip) { Remove-Item -LiteralPath $tmpZip -Force }
if (Test-Path $OutputPath) { Remove-Item -LiteralPath $OutputPath -Force }
Compress-Archive -Path (Join-Path $workDir '*') -DestinationPath $tmpZip -Force
Rename-Item -LiteralPath $tmpZip -NewName ([System.IO.Path]::GetFileName($OutputPath))

Write-Host "DONE: $OutputPath"
