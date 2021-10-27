import './CreatePostComponentUserName.css';

const CreatePostComponentUserName = ({ user }) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  return <p className="container_post-username">{fullName}</p>;
};

export default CreatePostComponentUserName;
