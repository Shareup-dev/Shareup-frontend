import { useMemo, useState } from 'react';

const fileSchema = { file: '', preview: '', isReading: false };
const useFileSelect = () => {
  const [files, setFiles] = useState([]);
  const filesCount = useMemo(() => {
    return files.length;
  }, [files]);

  const preparePreviewFile = (index, fileToUpdate = fileSchema) => {
    const reader = new FileReader();

    reader.onload = () => {
      console.log('reader onload');

      fileToUpdate.preview = reader.result;
      fileToUpdate.isReading = false;
      fileUpdateByIndex(index, fileToUpdate);
    };

    reader.readAsDataURL(fileToUpdate.file);
  };

  const fileDeleteByIndex = (index) => {
    setFiles((currentFiles) => currentFiles.filter((file, fileIndex) => fileIndex !== index));
  };

  const fileDeleteAll = () => {
    setFiles([]);
  };

  const fileUpdateByIndex = (index, fileUpdate = fileSchema) => {
    setFiles((currentFiles) => {
      let newFiles = [...currentFiles];
      newFiles[index] = fileUpdate;
      return newFiles;
    });
  };

  const filesAdd = (files = new FileList()) => {
    let fileIndex;

    for (fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const currentFile = files[fileIndex];
      if (currentFile && currentFile.type.substring(0, 5) === 'image') {
        const newFile = { file: currentFile, preview: '', isReading: true };
        preparePreviewFile(fileIndex, newFile);
        setFiles((currentFiles) => [...currentFiles, newFile]);
      }
    }
  };

  return {
    fileSelected: { files, filesCount, fileSchema, filesAdd, fileDeleteAll, fileDeleteByIndex },
  };
};

export default useFileSelect;
