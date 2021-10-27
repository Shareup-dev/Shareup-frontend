import './CreatePostComponentSelectPrivacy.css';

const DEFAULT_PRIVACY_OPTIONS = ['Friends', 'Only Me', 'Public'];

const CreatePostComponentSelectPrivacy = ({ privacy, handlePostChange, options = DEFAULT_PRIVACY_OPTIONS }) => {
  const privacyOptions = options.map((option) => <option value={option}>{option}</option>);

  return (
    <select className="container__post-privacy" name="privacy" id="privacy" value={privacy} onChange={handlePostChange}>
      {privacyOptions}
    </select>
  );
};

export default CreatePostComponentSelectPrivacy;
