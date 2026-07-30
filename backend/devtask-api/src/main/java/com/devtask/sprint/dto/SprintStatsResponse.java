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
public class SprintStatsResponse {

    private LocalDate startDate;
    private LocalDate endDate;
    private int totalTasks;
    private int completedTasks;
    private int inProgressTasks;
    private int todoTasks;
    private double percentComplete;
    private int daysLeft;
    private double pace;
    private String status; // "ON_TRACK", "BEHIND", "AHEAD"
}