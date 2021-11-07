const CreatePostFieldText = ({ content, handlePostChange }) => {
  return (
    <textarea
      rows={10}
      placeholder={'What’s on your mind?'}
      name='content'
      value={content}
      onChange={handlePostChange}
    />
  );
};

export default CreatePostFieldText;
