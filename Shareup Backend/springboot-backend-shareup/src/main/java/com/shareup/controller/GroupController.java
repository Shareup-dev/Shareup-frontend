package com.shareup.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.List;


import org.apache.tomcat.util.json.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shareup.exception.ResourceNotFoundException;
import com.shareup.model.Group;
import com.shareup.model.Post;
import com.shareup.model.User;
import com.shareup.repository.GroupRepository;
import com.shareup.repository.PostRepository;
import com.shareup.repository.UserRepository;

//@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.100.239:3000"})
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/groups")
public class GroupController {
	@Autowired
	private GroupRepository groupRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PostRepository postRepository;

	// get all groups
	@GetMapping("")
	public List<Group> getAllGroups() {
		return groupRepository.findAll();
	}
	
	@GetMapping("/id/{id}")
	public Group getGroupById(@PathVariable Long id) {
		return groupRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Group not exist with id :" + id));
	}
	
	@GetMapping("/email/{email}")
	public List<Group> getAllGroupsByEmail(@PathVariable String email) {
		return groupRepository.findByMembers_Email(email);
	}

	// public ResponseEntity<?> createGroup(@PathVariable String email, @RequestParam(name = "profilePicture") MultipartFile multipartFile ) throws IOException{

	@PostMapping("{uid}/create")
	public ResponseEntity<?> createGroup(@PathVariable Long uid, @RequestParam(name = "group") String group,  @RequestParam(name = "groupPicture", required = false) MultipartFile groupPicture,  @RequestParam(name = "groupCover", required = false) MultipartFile groupCover) throws IOException{
		try{
			User user = userRepository.findById(uid).orElseThrow(() -> new ResourceNotFoundException("User not exist with id :" + uid));
		System.out.println("CHECKNECKNK");

		Group createGroup = new ObjectMapper().readValue(group, Group.class);
		createGroup.setOwner(user);	
		createGroup.setMedia(null);

		System.out.println(groupPicture + " YEEWHA");
		System.out.println(groupCover + " YEEWHA Cover");

		String fileNameImage = null;
		String fileNameCover = null;

	        
			//Upload Files
	        if(groupPicture != null) {
	        	fileNameImage = StringUtils.cleanPath(groupPicture.getOriginalFilename());
				
				createGroup.setImage(fileNameImage);
	        }

			if(groupCover != null) {
	        	fileNameCover = StringUtils.cleanPath(groupCover.getOriginalFilename());
				
				createGroup.setCoverImage(fileNameCover);
	        }
		
			Group savedGroup = groupRepository.save(createGroup);
			
			if(groupPicture != null) {
				//uploading file
				String uploadDir = "./data/group/" + savedGroup.getId() + "/profile_picture";
				
				Path uploadPath = Paths.get(uploadDir);
				
				
				if(!Files.exists(uploadPath)) {
					Files.createDirectories(uploadPath);
				}
				
				try(InputStream inputStream = groupPicture.getInputStream()){
					Path filePath = uploadPath.resolve(fileNameImage);
					System.out.println(filePath.toFile().getAbsolutePath());
					Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
				}catch(IOException e) {
					throw new IOException("Could not save uploaded file: " + fileNameImage);
				}	
	        }

			if(groupCover != null) {
				//uploading file
				String uploadDir2 = "./data/group/" + savedGroup.getId() + "/cover_image";
				
				Path uploadPath2 = Paths.get(uploadDir2);
				
				
				if(!Files.exists(uploadPath2)) {
					Files.createDirectories(uploadPath2);
				}
				
				try(InputStream inputStream2 = groupCover.getInputStream()){
					Path filePath2 = uploadPath2.resolve(fileNameCover);
					System.out.println(filePath2.toFile().getAbsolutePath());
					Files.copy(inputStream2, filePath2, StandardCopyOption.REPLACE_EXISTING);
				}catch(IOException e) {
					throw new IOException("Could not save uploaded file: " + fileNameCover);
				}	
	        }
	        
			System.out.println(savedGroup);
			return ResponseEntity.ok(savedGroup);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}
	}
	
	//get Post by group
	@GetMapping("posts/{id}")
	public List<Post> getPostsByGroupId(@PathVariable Long id) {
		List<Post> groupsPosts = postRepository.findByGroup_Id(id);
		Collections.reverse(groupsPosts);
		return groupsPosts;
	}
	
	@PostMapping("/{uid}/join/{gid}")
	public ResponseEntity<?> joinGroup(@PathVariable Long uid, @PathVariable Long gid){
		Group group = groupRepository.findById(gid).orElseThrow(() -> new ResourceNotFoundException("Group not exist with id :" + gid));
		User user = userRepository.findById(uid).orElseThrow(() -> new ResourceNotFoundException("User not exist with id :" + uid));
		group.addMember(user);
		
		Group gsaved = groupRepository.save(group);
		return ResponseEntity.ok(gsaved);
	}

	@DeleteMapping("/{uid}/leave/{gid}")
	public ResponseEntity<?> leaveGroup(@PathVariable Long uid, @PathVariable Long gid){
		Group group = groupRepository.findById(gid).orElseThrow(() -> new ResourceNotFoundException("Group not exist with id :" + gid));
		User user = userRepository.findById(uid).orElseThrow(() -> new ResourceNotFoundException("User not exist with id :" + uid));
		group.removeMember(user);
		Group gsaved = groupRepository.save(group);
		return ResponseEntity.ok(gsaved);
	}
	
}
