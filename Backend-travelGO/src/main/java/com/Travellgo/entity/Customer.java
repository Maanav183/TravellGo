package com.Travellgo.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    private String role; // ROLE_USER / ROLE_ADMIN

    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int Customer_id;
	
	@NotNull
	private String name;
	
	@NotNull
	private String password;
	
	private String address;
	
	private String phoneNo;
	
	@Email
	private String email;
	
	@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
	private List<Booking> bookings = new ArrayList<>();
	
	@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
	private List<Ticket> tickets = new ArrayList<>();
	
	@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Feedback> feedbacks = new ArrayList<>();
}
