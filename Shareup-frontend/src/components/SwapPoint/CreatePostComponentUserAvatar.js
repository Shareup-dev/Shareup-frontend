import './CreatePostComponentUserAvatar.css';

const CreatePostComponentUserAvatar = ({ imagePath }) => {
  return <img className="container_post-avatar" src={imagePath} alt="imagePath" />;
};

export default CreatePostComponentUserAvatar;
