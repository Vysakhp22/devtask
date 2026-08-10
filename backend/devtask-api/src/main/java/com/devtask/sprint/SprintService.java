package com.devtask.sprint;

import com.devtask.exception.ResourceNotFoundException;
import com.devtask.sprint.dto.BurndownPoint;
import com.devtask.sprint.dto.SprintSummary;
import com.devtask.task.Task;
import com.devtask.task.TaskRepository;
import com.devtask.task.TaskStatus;
import com.devtask.task.TaskType;
import com.devtask.user.User;
import com.devtask.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SprintService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    // Tasks whose deadlines are within this many days of the previous
    // task's deadline (sorted chronologically) are grouped into the
    // SAME sprint cluster. A bigger gap starts a new cluster.
    private static final int CLUSTER_GAP_DAYS = 14;

    public List<SprintSummary> getSprintHistory() {
        User user = getCurrentUser();
        List<Task> sprintTasks = getAllSprintTasks(user.getId());

        return clusterByDeadline(sprintTasks).stream()
                .map(this::toSummary)
                .sorted(Comparator.comparing(SprintSummary::getEndDate).reversed())
                .collect(Collectors.toList());

    }

    // ═══════════════════════════════════════════════════════════════
    // BURNDOWN CHART
    // ═══════════════════════════════════════════════════════════════

    /**
     * Returns one point per day of the current sprint, showing:
     * - idealRemaining: what SHOULD be left if progress was perfectly
     * steady (the dashed reference line)
     * - actualRemaining: what IS actually left, based on real task
     * completion history (the solid line)
     * <p>
     * The sprint window itself is derived from the SPRINT_TASK-type
     * tasks: starts at the earliest one's creation date, ends at the
     * latest one's deadline.
     */

    public List<BurndownPoint> getBurndownData() {
        User user = getCurrentUser();
        List<Task> sprintTasks = getAllSprintTasks(user.getId());

        if (sprintTasks.isEmpty()) {
            return List.of();
        }

        LocalDate rangeStart = findEarliestCreatedDate(sprintTasks);
        LocalDate rangeEnd = findLatestCreatedDate(sprintTasks);
        int sprintLengthDays = (int) ChronoUnit.DAYS.between(rangeStart, rangeEnd) + 1;

        int totalTasks = sprintTasks.size();
        List<BurndownPoint> burndownPoints = new ArrayList<>();

        for (int day = 1; day <= sprintLengthDays; day++) {
            int idealRemaining = calculateIdealRemaining(totalTasks, day, sprintLengthDays);

            LocalDate dayDate = rangeStart.plusDays(day - 1);
            int actualRemaining = calculateActualRemaining(sprintTasks, dayDate);

            burndownPoints.add(BurndownPoint.builder()
                    .day(day)
                    .idealRemaining(idealRemaining)
                    .actualRemaining(actualRemaining)
                    .build());
        }

        return burndownPoints;

    }

    private LocalDate findEarliestCreatedDate(List<Task> tasks) {
        return tasks.stream()
                .map(t -> t.getCreatedAt().toLocalDate())
                .min(Comparator.naturalOrder())
                .orElse(LocalDate.now());
    }

    private LocalDate findLatestCreatedDate(List<Task> tasks) {
        return tasks.stream()
                .map(t -> t.getCreatedAt().toLocalDate())
                .max(Comparator.naturalOrder())
                .orElse(LocalDate.now());
    }

    private int calculateIdealRemaining(int totalTasks, int day, int sprintLengthDays) {
        if (sprintLengthDays <= 1) return day == 1 ? totalTasks : 0;
        double fractionRemaining = 1.0 - ((day - 1) / (double) (sprintLengthDays - 1));
        return (int) Math.round(totalTasks * fractionRemaining);
    }

    private int calculateActualRemaining(List<Task> tasks, LocalDate asOfDate) {
        long doneByThen = tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE)
                .filter(t -> t.getUpdatedAt() != null &&
                        !t.getUpdatedAt().toLocalDate().isAfter(asOfDate))
                .count();

        return tasks.size() - (int) doneByThen;
    }


    private List<Task> getAllSprintTasks(String userId) {
        return taskRepository.findByUserId(userId).stream()
                .filter(task -> task.getType() == TaskType.SPRINT_TASK)
                .filter(task -> task.getDeadline() != null)
                .toList();
    }

    private List<List<Task>> clusterByDeadline(List<Task> tasks) {
        List<Task> sorted = tasks.stream()
                .sorted(Comparator.comparing(t -> t.getDeadline().toLocalDate()))
                .toList();

        List<List<Task>> clusters = new ArrayList<>();
        List<Task> currentCluster = new ArrayList<>();
        LocalDate lastDeadline = null;

        for (Task task : sorted) {
            LocalDate deadline = task.getDeadline().toLocalDate();

            boolean gapTooBig = lastDeadline != null && ChronoUnit.DAYS.between(lastDeadline, deadline) > CLUSTER_GAP_DAYS;

            if (gapTooBig) {
                clusters.add(currentCluster);
                currentCluster = new ArrayList<>();
            }

            currentCluster.add(task);
            lastDeadline = deadline;
        }

        if (!currentCluster.isEmpty()) {
            clusters.add(currentCluster);
        }

        return clusters;
    }

    private LocalDate clusterStartDate(List<Task> cluster) {
        return cluster.stream()
                .map(t -> t.getCreatedAt().toLocalDate())
                .min(Comparator.naturalOrder())
                .orElse(LocalDate.now());
    }

    private LocalDate clusterEndDate(List<Task> cluster) {
        return cluster.stream()
                .map(t -> t.getDeadline().toLocalDate())
                .max(Comparator.naturalOrder())
                .orElse(LocalDate.now());
    }

    private SprintSummary toSummary(List<Task> cluster) {
        long completed = cluster.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE).count();

        return SprintSummary.builder()
                .startDate(clusterStartDate(cluster))
                .endDate(clusterEndDate(cluster))
                .totalTasks(cluster.size())
                .completedTasks((int) completed)
                .build();
    }


    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> ResourceNotFoundException.user(email));
    }


}
