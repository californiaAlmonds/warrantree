package com.warrantree.service;

import com.warrantree.dto.auth.AuthResponse;
import com.warrantree.dto.auth.LoginRequest;
import com.warrantree.dto.auth.RegisterRequest;
import com.warrantree.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserService userService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse login(LoginRequest loginRequest) {
        logger.info("Attempting login for email: {}", loginRequest.getEmail());
        
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Get user details
            User user = (User) authentication.getPrincipal();
            logger.info("Successfully authenticated user: {}", user.getEmail());

            // Generate simple token (replace with JWT later)
            String token = generateSimpleToken(user);
            
            return new AuthResponse(token, user);
            
        } catch (AuthenticationException e) {
            logger.warn("Authentication failed for email: {}", loginRequest.getEmail());
            throw new RuntimeException("Invalid email or password");
        }
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        logger.info("Attempting registration for email: {}", registerRequest.getEmail());
        
        // Check if user already exists
        if (userService.existsByEmail(registerRequest.getEmail())) {
            logger.warn("Registration failed - email already exists: {}", registerRequest.getEmail());
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = userService.createUser(
                registerRequest.getName(),
                registerRequest.getEmail(),
                registerRequest.getPassword()
        );

        logger.info("Successfully registered user: {}", user.getEmail());

        // Generate token
        String token = generateSimpleToken(user);
        
        return new AuthResponse(token, user);
    }

    public User getCurrentUser(String token) {
        // For now, extract user ID from simple token format
        try {
            String userIdStr = token.replace("USER_", "");
            Long userId = Long.parseLong(userIdStr);
            return userService.getUserById(userId);
        } catch (Exception e) {
            logger.warn("Invalid token format: {}", token);
            throw new RuntimeException("Invalid token");
        }
    }

    public void logout(String token) {
        logger.info("User logout - token invalidated");
        // In a real implementation, you would add the token to a blacklist
        // For now, this is just a placeholder
    }

    public AuthResponse.UserInfo getUserProfile(Long userId) {
        User user = userService.getUserById(userId);
        return new AuthResponse.UserInfo(user);
    }

    public AuthResponse.UserInfo updateUserProfile(Long userId, String name, String email) {
        User updatedUser = userService.updateUserProfile(userId, name, email);
        return new AuthResponse.UserInfo(updatedUser);
    }

    public boolean validateToken(String token) {
        try {
            // Simple validation - check if token starts with USER_ and has valid user ID
            if (!token.startsWith("USER_")) {
                return false;
            }
            String userIdStr = token.replace("USER_", "");
            Long userId = Long.parseLong(userIdStr);
            return userService.getUserById(userId) != null;
        } catch (Exception e) {
            return false;
        }
    }

    // Simple token generation (replace with JWT later)
    private String generateSimpleToken(User user) {
        return "USER_" + user.getId();
    }
} 