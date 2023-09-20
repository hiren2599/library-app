package com.keepreading.springbootlibrary.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.keepreading.springbootlibrary.entity.Book;

public interface BookRepository extends JpaRepository<Book, Long> {

}
