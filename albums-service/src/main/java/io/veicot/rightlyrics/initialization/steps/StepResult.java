package io.veicot.rightlyrics.initialization.steps;

import lombok.Data;

@Data
public class StepResult {

    private String stepId;
    private String message;
    private int statusCode;

    private StepResult(String stepId, String message, int statusCode) {
        this.stepId = stepId;
        this.message = message;
        this.statusCode = statusCode;
    }

    public static StepResult SUCCESS(String stepId, String message) {
        return new StepResult(stepId, message, 0);
    }

    public static StepResult ERROR(String stepId, int errorCode, String message) {
        return new StepResult(stepId, message, errorCode);
    }

}