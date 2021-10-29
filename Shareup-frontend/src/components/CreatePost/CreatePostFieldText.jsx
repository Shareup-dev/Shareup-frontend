import './CreatePostFieldText.css';

const CreatePostFieldText = ({ content, handlePostChange }) => {
  return (
    <textarea
      className='container__post-content'
      rows={10}
      placeholder={'What’s on your mind?'}
      name='content'
      value={content}
      onChange={handlePostChange}
    />
  );
};

export default CreatePostFieldText;
