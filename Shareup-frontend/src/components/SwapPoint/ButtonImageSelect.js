import { useMemo, useRef, useState, memo } from 'react';

const imageSchema = { image: '', preview: '', isReading: false };
const ButtonImageSelect = ({ buttonSelectText = 'Image', multipleFiles = false, className = '', style = {} }) => {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();

  const imagesCount = useMemo(() => {
    return images.length;
  }, [images]);

  const preparePreviewImage = (index, imageToUpdate) => {
    const reader = new FileReader();

    reader.onload = () => {
      console.log('reader onload');

      imageToUpdate.preview = reader.result;
      imageToUpdate.isReading = false;
      imageUpdateByIndex(index, imageToUpdate);
    };

    reader.readAsDataURL(imageToUpdate.image);
  };

  const onImageSelectClick = (event) => {
    event.preventDefault();
    fileInputRef.current.click();
  };

  const imageDeleteByIndex = (index) => {
    setImages((currentImages) => currentImages.filter((image, imageIndex) => imageIndex !== index));
  };

  const imageDeleteAll = () => {
    setImages([]);
  };

  const imageUpdateByIndex = (index, imageUpdate) => {
    setImages((currentImages) => {
      let newImages = [...currentImages];
      newImages[index] = imageUpdate;
      return newImages;
    });
  };

  const imageAdd = (event) => {
    let files;
    let fileIndex;

    files = event.target.files;

    for (fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const currentFile = files[fileIndex];
      if (currentFile && currentFile.type.substring(0, 5) === 'image') {
        const newImage = { image: currentFile, preview: '', isReading: true };
        preparePreviewImage(fileIndex, newImage);
        setImages((currentFiles) => [...currentFiles, newImage]);
      }
    }
  };

  const ImageSelectButton = () => <button onClick={onImageSelectClick}>{buttonSelectText}</button>;

  const InputImage = () => (
    <input
      ref={fileInputRef}
      type="file"
      multiple={multipleFiles}
      style={{ display: 'none' }}
      accept={'image/*'}
      onChange={imageAdd}
    ></input>
  );

  const ButtonImageUI = () => (
    <div className={className} style={style}>
      <ImageSelectButton />
      <InputImage />
    </div>
  );

  return { ButtonImageUI: memo(ButtonImageUI), images, imagesCount, imageSchema, imageDeleteAll, imageDeleteByIndex };
};

export default ButtonImageSelect;
