package com.Travellgo.exception;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(CustomException.class)
	public ResponseEntity<ErrorResponse> handleCustomException(CustomException ex, WebRequest request) {
		ErrorResponse errorResponse = new ErrorResponse();
		errorResponse.setTimeStamp(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
		errorResponse.setStatus(ex.getStatus().value());
		errorResponse.setError(ex.getStatus().getReasonPhrase());
		errorResponse.setMessage(ex.getMessage());
		errorResponse.setPath(request.getDescription(false).substring(4)); // Remove prefix
		return new ResponseEntity<>(errorResponse, ex.getStatus());
	}

	@ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
	public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
			org.springframework.dao.DataIntegrityViolationException ex, WebRequest request) {
		ErrorResponse errorResponse = new ErrorResponse();
		errorResponse.setTimeStamp(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
		errorResponse.setStatus(org.springframework.http.HttpStatus.CONFLICT.value());
		errorResponse.setError(org.springframework.http.HttpStatus.CONFLICT.getReasonPhrase());
		String errorMessage = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
		errorResponse.setMessage("Database error: " + errorMessage); // Expose root cause for clarity,
																		// or generic message
		errorResponse.setPath(request.getDescription(false).substring(4));
		return new ResponseEntity<>(errorResponse, org.springframework.http.HttpStatus.CONFLICT);
	}
}