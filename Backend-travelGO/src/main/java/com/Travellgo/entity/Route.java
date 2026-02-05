package com.Travellgo.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int routeId;
	
	private String routeFrom;
	
	private String routeTo;
	
	private String timing;
	
	private LocalDate dateOfJourney;

	private int bus_id;
}
