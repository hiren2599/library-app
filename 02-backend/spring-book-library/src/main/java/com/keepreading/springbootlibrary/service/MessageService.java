package com.keepreading.springbootlibrary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.keepreading.springbootlibrary.dao.MessageRepository;
import com.keepreading.springbootlibrary.entity.Message;

@Service
@Transactional
public class MessageService {

	@Autowired
	private MessageRepository messageRepository;
	
	public void postMessage(Message messageRequest, String userEmail) {
		Message message = new Message(messageRequest.getTitle(), messageRequest.getQuestion());
		message.setUserEmail(userEmail);
		messageRepository.save(message);
	}
}
