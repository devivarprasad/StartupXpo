package com.startupxpo.backend.handler; // Use your chosen package

import com.startupxpo.backend.payload.response.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 1. Handles truly non-existent paths (404 condition)
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<MessageResponse> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        // Returns the correct HTTP status code for a missing resource (404 Not Found)
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MessageResponse("The requested resource was not found."));
    }

    // 2. Handles paths that match a pattern but have a bad variable type (400 condition)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<MessageResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = String.format(
                "Parameter '%s' has an invalid format. Value given: '%s'",
                ex.getName(), ex.getValue()
        );
        // Returns the correct HTTP status code for bad input data (400 Bad Request)
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse(message));
    }
}