package com.spendwise.repository;

import com.spendwise.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserId(Long userId);

    // Find default categories (where user is null) OR user specific ones
    List<Category> findByUserIdOrUserIsNull(Long userId);
}
