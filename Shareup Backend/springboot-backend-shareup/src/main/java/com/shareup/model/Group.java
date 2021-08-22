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
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "groups")
public class Group {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "description")
	private String description;
	
	@Column(name = "privacy_setting")
	private String privacySetting;
	
	@Column(name = "group_invitation_setting")
	private String groupInvitationSetting;
	
	@Column(name = "image")
	private String image;
	
	@Column(name = "media")
	private ArrayList<String> media = new ArrayList<String>();
	
	@Column(name = "cover_image")
	private String coverImage;

	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name="owner_id", referencedColumnName = "id")
	private User owner;
	
	@ManyToMany(cascade = CascadeType.PERSIST, mappedBy="groups")
    private List<User> members = new ArrayList<>();
	
	@OneToMany(cascade = CascadeType.PERSIST)
	private List<User> admins = new ArrayList<>();
	
	@OneToMany(cascade = CascadeType.PERSIST)
	private List<User> mods = new ArrayList<>();
	
	public Group() {
	}

	public Group(String name, String description, String privacySetting, String groupInvitationSetting, String image, String coverImage) {
		super();
		this.name = name;
		this.description = description;
		this.privacySetting = privacySetting;
		this.groupInvitationSetting = groupInvitationSetting;
		this.image = image;
		this.coverImage = coverImage;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getPrivacySetting() {
		return privacySetting;
	}

	public void setPrivacySetting(String privacySetting) {
		this.privacySetting = privacySetting;
	}

	public String getGroupInvitationSetting() {
		return groupInvitationSetting;
	}

	public void setGroupInvitationSetting(String groupInvitationSetting) {
		this.groupInvitationSetting = groupInvitationSetting;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public ArrayList<String> getMedia() {
		return media;
	}

	public void setMedia(ArrayList<String> media) {
		this.media = media;
	}

	public String getCoverImage() {
		return coverImage;
	}

	public void setCoverImage(String coverImage) {
		this.coverImage = coverImage;
	}

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

	public List<User> getMembers() {
		return members;
	}

	public void setMembers(List<User> members) {
		this.members = members;
	}

	public List<User> getAdmins() {
		return admins;
	}

	public void setAdmins(List<User> admins) {
		this.admins = admins;
	}

	public List<User> getMods() {
		return mods;
	}

	public void setMods(List<User> mods) {
		this.mods = mods;
	}
	
	public void addMember(User user) {
		this.getMembers().add(user);
		user.getGroups().add(this);
	}

	public void removeMember(User user) {
		this.getMembers().remove(user);
		user.getGroups().remove(this);
	}
	
	public void addAdmin(User user) {
		this.getAdmins().add(user);
	}
	
	public void addMod(User user) {
		this.getMods().add(user);
	}

	public boolean hasUser(User user){
		for(User u: this.getMembers()){
			if(u.equals(user))
				return true;
		}
		return false;
		
	}

	@Transient
	public String getGroupImagePath() {
		if (image == null ||(Long) id == null) return null;
		// if(profilePicture.equals("default.png")) return "/data/user/default/profile_picture/default.png";
		
		return "/data/group/" + id + "/profile_picture/" + image;		
			
	}

	@Transient
	public String getGroupCoverPath() {
		if (coverImage == null ||(Long) id == null) return null;
		return "/data/group/" + id + "/cover_image/" + coverImage;
			
	}
	
	
}
