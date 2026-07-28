package com.devtask.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * The single, central place where every exception thrown ANYWHERE
 * in the application gets converted into a consistent ApiError JSON
 * response. No controller or service ever needs try-catch for HTTP
 * error handling — they just throw the right exception type and
 * this class takes care of the rest.
 * <p>
 * Order matters conceptually (not in code) — Spring picks the
 * MOST SPECIFIC handler that matches the thrown exception type.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── 1. Our own custom exceptions (ApiException and subclasses) ──
    // Covers: ResourceNotFoundException, DuplicateResourceException,
    //         UnauthorizedException — ALL in one handler, because
    //         they all carry their own status/errorCode/message.
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiError> handleApiException(
            ApiException ex, HttpServletRequest request) {

        log.warn("[{}] {} — {}", ex.getErrorCode(), ex.getMessage(), request.getRequestURI());

        ApiError error = ApiError.builder()
                .status(ex.getHttpStatus().value())
                .errorCode(ex.getErrorCode().name())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(ex.getHttpStatus()).body(error);
    }

    // ── 2. ValidationException (custom business-rule validation) ────
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiError> handleValidationException(
            ValidationException ex, HttpServletRequest request) {

        ApiError error = ApiError.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .errorCode(ErrorCode.VALIDATION_FAILED.name())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .fieldErrors(ex.getFieldErrors())
                .build();

        return ResponseEntity.badRequest().body(error);
    }

    // ── 3. Bean Validation failures (@Valid on @RequestBody) ─────────
    // Triggered by @NotBlank, @Email, @Size etc. failing in DTOs
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleBeanValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fe.getField(), fe.getDefaultMessage());
        }

        ApiError error = ApiError.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .errorCode(ErrorCode.VALIDATION_FAILED.name())
                .message("One or more fields are invalid")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .fieldErrors(fieldErrors)
                .build();

        return ResponseEntity.badRequest().body(error);
    }

    // ── 4. Wrong email/password during login ─────────────────────────
    // Thrown internally by Spring's AuthenticationManager.authenticate()
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(
            HttpServletRequest request) {

        ApiError error = ApiError.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .errorCode(ErrorCode.INVALID_CREDENTIALS.name())
                .message("Email or password is incorrect")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    // ── 5. Authenticated but not allowed (future use — roles/permissions) ─
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(
            HttpServletRequest request) {

        ApiError error = ApiError.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .errorCode(ErrorCode.ACCESS_DENIED.name())
                .message("You do not have permission to perform this action")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    // ── 6. Database-level unique constraint violation (safety net) ──
    // Backup for cases where a duplicate slips past our own check
    // due to a race condition (two requests at the exact same time)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrity(
            HttpServletRequest request) {

        ApiError error = ApiError.builder()
                .status(HttpStatus.CONFLICT.value())
                .errorCode(ErrorCode.EMAIL_ALREADY_REGISTERED.name())
                .message("This record conflicts with an existing one")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    // ── 7. Truly unexpected errors — the safety net of safety nets ──
    // If we reach here, something we did NOT anticipate happened.
    // We log the FULL stack trace internally but never expose
    // internal details to the client — that would be a security leak.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(
            Exception ex, HttpServletRequest request) {

        log.error("Unhandled exception at {}", request.getRequestURI(), ex);

        ApiError error = ApiError.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .errorCode(ErrorCode.INTERNAL_SERVER_ERROR.name())
                .message("Something went wrong. Please try again later.")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.internalServerError().body(error);
    }
}