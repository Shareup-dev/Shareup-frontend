package com.shareup.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shareup.model.Post;

@Repository
public interface PostRepository extends JpaRepository<Post,Long>{
	List<Post> findByGroup_Id(Long id);

	List<Post> findByUser_Friends_IdOrUser_Id(Long id, Long uid);

	List<Post> findByUser_Friends_EmailOrUser_Email(String email, String uemail);

	// List<Post> findByUser_savedPosts(String email);

	List<Post> findByUser_Friends_Id(Long id);

}
