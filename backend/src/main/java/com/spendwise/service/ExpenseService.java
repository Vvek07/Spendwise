package com.spendwise.service;

import com.spendwise.model.Expense;
import com.spendwise.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;

    public List<Expense> getAllExpenses(Long userId) {
        return expenseRepository.findByUserIdOrderByDateDesc(userId);
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public Expense updateExpense(Long id, Expense expenseRequest) {
        return expenseRepository.findById(id).map(expense -> {
            if (expenseRequest.getAmount() != null) {
                expense.setAmount(expenseRequest.getAmount());
            }
            if (expenseRequest.getDescription() != null) {
                expense.setDescription(expenseRequest.getDescription());
            }
            if (expenseRequest.getDate() != null) {
                expense.setDate(expenseRequest.getDate());
            }
            if (expenseRequest.getCategory() != null) {
                expense.setCategory(expenseRequest.getCategory());
            }
            return expenseRepository.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense not found with id " + id));
    }
}
