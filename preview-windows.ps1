$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = $null
$port = $null

foreach ($candidatePort in 8000..8010) {
    try {
        $testListener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $candidatePort)
        $testListener.Start()
        $listener = $testListener
        $port = $candidatePort
        break
    } catch {
        if ($testListener) {
            try { $testListener.Stop() } catch {}
        }
    }
}

if (-not $listener) {
    Write-Host ""
    Write-Host "Could not find a free preview port between 8000 and 8010." -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
}

function Get-ContentType {
    param([string]$Path)
    switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
        ".html" { "text/html; charset=utf-8" }
        ".css"  { "text/css; charset=utf-8" }
        ".js"   { "application/javascript; charset=utf-8" }
        ".json" { "application/json; charset=utf-8" }
        ".svg"  { "image/svg+xml" }
        ".png"  { "image/png" }
        ".jpg"  { "image/jpeg" }
        ".jpeg" { "image/jpeg" }
        ".gif"  { "image/gif" }
        ".webp" { "image/webp" }
        ".ico"  { "image/x-icon" }
        ".woff" { "font/woff" }
        ".woff2"{ "font/woff2" }
        ".ttf"  { "font/ttf" }
        ".xml"  { "application/xml; charset=utf-8" }
        ".txt"  { "text/plain; charset=utf-8" }
        default { "application/octet-stream" }
    }
}

function Send-Response {
    param(
        [System.Net.Sockets.NetworkStream]$Stream,
        [int]$StatusCode,
        [string]$StatusText,
        [byte[]]$Body,
        [string]$ContentType
    )
    $crlf = [Environment]::NewLine
    $header = "HTTP/1.1 $StatusCode $StatusText" + $crlf +
              "Content-Type: $ContentType" + $crlf +
              "Content-Length: $($Body.Length)" + $crlf +
              "Cache-Control: no-store" + $crlf +
              "Connection: close" + $crlf + $crlf
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
    $Stream.Write($headerBytes,0,$headerBytes.Length)
    if ($Body.Length -gt 0) { $Stream.Write($Body,0,$Body.Length) }
    $Stream.Flush()
}

$url = "http://127.0.0.1:$port/"
Write-Host ""
Write-Host "RMO website preview is running." -ForegroundColor Green
Write-Host "Preview: $url" -ForegroundColor Cyan
Write-Host "Keep this window open. Press Ctrl+C when finished."
Write-Host ""
Start-Process $url

$rootFull = [System.IO.Path]::GetFullPath($root + [System.IO.Path]::DirectorySeparatorChar)

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new($stream,[System.Text.Encoding]::ASCII,$false,4096,$true)
            $requestLine = $reader.ReadLine()
            if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }

            do { $headerLine = $reader.ReadLine() }
            while ($null -ne $headerLine -and $headerLine -ne "")

            $parts = $requestLine.Split(" ")
            if ($parts.Length -lt 2 -or $parts[0] -ne "GET") {
                $body = [System.Text.Encoding]::UTF8.GetBytes("Method not allowed")
                Send-Response $stream 405 "Method Not Allowed" $body "text/plain; charset=utf-8"
                continue
            }

            $rawPath = $parts[1].Split("?")[0]
            $urlPath = [System.Uri]::UnescapeDataString($rawPath)
            if ($urlPath -eq "/") { $urlPath = "/index.html" }

            $relativePath = $urlPath.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
            $candidate = [System.IO.Path]::GetFullPath((Join-Path $root $relativePath))

            if (-not $candidate.StartsWith($rootFull,[System.StringComparison]::OrdinalIgnoreCase)) {
                $body = [System.Text.Encoding]::UTF8.GetBytes("Forbidden")
                Send-Response $stream 403 "Forbidden" $body "text/plain; charset=utf-8"
                continue
            }

            if (Test-Path $candidate -PathType Container) {
                $candidate = Join-Path $candidate "index.html"
            }

            if (-not (Test-Path $candidate -PathType Leaf)) {
                $body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
                Send-Response $stream 404 "Not Found" $body "text/plain; charset=utf-8"
                continue
            }

            $bytes = [System.IO.File]::ReadAllBytes($candidate)
            $contentType = Get-ContentType $candidate
            Send-Response $stream 200 "OK" $bytes $contentType
        } finally {
            if ($client) { $client.Close() }
        }
    }
} finally {
    if ($listener) { $listener.Stop() }
}
