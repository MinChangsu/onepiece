import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const DropZone = (props) => {
  const { onChange, isReset, setReset } = props;
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles((files) => [
        ...files,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      ]);
    },
    [files],
  );

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    // accept: '.xlsx,.docx,.pdf,.png,.jpg,.jpeg',
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    onDrop,
  });

  const removeFile = (file) => async () => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    // console.log('remove dropzone :', newFiles);
    await setFiles(newFiles);
    onChange(newFiles);
  };

  // Dropzone style
  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  };

  const focusedStyle = { borderColor: '#2196f3' };
  const acceptStyle = { borderColor: '#00e676' };
  const rejectStyle = { borderColor: '#ff1744' };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  };

  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    // width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box',
  };

  const thumbInner = {
    // display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
  };

  const img = {
    display: 'block',
    width: 'auto',
    height: '100%',
  };

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <span>
          <i className='far fa-lg fa-fw me-10px fa-window-close mt-2' onClick={removeFile(file)}></i>
        </span>
        <span>
          <img
            src={file.preview}
            style={img}
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
          />
        </span>
      </div>
    </div>
  ));

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 시작
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // componentDidMount
  useEffect(() => {
    // console.log('isReset :', isReset);
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  // componentDidUpdate
  useEffect(() => {
    // console.log('isReset :', isReset);
    if (isReset === true) {
      setFiles([]);
      setReset(false);
    }
  });

  // componentWillReceiveProps
  useEffect(() => {
    // console.log('isReset :', isReset);
    if (onChange) {
      onChange(files);
    }
  }, [files]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <section className='container'>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>업로드할 파일을 선택해주세요.</p>
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
};

export default DropZone;
