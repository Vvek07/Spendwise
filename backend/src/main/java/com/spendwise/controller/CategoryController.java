package com.spendwise.controller;

import com.spendwise.model.Category;
import com.spendwise.model.User;
import com.spendwise.repository.UserRepository;
import com.spendwise.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    CategoryService categoryService;

    @Autowired
    UserRepository userRepository;

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }

    @GetMapping
    public List<Category> getUserCategories() {
        return categoryService.getAllCategoriesForUser(getCurrentUser().getId());
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        category.setUser(getCurrentUser());
        return ResponseEntity.ok(categoryService.createCategory(category));
    }
}
