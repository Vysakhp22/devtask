package com.devtask.exception;

import java.util.Map;

/**
 * Thrown for business-rule validation failures that Bean Validation
 * (@NotBlank, @Email etc.) cannot express — e.g. "deadline required
 * when task type is SPRINT_TASK". Bean Validation failures are
 * handled separately (see GlobalExceptionHandler), this is for
 * custom logic checks inside services.
 * Always maps to HTTP 400 Bad Request.
 */
public class ValidationException extends ApiException {

    private final Map<String, String> fieldErrors;

    public ValidationException(Map<String, String> fieldErrors) {
        super(ErrorCode.VALIDATION_FAILED, org.springframework.http.HttpStatus.BAD_REQUEST, "Validation failed");
        this.fieldErrors = fieldErrors;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }
}
