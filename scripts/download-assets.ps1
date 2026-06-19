# Downloads all Framer asset images to /public/images/
# Run from the project root: powershell -File scripts/download-assets.ps1

$ErrorActionPreference = "Continue"
$out = "D:\projects\framer\public\images"

$assets = @(
  # Named assets from prompt
  @{ url="https://framerusercontent.com/images/JkOGUpDEBQ5FeI9HVAlSpoDzs0.jpg";  name="hero-bg.jpg" },
  @{ url="https://framerusercontent.com/images/EGprxWBupmsG38b8hHxhm6DAk.jpg";   name="about-factory.jpg" },
  @{ url="https://framerusercontent.com/images/btHCzx2hdyQWWxyPoY0KpkOuEQ.jpg";  name="intro-foundations.jpg" },
  @{ url="https://framerusercontent.com/images/BtL5sG0xQ2S16MDLoaL1CRc4wTg.jpg"; name="intro-hybrid.jpg" },
  @{ url="https://framerusercontent.com/images/GIqRjUzX1PVrHe8XSHRJsS0YaA.jpg";  name="intro-solar.jpg" },
  @{ url="https://framerusercontent.com/images/8ILyToNATa77bK3Tye69T6GjV9E.png";  name="values-graphic.png" },
  @{ url="https://framerusercontent.com/images/gW8yYsacHiHbYJruEx2Ek3thkIk.webp"; name="project-regen.webp" },
  @{ url="https://framerusercontent.com/images/PE2Q4nZMGYEuJYrAk8d0swPrSY.webp";  name="project-gamesa.webp" },
  @{ url="https://framerusercontent.com/images/XS2mjgEm7qmbFX2tekHUaHlDYM.jpg";   name="cert-iso-14001.jpg" },
  @{ url="https://framerusercontent.com/images/EGprxWBupmsG38b8hHxhm6DAk.jpg";   name="cta-1.jpg" },
  @{ url="https://framerusercontent.com/images/HMLilDT8OVWhgIQHKvgb3S7J2gw.jpg"; name="cta-2.jpg" },
  @{ url="https://framerusercontent.com/images/shn0Pai8ytDvo0JvLIJCUOY.webp";    name="cta-3.webp" },
  @{ url="https://framerusercontent.com/images/7nneOn1QEgQcom6NcWmKaNb2S4.jpg";  name="cta-4.jpg" },
  @{ url="https://framerusercontent.com/images/bg3xh7tsXApHOj7uearTm270jl8.svg"; name="pattern-1.svg" },
  @{ url="https://framerusercontent.com/images/xAvkgKdJvB2GjRJX2r7kh3rlk.svg";  name="pattern-2.svg" },
  @{ url="https://framerusercontent.com/images/wxxB24s4RRIqaNPjMpflC6BaY.png";   name="logo-light.png" },
  @{ url="https://framerusercontent.com/images/dEHVUVMVYid0cRUOdMhnl6BOAc.png";  name="logo-dark.png" },
  @{ url="https://framerusercontent.com/images/WqXFJT0VBDWmZte8NVZqXuiRHY.png";  name="favicon-light.png" },
  @{ url="https://framerusercontent.com/images/1roggZCFwjOq0IDRbFbK792JUQE.png"; name="favicon-dark.png" },
  @{ url="https://framerusercontent.com/images/BtL5sG0xQ2S16MDLoaL1CRc4wTg.jpg"; name="cert-iso-9001.jpg" },
  @{ url="https://framerusercontent.com/images/BtL5sG0xQ2S16MDLoaL1CRc4wTg.jpg"; name="cert-iso-ohsas.jpg" },
  # OG image (in /assets/ path)
  @{ url="https://framerusercontent.com/assets/7LDZXjNOs4SP4CDKzNOlnREoA.png";   name="og-image.png" },
  # Additional images found in HTML (kept with original hash names)
  @{ url="https://framerusercontent.com/images/EDiBEK90luV1MlOKqHd3y35SjyY.jpg"; name="EDiBEK90luV1MlOKqHd3y35SjyY.jpg" },
  @{ url="https://framerusercontent.com/images/FtoWOGjx9SGmu6mwrre7CXFsTL8.webp"; name="FtoWOGjx9SGmu6mwrre7CXFsTL8.webp" },
  @{ url="https://framerusercontent.com/images/gOupSgmUxbxJqLvO69J5QB4soU4.webp"; name="gOupSgmUxbxJqLvO69J5QB4soU4.webp" },
  @{ url="https://framerusercontent.com/images/H2IlCMMmRklSFMpvMe1avxyrc8.webp";  name="H2IlCMMmRklSFMpvMe1avxyrc8.webp" },
  @{ url="https://framerusercontent.com/images/i6eny5lygrLdpq5Gqvme29j7Yhw.webp"; name="i6eny5lygrLdpq5Gqvme29j7Yhw.webp" },
  @{ url="https://framerusercontent.com/images/I9dRVlQULmDqNAJpZOkuncGfE.jpg";   name="I9dRVlQULmDqNAJpZOkuncGfE.jpg" },
  @{ url="https://framerusercontent.com/images/immMxFmRyMw1HaAhNQx1KR16KY.webp"; name="immMxFmRyMw1HaAhNQx1KR16KY.webp" },
  @{ url="https://framerusercontent.com/images/LZwZWc2RR4ub4v2doN9iaKQIW0.jpg";  name="LZwZWc2RR4ub4v2doN9iaKQIW0.jpg" },
  @{ url="https://framerusercontent.com/images/qTEevZ1R4oJu9NN6ub1u4P0Ck.png";   name="qTEevZ1R4oJu9NN6ub1u4P0Ck.png" },
  @{ url="https://framerusercontent.com/images/R232YVK5pBfOzsZkEJh6SI9sk.svg";   name="R232YVK5pBfOzsZkEJh6SI9sk.svg" },
  @{ url="https://framerusercontent.com/images/yX7fRz0Y9mhztEYD2snkPDC6R0I.webp"; name="yX7fRz0Y9mhztEYD2snkPDC6R0I.webp" }
)

$downloaded = 0
$failed = 0

foreach ($a in $assets) {
  $dest = Join-Path $out $a.name
  if (Test-Path $dest) {
    Write-Host "  SKIP (exists) $($a.name)"
    $downloaded++
    continue
  }
  try {
    Invoke-WebRequest -Uri $a.url -OutFile $dest -UseBasicParsing -TimeoutSec 30
    $size = (Get-Item $dest).Length
    Write-Host "  OK  $($a.name)  ($size bytes)"
    $downloaded++
  } catch {
    Write-Host "  FAIL $($a.name): $_"
    $failed++
  }
}

Write-Host ""
Write-Host "Done: $downloaded downloaded, $failed failed."
