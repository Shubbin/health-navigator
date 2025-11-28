# Fix Imports Script
# Fixes broken imports and leftover type definitions from conversion

Write-Host "Starting Fix-Imports script..." -ForegroundColor Green

$projectRoot = "c:\Users\makin\Desktop\health-navigator-pro"
Set-Location $projectRoot

# Function to fix content
function Fix-Content {
    param (
        [string]$content
    )
    
    # Fix React import
    $content = $content -replace 'import \* from "react"', 'import * as React from "react"'
    
    # Fix Radix UI imports
    $radixMap = @{
        "accordion"       = "AccordionPrimitive"
        "alert-dialog"    = "AlertDialogPrimitive"
        "aspect-ratio"    = "AspectRatioPrimitive"
        "avatar"          = "AvatarPrimitive"
        "checkbox"        = "CheckboxPrimitive"
        "collapsible"     = "CollapsiblePrimitive"
        "context-menu"    = "ContextMenuPrimitive"
        "dialog"          = "DialogPrimitive"
        "dropdown-menu"   = "DropdownMenuPrimitive"
        "hover-card"      = "HoverCardPrimitive"
        "label"           = "LabelPrimitive"
        "menubar"         = "MenubarPrimitive"
        "navigation-menu" = "NavigationMenuPrimitive"
        "popover"         = "PopoverPrimitive"
        "progress"        = "ProgressPrimitive"
        "radio-group"     = "RadioGroupPrimitive"
        "scroll-area"     = "ScrollAreaPrimitive"
        "select"          = "SelectPrimitive"
        "separator"       = "SeparatorPrimitive"
        "slider"          = "SliderPrimitive"
        "switch"          = "SwitchPrimitive"
        "tabs"            = "TabsPrimitive"
        "toast"           = "ToastPrimitives"
        "toggle"          = "TogglePrimitive"
        "toggle-group"    = "ToggleGroupPrimitive"
        "tooltip"         = "TooltipPrimitive"
    }
    
    foreach ($key in $radixMap.Keys) {
        $name = $radixMap[$key]
        # Escape the forward slash in the regex just in case, though not strictly needed in PS strings
        $content = $content -replace "import \* from ""@radix-ui/react-$key""", "import * as $name from ""@radix-ui/react-$key"""
    }
    
    # Fix other imports
    $content = $content -replace 'import \* from "react-resizable-panels"', 'import * as ResizablePrimitive from "react-resizable-panels"'
    $content = $content -replace 'import \{ Command \} from "cmdk"', 'import { Command as CommandPrimitive } from "cmdk"'
    
    # Fix Embla Carousel
    $content = $content -replace 'import useEmblaCarousel, \{ type UseEmblaCarouselType \} from "embla-carousel-react"', 'import useEmblaCarousel from "embla-carousel-react"'
    
    # Remove leftover broken type definitions (heuristic)
    $content = $content -replace '(?ms)^\s*plugins\?: CarouselPlugin;.*?\}\s*& CarouselProps;', ''
    $content = $content -replace '(?ms)^\s*api: ReturnType\[1\];.*?\} & CarouselProps;', ''
    
    # Remove leftover type annotations in function args
    $content = $content -replace ':\s*React\.ComponentProps(?:WithoutRef)?<[^>]+>', ''
    $content = $content -replace ':\s*React\.HTMLAttributes(?:<[^>]+>)?', ''
    $content = $content -replace ':\s*React\.KeyboardEvent', ''
    $content = $content -replace ':\s*CarouselApi', ''
    
    # Fix generic leftovers like <HTMLDivElement, ...>
    # Using (?s) to allow dot to match newlines for multi-line generics
    # This regex matches < followed by anything until > (non-greedy)
    # It might be risky if there are nested <>, but for these specific React.forwardRef cases it should be fine
    $content = $content -replace '(?s)React\.forwardRef\s*<.*?>', 'React.forwardRef'
    
    return $content
}

# Get all .jsx files in src directory
$files = Get-ChildItem -Path "src" -Recurse -Filter "*.jsx"

Write-Host "Found $($files.Count) files to check." -ForegroundColor Yellow

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $newContent = Fix-Content -content $content
    
    if ($content -ne $newContent) {
        Write-Host "Fixing: $($file.Name)" -ForegroundColor Cyan
        $newContent | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
    }
}

Write-Host "Fix complete!" -ForegroundColor Green
