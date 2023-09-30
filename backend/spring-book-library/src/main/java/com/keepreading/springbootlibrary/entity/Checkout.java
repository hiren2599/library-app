package com.keepreading.springbootlibrary.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="checkout")
@Data
public class Checkout {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name="user_email")
	private String userEmail;
	
	@Column(name="checkout_date")
	private String checkoutDate;
	
	@Column(name="return_date")
	private String returnDate;
	
	@Column(name="book_id")
	private Long bookId;
	
	public Checkout() {}

	public Checkout(String userEmail, String checkoutDate, String returnDate, Long bookId) {
		this.userEmail = userEmail;
		this.checkoutDate = checkoutDate;
		this.returnDate = returnDate;
		this.bookId = bookId;
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public String getCheckoutDate() {
		return checkoutDate;
	}

	public void setCheckoutDate(String checkoutDate) {
		this.checkoutDate = checkoutDate;
	}

	public String getReturnDate() {
		return returnDate;
	}

	public void setReturnDate(String returnDate) {
		this.returnDate = returnDate;
	}

	public Long getBookId() {
		return bookId;
	}

	public void setBookId(Long bookId) {
		this.bookId = bookId;
	}
	
	
	
}
