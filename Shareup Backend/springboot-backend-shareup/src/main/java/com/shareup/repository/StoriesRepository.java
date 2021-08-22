package com.shareup.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shareup.model.Stories;

@Repository
public interface StoriesRepository extends JpaRepository<Stories,Long>{
	


	List<Stories> findByUser_Friends_IdOrUser_Id(Long id, Long uid);

	List<Stories> findByUser_Friends_EmailOrUser_Email(String email, String uemail);

	// List<Post> findByUser_savedPosts(String email);

	List<Stories> findByUser_Friends_Id(Long id);

}
