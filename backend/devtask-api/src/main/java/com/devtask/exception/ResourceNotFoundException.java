package com.devtask.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(ErrorCode errorCode, String message) {
        super(errorCode, HttpStatus.NOT_FOUND, message);
    }

    public ResourceNotFoundException task(String taskId) {
        return new ResourceNotFoundException(ErrorCode.TASK_NOT_FOUND, "No task found with id: " + taskId);
    }

    public ResourceNotFoundException user(String email) {
        return new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND, "No user found with email: " + email);
    }
}
