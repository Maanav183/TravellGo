package com.Travellgo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.annotation.Nullable;
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
public class Packages {

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	private int packageId;

	private String packageName;

	private String packageDescription;

	private String packageType;

	private double cost;

	@Nullable
	private String paymentDetails;

	private String city; // To group by city

	private String duration;

	private String image; // City image or package image

	private double rating;

	private String highlights; // Comma separated

	@JsonIgnore
	@ManyToOne
	private Booking booking;
}
