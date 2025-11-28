# Remove VariantProps Script
Write-Host "Removing VariantProps imports..."

$files = Get-ChildItem -Path "src" -Recurse -Filter "*.jsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Remove VariantProps from imports
    $content = $content -replace 'import \{ cva, VariantProps \} from', 'import { cva } from'
    $content = $content -replace 'import \{ VariantProps, cva \} from', 'import { cva } from'
    $content = $content -replace 'import \{ VariantProps \} from', 'import {} from'
    
    if ($content -ne $originalContent) {
        Write-Host "Fixing imports in $($file.Name)"
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
    }
}

Write-Host "Done."
