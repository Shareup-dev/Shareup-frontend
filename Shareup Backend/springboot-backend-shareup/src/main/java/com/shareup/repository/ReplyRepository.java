package com.shareup.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shareup.model.Reply;

@Repository
public interface ReplyRepository extends JpaRepository<Reply,Long>{

}
