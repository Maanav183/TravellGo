package com.Travellgo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.Travellgo.entity.Hotel;

@Repository
public interface HotelRepo extends JpaRepository<Hotel, Integer>{

	@Query("SELECT h FROM Hotel h WHERE h.hotelName LIKE %:hotelName%")
    List<Hotel> findHotelsByNameContaining(String hotelName);

	
}
