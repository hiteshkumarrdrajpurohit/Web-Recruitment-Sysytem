package com.sunbeam.exception_handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;

import com.sunbeam.custom_exceptions.AuthenticationFailureException;
import com.sunbeam.custom_exceptions.InvalidInputException;
import com.sunbeam.custom_exceptions.ResourceNotFoundException;
import com.sunbeam.dto.ApiResponse;

@RestControllerAdvice // declares a spring bean containing 
//cross cutting concern(repetitive logic) of exc handling
//= @ControllerAdvice - class level + @ResponseBody - all exc handling methods
public class GlobalExceptionHandler {
	//add exception handling method - to handle ResourceNOtFoundException
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<?> 
	handleResourceNotFoundException(ResourceNotFoundException e)
	{
		System.out.println("in catch - Res not found exc");
		return ResponseEntity.status(HttpStatus.NOT_FOUND)//SC 404
				.body(new ApiResponse(e.getMessage()));		
	}
	//add exception handling method - to handle auth failure
		@ExceptionHandler(AuthenticationFailureException.class)
		public ResponseEntity<?> 
		handleAuthenticationFailureException(AuthenticationFailureException e)
		{
			System.out.println("in catch -invalid auth");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)//SC 401
					.body(new ApiResponse(e.getMessage()));		
		}
		//add exception handling method - to handle bad request - invalid input
		@ExceptionHandler(InvalidInputException.class)
	    public ResponseEntity<?> 
		handleInvalidInputException(InvalidInputException e)
				{
					System.out.println("in catch -invalid input exc");
					return ResponseEntity.status(HttpStatus.BAD_REQUEST)//SC 400
							.body(new ApiResponse(e.getMessage()));		
				}
		
		// Handle Bean Validation errors (from @NotBlank, @NotNull, etc.)
		@ExceptionHandler(MethodArgumentNotValidException.class)
		public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException e) {
			System.out.println("in catch - validation exc");
			FieldError fieldError = e.getBindingResult().getFieldError();
			String errorMessage = fieldError != null ? fieldError.getDefaultMessage() : "Validation failed";
			return ResponseEntity.status(HttpStatus.BAD_REQUEST) // SC 400
					.body(new ApiResponse(errorMessage));
		}
		
		//add exception handling method - to catch remaining excs (catch-all)
		@ExceptionHandler(RuntimeException.class)
		public ResponseEntity<?> 
		handleInvalidInputException(RuntimeException e)
		{
			System.out.println("in catch all");
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)//SC 500
					.body(new ApiResponse(e.getMessage()));		
		}
}
