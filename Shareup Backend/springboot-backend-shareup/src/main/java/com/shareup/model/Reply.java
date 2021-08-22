package com.shareup.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "reply")
public class Reply {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "content")
	private String content;
	
	@Column(name = "published")
	private String published;
	
	@Column(name = "last_edited")
	private String lastEdited;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name="user_id", referencedColumnName = "id")
	private User user;
	
//	@ManyToOne(cascade = CascadeType.ALL)
//	@JoinColumn(name="comment_id", referencedColumnName = "id")
//	private Comment comment;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "reply_id", referencedColumnName = "id")
	private List<Reaction> reactions = new ArrayList<>();
	
	public Reply() {
	}

	public Reply(String content, String published, String lastEdited, User user) {
		super();
		this.content = content;
		this.published = published;
		this.lastEdited = lastEdited;
		this.user = user;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getPublished() {
		return published;
	}

	public void setPublished(String published) {
		this.published = published;
	}

	public String getLastEdited() {
		return lastEdited;
	}

	public void setLastEdited(String lastEdited) {
		this.lastEdited = lastEdited;
	}

	public List<Reaction> getReactions() {
		return reactions;
	}

	public void setReactions(List<Reaction> reactions) {
		this.reactions = reactions;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	
	
}
