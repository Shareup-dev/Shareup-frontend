package com.shareup.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.shareup.exception.ResourceNotFoundException;
import com.shareup.jwt.JwtUtil;
import com.shareup.model.Comment;
import com.shareup.model.Group;
import com.shareup.model.Post;
import com.shareup.model.Reaction;
import com.shareup.model.Reply;
import com.shareup.model.Stories;
import com.shareup.model.Swap;
import com.shareup.model.User;
import com.shareup.repository.CommentRepository;
import com.shareup.repository.GroupRepository;
import com.shareup.repository.PostRepository;
import com.shareup.repository.ReactionRepository;
import com.shareup.repository.ReplyRepository;
import com.shareup.repository.StoriesRepository;
import com.shareup.repository.SwapRepository;
import com.shareup.repository.UserRepository;
import com.shareup.service.UserService;

//@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.100.239:3000"})
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1")
public class UserController {

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private UserService userService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private SwapRepository swapRepository;

	
	@Autowired
	private PostRepository postRepository;

	@Autowired
	private CommentRepository commentRepository;

	@Autowired
	private ReplyRepository replyRepository;

	@Autowired
	private ReactionRepository reactionRepository;

	@Autowired
	private GroupRepository groupRepository;

	@Autowired
	private StoriesRepository storiesRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	// get all employees
	@GetMapping("/users")
	public List<User> getAllUser() {
		return userRepository.findAll();
	}

	// Create user rest api
	@PostMapping("/users")
	public ResponseEntity<?> createUser(@RequestBody User user) {
		if (userRepository.findByEmail(user.getEmail()) != null) {
			System.out.println("User Already there");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User Already There");
		}
		System.out.println(user.getFirstName());
		System.out.println("WORKING");
		String encodedPassword = passwordEncoder.encode(user.getPassword());
		// System.out.println(encodedPassword + " THIS IS THE ENCODED PASSWORD" +
		// authenticationRequest.getPassword());
		user.setPassword(encodedPassword);
		if (user.getProfilePicture() == null) {
			user.setProfilePicture("default.png");
		}
		User savedUser = userRepository.save(user);
		return ResponseEntity.ok(savedUser);
	}

	@PutMapping("/users/{email}/edit_profile")
	public ResponseEntity<?> updateuser(@PathVariable String email, @RequestBody User user) {
		User usser = userRepository.findByEmail(email);
		usser.setFirstName(user.getFirstName());
		usser.setLastName(user.getLastName());
		usser.setAboutme(user.getAboutme());
		usser.setJob(user.getJob());
		usser.setHometown(user.getHometown());
		usser.setCurrenttown(user.getCurrenttown());
		usser.setGender(user.getGender());
		usser.setRelationshipstatus(user.getRelationshipstatus());
		usser.setInterests(user.getInterests());
		User updatedUser = userRepository.save(usser);
		return ResponseEntity.ok(updatedUser);

	}

	// get user by id
	@GetMapping("/users/{id}")
	public ResponseEntity<User> getUserById(@PathVariable Long id) {
		User user = userRepository.findById(id)
				.orElseThrow((() -> new ResourceNotFoundException("User not exist with id: " + id)));
		return ResponseEntity.ok(user);
	}

