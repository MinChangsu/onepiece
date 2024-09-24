import React, { useEffect, useState } from 'react';
import { Panel, PanelBody } from '../../../components/panel/panel';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import agent from '../../../agents';

const CmnNtcRgtModal = () => {
  // const [formData, setFormData] = useState({});

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 시작
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // componentDidMount
  useEffect(() => {}, []);

  // componentDidUpdate
  // useEffect(() => {});

  // componentWillReceiveProps
  // useEffect((props) => {}, [props.data]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  // const validateSchema = Yup.object({
  // title: Yup.string().required('제목을 입력해주세요.').min(2, '제목은 최소 2글자 이상 입니다.'),
  // title: Yup.string().required('제목을 입력해주세요.'),
  // cn: Yup.string().required('내용을 입력해주세요.'),
  // email: Yup.string().email('Please enter a valid email').required('This field is required'),
  /*password: Yup.string()
      .required('This field is required')
      .min(8, 'Pasword must be 8 or more characters')
      .matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, 'Password ahould contain at least one uppercase and lowercase character')
      .matches(/\d/, 'Password should contain at least one number')
      .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, 'Password should contain at least one special character'),
    confirmPassword: Yup.string().when('password', (password, field) => {
      if (password) {
        return field.required('The passwords do not match').oneOf([Yup.ref('password')], 'The passwords do not match');
      }
    }),*/
  // });

  const postNtc = async () => {
    let params = formik.values;
    // setFormData({ ...formData, params });
    // console.log(formik.values);

    agent.BrdInfo.postNtc(params).then((data) => {
      let rtn = JSON.parse(data.text);
      if (rtn.result === 'SUCCESS') {
        alert('정상적으로 저장되었습니다.\n목록으로 이동합니다.');
        // modalCmnNtcRgt;
      } else if (rtn.result === 'FAIL') {
        alert('정상적으로 저장되지 않았습니다.\n관리자에게 문의하시기 바랍니다.');
      }
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
    },
    validationSchema: validateSchema,
    onSubmit: (values) => {
      postNtc();
    },
  });

  const handleChangeCn = (v) => {
    const processedHtml = v.replace(/(^([ ]*<p><br><\/p>)*)|((<p><br><\/p>)*[ ]*$)/gi, '').trim(' ');
    //console.log(processedHtml);
    formik.setFieldValue('cn', processedHtml);
  };

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <div className='modal fade' id='modalCmnNtcRgt' data-bs-backdrop='static' data-bs-keyboard='false'>
      <div className='modal-dialog modal-xl'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h4 className='modal-title'>공지사항 등록</h4>
            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-hidden='true'></button>
          </div>
          <div className='modal-body pb-0'>
            <Panel className='mb-0'>
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
                      <ReactQuill
                        className='h-200px mb-40px'
                        id='cn'
                        value={formik.values.cn}
                        onChange={handleChangeCn}
                      />
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
                          {...formik.getFieldProps('useYn')}
                        />
                        <label className='form-check-label' htmlFor='useYn'>
                          사용
                        </label>
                      </div>
                    </div>
                  </div>
                </form>
              </PanelBody>
            </Panel>
          </div>
          <div className='modal-footer'>
            <button className='btn btn-white' data-bs-dismiss='modal'>
              Close
            </button>
            <button type='submit' className='btn btn-success w-80px' onClick={handleSubmit}>
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmnNtcRgtModal;
