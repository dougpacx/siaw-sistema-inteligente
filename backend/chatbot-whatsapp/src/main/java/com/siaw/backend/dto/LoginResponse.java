package com.siaw.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String avatar;
    private String token;
    private boolean success;

    // Provides nested 'user' field so frontend 'res.user' resolves seamlessly
    public Map<String, Object> getUser() {
        return Map.of(
                "id", id != null ? id : 1L,
                "name", name != null ? name : "Usuário",
                "email", email != null ? email : "",
                "role", role != null ? role : "Administrador",
                "avatar", avatar != null ? avatar : "",
                "token", token != null ? token : ""
        );
    }
}
