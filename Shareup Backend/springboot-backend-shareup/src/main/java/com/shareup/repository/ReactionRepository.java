package com.shareup.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shareup.model.Reaction;


@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long>{

}
