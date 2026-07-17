package com.devtask.task;

import com.devtask.task.dto.TaskRequest;
import com.devtask.task.dto.TaskResponse;
import com.devtask.user.User;
import com.devtask.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<TaskResponse> getAllTasks() {
        User user = getCurrentUser();
        List<Task> tasks = taskRepository.findByUserId(user.getId());
        return tasks.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TaskResponse getTaskById(String taskId) {
        Task task = findTaskAndVerifyOwnership(taskId);
        return mapToResponse(task);
    }

    public TaskResponse createTask(TaskRequest taskRequest) {
        User user = getCurrentUser();

        Task task = Task.builder()
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .status(taskRequest.getStatus())
                .priority(taskRequest.getPriority())
                .type(taskRequest.getType())
                .deadline(taskRequest.getDeadline())
                .tags(joinTags(taskRequest.getTags()))
                .user(user)
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    public TaskResponse updateTask(String taskId, TaskRequest taskRequest) {
        Task task = findTaskAndVerifyOwnership(taskId);

        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setStatus(taskRequest.getStatus());
        task.setPriority(taskRequest.getPriority());
        task.setType(taskRequest.getType());
        task.setDeadline(taskRequest.getDeadline());
        task.setTags(joinTags(taskRequest.getTags()));

        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    public void deleteTask(String taskId) {
        Task task = findTaskAndVerifyOwnership(taskId);
        taskRepository.delete(task);
    }


    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private List<String> splitTags(String tags) {
        if (tags == null || tags.isBlank()) {
            return List.of();
        }
        return Arrays.asList(tags.split(","));
    }

    private String joinTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return "";
        }
        return String.join(",", tags);
    }

    private Task findTaskAndVerifyOwnership(String taskId) {
        User user = getCurrentUser();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You do not have permission to access this task");
        }

        return task;
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .type(task.getType())
                .deadline(task.getDeadline())
                .tags(splitTags(task.getTags()))
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}