package com.Travellgo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Travellgo.entity.Packages;

public interface PackageRepo extends JpaRepository<Packages, Integer>{

}