	// get user by email
	@GetMapping("/users/email/{email}")
	public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
		User user = userRepository.findByEmail(email);
		if (user == null) {
			return ResponseEntity.ok("Unsuccessful");
		}
		return ResponseEntity.ok(user);
	}

	// upload profile picture
	@PostMapping("/users/{email}/upload_profile_picture")
	public ResponseEntity<?> uploadProfilePicture(@PathVariable String email,
			@RequestParam(name = "profilePicture") MultipartFile multipartFile) throws IOException {
		try {
			User user = userRepository.findByEmail(email);

			String fileName = null;
			// Upload Files
			if (multipartFile != null) {
				fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());

				user.setProfilePicture(fileName);
			}

			User savedUser = userRepository.save(user);

			if (multipartFile != null) {
				// uploading file
				String uploadDir = "./data/user/" + savedUser.getEmail() + "/profile_picture";

				Path uploadPath = Paths.get(uploadDir);

				if (!Files.exists(uploadPath)) {
					Files.createDirectories(uploadPath);
				}

				try (InputStream inputStream = multipartFile.getInputStream()) {
					Path filePath = uploadPath.resolve(fileName);
					System.out.println(filePath.toFile().getAbsolutePath());
					Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
				} catch (IOException e) {
					throw new IOException("Could not save uploaded file: " + fileName);
				}
			}

			return ResponseEntity.ok(savedUser);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}
	}

	@PostMapping("/users/{email}/upload_cover_picture")
	public ResponseEntity<?> uploadCoverPicture(@PathVariable String email,
			@RequestParam(name = "coverPicture") MultipartFile multipartFile) throws IOException {
		try {
			System.out.println("COVER PICTURE UPLOAD");
			User user = userRepository.findByEmail(email);

			String fileName = null;
			// Upload Files
			if (multipartFile != null) {
				fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());

				user.setCoverPicture(fileName);
			}

			User savedUser = userRepository.save(user);

			if (multipartFile != null) {
				// uploading file
				String uploadDir = "./data/user/" + savedUser.getEmail() + "/cover_picture";

				Path uploadPath = Paths.get(uploadDir);

				if (!Files.exists(uploadPath)) {
					Files.createDirectories(uploadPath);
				}

				try (InputStream inputStream = multipartFile.getInputStream()) {
					Path filePath = uploadPath.resolve(fileName);
					System.out.println(filePath.toFile().getAbsolutePath());
					Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
				} catch (IOException e) {
					throw new IOException("Could not save uploaded file: " + fileName);
				}
			}

			return ResponseEntity.ok(savedUser);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}
	}

	// Get user_friend table
	// @GetMapping("/friends")
	// public List<Friendship> getAllUserFriends(){
	// return friendRepository.findAll();
	// }
	//
	// adding to user_friend table
	@PostMapping("/friends/{uid}/{fid}")
	public ResponseEntity<?> addFriends(@PathVariable Long uid, @PathVariable Long fid) {
		User main = userRepository.findById(uid).orElse(null);
		User frienduser = userRepository.findById(fid).orElse(null);

		try {
			main.addFriend(frienduser);
			User savedUser = userRepository.save(main);
			return ResponseEntity.ok(savedUser);
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.ok("Not Success");
		}
		// System.out.println("Uid: " +uid + " fid: " + fid + " token: " +
		// jwtUtil.getCurrentUser() + " teehee");
	}

	@DeleteMapping("/friends/{uid}/{fid}")
	public ResponseEntity<?> removeFriends(@PathVariable Long uid, @PathVariable Long fid) {
		User main = userRepository.findById(uid).orElse(null);
		User frienduser = userRepository.findById(fid).orElse(null);
		try {
			main.removeFriend(frienduser);
			User savedUser = userRepository.save(main);
			return ResponseEntity.ok(savedUser);
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.ok("Not Success");
		}
	}

	@GetMapping("/friends/{email}")
	public ResponseEntity<?> getFriends(@PathVariable String email) {
		try {
			List<User> friendsList = userService.getFriends(email);
			return ResponseEntity.ok(friendsList);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}

	}
	// Reactions

	@GetMapping("/reactions")
	public ResponseEntity<?> getReactions() {
		try {
			List<Reaction> reactionList = reactionRepository.findAll();
			// Collections.reverse(postList);
			return ResponseEntity.ok(reactionList);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}

	}

	@GetMapping("/posts")
	public ResponseEntity<?> getPost() {
		try {
			List<Post> postList = postRepository.findAll();
			Collections.reverse(postList);
			return ResponseEntity.ok(postList);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}

	}

	// @GetMapping("/posts/{uid}")
	// public ResponseEntity<?> getPostForUser(@PathVariable Long uid) {
	// try {
	// List<Post> postList = postRepository.findByUser_Friends_IdOrUser_Id(uid,
	// uid);
	// Collections.reverse(postList);
	// return ResponseEntity.ok(postList);
	// } catch (Exception e) {
	// e.printStackTrace();
	// return ResponseEntity.ok("Unsuccessful");
	// }

	// }

	@GetMapping("/posts/{email}")
	public ResponseEntity<?> getPostForUser(@PathVariable String email) {
		try {
			List<Post> postList = postRepository.findByUser_Friends_EmailOrUser_Email(email, email);
			// postList.sort((p1,p2) -> p1.getPublished().compareTo(p2.getPublished()));
			postList.sort(Comparator.comparing(o -> ((Post) o).getPublished()).reversed());

			// postList.sort((p1,p2) -> o1.getDateTime().compareTo(o2.getDateTime()));
			// Collections.reverse(postList);
			return ResponseEntity.ok(postList);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}

	}

	@GetMapping("/posts/{email}/saved_posts")
	public ResponseEntity<?> getSavedPostsForUser(@PathVariable String email) {
		try {
			User user = userRepository.findByEmail(email);
			List<Post> postList = user.getSavedPosts();
			Collections.reverse(postList);
			return ResponseEntity.ok(postList);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}

	}

	@PutMapping("/posts/{uid}/like-unlike/{pid}")
	public ResponseEntity<?> likeOrUnlikePost(@PathVariable Long pid, @PathVariable Long uid,
			@RequestBody Reaction reaction) {
		try {
			Post post = postRepository.findById(pid)
					.orElseThrow(() -> new ResourceNotFoundException("Post not exist with id :" + pid));
			User main = userRepository.findById(uid)
					.orElseThrow(() -> new ResourceNotFoundException("User not exist with id :" + uid));
			reaction.setUser(main);
			Optional<Reaction> gottenPost = post.getReactions().stream().filter(p -> p.getUser().equals(main))
					.findFirst();
			Boolean alreadyLiked = gottenPost.isPresent();
			if (alreadyLiked) {
				System.out.println("ALREADY THEREREREREE");
				post.removeReaction(gottenPost.get());
				reactionRepository.save(gottenPost.get());
			} else {
				System.out.println("NOT THERERERERRERE");
				post.getReactions().add(reaction);
			}
			Post savedPost = postRepository.save(post);
			return ResponseEntity.ok(savedPost);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}
	}

	@PutMapping("/posts/{uid}/save-unsave/{pid}")
	public ResponseEntity<?> saveOrUnsavePost(@PathVariable Long pid, @PathVariable Long uid) {
		try {
			Post post = postRepository.findById(pid)
					.orElseThrow(() -> new ResourceNotFoundException("Post not exist with id :" + pid));
			User main = userRepository.findById(uid)
					.orElseThrow(() -> new ResourceNotFoundException("User not exist with id :" + uid));

			Optional<User> gottenUser = post.getSavedByUsers().stream().filter(p -> p.equals(main)).findFirst();
			// post.getReactions().stream().filter(p ->
			// p.getUser().equals(main)).findFirst();
			Boolean alreadySaved = gottenUser.isPresent();
			if (alreadySaved) {
				System.out.println("ALREADY THEREREREREE");
				main.removeSavedPost(post);
			} else {
				System.out.println("NOT THERERERERRERE");
				main.addSavedPost(post);
			}
			// Post savedPost = postRepository.save(post);
			User savedMain = userRepository.save(main);
			return ResponseEntity.ok(savedMain);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}
	}

	@PostMapping("/posts/{uid}")
	public ResponseEntity<?> uploadPost(@PathVariable Long uid, @RequestParam("content") String content,
			@RequestParam(name = "groupid", required = false) Long groupid,
			@RequestParam(name = "files",required = false) MultipartFile multipartFile,@RequestParam(name = "swapfiles",required = false) MultipartFile multipartswapFile, @RequestParam(name = "userTagId",required = false) Long utid) throws IOException {
		try {
			User main = userRepository.findById(uid).orElse(null);
			Post post = new Post();
			if (utid != null) {
			User tagUser = userRepository.findById(utid).orElse(null);}
		     post.setUserTag(null);
			
			post.setContent(content);
			post.setUser(main);
			
			if (groupid != null) {
				Group group = groupRepository.findById(groupid)
						.orElseThrow(() -> new ResourceNotFoundException("Group not exist with id :" + groupid));
				post.setGroup(group);
			}

			LocalDateTime today = LocalDateTime.now();

			System.out.println("Before : " + today);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm:ss");

			String formatDateTime = today.format(formatter);

			post.setPublished(formatDateTime);
			post.setLastEdited(formatDateTime);
			String fileName = null;
			String fileNameS=null;

			// Upload Files
			if (multipartFile != null) {
				fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());

				post.setImage(fileName);
				
			}
            if (multipartswapFile != null) {
				fileNameS = StringUtils.cleanPath(multipartswapFile.getOriginalFilename());

				
				post.setSwapimage(fileNameS);
System.out.println("Before : " + fileNameS);

			}

			Post savedPost = postRepository.save(post);

			if (multipartFile != null) {
				// uploading file
				String uploadDir = "./user-post/" + savedPost.getId();

				Path uploadPath = Paths.get(uploadDir);

			if (!Files.exists(uploadPath)) {
					Files.createDirectories(uploadPath);
				}

				try (InputStream inputStream = multipartFile.getInputStream()) {
					Path filePath = uploadPath.resolve(fileName);
					System.out.println(filePath.toFile().getAbsolutePath());
					Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
				} catch (IOException e) {
					throw new IOException("Could not save uploaded file: " + fileName);
				}
			}
			if (multipartswapFile != null) {
				// uploading file
				String uploadDir = "./user-post/" + savedPost.getId();

				Path uploadPath = Paths.get(uploadDir);

				if (!Files.exists(uploadPath)) {
					Files.createDirectories(uploadPath);
				}

				try (InputStream inputStream = multipartswapFile.getInputStream()) {
					Path filePath = uploadPath.resolve(fileNameS);
					System.out.println(filePath.toFile().getAbsolutePath());
					Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
				} catch (IOException e) {
					throw new IOException("Could not save uploaded file: " + fileName);
				}
			}

			System.out.println(post);
			return ResponseEntity.ok(post);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}
	}
	@PostMapping("/swaps/{uid}")
	public ResponseEntity<?> uploadSwap(@PathVariable Long uid, @RequestParam("content") String content, @RequestParam(name="category",required = false) String category,@RequestParam(name="privacy",required = false) String privacy,
			@RequestParam(name = "groupid", required = false) Long groupid, 
			@RequestParam(name = "files", required = false) MultipartFile multipartFile) throws IOException {
		try {
			User main = userRepository.findById(uid).orElse(null);
			
			Swap swap = new Swap();
			swap.setContent(content);
			swap.setCategory(category);
			swap.setPrivacy(privacy);
			swap.setUser(main);
			
			if (groupid != null) {
				Group group = groupRepository.findById(groupid)
						.orElseThrow(() -> new ResourceNotFoundException("Group not exist with id :" + groupid));
				swap.setGroup(group);
			}

			LocalDateTime today = LocalDateTime.now();

			System.out.println("Before : " + today);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm:ss");

			String formatDateTime = today.format(formatter);

			swap.setPublished(formatDateTime);
			swap.setLastEdited(formatDateTime);
			String fileName = null;

			// Upload Files
			if (multipartFile != null) {
				fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());

				swap.setImage(fileName);
			}

			Swap savedSwap = swapRepository.save(swap);

			if (multipartFile != null) {
				// uploading file
				String uploadDir = "./user-post/" + savedSwap.getId();

				Path uploadPath = Paths.get(uploadDir);

				if (!Files.exists(uploadPath)) {
					Files.createDirectories(uploadPath);
				}

				try (InputStream inputStream = multipartFile.getInputStream()) {
					Path filePath = uploadPath.resolve(fileName);
					System.out.println(filePath.toFile().getAbsolutePath());
					Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
				} catch (IOException e) {
					throw new IOException("Could not save uploaded file: " + fileName);
				}
			}

			System.out.println(swap);
			return ResponseEntity.ok(swap);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}
	}

	@PutMapping("/posts/{id}")
	public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post post) {
		Post mainPost = postRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Post not exist with id :" + id));

		mainPost.setContent(post.getContent());

		LocalDateTime today = LocalDateTime.now();

		System.out.println("Before : " + today);

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm:ss");

		String formatDateTime = today.format(formatter);

		mainPost.setLastEdited(formatDateTime);

		Post updatedPost = postRepository.save(mainPost);
		return ResponseEntity.ok(updatedPost);

	}

	@DeleteMapping("/posts/{id}")
	public ResponseEntity<Map<String, Boolean>> deletePost(@PathVariable Long id) {
		Post post = postRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Post not exist with id :" + id));
		System.out.println("Deleting : " + post);

		List<User> list = post.getSavedByUsers();

		list.addAll(new ArrayList<>(post.getSavedByUsers()));

		for (User user : list) {
			System.out.println("DELETE");
			user.removeSavedPost(post);
		}
		// post.getSavedByUsers().clear();
		postRepository.delete(post);

		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return ResponseEntity.ok(response);
	}

	// for comments

	// no get

	@PostMapping("/comment/{userid}/{postid}")
	public ResponseEntity<?> addComment(@PathVariable Long userid, @PathVariable Long postid,
			@RequestBody Comment comment) {
		try {
			User user = userRepository.findById(userid)
					.orElseThrow(() -> new ResourceNotFoundException("User not exist with id :" + userid));
			Post post = postRepository.findById(postid)
					.orElseThrow(() -> new ResourceNotFoundException("post not exist with id :" + postid));

			comment.setUser(user);

			LocalDateTime today = LocalDateTime.now();

			System.out.println("Before : " + comment);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm:ss");

			String formatDateTime = today.format(formatter);

			comment.setPublished(formatDateTime);
			comment.setLastEdited(formatDateTime);
			post.getComments().add(comment);
			Post savedPost = postRepository.save(post);

			return ResponseEntity.ok(post);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}
	}

	@DeleteMapping("/comment/{id}")
	public ResponseEntity<Map<String, Boolean>> deleteComment(@PathVariable Long id) {
		Comment comment = commentRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Comment not exist with id :" + id));

		commentRepository.delete(comment);
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return ResponseEntity.ok(response);
	}

	// for reply

	// no getter

	@PostMapping("/reply/{userid}/{commentid}")
	public ResponseEntity<?> addReply(@PathVariable Long userid, @PathVariable Long commentid,
			@RequestBody Reply reply) {
		try {
			User user = userRepository.findById(userid)
					.orElseThrow(() -> new ResourceNotFoundException("User not exist with id :" + userid));
			Comment comment = commentRepository.findById(commentid)
					.orElseThrow(() -> new ResourceNotFoundException("comment not exist with id :" + commentid));

			reply.setUser(user);

			LocalDateTime today = LocalDateTime.now();

			System.out.println("Before : " + today);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm:ss");

			String formatDateTime = today.format(formatter);

			reply.setPublished(formatDateTime);
			reply.setLastEdited(formatDateTime);
			comment.getReplies().add(reply);
			commentRepository.save(comment);
			return ResponseEntity.ok(comment);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}
	}

	@DeleteMapping("/reply/{id}")
	public ResponseEntity<Map<String, Boolean>> deleteReply(@PathVariable Long id) {
		Reply reply = replyRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Reply not exist with id :" + id));

		replyRepository.delete(reply);
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return ResponseEntity.ok(response);
	}

	// Followers && Following

	@GetMapping("{user_email}/followers")
	public ResponseEntity<?> getFollowers(@PathVariable String user_email) {
		User user = userRepository.findByEmail(user_email);

		List<User> followers = user.getFollowers();
		return ResponseEntity.ok(followers);
	}

	@GetMapping("{user_email}/following")
	public ResponseEntity<?> getFollowing(@PathVariable String user_email) {
		User user = userRepository.findByEmail(user_email);

		List<User> following = user.getFollowing();
		return ResponseEntity.ok(following);
	}

	@PostMapping("{user_email}/follows/{user_followed_id}")
	public ResponseEntity<?> userFollowingAction(@PathVariable String user_email, @PathVariable Long user_followed_id) {

		try {
			User user = userRepository.findByEmail(user_email);

			User followed_user = userRepository.findById(user_followed_id)
					.orElseThrow(() -> new ResourceNotFoundException("User not exist with id :" + user_followed_id));

			followed_user.addFollower(user);
			User savedUser = userRepository.save(followed_user);
			return ResponseEntity.ok(savedUser);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}
	}

	@DeleteMapping("{user_email}/unfollow/{user_followed_id}")
	public ResponseEntity<?> userUnfollow(@PathVariable String user_email, @PathVariable Long user_followed_id) {
		try {
			User user = userRepository.findByEmail(user_email);

			User followed_user = userRepository.findById(user_followed_id)
					.orElseThrow(() -> new ResourceNotFoundException("User not exist with id :" + user_followed_id));

			followed_user.removeFollower(user);
			User savedUser = userRepository.save(followed_user);
			return ResponseEntity.ok(savedUser);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}
	}

	// Get FriendRequests
	@GetMapping("{user_email}/friend_request_sent")
	public ResponseEntity<?> getFriendRequests(@PathVariable String user_email) {
		User user = userRepository.findByEmail(user_email);

		List<User> requestsSent = user.getFriendRequestSent();
		return ResponseEntity.ok(requestsSent);
	}

	@PostMapping("{uid}/friend_request/{fid}")
	public ResponseEntity<?> sendFriendRequest(@PathVariable Long uid, @PathVariable Long fid) {
		User requester = userRepository.findById(uid).orElse(null);
		User reciever = userRepository.findById(fid).orElse(null);

		try {
			requester.sendFriendRequest(reciever);
			User savedUser = userRepository.save(requester);
			return ResponseEntity.ok(savedUser);
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.ok("Not Success");
		}
	}

	// Get FriendRequestsRecieved
	@GetMapping("{user_email}/friend_request_recieved")
	public ResponseEntity<?> getFriendRequestsRecieved(@PathVariable String user_email) {
		User user = userRepository.findByEmail(user_email);

		List<User> requestsRecieved = user.getFriendRequestRecieved();
		return ResponseEntity.ok(requestsRecieved);
	}

	// Friend Requests
	// Accepting Friend Request
	@PostMapping("{uid}/accept_friend_request/{fid}")
	public ResponseEntity<?> acceptFriendRequest(@PathVariable Long uid, @PathVariable Long fid) {
		User main = userRepository.findById(uid)
				.orElseThrow(() -> new ResourceNotFoundException("User not exist with id :" + uid));
		User frienduser = userRepository.findById(fid)
				.orElseThrow(() -> new ResourceNotFoundException("User not exist with id :" + fid));

		try {
			main.acceptFriendRequest(frienduser);
			frienduser.removeFriendRequest(main);
			// main.removeFriendRequest(frienduser);
			User savedUser = userRepository.save(main);
			return ResponseEntity.ok(savedUser);
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.ok(HttpStatus.BAD_REQUEST);
		}
	}

	// Declining/ Unsending Friend Request
	@PostMapping("{uid}/decline_friend_request/{fid}")
	public ResponseEntity<?> declineFriendRequest(@PathVariable Long uid, @PathVariable Long fid) {
		User main = userRepository.findById(uid)
				.orElseThrow(() -> new ResourceNotFoundException("User not exist with id :" + uid));
		User frienduser = userRepository.findById(fid)
				.orElseThrow(() -> new ResourceNotFoundException("User not exist with id :" + fid));
		try {
			main.removeFriendRequest(frienduser);
			User savedUser = userRepository.save(main);
			return ResponseEntity.ok(savedUser);
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.ok(HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("{uid}/blocks/{bid}")
	public ResponseEntity<?> blockUser(@PathVariable Long uid, @PathVariable Long bid) {
		User user = userRepository.findById(uid).orElse(null);
		User blockUser = userRepository.findById(bid).orElse(null);

		try {
			user.blockUser(blockUser);
			User savedUser = userRepository.save(user);
			return ResponseEntity.ok(savedUser);
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.ok("Not Success");
		}
	}

	@PostMapping("{uid}/unblocks/{bid}")
	public ResponseEntity<?> unblockUser(@PathVariable Long uid, @PathVariable Long bid) {
		User user = userRepository.findById(uid).orElse(null);
		User blockUser = userRepository.findById(bid).orElse(null);

		try {
			user.unblockUser(blockUser);
			User savedUser = userRepository.save(user);
			return ResponseEntity.ok(savedUser);
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.ok("Not Success");
		}
	}
	@PostMapping("/Stories/{uid}")
	public ResponseEntity<?> uploadStories(@PathVariable Long uid, @RequestParam(name = "stryfiles", required = true) MultipartFile multipartFileStry) throws IOException {
		try {
			User main = userRepository.findById(uid).orElse(null);
			
			Stories stories= new Stories();
			
			stories.setUser(main);
			

			LocalDateTime today = LocalDateTime.now();

			System.out.println("Before : " + today);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm:ss");

			String formatDateTime = today.format(formatter);

			stories.setDate(formatDateTime);
			
			String fileName = null;

			// Upload Files
			if (multipartFileStry != null) {
				fileName = StringUtils.cleanPath(multipartFileStry.getOriginalFilename());

				stories.setImage(fileName);
				System.out.println("image : " + fileName);
				
			}
            
			Stories savedStories = storiesRepository.save(stories);

			if (multipartFileStry != null) {
				// uploading file
				String uploadDir = "./user-stories/" + savedStories.getId();

				Path uploadPath = Paths.get(uploadDir);

			if (!Files.exists(uploadPath)) {
					Files.createDirectories(uploadPath);
				}

				try (InputStream inputStream = multipartFileStry.getInputStream()) {
					Path filePath = uploadPath.resolve(fileName);
					System.out.println("uplod"+filePath.toFile().getAbsolutePath());
					Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
				} catch (IOException e) {
					throw new IOException("Could not save uploaded file: " + fileName);
				}
			}
			

			System.out.println(stories);
			return ResponseEntity.ok(stories);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}
	}
	@GetMapping("/stories")
	public ResponseEntity<?> getStories() {
		try {
			List<Stories> storiesList = storiesRepository.findAll();
			Collections.reverse(storiesList);
			return ResponseEntity.ok(storiesList);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}

	}
	@GetMapping("/stories/{email}")
	public ResponseEntity<?> getStoriesForUser(@PathVariable String email) {
		try {
			List<Stories> storiesList = storiesRepository.findByUser_Friends_EmailOrUser_Email(email, email);
			System.out.println(storiesList);
			// postList.sort((p1,p2) -> p1.getPublished().compareTo(p2.getPublished()));
			storiesList.sort(Comparator.comparing(o -> ((Stories) o).getDate()).reversed());

			// postList.sort((p1,p2) -> o1.getDateTime().compareTo(o2.getDateTime()));
			// Collections.reverse(postList);
			return ResponseEntity.ok(storiesList);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok("Unsuccessful");
		}

	}
	@PutMapping("/stories/{id}")
	public ResponseEntity<Stories> updateStories(@PathVariable Long id, @RequestBody Stories stories) {
		Stories mainStories = storiesRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Stories not exist with id :" + id));

		mainStories.setImage(stories.getImage());

		LocalDateTime today = LocalDateTime.now();

		System.out.println("Before : " + today);

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm:ss");

		String formatDateTime = today.format(formatter);

		mainStories.setLastdate(formatDateTime);

		Stories updatedStories = storiesRepository.save(mainStories);
		return ResponseEntity.ok(updatedStories);

	}


}
