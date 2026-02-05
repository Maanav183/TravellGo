package com.Travellgo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int ticketId;

	private String status;

	private String seatNumber;

	@JsonIgnore
	@ManyToOne(cascade = CascadeType.ALL)
	private Customer customer;

	@ManyToOne(cascade = CascadeType.ALL)
	private Route route;

	@ManyToOne(cascade = CascadeType.ALL)
	private Bus bus;
}
