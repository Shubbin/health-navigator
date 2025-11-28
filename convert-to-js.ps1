# TypeScript to JavaScript Converter
# This script converts TypeScript files to JavaScript by removing type annotations

Write-Host "Starting TypeScript to JavaScript conversion..." -ForegroundColor Green

$projectRoot = "c:\Users\makin\Desktop\health-navigator-pro"
Set-Location $projectRoot

# Function to convert TypeScript content to JavaScript
function Convert-TStoJS {
    param (
        [string]$content
    )
    
    # Remove type imports (import type { ... })
    $content = $content -replace 'import\s+type\s+\{[^}]+\}\s+from\s+[''"][^''"]+[''"];?\r?\n?', ''
    
    # Remove inline type keyword from imports
    $content = $content -replace '(import\s+\{[^}]*?)\btype\s+', '$1'
    
    # Remove TypeScript type annotations from imports (: Type after variable)
    $content = $content -replace ':\s*[A-Z][a-zA-Z0-9<>,\s\[\]|&{}]*(?=\s*[,}])', ''
    
    # Remove generic type parameters from imports and functions
    $content = $content -replace '<[A-Z][a-zA-Z0-9,\s<>]*>', ''
    
    # Remove interface and type declarations (export interface ... or type ... =)
    $content = $content -replace 'export\s+interface\s+\w+[^{]*\{[^}]*\}\r?\n?', ''
    $content = $content -replace 'export\s+type\s+\w+\s*=\s*[^;]+;\r?\n?', ''
    $content = $content -replace 'interface\s+\w+[^{]*\{[^}]*\}\r?\n?', ''
    $content = $content -replace 'type\s+\w+\s*=\s*[^;]+;\r?\n?', ''
    
    # Remove function return type annotations (: Type after function parameters)
    $content = $content -replace '\):\s*[A-Z][a-zA-Z0-9<>,\s\[\]|&{}]*(?=\s*[={])', ')'
    
    # Remove variable type annotations (const x: Type = ...)
    $content = $content -replace '((?:const|let|var)\s+\w+):\s*[A-Z][a-zA-Z0-9<>,\s\[\]|&{}]*(?=\s*=)', '$1'
    
    # Remove React.FC and similar type annotations
    $content = $content -replace ':\s*React\.(FC|FunctionComponent|ReactNode|ReactElement|ComponentType)[^=]*', ''
    
    # Remove satisfies keyword
    $content = $content -replace '\s+satisfies\s+\w+', ''
    
    # Remove TypeScript non-null assertion operator (!)
    $content = $content -replace '(\w+)!\.', '$1.'
    $content = $content -replace '(\w+)!\)', '$1)'
    
    # Remove as type assertions
    $content = $content -replace '\s+as\s+\w+(<[^>]+>)?', ''
    
    # Update .tsx and .ts imports to .jsx and .js
    $content = $content -replace '(from\s+[''"])([^''"]+)\.tsx([''"])', '$1$2.jsx$3'
    $content = $content -replace '(from\s+[''"])([^''"]+)\.ts([''"])', '$1$2.js$3'
    
    return $content
}

# Get all .ts and .tsx files in src directory
$tsFiles = Get-ChildItem -Path "src" -Include "*.ts", "*.tsx" -Recurse -File

Write-Host "Found $($tsFiles.Count) TypeScript files to convert" -ForegroundColor Yellow

foreach ($file in $tsFiles) {
    Write-Host "Converting: $($file.FullName)" -ForegroundColor Cyan
    
    # Read file content
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Convert content
    $convertedContent = Convert-TStoJS -content $content
    
    # Determine new file path
    $newExtension = if ($file.Extension -eq ".tsx") { ".jsx" } else { ".js" }
    $newPath = $file.FullName -replace '\.(tsx|ts)$', $newExtension
    
    # Write converted content to new file
    $convertedContent | Out-File -FilePath $newPath -Encoding UTF8 -NoNewline
    
    # Delete old TypeScript file
    Remove-Item $file.FullName -Force
    
    Write-Host "  -> Created: $newPath" -ForegroundColor Green
}

Write-Host "`nConversion complete! Total files converted: $($tsFiles.Count)" -ForegroundColor Green
Write-Host "Next steps: Run 'npm install' to update dependencies" -ForegroundColor Yellow
