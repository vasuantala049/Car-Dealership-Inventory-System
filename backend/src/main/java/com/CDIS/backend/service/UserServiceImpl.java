package com.CDIS.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.CDIS.backend.dto.LoginRequest;
import com.CDIS.backend.dto.LoginResponse;
import com.CDIS.backend.dto.RegisterRequest;
import com.CDIS.backend.dto.UserResponse;
import com.CDIS.backend.entity.User;
import com.CDIS.backend.entity.UserRole;
import com.CDIS.backend.exception.EmailAlreadyExistsException;
import com.CDIS.backend.exception.InvalidCredentialsException;
import com.CDIS.backend.repository.UserRepository;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
            JwtService jwtService,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        // Give admin role ONLY to vasu049@gmail.com
        UserRole role = "vasu049@gmail.com".equalsIgnoreCase(request.email()) ? UserRole.ADMIN : UserRole.USER;

        User user = new User(null, request.email(), passwordEncoder.encode(request.password()), role);
        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser.getId(), savedUser.getEmail());
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return new LoginResponse(jwtService.generateToken(user));
    }
}
