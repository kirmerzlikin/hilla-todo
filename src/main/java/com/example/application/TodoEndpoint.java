package com.example.application;

import java.util.List;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import lombok.RequiredArgsConstructor;

@Endpoint
@AnonymousAllowed
@RequiredArgsConstructor
public class TodoEndpoint {

    private final TodoRepository todoRepository;

    public @Nonnull List<@Nonnull Todo> findAll() {
        return todoRepository.findAll();
    }

    public @Nonnull Todo save(@Nonnull Todo todo) {
      return todoRepository.save(todo);
    }

    public void remove(@Nonnull Integer id) {
        todoRepository.deleteById(id);
    }
}
