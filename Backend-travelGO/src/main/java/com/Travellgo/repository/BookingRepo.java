package com.Travellgo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Travellgo.entity.Booking;

public interface BookingRepo extends JpaRepository<Booking, Integer>{

}
