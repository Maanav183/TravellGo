package com.Travellgo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bus {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int busId;

	@NotNull
	private String travelAgency;

	private String busType;

	private int capacity;

	private double fare;

	private String image;

	private double rating;

	private String departureTime;

	private String arrivalTime;

	private String route; // e.g. "Delhi - Jaipur"

	private int routeId;

}
