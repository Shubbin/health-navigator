# Fix ForwardRef Script
Write-Host "Starting Fix ForwardRef..."

$files = Get-ChildItem -Path "src" -Recurse -Filter "*.jsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix React.forwardRef> pattern
    $content = $content -replace 'React\.forwardRef>', 'React.forwardRef'
    
    if ($content -ne $originalContent) {
        Write-Host "Fixing forwardRef in $($file.Name)"
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
    }
}

Write-Host "Done."
