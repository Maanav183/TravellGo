package com.Travellgo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Travellgo.entity.Ticket;

public interface TicketRepo extends JpaRepository<Ticket, Integer> {

    java.util.List<Ticket> findByRoute(com.Travellgo.entity.Route route);
}
