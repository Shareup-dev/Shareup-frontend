package com.shareup.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;


//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/users")
public class JwtAuthenticationRestController {

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception{
    	try {
            String encodedPassword = passwordEncoder.encode(authenticationRequest.getPassword());
            System.out.println(encodedPassword + " THIS IS THE ENCODED PASSWORD" + authenticationRequest.getPassword());
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword())
            );
    	} catch (BadCredentialsException e) {
    		throw new Exception("Incorrect username or password", e);
    	}
    	final String jwt = jwtUtil.generateToken(authenticationRequest.getUsername());
    	
//    	System.out.println("This is the current user = " + jwtUtil.getCurrentUser());
    	
    	return ResponseEntity.ok(new AuthenticationResponse(jwt,authenticationRequest.getUsername()));  
    }
}
