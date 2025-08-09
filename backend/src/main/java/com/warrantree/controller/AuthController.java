package com.warrantree.controller;

import com.warrantree.dto.auth.AuthResponse;
import com.warrantree.dto.auth.LoginRequest;
import com.warrantree.dto.auth.RegisterRequest;
import com.warrantree.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "User authentication and management operations")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user with email and password")
    @ApiResponse(responseCode = "200", description = "Successfully authenticated")
    @ApiResponse(responseCode = "401", description = "Invalid credentials")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for email: {}", loginRequest.getEmail());
        
        try {
            AuthResponse response = authService.login(loginRequest);
            logger.info("Successful login for email: {}", loginRequest.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.warn("Login failed for email: {} - {}", loginRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid email or password"));
        }
    }

    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Register a new user account")
    @ApiResponse(responseCode = "201", description = "Successfully registered")
    @ApiResponse(responseCode = "400", description = "Registration failed")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        logger.info("Registration attempt for email: {}", registerRequest.getEmail());
        
        try {
            AuthResponse response = authService.register(registerRequest);
            logger.info("Successful registration for email: {}", registerRequest.getEmail());
            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            logger.warn("Registration failed for email: {} - {}", registerRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(400).body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Logout user and invalidate token")
    @ApiResponse(responseCode = "200", description = "Successfully logged out")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        logger.info("Logout attempt");
        
        try {
            String token = extractTokenFromHeader(authHeader);
            authService.logout(token);
            logger.info("Successful logout");
            return ResponseEntity.ok(new MessageResponse("Successfully logged out"));
        } catch (Exception e) {
            logger.warn("Logout failed: {}", e.getMessage());
            return ResponseEntity.status(400).body(new ErrorResponse("Logout failed"));
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get current authenticated user details")
    @ApiResponse(responseCode = "200", description = "User details retrieved")
    @ApiResponse(responseCode = "401", description = "Invalid or expired token")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        logger.info("Get current user attempt");
        
        try {
            String token = extractTokenFromHeader(authHeader);
            
            if (!authService.validateToken(token)) {
                logger.warn("Invalid token provided");
                return ResponseEntity.status(401).body(new ErrorResponse("Invalid or expired token"));
            }
            
            AuthResponse.UserInfo userInfo = authService.getUserProfile(getUserIdFromToken(token));
            logger.info("Successfully retrieved user profile");
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            logger.warn("Get current user failed: {}", e.getMessage());
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid or expired token"));
        }
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Update current user's profile information")
    @ApiResponse(responseCode = "200", description = "Profile updated successfully")
    @ApiResponse(responseCode = "401", description = "Invalid or expired token")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody UpdateProfileRequest updateRequest) {
        logger.info("Update profile attempt");
        
        try {
            String token = extractTokenFromHeader(authHeader);
            
            if (!authService.validateToken(token)) {
                logger.warn("Invalid token provided");
                return ResponseEntity.status(401).body(new ErrorResponse("Invalid or expired token"));
            }
            
            Long userId = getUserIdFromToken(token);
            AuthResponse.UserInfo userInfo = authService.updateUserProfile(
                    userId, updateRequest.getName(), updateRequest.getEmail());
            
            logger.info("Successfully updated user profile");
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            logger.warn("Update profile failed: {}", e.getMessage());
            return ResponseEntity.status(400).body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/validate")
    @Operation(summary = "Validate token", description = "Check if token is valid")
    @ApiResponse(responseCode = "200", description = "Token is valid")
    @ApiResponse(responseCode = "401", description = "Token is invalid")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractTokenFromHeader(authHeader);
            boolean isValid = authService.validateToken(token);
            
            if (isValid) {
                return ResponseEntity.ok(new MessageResponse("Token is valid"));
            } else {
                return ResponseEntity.status(401).body(new ErrorResponse("Token is invalid"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new ErrorResponse("Token is invalid"));
        }
    }

    // Helper methods
    private String extractTokenFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new RuntimeException("Invalid authorization header");
    }

    private Long getUserIdFromToken(String token) {
        try {
            String userIdStr = token.replace("USER_", "");
            return Long.parseLong(userIdStr);
        } catch (Exception e) {
            throw new RuntimeException("Invalid token format");
        }
    }

    // Response classes
    public static class ErrorResponse {
        private String error;
        private long timestamp;

        public ErrorResponse(String error) {
            this.error = error;
            this.timestamp = System.currentTimeMillis();
        }

        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
        public long getTimestamp() { return timestamp; }
        public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    }

    public static class MessageResponse {
        private String message;
        private long timestamp;

        public MessageResponse(String message) {
            this.message = message;
            this.timestamp = System.currentTimeMillis();
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public long getTimestamp() { return timestamp; }
        public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    }

    public static class UpdateProfileRequest {
        @Parameter(description = "User's full name")
        private String name;
        
        @Parameter(description = "User's email address")
        private String email;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
} 