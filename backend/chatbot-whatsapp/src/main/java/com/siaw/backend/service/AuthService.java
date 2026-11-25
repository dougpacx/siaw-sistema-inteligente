package com.siaw.backend.service;

import com.siaw.backend.dto.LoginRequest;
import com.siaw.backend.dto.LoginResponse;
import com.siaw.backend.entity.User;
import com.siaw.backend.entity.UserRole;
import com.siaw.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "E-mail e senha são obrigatórios.");
        }

        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword().trim();

        // Check if user exists in database
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                return buildResponse(user);
            }
        }

        // Demo credentials fallback
        if (email.equals("admin@siaw.com") && password.equals("123456")) {
            User admin = userRepository.findByEmail("admin@siaw.com").orElseGet(() ->
                    userRepository.save(User.builder()
                            .name("Administrador SIAW")
                            .email("admin@siaw.com")
                            .password("123456")
                            .role(UserRole.ADMIN)
                            .build())
            );
            return buildResponse(admin);
        }

        if (email.equals("operador@siaw.com") && password.equals("123456")) {
            User operator = userRepository.findByEmail("operador@siaw.com").orElseGet(() ->
                    userRepository.save(User.builder()
                            .name("Operador de Atendimento")
                            .email("operador@siaw.com")
                            .password("123456")
                            .role(UserRole.OPERATOR)
                            .build())
            );
            return buildResponse(operator);
        }

        // Dynamic operator login for presentation flexibility if password is at least 6 chars
        if (password.length() >= 6) {
            User dynamicUser = userOpt.orElseGet(() -> {
                String userName = email.split("@")[0].toUpperCase();
                UserRole role = "Administrador".equalsIgnoreCase(request.getRole()) || "ADMIN".equalsIgnoreCase(request.getRole())
                        ? UserRole.ADMIN : UserRole.OPERATOR;
                return userRepository.save(User.builder()
                        .name(userName)
                        .email(email)
                        .password(password)
                        .role(role)
                        .build());
            });
            return buildResponse(dynamicUser);
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas. Use admin@siaw.com / 123456 ou operador@siaw.com / 123456.");
    }

    private LoginResponse buildResponse(User user) {
        String roleStr = user.getRole() == UserRole.ADMIN ? "Administrador" : "Operador";
        String avatar = user.getRole() == UserRole.ADMIN
                ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
                : "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces";

        return LoginResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(roleStr)
                .avatar(avatar)
                .token("jwt-siaw-token-" + user.getId())
                .success(true)
                .build();
    }
}
