import React, { useEffect, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AppSettings } from '../config/app-settings';
import { useRecoilState, useSetRecoilState } from 'recoil';
import loginState, { token } from '../store/loginState';
import agent from '../agents/index';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCookies } from 'react-cookie';

function Login() {
  const context = useContext(AppSettings);
  const [redirect, setRedirect] = useState(false);
  const [location, setLocation] = useState('/');
  const loginHandler = useSetRecoilState(loginState);
  const loginSetHandler = async (data) => {
    await loginHandler((val) => data);
  };

  // token
  // const [tokenRecoil] = useRecoilState(token);
  const tokenRecoilHandler = useSetRecoilState(token);
  const tokenSetHandler = async (data) => {
    let token = data ? window.sessionStorage.setItem('jwt', data) : window.sessionStorage.removeItem('jwt');
    await tokenRecoilHandler((val) => token);
  };

  // 아이디 기억하기
  const [isRemember, setIsRemember] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['rememberUsrId']);

  useEffect(() => {
    if (cookies.rememberUsrId !== undefined) {
      formik.setFieldValue('usrId', cookies.rememberUsrId);
      // setLoginForm({ ...loginForm, usrId: cookies.rememberUsrId });
      setIsRemember(true);
    }
  }, []);

  const handleChangeRememberMe = (e) => {
    setIsRemember(e.target.checked);
  };

  const handleLoginToMain = (event) => {
    event.preventDefault();
    formik.handleSubmit();
  };

  const handleLoginToSys = (event) => {
    event.preventDefault();
    setRedirect(true);
    setLocation('/sys');
  };

  const login = (values) => {
    agent.LoginInfo.login(values)
      .then((data) => {
        let rtn = JSON.parse(data.text);

        if (rtn.result === 'success') {
          loginSetHandler(rtn.usrInfo);
          if (rtn.usrInfo.lvl <= 9) {
            tokenSetHandler(rtn.token);

            // 아이디 저장하기 처리
            if (isRemember) {
              setCookie('rememberUsrId', values.usrId, { maxAge: 3600 });
            } else {
              removeCookie('rememberUsrId');
            }
            return <Navigate to={location} />;
            // return <Navigate to='sys' />;
          } else {
            alert('접속권한이 없습니다.');
            // window.localStorage.removeItem('isExistFireSnsr');
          }
        } else if (rtn.result === 'cntFail') {
          alert(rtn.msg);
          //alert('비밀번호를 5회 이상 틀리셨습니다.\n계정 정보를 분실하였을 경우,\n관리자에게 문의하시기 바랍니다.');
          // document.querySelector('#userId').focus();
          // window.localStorage.removeItem('isExistFireSnsr');
        } else if (rtn.result === 'fail') {
          /*alert(
            '아이디나 비밀번호가 일치하지 않습니다.\n로그인 실패 횟수가 5회 이상 틀리실 경우 접속이 차단 됩니다.\n계정 정보를 분실하였을 경우, 관리자에게 문의하시기 바랍니다.',
          );*/
          alert(rtn.msg);
          // window.localStorage.removeItem('isExistFireSnsr');
        }
      })
      .finally();

    // loginHandler((val) => info);
  };

  const validateSchema = Yup.object().shape({
    usrId: Yup.string().min(4, '4~20글자로 영문으로 입력해주세요.').required('아이디를 입력해주세요.'),
    usrPw: Yup.string().min(4, '4~20글자로 입력해주세요.').required('암호를 입력해주세요.'),
  });
  const formik = useFormik({
    initialValues: {
      usrId: '',
      usrPw: '',
    },
    validationSchema: validateSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      login(values);
    },
  });

  return (
    <div className='login login-with-news-feed'>
      <div className='news-feed'>
        <div className='news-image' style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg3.jpeg)' }}></div>
        <div className='news-caption'>
          <h4 className='caption-title'>
            <b>공유재산 업무지원시스템</b>
          </h4>
          {/*<p>[31773] 충청남도 당진시 시청1로 1 (수청동 1002번지)</p>*/}
        </div>
      </div>
      <div className='login-container'>
        <div className='login-header mb-30px'>
          <div className='brand'>
            <div className='d-flex align-items-center'>
              <span className='logo'></span>
              <b>로그인</b>
            </div>
            <small>시스템을 사용하기 위해 로그인을 해주세요.</small>
          </div>
          <div className='icon'>
            <i className='fa fa-sign-in-alt'></i>
          </div>
        </div>
        <div className='login-content'>
          <form className='fs-13px'>
            <div className='form-floating mb-15px'>
              <input
                type='text'
                className='form-control h-45px fs-13px'
                id='usrId'
                {...formik.getFieldProps('usrId')}
                placeholder='아이디를 입력해주세요.'
                maxLength='20'
              />
              {formik.touched.usrId && formik.errors.usrId && (
                <span className='text-danger' role='alert'>
                  {formik.errors.usrId}
                </span>
              )}
              <label htmlFor='usrId' className='d-flex align-items-center fs-13px text-gray-600'>
                아이디
              </label>
            </div>
            <div className='form-floating mb-15px'>
              <input
                type='password'
                className='form-control h-45px fs-13px'
                id='usrPw'
                {...formik.getFieldProps('usrPw')}
                placeholder='암호를 입력해주세요.'
                maxLength='20'
              />
              {formik.touched.usrPw && formik.errors.usrPw && (
                <span className='text-danger' role='alert'>
                  {formik.errors.usrPw}
                </span>
              )}
              <label htmlFor='usrPw' className='d-flex align-items-center fs-13px text-gray-600'>
                암호
              </label>
            </div>
            <div className='form-check mb-30px'>
              <input
                className='form-check-input'
                type='checkbox'
                id='rememberMe'
                onChange={handleChangeRememberMe}
                checked={isRemember}
              />
              <label className='form-check-label' htmlFor='rememberMe'>
                저장하기
              </label>
            </div>

            <div className='mb-15px'>
              <button className='btn h-45px btn-theme d-block w-50 btn-lg' onClick={handleLoginToMain}>
                로그인
              </button>
            </div>
            <hr className='bg-gray-600 opacity-2' />
            <div className='text-gray-600 text-center text-gray-500-darker mb-0'>
              COPYRIGHT ⓒ 2024. ITKOREA. ALL RIGHTS RESEVED.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
