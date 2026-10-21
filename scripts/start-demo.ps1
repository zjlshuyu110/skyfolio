$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path $PSScriptRoot -Parent
$taskPython = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
if (-not (Test-Path -LiteralPath $taskPython)) { $taskPython = (Get-Command python -ErrorAction Stop).Source }
$taskUrl = 'http://127.0.0.1:8766/demo/'
$taskRunning = $false
try { $taskData = Invoke-RestMethod -Uri ($taskUrl + 'data/demo.json') -TimeoutSec 2; $taskRunning = $taskData.revision -eq 'fictional-demo-v1' } catch {}
if (-not $taskRunning) {
    $taskDocs = Join-Path $taskRoot 'docs'
    $taskLogs = Join-Path $taskRoot 'work/demo'
    New-Item -ItemType Directory -Path $taskLogs -Force | Out-Null
    $taskProcess = Start-Process -FilePath $taskPython -ArgumentList @('-m','http.server','8766','--bind','127.0.0.1','--directory',('"'+$taskDocs+'"')) -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $taskLogs 'server.log') -RedirectStandardError (Join-Path $taskLogs 'error.log')
    $taskProcess.Id | Set-Content -LiteralPath (Join-Path $taskLogs 'server.pid')
    for ($taskAttempt = 0; $taskAttempt -lt 25; $taskAttempt++) {
        Start-Sleep -Milliseconds 200
        try { $taskData = Invoke-RestMethod -Uri ($taskUrl + 'data/demo.json') -TimeoutSec 1; if ($taskData.revision -eq 'fictional-demo-v1') { $taskRunning = $true; break } } catch {}
        if ($taskProcess.HasExited) { break }
    }
    if (-not $taskRunning) { throw 'Demo could not start. Check work/demo/error.log; port 8766 may be in use.' }
}
Start-Process $taskUrl
