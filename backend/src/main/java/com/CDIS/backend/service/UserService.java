package com.CDIS.backend.service;

import com.CDIS.backend.dto.RegisterRequest;
import com.CDIS.backend.dto.UserResponse;
import com.CDIS.backend.exception.EmailAlreadyExistsException;

public interface UserService {

    /**
     * Registers a user and returns the created user.
     *
     * @param request registration payload
     * @return created user response
     * @throws EmailAlreadyExistsException when the email is already taken
     */
    UserResponse register(RegisterRequest request);
}
