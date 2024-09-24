import React, { useEffect, useState } from 'react';
import { Panel, PanelBody } from '../../../components/panel/panel';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import agent from '../../../agents';
import { Modal } from 'react-bootstrap';

const UsrModal = (props) => {
  const { show, toggleShow, reloadParentList, usrSeq, authList } = props;
  const [validateSchema, setValidateSchema] = useState(
    Yup.object().shape({
      usrId: Yup.string()
        .required('아이디를 입력해주세요.')
        .test('IdDoubleCheck', '이미 사용중인 아이디입니다.', async function (usrId) {
          let seq = usrSeq;
          //console.log(seq);
          //console.log(this.parent);
          let result = await getIdDoubleCheck(usrId, seq);
          //console.log(result);
          return result;
        }),
      usrNm: Yup.string().min(2, '이름은 최소 2글자 이상 입니다.').required('이름을 입력해주세요.'),
      usrPw: Yup.string().test(
        'usrPw-validation',
        '비밀번호는 최소 4자 이상이어야 합니다.',
        (value) => !value || value.length >= 4, // 값이 없거나 길이가 4 이상이면 유효
      ),
      usrPwConfirm: Yup.string().when('usrPw', (usrPw, schema) =>
        usrPw ? schema.oneOf([Yup.ref('usrPw')], '비밀번호가 일치하지 않습니다.') : schema,
      ),
      lvl: Yup.string().required('레벨을 선택해주세요.').notOneOf([''], '레벨을 선택해주세요.'),
      eml: Yup.string().email('이메일 형식에 맞지 않습니다.'),
    }),
  );

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 시작
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // componentDidMount
  useEffect(() => {
    // console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ${props}`);
    // setIsShow(props.isShow);
    // console.log(authList);
  }, []);

  // componentWillReceiveProps
  useEffect(() => {
    // console.log(usrSeq);
    if (usrSeq > 0) {
      // 업데이트 데이터 가져오기
      fetchUsr(usrSeq);
    }
  }, [usrSeq]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  const formik = useFormik({
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
      delYn: 'N',
    },
    validationSchema: validateSchema,
    onSubmit: (values) => {
      postUsr();
    },
  });

  const fetchUsr = async (usrSeq) => {
    await agent.UsrInfo.fetchUsr(usrSeq).then(({ resultData, result }) => {
      if (result === 'SUCCESS') {
        handleSetData(resultData);
        setValidateSchema(
          Yup.object().shape({
            usrId: Yup.string()
              .required('아이디를 입력해주세요.')
              .test('IdDoubleCheck', '이미 사용중인 아이디입니다.', async function (usrId) {
                let seq = usrSeq;
                // console.log(seq);
                // console.log(this.parent);
                let result = await getIdDoubleCheck(usrId, seq);
                // console.log(result);
                return result;
              }),
            usrNm: Yup.string().min(2, '이름은 최소 2글자 이상 입니다.').required('이름을 입력해주세요.'),
            usrPw: Yup.string().test(
              'usrPw-validation',
              '비밀번호는 최소 4자 이상이어야 합니다.',
              (value) => !value || value.length >= 4, // 값이 없거나 길이가 4 이상이면 유효
            ),
            usrPwConfirm: Yup.string().when('usrPw', (usrPw, schema) =>
              usrPw ? schema.oneOf([Yup.ref('usrPw')], '비밀번호가 일치하지 않습니다.') : schema,
            ),
            lvl: Yup.string().required('레벨을 선택해주세요.').notOneOf([''], '레벨을 선택해주세요.'),
            eml: Yup.string().email('이메일 형식에 맞지 않습니다.'),
          }),
        );
      } else if (result === 'FAIL') {
      }
    });
  };
  const getIdDoubleCheck = async (usrId, usrSeq) => {
    let result = await agent.UsrInfo.postDupCheckUsrInfo({ usrId: usrId, usrSeq: usrSeq });
    return result.body;
  };
  const postUsr = async () => {
    let params = { ...formik.values };
    //console.log(params);
    agent.UsrInfo.postUsr(params)
      .then((data) => {
        let rtn = JSON.parse(data.text);
        // console.log(rtn);
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

  const handleSetData = ({ usrId, usrPw, usrPwConfirm, usrNm, telno, eml, lvl, addr, usrSeq, useYn, delYn }) => {
    formik.setFieldValue('usrId', usrId || '');
    formik.setFieldValue('usrPw', usrPw || '');
    formik.setFieldValue('usrPwConfirm', usrPwConfirm || '');
    formik.setFieldValue('usrNm', usrNm || '');
    formik.setFieldValue('telno', telno || '');
    formik.setFieldValue('eml', eml || '');
    formik.setFieldValue('lvl', lvl || '');
    formik.setFieldValue('addr', addr || '');
    formik.setFieldValue('usrSeq', usrSeq || '');
    formik.setFieldValue('useYn', useYn || 'Y');
    formik.setFieldValue('delYn', delYn || 'N');
  };
  const handleResetData = () => {
    if (usrSeq === 0) {
      formik.setFieldValue('usrId', '');
      formik.setFieldValue('usrPw', '');
      formik.setFieldValue('usrPwConfirm', '');
      formik.setFieldValue('usrNm', '');
      formik.setFieldValue('telno', '');
      formik.setFieldValue('eml', '');
      formik.setFieldValue('lvl', 10);
      formik.setFieldValue('addr', '');
      formik.setFieldValue('useYn', 'Y');
      formik.setFieldValue('delYn', 'N');
      formik.setFieldValue('usrSeq', usrSeq || '');
    }
  };

  const handleChangeUseYn = (e) => {
    let v = e.target.checked ? 'Y' : 'N';
    formik.setFieldValue('useYn', v);
  };
  const handleChangeDelYn = (e) => {
    let v = e.target.checked ? 'Y' : 'N';
    formik.setFieldValue('delYn', v);
  };

  const handleUsrPwTrim = (e) => {
    let usrPwTrim = e.target.value.replace(/\s+/g, '');
    formik.setFieldValue('usrPw', usrPwTrim);
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
        <Modal.Title>사용자 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Panel className='mb-0 w-100'>
          <PanelBody className='pb-0'>
            <form>
              <div className='row p-0 m-0'>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>아이디</label>
                  <div className='col-md-9'>
                    <input
                      type='text'
                      readOnly={true}
                      className='form-control'
                      id='usrId'
                      {...formik.getFieldProps('usrId')}
                    />
                    {formik.touched.usrId && formik.errors.usrId && (
                      <span className='text-danger' role='alert'>
                        {formik.errors.usrId}
                      </span>
                    )}
                  </div>
                </div>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>이름</label>
                  <div className='col-md-9'>
                    <input type='text' className='form-control' id='usrNm' {...formik.getFieldProps('usrNm')} />
                    {formik.touched.usrNm && formik.errors.usrNm && (
                      <span className='text-danger' role='alert'>
                        {formik.errors.usrNm}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='row p-0 m-0'>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>비밀번호</label>
                  <div className='col-md-9'>
                    <input
                      type='password'
                      className='form-control'
                      id='usrPw'
                      {...formik.getFieldProps('usrPw')}
                      onChange={handleUsrPwTrim}
                    />
                    {formik.touched.usrPw && formik.errors.usrPw && (
                      <span className='text-danger' role='alert'>
                        {formik.errors.usrPw}
                      </span>
                    )}
                  </div>
                </div>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>비밀번호 확인</label>
                  <div className='col-md-9'>
                    <input
                      type='password'
                      className='form-control'
                      id='usrPwConfirm'
                      {...formik.getFieldProps('usrPwConfirm')}
                    />
                    {formik.touched.usrPwConfirm && formik.errors.usrPwConfirm && (
                      <span className='text-danger' role='alert'>
                        {formik.errors.usrPwConfirm}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='row p-0 m-0'>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>이메일</label>
                  <div className='col-md-9'>
                    <input type='text' className='form-control' id='eml' {...formik.getFieldProps('eml')} />
                  </div>
                </div>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>연락처</label>
                  <div className='col-md-9'>
                    <input type='text' className='form-control' id='telno' {...formik.getFieldProps('telno')} />
                  </div>
                </div>
              </div>
              <div className='row p-0 m-0'>
                <div className='row mb-15px col-6'>
                  <div className='row mb-15px col-6'>
                    <label className='form-label col-form-label col-md-6'>사용여부</label>
                    <div className='col-md-6 ps-4'>
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
                  <div className='row mb-15px col-6 ms-2'>
                    <label className='form-label col-form-label col-md-6 '>삭제처리</label>
                    <div className='col-md-6  ps-4'>
                      <div className='form-check mt-2'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='delYn'
                          checked={formik.values.delYn === 'Y'}
                          onChange={handleChangeDelYn}
                        />
                        <label className='form-check-label' htmlFor='delYn'>
                          삭제
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row mb-15px col-6'>
                  <label className='form-label col-form-label col-md-3'>권한</label>
                  <div className='col-md-9'>
                    <select className='form-select' id='lvl' {...formik.getFieldProps('lvl')}>
                      {authList.map((auth) => (
                        <option key={auth.authLvl} value={auth.authLvl}>
                          {auth.authNm}
                        </option>
                      ))}
                    </select>
                    {formik.touched.lvl && formik.errors.lvl && (
                      <span className='text-danger' role='alert'>
                        {formik.errors.lvl}
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
                    <input type='text' className='form-control' id='addr' {...formik.getFieldProps('addr')} />
                  </div>
                </div>
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

export default UsrModal;
