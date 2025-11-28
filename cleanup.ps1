# Cleanup Script
# Fixes specific corruptions in Command.jsx and Carousel.jsx and general generic leftovers

Write-Host "Starting Cleanup script..." -ForegroundColor Green

$projectRoot = "c:\Users\makin\Desktop\health-navigator-pro"
Set-Location $projectRoot

# Fix Command.jsx
$commandPath = "src\components\ui\command.jsx"
if (Test-Path $commandPath) {
    Write-Host "Fixing Command.jsx..." -ForegroundColor Cyan
    $content = Get-Content $commandPath -Raw -Encoding UTF8
    
    # Fix Command component (missing args)
    # It looks like: const Command = React.forwardRef ( <CommandPrimitive
    # We need to insert the args
    $content = $content -replace 'const Command = React\.forwardRef \(\s*<CommandPrimitive', 'const Command = React.forwardRef(({ className, ...props }, ref) => ( <CommandPrimitive'
    
    # Fix other components (garbage leftovers)
    # Pattern: React.forwardRef, ... >((
    $content = $content -replace 'React\.forwardRef,\s*[\s\S]*?>\s*\(', 'React.forwardRef('
    
    $content | Out-File -FilePath $commandPath -Encoding UTF8 -NoNewline
}

# Fix Carousel.jsx
$carouselPath = "src\components\ui\carousel.jsx"
if (Test-Path $carouselPath) {
    Write-Host "Fixing Carousel.jsx..." -ForegroundColor Cyan
    $content = Get-Content $carouselPath -Raw -Encoding UTF8
    
    # Fix CarouselContent
    $content = $content -replace 'const CarouselContent = React\.forwardRef \{', 'const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {'
    
    # Fix CarouselItem
    $content = $content -replace 'const CarouselItem = React\.forwardRef \{', 'const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {'
    
    # Fix CarouselPrevious
    $content = $content -replace 'const CarouselPrevious = React\.forwardRef \{', 'const CarouselPrevious = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {'
    
    # Fix CarouselNext
    $content = $content -replace 'const CarouselNext = React\.forwardRef \{', 'const CarouselNext = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {'
    
    # Fix export
    $content = $content -replace 'export \{ type CarouselApi,', 'export {'
    
    $content | Out-File -FilePath $carouselPath -Encoding UTF8 -NoNewline
}

# General Fix for other files (like Tooltip.jsx)
$files = Get-ChildItem -Path "src" -Recurse -Filter "*.jsx"
foreach ($file in $files) {
    # Skip already handled files if needed, but the regex is safe
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Fix: React.forwardRef, ... >(
    if ($content -match 'React\.forwardRef,\s*[\s\S]*?>\s*\(') {
        Write-Host "Cleaning generics in: $($file.Name)" -ForegroundColor Cyan
        $content = $content -replace 'React\.forwardRef,\s*[\s\S]*?>\s*\(', 'React.forwardRef('
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
    }
}

Write-Host "Cleanup complete!" -ForegroundColor Green
