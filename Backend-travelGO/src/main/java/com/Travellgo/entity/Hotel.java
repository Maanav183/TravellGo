package com.Travellgo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int hotelId;

	private String hotelName;

	private String hotelType;

	private String hotelDescription;

	private String hotelAddress;

	private String city;

	private double rent;

	private String status;

	private String image;

	private double rating;

	private String amenities; // Comma separated

	private String interiorImg1;
	private String interiorImg2;
	private String interiorImg3;

	@JsonIgnore
	@ManyToOne
	private Booking booking;

}
