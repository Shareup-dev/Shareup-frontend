package com.shareup.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shareup.model.Swap;

public interface SwapRepository extends JpaRepository<Swap,Long> {
	List<Swap> findByGroup_Id(Long id);

	List<Swap> findByUser_Friends_IdOrUser_Id(Long id, Long uid);

	List<Swap> findByUser_Friends_EmailOrUser_Email(String email, String uemail);

	// List<Post> findByUser_savedPosts(String email);

	List<Swap> findByUser_Friends_Id(Long id);

}

