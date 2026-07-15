package com.devtask.task.dto;

import com.devtask.task.TaskPriority;
import com.devtask.task.TaskStatus;
import com.devtask.task.TaskType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Status is required")
    private TaskStatus status;

    @NotNull(message = "Priority is required")
    private TaskPriority priority;

    @NotNull(message = "Type is required")
    private TaskType type;

    private LocalDateTime deadline;

    private List<String> tags;

}
