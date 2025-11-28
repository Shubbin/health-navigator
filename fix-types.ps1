# Fix Types Script
Write-Host "Starting Fix Types..."

$files = Get-ChildItem -Path "src" -Recurse -Filter "*.jsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix }: Type) pattern
    # Matches }: TypeName) or }: TypeName<...>)
    $content = $content -replace '\}\s*:\s*\w+(?:<[^>]+>)?\s*\)', '})'
    
    # Fix }: React.Type) pattern
    $content = $content -replace '\}\s*:\s*React\.\w+(?:<[^>]+>)?\s*\)', '})'
    
    # Fix }: { ... }) pattern (inline object type)
    $content = $content -replace '\}\s*:\s*\{[^}]+\}\s*\)', '})'
    
    if ($content -ne $originalContent) {
        Write-Host "Fixing types in $($file.Name)"
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
    }
}

Write-Host "Done."
