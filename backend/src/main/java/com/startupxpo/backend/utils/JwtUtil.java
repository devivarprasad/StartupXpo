package com.startupxpo.backend.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String secretString;

    private SecretKey getSecretKey() {
        logger.debug("Generating JWT secret key");
        SecretKey key = Keys.hmacShaKeyFor(secretString.getBytes(StandardCharsets.UTF_8));
        return key;
    }

    public String generateToken(UserDetails userDetails) {
        logger.info("Generating JWT token for user: {}", userDetails.getUsername());
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("role", userDetails.getAuthorities())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(getSecretKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        try {
            logger.debug("Extracting username from JWT token");
            String username = Jwts.parserBuilder()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            
            logger.info("Successfully extracted username: {} from JWT", username);
            return username;
        } catch (Exception e) {
            logger.error("Failed to extract username from JWT: {}", e.getMessage());
            throw e;
        }
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        logger.debug("Validating JWT token for user: {}", userDetails.getUsername());
        
        try {
            final String username = extractUsername(token);
            boolean usernameMatch = username.equals(userDetails.getUsername());
            boolean notExpired = !isTokenExpired(token);
            
            if (usernameMatch && notExpired) {
                logger.info("JWT token validation successful for user: {}", username);
            } else {
                logger.warn("JWT token validation failed for user: {} - Username match: {}, Not expired: {}", 
                    username, usernameMatch, notExpired);
            }
            
            return (usernameMatch && notExpired);
        } catch (Exception e) {
            logger.error("JWT token validation failed with exception: {}", e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            final Date expiration = (Date) Jwts.parserBuilder()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
            
            Date now = new Date(System.currentTimeMillis());
            boolean expired = expiration.before(now);
            
            if (expired) {
                logger.warn("JWT token is expired. Expiration: {}, Current: {}", expiration, now);
            }
            
            return expired;
        } catch (Exception e) {
            logger.error("Error checking token expiration: {}", e.getMessage());
            return true;
        }
    }
}

