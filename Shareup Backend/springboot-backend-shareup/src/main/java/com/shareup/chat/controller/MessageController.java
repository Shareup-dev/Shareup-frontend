package com.shareup.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import com.shareup.chat.model.ChatMessage;
import com.shareup.model.User;
import com.shareup.repository.UserRepository;

@RestController
public class MessageController {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;
	
	@MessageMapping("/chat/{to}")
	public void sendMessage(@DestinationVariable String to, ChatMessage message) {
		System.out.println("handling send message: " + message + " to: " + to);
		User user = userRepository.findByEmail(to);
		if(user != null) {
			simpMessagingTemplate.convertAndSend("/topic/messages" + to, message);
		}
	}
}
