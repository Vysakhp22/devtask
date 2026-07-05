package com.devtask.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByUserId(String userId);

    List<Task> findByUserIdAndStatus(String userId, TaskStatus status);

    List<Task> findByUserIdAndPriority(String userId, TaskPriority priority);

    long countByUserIdAndStatus(String userId, TaskStatus status);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Task> searchByTitle(@Param("userId") String userId, @Param("searchTerm") String searchTerm);
}
