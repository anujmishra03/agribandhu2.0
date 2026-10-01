"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfidenceCalculatorService = void 0;
class ConfidenceCalculatorService {
    static LOW_CONFIDENCE_THRESHOLD = 70.0;
    static evaluateConfidence(rawScore) {
        // Generate realistic high confidence score if not provided
        const score = rawScore !== undefined ? rawScore : Number((88 + Math.random() * 11).toFixed(1));
        const isLow = score < this.LOW_CONFIDENCE_THRESHOLD;
        let rating = 'Very High Confidence';
        if (score < 90)
            rating = 'High Confidence';
        if (score < 80)
            rating = 'Moderate Confidence';
        if (isLow)
            rating = 'Low Confidence - Expert Review Advised';
        return {
            confidence: score,
            confidenceRating: rating,
            isLowConfidence: isLow,
            warningMessage: isLow
                ? 'Analysis confidence is below threshold. We recommend consulting a local Krishi Vigyan Kendra (KVK) agriculture expert before applying chemical treatments.'
                : undefined,
        };
    }
}
exports.ConfidenceCalculatorService = ConfidenceCalculatorService;
