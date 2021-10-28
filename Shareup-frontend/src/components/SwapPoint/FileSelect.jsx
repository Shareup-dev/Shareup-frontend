import { useEffect, useRef } from 'react';

import './FileSelect.css';

const FileSelect = ({
  buttonSelectText = 'Images',
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
    <div className="">
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
