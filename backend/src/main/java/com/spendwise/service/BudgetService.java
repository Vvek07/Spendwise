package com.spendwise.service;

import com.spendwise.model.Budget;
import com.spendwise.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {
    @Autowired
    private BudgetRepository budgetRepository;

    public List<Budget> getBudgetsForMonth(Long userId, String month) {
        return budgetRepository.findByUserIdAndMonth(userId, month);
    }

    public Budget createOrUpdateBudget(Budget budget) {
        Optional<Budget> existing = budgetRepository.findByUserIdAndCategoryIdAndMonth(
                budget.getUser().getId(), budget.getCategory().getId(), budget.getMonth());

        if (existing.isPresent()) {
            Budget b = existing.get();
            b.setLimitAmount(budget.getLimitAmount());
            return budgetRepository.save(b);
        }
        return budgetRepository.save(budget);
    }
}
