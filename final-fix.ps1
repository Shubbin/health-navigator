# Final Fix Script
Write-Host "Starting Final Fix..."

$files = Get-ChildItem -Path "src" -Recurse -Filter "*.jsx"
# Regex to match: React.forwardRef, followed by anything until >(
# We use single line mode (?s) so . matches newline
# But we want to be careful not to match too much.
# The pattern is specifically the comma after forwardRef, which is invalid JS.
$pattern = 'React\.forwardRef,\s*[\s\S]*?>\s*\('

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match $pattern) {
        Write-Host "Fixing $($file.Name)"
        $content = $content -replace $pattern, 'React.forwardRef('
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
    }
}

Write-Host "Done."
