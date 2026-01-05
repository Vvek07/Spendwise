package com.spendwise.controller;

import com.spendwise.model.Expense;
import com.spendwise.model.User;
import com.spendwise.model.User;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.repository.UserRepository;
import com.spendwise.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    @Autowired
    ExpenseService expenseService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CategoryRepository categoryRepository;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ExpenseController.class);

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        logger.info("Accessing getAllExpenses for user: " + getCurrentUser().getEmail());
        return expenseService.getAllExpenses(getCurrentUser().getId());
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        logger.info("Creating expense: " + expense.getDescription());
        User user = getCurrentUser();
        expense.setUser(user);

        // Fetch and set category if provided
        if (expense.getCategory() != null && expense.getCategory().getId() != null) {
            categoryRepository.findById(expense.getCategory().getId())
                    .ifPresent(expense::setCategory);
        } else {
            expense.setCategory(null);
        }

        // Default date to now if null
        if (expense.getDate() == null) {
            expense.setDate(LocalDate.now());
        }
        return ResponseEntity.ok(expenseService.createExpense(expense));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        // Fetch and set category if provided
        if (expense.getCategory() != null && expense.getCategory().getId() != null) {
            categoryRepository.findById(expense.getCategory().getId())
                    .ifPresent(expense::setCategory);
        }
        return ResponseEntity.ok(expenseService.updateExpense(id, expense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        // In a real app, check ownership before delete
        expenseService.deleteExpense(id);
        return ResponseEntity.ok().build();
    }
}
