import './CreatePostComponentFieldText.css';

const CreatePostComponentFieldText = ({ content, handlePostChange }) => {
  return (
    <textarea
      className="container__post-content"
      rows={15}
      placeholder={'What’s on your mind?'}
      name="content"
      value={content}
      onChange={handlePostChange}
    />
  );
};

export default CreatePostComponentFieldText;
