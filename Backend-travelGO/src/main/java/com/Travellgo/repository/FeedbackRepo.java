package com.Travellgo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Travellgo.entity.Feedback;

public interface FeedbackRepo extends JpaRepository<Feedback, Integer> {

    java.util.List<Feedback> findByCustomer(com.Travellgo.entity.Customer customer);

}
