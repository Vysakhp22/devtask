package com.devtask.sprint.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SprintSummary {
    private LocalDate startDate;
    private LocalDate endDate;
    private int totalTasks;
    private int completedTasks;
}