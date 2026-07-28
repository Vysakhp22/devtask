package com.devtask.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * The ONE AND ONLY shape every error response takes,
 * regardless of which endpoint or exception caused it.
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) // omit null fields from JSON
public class ApiError {
    private int status;              // HTTP status code, e.g. 404
    private String errorCode;        // stable code, e.g. "TASK_NOT_FOUND"
    private String message;          // human-readable message
    private String path;             // which endpoint was called
    private LocalDateTime timestamp; // when it happened

    // only present for validation errors (400s from @Valid)
    private Map<String, String> fieldErrors;
}
