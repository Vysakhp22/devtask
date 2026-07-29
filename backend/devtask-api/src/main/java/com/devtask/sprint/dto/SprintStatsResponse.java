package com.devtask.sprint.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SprintStatsResponse {

    private int totalTasks;
    private int completedTasks;
    private int inProgressTasks;
    private int todoTasks;
    private double percentComplete;
    private int daysLeft;
    private double pace;
    private String status; // "ON_TRACK", "BEHIND", "AHEAD"
}