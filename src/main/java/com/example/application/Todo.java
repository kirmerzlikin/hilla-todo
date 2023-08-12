package com.example.application;

import java.time.Instant;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Todo {

    @Id
    @GeneratedValue
    private Integer id;

    private boolean done = false;

    @NotBlank
    private String task;

    private Instant createdAtInstant;

    private Date createdAtDate;

    public Todo() {
    }

    public Todo(String task) {
        this.task = task;
    }
}
