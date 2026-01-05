package com.spendwise.controller;

import com.spendwise.model.User;
import com.spendwise.model.Category;
import com.spendwise.payload.request.LoginRequest;
import com.spendwise.payload.request.SignupRequest;
import com.spendwise.payload.response.JwtResponse;
import com.spendwise.payload.response.MessageResponse;
import com.spendwise.repository.UserRepository;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.security.jwt.JwtUtils;
import com.spendwise.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getName(),
                userDetails.getCurrency()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        if (signUpRequest.getCurrency() != null) {
            user.setCurrency(signUpRequest.getCurrency());
        }

        User savedUser = userRepository.save(user);

        // Seed default categories
        createDefaultCategories(savedUser);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    private void createDefaultCategories(User user) {
        List<Category> categories = new ArrayList<>();
        categories.add(new Category(null, "Food & Dining", "EXPENSE", "#ef4444", user)); // Red
        categories.add(new Category(null, "Transportation", "EXPENSE", "#3b82f6", user)); // Blue
        categories.add(new Category(null, "Utilities", "EXPENSE", "#eab308", user)); // Yellow
        categories.add(new Category(null, "Entertainment", "EXPENSE", "#a855f7", user)); // Purple
        categories.add(new Category(null, "Healthcare", "EXPENSE", "#10b981", user)); // Green
        categories.add(new Category(null, "Shopping", "EXPENSE", "#f43f5e", user)); // Pink
        categories.add(new Category(null, "Business", "EXPENSE", "#64748b", user)); // Slate
        categories.add(new Category(null, "Other", "EXPENSE", "#94a3b8", user)); // Gray

        categoryRepository.saveAll(categories);
    }
}
