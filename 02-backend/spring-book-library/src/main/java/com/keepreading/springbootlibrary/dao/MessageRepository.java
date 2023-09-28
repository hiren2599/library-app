package com.keepreading.springbootlibrary.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

import com.keepreading.springbootlibrary.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {

	Page<Message> findByUserEmail(@RequestParam("user_email") String userEmail, Pageable pageable);
}
