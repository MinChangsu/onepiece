import React, { useEffect, useState } from 'react';
import { Panel, PanelBody } from '../../../components/panel/panel';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import agent from '../../../agents';
import { Modal } from 'react-bootstrap';
import CmnDropZone from '../../../composables/cmnDropzone';

const CmnNtcModal = (props) => {
  const { show, toggleShow, reloadParentList, seq } = props;
  const [reset, setReset] = useState(false);
  const [files2, setFiles2] = useState([]);
  const [cmnFileList, setCmnFileList] = useState([]);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 시작
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // componentDidMount
  useEffect(() => {
    // console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ${props}`);
    // setIsShow(props.isShow);
  }, []);

  // componentDidUpdate
  useEffect(() => {
    // console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ${props}`);
  });

  // componentWillReceiveProps
  useEffect(() => {
    if (seq > 0) {
      // 업데이트 데이터 가져오기
      fetchNtc(seq);
      const spanElement = document.getElementById('brdMode');
      if (spanElement) {
        spanElement.textContent = '수정';
      }
    } else {
      const spanElement = document.getElementById('brdMode');
      if (spanElement) {
        spanElement.textContent = '등록';
      }
    }
  }, [seq]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  const fetchNtc = async (seq) => {
    await agent.BrdInfo.fetchNtc(seq).then(({ resultData, result, cmnFileList }) => {
      if (result === 'success') {
        handleSetData(resultData);
        setCmnFileList(cmnFileList);
      } else if (result === 'fail') {
      }
    });
  };

  const handleChangeFile = (f) => {
    setFiles2(f);
  };

  const handleSetReset = (val) => {
    setReset(val);
  };

  const handleRemoveFile = (fileSeq) => {
    if (fileSeq > 0) {
      if (window.confirm('파일을 삭제하시겠습니까?')) {
        deleteFileData(fileSeq);
      }
    }
  };

  const handleDownFile = (fileSeq, fileName) => {
    if (fileSeq > 0) {
      downFileData(fileSeq, fileName);
    }
  };

  const deleteFileData = async (fileSeq) => {
    await agent.BrdInfo.deleteCmnFile(fileSeq)
      .then(({ result }) => {
        if (result === 'success') {
          fetchNtc(seq);
        } else if (result === 'fail') {
        }
      })
      .finally();
  };
  const downFileData = async (fileSeq, fileName) => {
    await agent.BrdInfo.downloadCmnFile(fileSeq).then((file) => {
      const url = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // 원하는 파일 이름으로 설정
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };

  const postNtc = async () => {
    // let params = formik.values;
    let formData = new FormData();
    for (const key in formik.values) {
      if (formik.values.hasOwnProperty(key)) {
        formData.append(key, formik.values[key]);
      }
    }
    if (files2.length > 0) {
      for (let i = 0; i < files2.length; i++) {
        formData.append(`cmnFileDomainList[${i}].brdSeq`, seq);
        formData.append(`cmnFileDomainList[${i}].cOrd`, i);
        formData.append(`cmnFileDomainList[${i}].files`, files2[i]);
        formData.append(`cmnFileDomainList[${i}].brdType`, 'NTC');
      }
    }
    agent.BrdInfo.postNtc(formData)
      .then((data) => {
        let rtn = JSON.parse(data.text);
        if (rtn.result === 'SUCCESS') {
          alert('정상적으로 저장되었습니다.\n목록으로 이동합니다.');
          // modalCmnNtcRgt;
        } else if (rtn.result === 'FAIL') {
          alert('정상적으로 저장되지 않았습니다.\n관리자에게 문의하시기 바랍니다.');
        }
      })
      .then(() => {
        reloadParentList(1);
        toggleShow();
      });
  };

  const validateSchema = Yup.object().shape({
    title: Yup.string().min(2, '제목은 최소 2글자 이상 입니다.').required('제목을 입력해주세요.'),
    cn: Yup.string().required('내용을 입력해주세요.'),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      cn: '',
      useYn: 'N',
      seq: 0,
    },
    validationSchema: validateSchema,
    onSubmit: (values) => {
      postNtc();
    },
  });

  const handleSetData = ({ title, cn, useYn, seq }) => {
    formik.setFieldValue('title', title);
    formik.setFieldValue('cn', cn);
    formik.setFieldValue('useYn', useYn);
    formik.setFieldValue('seq', seq);
  };
  const handleResetData = () => {
    if (seq === 0) {
      formik.setFieldValue('title', '');
      formik.setFieldValue('cn', '');
      formik.setFieldValue('useYn', '');
      formik.setFieldValue('seq', 0);
      setCmnFileList([]);
    } else {
      fetchNtc(seq);
    }
  };
  const handleChangeCn = (v) => {
    // const processedHtml = v.replace(/(^([ ]*<p><br><\/p>)*)|((<p><br><\/p>)*[ ]*$)/gi, '').trim(' ');
    const processedHtml = v === '<p><br></p>' ? '' : v;
    formik.setFieldValue('cn', processedHtml);
  };
  const handleChangeUseYn = (e) => {
    let v = e.target.checked ? 'Y' : 'N';
    formik.setFieldValue('useYn', v);
  };

  const handleDelete = () => {
    if (window.confirm('삭제하시겠습니까?')) {
      agent.BrdInfo.deleteNtc(seq).then(({ result }) => {
        if (result === 'success') {
          alert('삭제되었습니다.');
          reloadParentList(1);
          toggleShow();
        } else if (result === 'fail') {
          alert('삭제되지 않았습니다.');
        }
      });
    }
  };

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  const handleClose = async () => {
    toggleShow();
  };

  return (
    <Modal size='xl' show={show} onHide={handleClose} backdrop='static' keyboard={false} onEnter={handleResetData}>
      <Modal.Header closeButton>
        <Modal.Title>
          공지사항 <span id='brdMode'>등록</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Panel className='mb-0 w-100'>
          <PanelBody className='pb-0'>
            <form>
              <div className='row mb-15px'>
                <label className='form-label col-form-label col-md-1'>제목</label>
                <div className='col-md-11'>
                  <input type='text' className='form-control' id='title' {...formik.getFieldProps('title')} />
                  {formik.touched.title && formik.errors.title && (
                    <span className='text-danger' role='alert'>
                      {formik.errors.title}
                    </span>
                  )}
                </div>
              </div>
              <div className='row mb-15px'>
                <label className='form-label col-form-label col-md-1'>내용</label>
                <div className='col-md-11'>
                  <ReactQuill className='h-200px mb-40px' id='cn' value={formik.values.cn} onChange={handleChangeCn} />
                  {formik.errors.cn && (
                    <span className='text-danger' role='alert'>
                      {formik.errors.cn}
                    </span>
                  )}
                </div>
              </div>
              <div className='row mb-15px'>
                <label className='form-label col-form-label col-md-1'>사용여부</label>
                <div className='col-md-11'>
                  <div className='form-check mt-2'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='useYn'
                      checked={formik.values.useYn === 'Y'}
                      onChange={handleChangeUseYn}
                    />
                    <label className='form-check-label' htmlFor='useYn'>
                      사용
                    </label>
                  </div>
                </div>
              </div>
              {cmnFileList.length > 0 && (
                <div className='row mb-15px'>
                  <label className='form-label col-form-label col-md-1'>첨부파일</label>
                  <div className='col-md-11'>
                    <div className='border-atch border atchFileBox row p-2 m-0'>
                      {cmnFileList.length > 0 &&
                        cmnFileList.map((file, index) => (
                          <div className='col-md-4 atch_div' key={file.seq}>
                            <div>{file.cFileOrgName}</div>
                            <div className='d-flex justify-content-between'>
                              <button
                                type='button'
                                onClick={() => handleDownFile(file.seq, file.cFileOrgName)}
                                className='me-1 btn btn-success'
                              >
                                다운
                              </button>
                              <button
                                type='button'
                                onClick={() => handleRemoveFile(file.seq)}
                                className='btn btn-danger'
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
              <CmnDropZone onChange={handleChangeFile} isReset={reset} setReset={handleSetReset} />
            </form>
          </PanelBody>
        </Panel>
      </Modal.Body>

      <Modal.Footer>
        <button className='btn btn-danger me-5' onClick={handleDelete}>
          삭제
        </button>
        <div>
          <button className='btn btn-white w-70px me-2' onClick={handleClose}>
            닫기
          </button>
          <button type='submit' className='btn btn-success w-70px' onClick={handleSubmit}>
            저장
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CmnNtcModal;
