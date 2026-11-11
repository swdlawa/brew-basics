# ==========================================================================
# generate-images.ps1
# Regenerates the site's identity images (Open Graph, favicon, app icons)
# using .NET System.Drawing — no external tools required.
#
# Usage:
#   pwsh -File scripts/generate-images.ps1
#   (run from the project root, e.g. the "guide-site" folder)
#
# To make these YOUR OWN, edit the parameters at the top (name, tagline,
# colors) and run again.
# ==========================================================================

param(
  [string]$SiteName  = "Brew Basics",
  [string]$Tagline   = "A beginner's guide to brewing better coffee at home."
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

# --- Brand palette (match css/styles.css) --------------------------------
$rust     = [System.Drawing.ColorTranslator]::FromHtml("#b4532c")
$rustDark = [System.Drawing.ColorTranslator]::FromHtml("#8c3a1e")
$cream    = [System.Drawing.ColorTranslator]::FromHtml("#faf6f0")
$creamSoft= [System.Drawing.ColorTranslator]::FromHtml("#f3e0cf")
$coffee   = [System.Drawing.ColorTranslator]::FromHtml("#6b3a1e")

$outDir = Join-Path (Split-Path $PSScriptRoot -Parent) "assets"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function New-RoundedRectPath {
  param([float]$x, [float]$y, [float]$w, [float]$h, [float]$r)
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $p.AddArc($x, $y, $d, $d, 180, 90)
  $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $p.CloseFigure()
  return $p
}

function Draw-Cup {
  param(
    $g,
    [float]$cx, [float]$cy, [float]$size,
    $bodyBrush, $bodyPen, $coffeeBrush, $steamPen,
    [bool]$withSteam
  )
  $w = $size
  $h = $size * 0.85
  $x = $cx - $w / 2
  $y = $cy - $h / 2
  $r = $size * 0.14

  # Handle (right side)
  $g.DrawArc($steamPen, ($x + $w * 0.72), ($y + $h * 0.22), ($w * 0.42), ($h * 0.56), 270, 180)

  # Cup body
  $path = New-RoundedRectPath $x $y $w $h $r
  $g.FillPath($bodyBrush, $path)
  $g.DrawPath($bodyPen, $path)

  # Coffee surface
  $g.FillEllipse($coffeeBrush, ($x + $w * 0.07), ($y + $h * 0.16), ($w * 0.86), ($h * 0.20))

  # Steam
  if ($withSteam) {
    $g.DrawBezier($steamPen, ($cx - $w*0.18), $y, ($cx - $w*0.30), ($y - $h*0.16), ($cx - $w*0.10), ($y - $h*0.24), ($cx - $w*0.18), ($y - $h*0.38))
    $g.DrawBezier($steamPen, ($cx + $w*0.14), $y, ($cx + $w*0.26), ($y - $h*0.16), ($cx + $w*0.10), ($y - $h*0.24), ($cx + $w*0.16), ($y - $h*0.38))
  }
}

function New-BitmapPair {
  param([int]$w, [int]$h)
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  return @($bmp, $g)
}

function Draw-CenteredText {
  param($g, [string]$text, $font, $brush, [float]$x, [float]$y, [float]$w, [float]$h)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
  $rect = New-Object System.Drawing.RectangleF($x, $y, $w, $h)
  $g.DrawString($text, $font, $brush, $rect, $sf)
  $sf.Dispose()
}

# --- 1. Square app icons + favicon (cup only, no text) --------------------
foreach ($size in @(64, 180, 192, 512)) {
  $pair = New-BitmapPair $size $size
  $bmp = $pair[0]; $g = $pair[1]
  $g.Clear($rust)

  $cupSize = $size * 0.60
  $bodyBrush  = New-Object System.Drawing.SolidBrush($cream)
  $bodyPen    = New-Object System.Drawing.Pen($cream, [float]($size * 0.05))
  $coffeeBrush= New-Object System.Drawing.SolidBrush($coffee)
  $steamPen   = New-Object System.Drawing.Pen($cream, [float]($size * 0.045))

  Draw-Cup $g ($size / 2) ($size * 0.52) $cupSize $bodyBrush $bodyPen $coffeeBrush $steamPen $false

  $name = switch ($size) {
    64  { "favicon.png" }
    180 { "apple-touch-icon.png" }
    192 { "icon-192.png" }
    512 { "icon-512.png" }
  }
  $bmp.Save((Join-Path $outDir $name), [System.Drawing.Imaging.ImageFormat]::Png)

  $bodyBrush.Dispose(); $bodyPen.Dispose(); $coffeeBrush.Dispose(); $steamPen.Dispose()
  $g.Dispose(); $bmp.Dispose()
}

# --- 2. Open Graph image (1200 x 630) -------------------------------------
$pair = New-BitmapPair 1200 630
$bmp = $pair[0]; $g = $pair[1]
$g.Clear($rust)

# Subtle darker rounded panel for depth
$panel = New-RoundedRectPath 60 60 1080 510 36
$panelBrush = New-Object System.Drawing.SolidBrush($rustDark)
$g.FillPath($panelBrush, $panel)

# Cup (with steam)
$cupSize = 210
$bodyBrush  = New-Object System.Drawing.SolidBrush($cream)
$bodyPen    = New-Object System.Drawing.Pen($cream, 10)
$coffeeBrush= New-Object System.Drawing.SolidBrush($coffee)
$steamPen   = New-Object System.Drawing.Pen($cream, 9)
Draw-Cup $g 600 235 $cupSize $bodyBrush $bodyPen $coffeeBrush $steamPen $true

# Wordmark + tagline
$fontTitle = New-Object System.Drawing.Font("Segoe UI", 104, [System.Drawing.FontStyle]::Bold)
$fontTag   = New-Object System.Drawing.Font("Segoe UI", 38, [System.Drawing.FontStyle]::Regular)
$titleBrush = New-Object System.Drawing.SolidBrush($cream)
$tagBrush   = New-Object System.Drawing.SolidBrush($creamSoft)

Draw-CenteredText $g $SiteName $fontTitle $titleBrush 80 400 1040 130
Draw-CenteredText $g $Tagline $fontTag $tagBrush 80 540 1040 60

$bmp.Save((Join-Path $outDir "og-image.png"), [System.Drawing.Imaging.ImageFormat]::Png)

$panelBrush.Dispose(); $bodyBrush.Dispose(); $bodyPen.Dispose(); $coffeeBrush.Dispose()
$steamPen.Dispose(); $fontTitle.Dispose(); $fontTag.Dispose(); $titleBrush.Dispose(); $tagBrush.Dispose()
$g.Dispose(); $bmp.Dispose()

Write-Output "Generated images in $outDir"
Get-ChildItem $outDir -Filter *.png | Select-Object Name, Length
