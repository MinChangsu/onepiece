import React, { useEffect, useState } from 'react';
import { Panel, PanelBody } from '../../../components/panel/panel';
import 'react-quill/dist/quill.snow.css';
import { Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import agent from '../../../agents';

const CmnStdCdRgtModal = (props) => {
  const { show, toggleShow, reloadParentList, values } = props;

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
    if (values) {
      // 업데이트 데이터 가져오기
      // fetchNtc(seq);
    }
  }, [values]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  const posStdCd = async (values) => {
    agent.CmnInfo.postStdCd(values)
      .then((data) => {
        let rtn = JSON.parse(data.text);
        if (rtn.result === 'success') {
          alert('정상적으로 저장되었습니다.');
          reloadParentList();
        } else if (rtn.result === 'fail') {
          alert('정상적으로 저장되지 않았습니다.\n관리자에게 문의하시기 바랍니다.');
        }
      })
      .then(() => {
        toggleShow();
      });
  };

  // formik ////////////////////////////////////////////////////////////////////////////////
  const validateSchema = Yup.object().shape({
    cd: Yup.string()
      .min(2, '대문자 2글자 숫자 2~19글자로 조합해주세요')
      .required('코드를 입력해주세요.')
      .test(
        'cd', // Name
        '중복된 코드입니다.', // Msg
        async (cd) => {
          let params = { cd: cd };
          let success = false;
          return agent.CmnInfo.dupChkStdCd(params).then((data) => {
            let rtn = JSON.parse(data.text);
            success = rtn.result !== 'true';
            // console.log(success);
            return success;
          });
        },
      ),
    cdNm: Yup.string().required('코드명을 입력해주세요.'),
  });

  const formik = useFormik({
    initialValues: {
      cd: '',
      cdNm: '',
      prntCd: '',
      lvl: '',
      memo: '',
    },
    validationSchema: validateSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      posStdCd(values);
    },
  });

  const handleSetData = () => {
    //console.log(values);
    if (values.seq === '') {
      formik.setFieldValue('prntCd', 'ROOT');
      formik.setFieldValue('lvl', '1');
      formik.setFieldValue('cd', '');
      formik.setFieldValue('cdNm', '');
      formik.setFieldValue('memo', '');
    } else {
      formik.setFieldValue('prntCd', values.cd);
      formik.setFieldValue('lvl', parseInt(values.lvl) + 1);
      formik.setFieldValue('cd', '');
      formik.setFieldValue('cdNm', '');
      formik.setFieldValue('memo', '');
    }
  };

  // formik ////////////////////////////////////////////////////////////////////////////////

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  const handleClose = async () => {
    toggleShow();
  };

  return (
    <Modal size='md' show={show} onHide={handleClose} backdrop='static' keyboard={false} onEnter={handleSetData}>
      <Modal.Header closeButton>
        <Modal.Title>공통코드 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Panel className='mb-0 w-100'>
          <PanelBody className='pb-0'>
            <form id='insFrm'>
              <div className='form-group'>
                <label htmlFor='insCd' className='fw-bold'>
                  새 코드&nbsp;<span className='text-danger'>*</span>
                </label>
                <input
                  type='text'
                  style={{ msImeMode: 'disabled' }}
                  className='form-control'
                  id='cd'
                  {...formik.getFieldProps('cd')}
                  placeholder='대문자 2글자 숫자 2~19글자로 조합해주세요.'
                  maxLength='20'
                />
                {formik.touched.cd && formik.errors.cd && (
                  <span className='text-danger' role='alert'>
                    {formik.errors.cd}
                  </span>
                )}
              </div>
              <div className='form-group mt-2'>
                <label htmlFor='cdNm' className='fw-bold'>
                  새 코드명&nbsp;<span className='text-danger'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='cdNm'
                  {...formik.getFieldProps('cdNm')}
                  placeholder='2 ~ 30자 내로 작성해주세요.'
                  maxLength='30'
                />
                {formik.touched.cdNm && formik.errors.cdNm && (
                  <span className='text-danger' role='alert'>
                    {formik.errors.cdNm}
                  </span>
                )}
              </div>
              <div className='form-group mt-2'>
                <label htmlFor='prntCd' className='fw-bold'>
                  상위코드
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='prntCd'
                  {...formik.getFieldProps('prntCd')}
                  readOnly
                  disabled
                />
                {formik.touched.prntCd && formik.errors.prntCd && (
                  <span className='text-danger' role='alert'>
                    {formik.errors.prntCd}
                  </span>
                )}
              </div>
              <div className='form-group mt-2'>
                <label htmlFor='lvl' className='fw-bold'>
                  레벨
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='lvl'
                  {...formik.getFieldProps('lvl')}
                  readOnly
                  disabled
                />
                {formik.touched.lvl && formik.errors.lvl && (
                  <span className='text-danger' role='alert'>
                    {formik.errors.lvl}
                  </span>
                )}
              </div>
              <div className='form-group mt-2'>
                <label htmlFor='memo' className='fw-bold'>
                  메모
                </label>
                <textarea className='form-control' id='memo' rows='6' {...formik.getFieldProps('memo')}></textarea>
                {formik.touched.memo && formik.errors.memo && (
                  <span className='text-danger' role='alert'>
                    {formik.errors.memo}
                  </span>
                )}
              </div>
            </form>
          </PanelBody>
        </Panel>
      </Modal.Body>

      <Modal.Footer>
        <button className='btn btn-white' onClick={handleClose}>
          닫기
        </button>
        <button type='submit' className='btn btn-success w-80px' onClick={handleSubmit}>
          저장
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default CmnStdCdRgtModal;
