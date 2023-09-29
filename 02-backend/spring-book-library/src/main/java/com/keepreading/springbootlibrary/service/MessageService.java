package com.keepreading.springbootlibrary.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.keepreading.springbootlibrary.dao.MessageRepository;
import com.keepreading.springbootlibrary.entity.Message;
import com.keepreading.springbootlibrary.requestmodels.AdminQuestionRequest;

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
	
	public void putMessage(AdminQuestionRequest adminQuestionRequest, String userEmail) throws Exception {
		Optional<Message> validateMessage = messageRepository.findById(adminQuestionRequest.getId());
				
		if(!validateMessage.isPresent()) {
			throw new Exception("Something went wrong");
		}
		
		validateMessage.get().setAdminEmail(userEmail);
		validateMessage.get().setResponse(adminQuestionRequest.getResponse());
		validateMessage.get().setClosed(true);
		
		messageRepository.save(validateMessage.get());
	}
}
