import React, {useEffect, useRef, useState} from 'react';

import '../../assets/css/common.css';

const AtchFile = ({ attachedFiles, setAttachedFiles }) => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const inputFileRef = useRef(null);

  const handleDivClick = () => {
    inputFileRef.current.click();
  };
  const onSelectFile = (e) => {
    e.preventDefault();
    e.persist();
    //선택한 파일
    const selectedFiles = e.target.files;
    //console.log(e.target.files[0])
    //선택한 파일들을 fileUrlList에 넣어준다.
    const fileUrlList = [...selectedFiles];
    console.log(fileUrlList)
    console.log("fdfd")

    // // 업로드되는 파일에는 url이 있어야 한다. filePath로 보내줄 url이다.
    // //획득한 Blob URL Address를 브라우져에서 그대로 호출 시에 이미지는 표시가 되고 ,
    // //일반 파일의 경우 다운로드를 할 수 있다.
    // for (let i = 0; i < selectedFiles.length; i++) {
    //   const nowUrl = URL.createObjectURL(selectedFiles[i]);
    //   fileUrlList.push(nowUrl[i]);
    // }

    setSelectedFiles(fileUrlList);
    setAttachedFiles(fileUrlList);

    //Array.from() 은 문자열 등 유사 배열(Array-like) 객체나 이터러블한 객체를 배열로 만들어주는 메서드이다.
    const selectedFileArray: any = Array.from(selectedFiles);

    //브라우저 상에 보여질 파일 이름
    const imageArray = selectedFileArray.map((file: any) => {
      return file.name;
    });

    // 첨부파일 삭제시
    setSelectedImages((previousImages: any) => previousImages.concat(imageArray));
    e.target.value = '';
  };
  //브라우저상에 보여질 첨부파일
  const attachFile =
      selectedImages &&
      selectedImages.map((image) => {
        return (
            <div className="atchFileBox" key={image}>
              <div className="me-1">{image}</div>
              <button className="btn btn-xs btn-danger" onClick={() => setSelectedImages(selectedImages.filter((e) => e !== image))}>
               X
              </button>
            </div>
        );
      });

  return (
      <div className='row mb-15px'>
        <label className='form-label col-form-label col-md-1'>첨부파일</label>
        <div className='col-md-11'>
            {selectedImages.length !== 0 ? (
                <div className="d-flex atch_div p-1">{attachFile}</div>
            ) : (
                <input className="form-control" onClick={handleDivClick} readOnly={true} placeholder="파일을 첨부할수 있습니다."/>
            )}
            {selectedImages.length === 0 && (
                <input className='d-none'
                    type="file"
                    name="atchFileNmList"
                       multiple="true"
                       ref={inputFileRef}
                    onChange={onSelectFile}
                    // accept=".png, .jpg, image/*"
                />
            )}
        </div>
      </div>
  );
};

export default AtchFile;
