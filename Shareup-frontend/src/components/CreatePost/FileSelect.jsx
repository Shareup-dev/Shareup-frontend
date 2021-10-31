import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';

import './FileSelect.css';

const FileSelect = ({
  buttonSelectText = <FontAwesomeIcon icon={faFileImage} />,
  multipleFiles = true,
  acceptFiles = 'image/*',
  onfileSelect = (event) => {},
}) => {
  const fileInputRef = useRef();

  const onFileClick = (event) => {
    event.preventDefault();
    fileInputRef.current.click();
  };

  return (
    <div className="container__file-select">
      <button onClick={onFileClick}>{buttonSelectText}</button>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multipleFiles}
        style={{ display: 'none' }}
        accept={acceptFiles}
        onChange={onfileSelect}
      ></input>
    </div>
  );
};

export default FileSelect;
