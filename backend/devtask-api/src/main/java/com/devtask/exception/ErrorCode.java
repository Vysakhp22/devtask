package com.devtask.exception;

/**
 * Central registry of every error code the API can return.
 * Angular uses these CODES (not messages) to decide behavior,
 * e.g. redirect to login on AUTH_TOKEN_EXPIRED,
 * show a field error on VALIDATION_FAILED,
 * show a toast on generic errors.
 * <p>
 * Naming convention: DOMAIN_REASON
 */
public enum ErrorCode {

    // ── Auth domain ──────────────────────────────────────────────
    EMAIL_ALREADY_REGISTERED,
    INVALID_CREDENTIALS,
    AUTH_TOKEN_MISSING,
    AUTH_TOKEN_EXPIRED,
    AUTH_TOKEN_INVALID,

    // ── User domain ──────────────────────────────────────────────
    USER_NOT_FOUND,

    // ── Task domain ──────────────────────────────────────────────
    TASK_NOT_FOUND,

    // ── Generic / cross-cutting ──────────────────────────────────
    VALIDATION_FAILED,
    ACCESS_DENIED,
    RESOURCE_NOT_FOUND,
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR
}