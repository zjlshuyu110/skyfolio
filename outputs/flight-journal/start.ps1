$ErrorActionPreference = 'Stop'
$taskAppDirectory = $PSScriptRoot
$taskConfig = Get-Content -LiteralPath (Join-Path $taskAppDirectory 'config.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$taskPort = 8765
$taskUrl = "http://127.0.0.1:$taskPort"
$taskAlreadyRunning = $false
try {
    $taskHealth = Invoke-RestMethod -Uri "$taskUrl/api/health" -TimeoutSec 2
    if ($taskHealth.app -eq 'flight-journal') { $taskAlreadyRunning = $true }
} catch { }
if (-not $taskAlreadyRunning) {
    $taskPython = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
    if (-not (Test-Path -LiteralPath $taskPython)) {
        $taskPythonCommand = Get-Command python -ErrorAction SilentlyContinue
        if (-not $taskPythonCommand) { throw 'Python is missing. Install Python 3.10+ and the openpyxl and tzdata packages.' }
        $taskPython = $taskPythonCommand.Source
    }
    $taskLogDirectory = [System.IO.Path]::GetFullPath((Join-Path $taskAppDirectory '../../work/flight-journal'))
    New-Item -ItemType Directory -Path $taskLogDirectory -Force | Out-Null
    $taskAppScript = Join-Path $taskAppDirectory 'app.py'
    $taskProcess = Start-Process -FilePath $taskPython -ArgumentList @(('"' + $taskAppScript + '"'), '--port', "$taskPort") -WorkingDirectory $taskAppDirectory -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $taskLogDirectory 'server.log') -RedirectStandardError (Join-Path $taskLogDirectory 'server-error.log')
    $taskProcess.Id | Set-Content -LiteralPath (Join-Path $taskLogDirectory 'server.pid')
    for ($taskAttempt = 0; $taskAttempt -lt 25; $taskAttempt++) {
        Start-Sleep -Milliseconds 200
        try {
            $taskHealth = Invoke-RestMethod -Uri "$taskUrl/api/health" -TimeoutSec 1
            if ($taskHealth.app -eq 'flight-journal') { $taskAlreadyRunning = $true; break }
        } catch { }
        if ($taskProcess.HasExited) { break }
    }
    if (-not $taskAlreadyRunning) { throw "The local app did not start. Check $taskLogDirectory/server-error.log." }
}
Start-Process $taskUrl
