package com.devtask.task.dto;

import com.devtask.task.TaskPriority;
import com.devtask.task.TaskStatus;
import com.devtask.task.TaskType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private String id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private TaskType type;
    private LocalDateTime deadline;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
