package com.Travellgo.utils;

import com.Travellgo.service.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Travellgo.entity.Customer;
import com.Travellgo.repository.CustomerRepo;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerRepo customerRepo;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        Customer customer = customerRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new CustomUserDetails(customer);
    }
}
