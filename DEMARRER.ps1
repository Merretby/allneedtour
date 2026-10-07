& {
    $ErrorActionPreference = "Stop"
    Set-Location -LiteralPath $PSScriptRoot
    npm install
    if ($LASTEXITCODE -ne 0) { throw "Installation échouée" }
    npm test
    if ($LASTEXITCODE -ne 0) { throw "Tests échoués" }
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build échoué" }
    npm run dev
}
