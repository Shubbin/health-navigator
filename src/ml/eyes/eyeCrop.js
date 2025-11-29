export class EyeCrop {
    /**
     * Crop eye regions from face landmarks
     * @param {Object} landmarks - MediaPipe face landmarks
     * @param {HTMLImageElement|HTMLVideoElement} image - Source image
     * @returns {Object} { leftEye, rightEye } - Cropped images
     */
    static crop(landmarks, image) {
        // Left eye indices: 33, 133 (corners)
        // Right eye indices: 362, 263 (corners)
        // Implementation to crop these regions
        return { leftEye: null, rightEye: null };
    }
}
