import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const CreatePostImages = ({ fileSelected = [] }) => {
  const showFilesSelected = fileSelected.files.map((image, index) => {
    if (image.isReading)
      return (
        <span key={index} className="container__images_loading">
          <span>
            <FontAwesomeIcon icon={faCircleNotch} />
          </span>
        </span>
      );

    return (
      <div className="container__images_img">
        <img
          key={index}
          src={image.preview}
          alt={`preview${index}`}
          onClick={() => {
            fileSelected.fileDeleteByIndex(index);
          }}
        />
      </div>
    );
  });

  const isShowRemoveButton = fileSelected.files.length > 0 && (
    <button className="post-container__images_button-close" onClick={fileSelected.fileDeleteAll}>
      Remove all
    </button>
  );

  return (
    <div className="post-container__images">
      {isShowRemoveButton}
      {showFilesSelected}
    </div>
  );
};

export default CreatePostImages;
