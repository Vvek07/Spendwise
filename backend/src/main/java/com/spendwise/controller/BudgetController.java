package com.spendwise.controller;

import com.spendwise.model.Budget;
import com.spendwise.model.User;
import com.spendwise.repository.UserRepository;
import com.spendwise.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/budgets")
public class BudgetController {
    @Autowired
    BudgetService budgetService;

    @Autowired
    UserRepository userRepository;

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }

    @GetMapping
    public List<Budget> getBudgets(@RequestParam String month) {
        return budgetService.getBudgetsForMonth(getCurrentUser().getId(), month);
    }

    @PostMapping
    public ResponseEntity<Budget> setBudget(@RequestBody Budget budget) {
        budget.setUser(getCurrentUser());
        return ResponseEntity.ok(budgetService.createOrUpdateBudget(budget));
    }
}
