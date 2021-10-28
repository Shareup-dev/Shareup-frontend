import fileStorage from '../../config/fileStorage';

import useFileSelect from './useFileSelect.js';
import useCreatePost from './useCreatePost.js';

import FileSelect from './FileSelect.jsx';
import CreatePostFieldText from './CreatePostFieldText.jsx';
import CreatePostSelectPrivacy from './CreatePostSelectPrivacy.jsx';
import CreatePostUserAvatar from './CreatePostUserAvatar.jsx';
import CreatePostUserName from './CreatePostUserName.jsx';
import CreatePostBodyOptions from './CreatePostBodyOptions.jsx';

import './CreatePost.css';

// UPDATED UI HERE
const CreatePost = ({ title = 'Create Swap Post', type = 'Swap' }) => {
  const { user, post } = useCreatePost();
  const { fileSelected } = useFileSelect();

  const handlePostChange = (event) => {
    const { name, value } = event.target;
    post.postUpdate({ name, value });
  };

  const handleUploadPost = async (event) => {
    event.preventDefault();

    const files = fileSelected.files.map((images) => images.image);
    post.postUpload(files);
  };

  const handleFileSelect = (event) => {
    fileSelected.filesAdd(event.target.files);
  };

  const PostImagesRemove = () => (
    <button onClick={fileSelected.fileDeleteAll}>
      <i class="las la-times"></i>
    </button>
  );

  const PostImages = () =>
    fileSelected.files.map((image, index) => {
      if (image.isReading) return <p>loading</p>;

      return (
        <img
          src={image.preview}
          alt={`preview${index}`}
          onClick={() => {
            fileSelected.fileDeleteByIndex(index);
          }}
        />
      );
    });

  const PostButton = () => (
    <button className="create-post-submit-swap" type="submit" onClick={handleUploadPost}>
      Share Swap
    </button>
  );

  return (
    <div className="container__create-post">
      <h1 className="create-post_title">{title}</h1>
      <div className="create-post_header">
        <CreatePostUserAvatar imagePath={fileStorage.baseUrl + user.profilePicturePath} />
        <div className="header_info">
          <CreatePostUserName user={user} />
          <CreatePostSelectPrivacy privacy={post.privacy} handlePostChange={handlePostChange} />
        </div>
      </div>
      <div className="create-post-body">
        <CreatePostFieldText content={post.content} handlePostChange={handlePostChange} />
        <CreatePostBodyOptions>
          <FileSelect onfileSelect={handleFileSelect} />
        </CreatePostBodyOptions>

        <PostImagesRemove />
        <PostImages />
        <PostButton />
      </div>
    </div>
  );
};

export default CreatePost;
