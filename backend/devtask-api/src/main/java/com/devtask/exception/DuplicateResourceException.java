package com.devtask.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when trying to create something that already exists
 * (duplicate email, duplicate resource with a unique constraint).
 * Always maps to HTTP 409 Conflict.
 */
public class DuplicateResourceException extends ApiException {
    public DuplicateResourceException(String message, ErrorCode errorCode) {
        super(errorCode, HttpStatus.CONFLICT, message);
    }

    public static DuplicateResourceException email(String email) {
        return new DuplicateResourceException(
                "An account with email '" + email + "' already exists",
                ErrorCode.EMAIL_ALREADY_REGISTERED
        );
    }
}
