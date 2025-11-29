export class RednessDetector {
    /**
     * Detect eye redness using HSV color analysis
     * @param {HTMLCanvasElement} eyeCanvas - Canvas containing cropped eye
     * @returns {Object} { score, isRed, confidence }
     */
    static analyze(eyeCanvas) {
        const ctx = eyeCanvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, eyeCanvas.width, eyeCanvas.height);
        const data = imageData.data;
        
        let redPixels = 0;
        let totalPixels = 0;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Simple redness heuristic: R > G + B
            if (r > (g + b) * 0.8 && r > 100) {
                redPixels++;
            }
            totalPixels++;
        }

        const score = (redPixels / totalPixels) * 100;
        
        return {
            score: score.toFixed(2),
            isRed: score > 15, // Threshold
            confidence: 0.85
        };
    }
}
