# Assemble le prototype : compresse les images, les intègre et écrit ..\jeu.html (s'ouvre par double-clic).
# Usage : powershell -File construire.ps1
# Une image déposée dans images\ sous l'un des noms de $facultatives remplace automatiquement le dessin provisoire.
param([string]$Sortie = (Join-Path $PSScriptRoot 'jeu.html'))
[Console]::OutputEncoding = [Text.Encoding]::UTF8
Add-Type -AssemblyName System.Drawing
$utf8 = New-Object Text.UTF8Encoding($false)
$Im = Join-Path $PSScriptRoot 'images'
$jpeg = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
function Compresser($fichier, $cadre, $largeurMax, $qualite) {
    $src = [Drawing.Image]::FromFile($fichier)
    try {
        $sx = 0; $sy = 0; $sw = $src.Width; $sh = $src.Height
        if ($cadre) { $sx = $cadre[0]; $sy = $cadre[1]; $sw = $cadre[2]; $sh = $cadre[3] }
        $dw = [Math]::Min($largeurMax, $sw); $dh = [int]($sh * $dw / $sw)
        $bmp = New-Object Drawing.Bitmap($dw, $dh)
        $g = [Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($src, (New-Object Drawing.Rectangle(0, 0, $dw, $dh)), (New-Object Drawing.Rectangle($sx, $sy, $sw, $sh)), [Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()
        $ep = New-Object Drawing.Imaging.EncoderParameters(1)
        $ep.Param[0] = New-Object Drawing.Imaging.EncoderParameter([Drawing.Imaging.Encoder]::Quality, [long]$qualite)
        $ms = New-Object IO.MemoryStream
        $bmp.Save($ms, $jpeg, $ep); $bmp.Dispose()
        return 'data:image/jpeg;base64,' + [Convert]::ToBase64String($ms.ToArray())
    } finally { $src.Dispose() }
}
$img = @{}
$S = Join-Path $Im 'sources'
function Source($motif) { return (Get-ChildItem -LiteralPath $S -Filter $motif | Select-Object -First 1).FullName }
# Rédaction sans Montclair (le jeu le pose lui-même) et nouveau portrait d'Hélène.
$img['scene_redaction'] = Compresser (Source 'Salle de r*daction audiovisuelle*.png') $null 1500 80
$img['scene_librairie'] = Compresser (Join-Path $S 'portrait_lenoir.png') $null 1500 80
$sb = (Get-ChildItem -LiteralPath $S -Filter 'Storyboard*.png' | Select-Object -First 1).FullName
$img['portrait_helene'] = Compresser (Source 'Portrait d*une femme*cheveux argent*.png') @(250, 110, 800, 800) 300 85
$img['portrait_montclair'] = Compresser $sb @(263, 250, 243, 250) 300 85
$img['portrait_lenoir'] = Compresser $sb @(519, 250, 243, 250) 300 85
$img['doc_d.carte'] = Compresser (Join-Path $Im 'doc_d.carte.jpg') $null 2000 80
$img['doc_d.frisland'] = Compresser (Join-Path $Im 'doc_d.frisland.jpg') $null 2000 80
$img['obj_mappemonde'] = Compresser (Join-Path $Im 'obj_mappemonde.png') $null 1600 90
$img['scene_salle_cartes'] = Compresser (Source 'Salle d*archives*.png') $null 1500 80
$img['scene_plateau'] = Compresser (Source 'Studio dor*.png') $null 1500 80
# Cadre resserre sur le moniteur : les trois cases du montage se posent sur ses trois rectangles (voir .banc dans style.css).
$img['scene_montage'] = Compresser (Source 'Salle de montage*.png') @(280, 145, 1120, 495) 1120 80
$tr = Source 'Triptyque*.png'
$img['portrait_lacote'] = Compresser $tr @(40, 0, 600, 600) 300 85
$img['portrait_bruno'] = Compresser $tr @(782, 0, 620, 620) 300 85
$img['portrait_sacha'] = Compresser $tr @(1471, 0, 620, 620) 300 85
$img['objet_bertha'] = Compresser (Source 'Cam*ra vintage*.png') $null 300 85
# Personnages en pied detoures (produits par detourer.ps1), gardes en PNG pour la transparence.
foreach ($n in 'pied_lacote', 'pied_bruno', 'pied_sacha', 'pied_montclair') {
    $f = Join-Path $Im ($n + '.png')
    if (Test-Path -LiteralPath $f) { $img[$n] = 'data:image/png;base64,' + [Convert]::ToBase64String([IO.File]::ReadAllBytes($f)) }
}
# Une image deposee dans images\ sous l'un de ces noms remplace celle des sources.
foreach ($n in 'scene_salle_cartes', 'scene_plateau', 'portrait_lacote', 'portrait_bruno', 'portrait_sacha', 'objet_bertha') {
    $f = Get-ChildItem -LiteralPath $Im -File | Where-Object { $_.BaseName -eq $n -and $_.Extension -match '^\.(png|jpe?g)$' } | Select-Object -First 1
    if ($f) { $img[$n] = Compresser $f.FullName $null $(if ($n -like 'scene_*') { 1500 } else { 300 }) 80 }
}
Write-Host "Images integrees : $($img.Count)"
$credits = [IO.File]::ReadAllText((Join-Path $Im 'credits.json'), $utf8)
$imgJson = '{"img":{' + (($img.GetEnumerator() | ForEach-Object { '"' + $_.Key + '":"' + $_.Value + '"' }) -join ',') + '},"credits":' + $credits + '}'
function Lire($p) { return [IO.File]::ReadAllText((Join-Path $PSScriptRoot $p), $utf8) }
$page = (Lire 'src\modele.html').Replace('__STYLE__', (Lire 'src\style.css')).Replace('__SON__', (Lire 'reference\moteur\son.js')).Replace('__DONNEES__', (Lire 'src\donnees.js')).Replace('__MOTEUR__', (Lire 'src\moteur.js')).Replace('__IMAGES__', $imgJson)
[IO.File]::WriteAllText($Sortie, $page, $utf8)
Write-Host ("Page ecrite : " + (Resolve-Path $Sortie) + " (" + [math]::Round($page.Length / 1024) + " Ko)")
