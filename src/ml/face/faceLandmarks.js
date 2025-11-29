import { BaseModel } from '../BaseModel';
import { FaceMesh } from '@mediapipe/face_mesh';

export class FaceLandmarks extends BaseModel {
    constructor(config = {}) {
        super(config);
        this.results = null;
    }

    async load() {
        try {
            this.model = new FaceMesh({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
                }
            });

            this.model.setOptions({
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            this.model.onResults(this.onResults.bind(this));
            this.isLoaded = true;
            console.log("FaceMesh model loaded");
            return true;
        } catch (error) {
            console.error("Error loading FaceMesh:", error);
            return false;
        }
    }

    onResults(results) {
        this.results = results;
    }

    async predict(videoElement) {
        if (!this.isLoaded || !this.model) {
            throw new Error("Model not loaded");
        }
        await this.model.send({ image: videoElement });
        return this.results;
    }
}
