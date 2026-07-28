package com.devtask.exception;

import org.springframework.http.HttpStatus;
/**
 * Thrown for authentication failures: wrong password, missing token,
 * expired token, invalid token signature.
 * Always maps to HTTP 401 Unauthorized.
 */
public class UnauthorizedException extends ApiException {

    public UnauthorizedException(String message, ErrorCode errorCode) {
        super(errorCode, HttpStatus.UNAUTHORIZED, message);
    }

    public static UnauthorizedException invalidCredentials() {
        return new UnauthorizedException("Email or Password is incorrect", ErrorCode.INVALID_CREDENTIALS);
    }

    public static UnauthorizedException tokenExpired() {
        return new UnauthorizedException("Token has expired", ErrorCode.AUTH_TOKEN_EXPIRED);
    }

    public static UnauthorizedException tokenInvalid() {
        return new UnauthorizedException("Token is invalid", ErrorCode.AUTH_TOKEN_INVALID);
    }
}
