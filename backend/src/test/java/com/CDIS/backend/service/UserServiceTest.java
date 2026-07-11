package com.CDIS.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.CDIS.backend.dto.RegisterRequest;
import com.CDIS.backend.dto.UserResponse;
import com.CDIS.backend.entity.User;
import com.CDIS.backend.exception.EmailAlreadyExistsException;
import com.CDIS.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void register_persistsUserAndReturnsIdAndEmail() {
        when(userRepository.existsByEmail("jane.doe@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

        UserResponse response = userService.register(new RegisterRequest("jane.doe@example.com", "super-secret"));

        assertNotNull(response.id());
        assertEquals(1L, response.id());
        assertEquals("jane.doe@example.com", response.email());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertEquals("jane.doe@example.com", savedUser.getEmail());
        assertNotNull(savedUser.getPassword());
        org.junit.jupiter.api.Assertions.assertNotEquals("super-secret", savedUser.getPassword());
        org.junit.jupiter.api.Assertions.assertTrue(new BCryptPasswordEncoder()
                .matches("super-secret", savedUser.getPassword()));
    }

    @Test
    void register_whenEmailAlreadyExists_throwsEmailAlreadyExistsException() {
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class,
                () -> userService.register(new RegisterRequest("existing@example.com", "another-secret")));
    }
}
