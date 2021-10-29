import './CreatePostUserAvatar.css';

const CreatePostUserAvatar = ({ imagePath }) => {
  return <img className="container_post-avatar" src={imagePath} alt="imagePath" />;
};

export default CreatePostUserAvatar;
