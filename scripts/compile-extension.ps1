pnpm build

$InChromeExtDir = 'dist'
$OutBuildDir = 'build'
if(-not (Test-Path $OutBuildDir)) {
    New-Item -ItemType Directory -Force -Path $OutBuildDir
}
$extName = 'rami-levy-chrome-ext'
$outZipFile = "$OutBuildDir\$extName.zip"

Compress-Archive -Path "$InChromeExtDir\*" -DestinationPath $outZipFile -Force
