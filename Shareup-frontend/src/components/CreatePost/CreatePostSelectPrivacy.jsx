const DEFAULT_PRIVACY_OPTIONS = ['Friends', 'Only Me', 'Public'];

const CreatePostSelectPrivacy = ({ privacy, handlePostChange, options = DEFAULT_PRIVACY_OPTIONS }) => {
  const privacyOptions = options.map((option) => <option value={option}>{option}</option>);

  return (
    <select name="privacy" id="privacy" value={privacy} onChange={handlePostChange}>
      {privacyOptions}
    </select>
  );
};

export default CreatePostSelectPrivacy;
