import React, { useEffect, useState } from 'react';
import { Panel, PanelBody } from '../../../components/panel/panel';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import agent from '../../../agents';
import { Modal } from 'react-bootstrap';

const UsrRgtModal = (props) => {
  const { show, rgtToggleShow, reloadParentList, seq, authList } = props;
  const [isValidationChecked, setIsValidationChecked] = useState(false);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 시작
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // componentDidMount

  // componentWillReceiveProps
  useEffect(() => {}, [seq]);

  const getIdDoubleCheck = async (usrId, usrSeq) => {
    let result = await agent.UsrInfo.postDupCheckUsrInfo({ usrId: usrId, usrSeq: usrSeq });
    return result.body;
  };
  const postUsr = async () => {
    let params = { ...rgtFormik.values };
    //console.log(params);

    agent.UsrInfo.postUsr(params)
      .then((data) => {
        let rtn = JSON.parse(data.text);
        //console.log(rtn);
        if (rtn.result === 'SUCCESS') {
          alert('정상적으로 저장되었습니다.\n목록으로 이동합니다.');
          // modalCmnNtcRgt;
        } else if (rtn.result === 'FAIL') {
          alert('정상적으로 저장되지 않았습니다.\n관리자에게 문의하시기 바랍니다.');
        }
      })
      .then(() => {
        reloadParentList(1);
        rgtToggleShow();
      });
  };

  const rgtValidateSchema = Yup.object().shape({
    usrId: Yup.string()
      .required('아이디를 입력해주세요.')
      .test('IdDoubleCheck', '이미 사용중인 아이디입니다.', async (usrId) => {
        let result = true;

        if (!isValidationChecked) {
          result = await getIdDoubleCheck(usrId);
        }
        setIsValidationChecked(result);
        return result;
      }),
    usrNm: Yup.string().min(2, '이름은 최소 2글자 이상 입니다.').required('이름을 입력해주세요.'),
    usrPw: Yup.string().required('비밀번호를 입력해주세요.').min(4, '비밀번호는 최소 4자 이상이어야 합니다.'),
    usrPwConfirm: Yup.string()
      .required('비밀번호 확인을 입력해주세요.')
      .oneOf([Yup.ref('usrPw'), null], '비밀번호가 일치하지 않습니다.'),
    lvl: Yup.string().required('레벨을 선택해주세요.').notOneOf([''], '레벨을 선택해주세요.'),
    eml: Yup.string().email('이메일 형식에 맞지 않습니다.'),
  });

  const rgtFormik = useFormik({
    initialValues: {
      usrId: '',
      usrPw: '',
      usrPwConfirm: '',
      usrNm: '',
      telno: '',
      eml: '',
      lvl: 9,
      addr: '',
      usrSeq: 0,
      useYn: 'Y',
    },
    validationSchema: rgtValidateSchema,
    onSubmit: (values) => {
      postUsr();
      handleRgtResetData2();
    },
  });

  const handleRgtResetData = () => {
    // console.log(seq);
    if (seq === 0) {
      rgtFormik.setFieldValue('usrId', '');
      rgtFormik.setFieldValue('usrPw', '');
      rgtFormik.setFieldValue('usrPwConfirm', '');
      rgtFormik.setFieldValue('usrNm', '');
      rgtFormik.setFieldValue('telno', '');
      rgtFormik.setFieldValue('eml', '');
      rgtFormik.setFieldValue('lvl', 9);
      rgtFormik.setFieldValue('addr', '');
      rgtFormik.setFieldValue('useYn', 'Y');
      // formik.resetForm();
    }
  };

  const handleRgtResetData2 = () => {
    rgtFormik.setFieldValue('usrId', '');
    rgtFormik.setFieldValue('usrPw', '');
    rgtFormik.setFieldValue('usrPwConfirm', '');
    rgtFormik.setFieldValue('usrNm', '');
    rgtFormik.setFieldValue('telno', '');
    rgtFormik.setFieldValue('eml', '');
    rgtFormik.setFieldValue('lvl', 9);
    rgtFormik.setFieldValue('addr', '');
    rgtFormik.setFieldValue('useYn', 'Y');
    // formik.resetForm();
  };

  const handleChangeUseYn = (e) => {
    // console.log(e);
    // console.log(e.target.checked);
    let v = e.target.checked ? 'Y' : 'N';
    //console.log(v);
    rgtFormik.setFieldValue('useYn', v);
  };

  const handleUsrPwTrim = (e) => {
    let usrPwTrim = e.target.value.replace(/\s+/g, '');
    rgtFormik.setFieldValue('usrPw', usrPwTrim);
  };

  const handleRgtSubmit = () => {
    rgtFormik.handleSubmit();
  };

  const handleRgtClose = async () => {
    rgtToggleShow();
  };

  const handleChangeUsrId = async (e) => {
    let usrId = e.target.value;
    rgtFormik.setFieldValue('usrId', usrId);
    setIsValidationChecked(false);
  };

  return (
    <Modal
      size='xl'
      show={show}
      onHide={handleRgtClose}
      backdrop='static'
      keyboard={false}
      onEnter={handleRgtResetData}
    >
      <Modal.Header closeButton>
        <Modal.Title>사용자 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Panel className='mb-0 w-100'>
          <PanelBody className='pb-0'>
            <form>
              <div className='row p-0 m-0'>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>
                    아이디&nbsp;<span className='text-danger'>*</span>
                  </label>
                  <div className='col-md-9'>
                    <input
                      type='text'
                      className='form-control'
                      id='usrId'
                      {...rgtFormik.getFieldProps('usrId')}
                      onChange={handleChangeUsrId}
                    />
                    {rgtFormik.touched.usrId && rgtFormik.errors.usrId && (
                      <span className='text-danger' role='alert'>
                        {rgtFormik.errors.usrId}
                      </span>
                    )}
                  </div>
                </div>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>
                    이름&nbsp;<span className='text-danger'>*</span>
                  </label>
                  <div className='col-md-9'>
                    <input type='text' className='form-control' id='usrNm' {...rgtFormik.getFieldProps('usrNm')} />
                    {rgtFormik.touched.usrNm && rgtFormik.errors.usrNm && (
                      <span className='text-danger' role='alert'>
                        {rgtFormik.errors.usrNm}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='row p-0 m-0'>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>
                    비밀번호&nbsp;<span className='text-danger'>*</span>
                  </label>
                  <div className='col-md-9'>
                    <input
                      type='password'
                      className='form-control'
                      id='usrPw'
                      {...rgtFormik.getFieldProps('usrPw')}
                      onChange={handleUsrPwTrim}
                    />
                    {rgtFormik.touched.usrPw && rgtFormik.errors.usrPw && (
                      <span className='text-danger' role='alert'>
                        {rgtFormik.errors.usrPw}
                      </span>
                    )}
                  </div>
                </div>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>
                    비밀번호 확인&nbsp;<span className='text-danger'>*</span>
                  </label>
                  <div className='col-md-9'>
                    <input
                      type='password'
                      className='form-control'
                      id='usrPwConfirm'
                      {...rgtFormik.getFieldProps('usrPwConfirm')}
                    />
                    {rgtFormik.touched.usrPwConfirm && rgtFormik.errors.usrPwConfirm && (
                      <span className='text-danger' role='alert'>
                        {rgtFormik.errors.usrPwConfirm}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='row p-0 m-0'>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>이메일</label>
                  <div className='col-md-9'>
                    <input type='text' className='form-control' id='eml' {...rgtFormik.getFieldProps('eml')} />
                  </div>
                </div>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>연락처</label>
                  <div className='col-md-9'>
                    <input type='text' className='form-control' id='telno' {...rgtFormik.getFieldProps('telno')} />
                  </div>
                </div>
              </div>
              <div className='row p-0 m-0'>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>
                    사용여부&nbsp;<span className='text-danger'>*</span>
                  </label>
                  <div className='col-md-9'>
                    <div className='form-check mt-2'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='useYn'
                        checked={rgtFormik.values.useYn === 'Y'}
                        onChange={handleChangeUseYn}
                      />
                      <label className='form-check-label' htmlFor='useYn'>
                        사용
                      </label>
                    </div>
                  </div>
                </div>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>
                    권한&nbsp;<span className='text-danger'>*</span>
                  </label>
                  <div className='col-md-9'>
                    <select className='form-select' id='lvl' {...rgtFormik.getFieldProps('lvl')}>
                      {authList.map((auth) => (
                        <option key={auth.authLvl} value={auth.authLvl}>
                          {auth.authNm}
                        </option>
                      ))}
                    </select>
                    {rgtFormik.touched.lvl && rgtFormik.errors.lvl && (
                      <span className='text-danger' role='alert'>
                        {rgtFormik.errors.lvl}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='row p-0 m-0'>
                <div className='row mb-15px '>
                  <label className='form-label col-form-label ' style={{ width: '130px' }}>
                    주소
                  </label>
                  <div className='' style={{ width: 'calc(100% - 150px)' }}>
                    <input type='text' className='form-control' id='addr' {...rgtFormik.getFieldProps('addr')} />
                  </div>
                </div>
              </div>
            </form>
          </PanelBody>
        </Panel>
      </Modal.Body>

      <Modal.Footer>
        <button className='btn btn-white' onClick={handleRgtClose}>
          닫기
        </button>
        <button type='submit' className='btn btn-success w-80px' onClick={handleRgtSubmit}>
          저장
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default UsrRgtModal;
