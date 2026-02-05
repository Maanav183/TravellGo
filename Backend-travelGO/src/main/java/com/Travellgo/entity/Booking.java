package com.Travellgo.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int bookingId;

	private String bookingType;

	private String description;

	private String bookingTitle;

	private LocalDate bookingDate;

	private LocalDate travelDate; // ✅ Added field for Travel Date

	@JsonIgnore
	@ManyToOne
	private Customer customer;

	@OneToMany(mappedBy = "booking")
	private List<Packages> packages = new ArrayList<>();

	@OneToMany(mappedBy = "booking")
	private List<Hotel> hotels = new ArrayList<>();

}
