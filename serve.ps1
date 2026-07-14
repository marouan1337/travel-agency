$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "============================================="
    Write-Host " Local Web Server Running Natively"
    Write-Host " Address: http://localhost:$port/"
    Write-Host " Root Dir: $PSScriptRoot"
    Write-Host "============================================="
    Write-Host "Press Ctrl+C in this terminal window to stop.`n"
} catch {
    Write-Error "Failed to start listener: $_"
    exit
}

$root = $PSScriptRoot

$mimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".gif"   = "image/gif"
    ".svg"   = "image/svg+xml"
    ".ico"   = "image/x-icon"
    ".mp4"   = "video/mp4"
    ".otf"   = "font/otf"
    ".ttf"   = "font/ttf"
    ".woff"  = "font/woff"
    ".woff2" = "font/woff2"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Get raw path and convert to file path
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/") {
            $urlPath = "/index.html"
        }

        # Resolve path relative to root
        $relative = $urlPath.Replace("/", "\").TrimStart("\")
        $filePath = Join-Path $root $relative

        # If path resolves to a folder, check for index.html inside it
        if (Test-Path -Path $filePath -PathType Container) {
            $filePath = Join-Path $filePath "index.html"
        }

        if (Test-Path -Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = $mimeTypes[$ext]
            if ($null -eq $contentType) {
                $contentType = "application/octet-stream"
            }

            $response.ContentType = $contentType
            $response.StatusCode = 200
            $response.Headers.Add("Access-Control-Allow-Origin", "*")

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "200 OK: $urlPath"
        } else {
            $response.StatusCode = 404
            $html = "<html><body><h1>404 Not Found</h1><p>File not found: $urlPath</p></body></html>"
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($html)
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "404 Not Found: $urlPath"
        }
    } catch {
        Write-Host "Error handling request: $_"
    } finally {
        if ($null -ne $response) {
            $response.Close()
        }
    }
}
