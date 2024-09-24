import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  kakaoMapType,
  krasModalViewMode,
  mapEditModeType,
  pnuCode,
  dataListModalViewMode,
  dataLawLayerType,
  docModalViewMode,
  propertyModalViewMode,
  isNewData,
  dataSeq,
  illegalListModalViewMode,
  isViewPlaneOption,
} from '../../store/stores';
import loginState, { token } from '../../store/loginState';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import PerfectScrollbar from 'react-perfect-scrollbar';

const _SideHeader = () => {
  const [isViewLayerOption, setIsViewLayerOption] = useState(false);
  const [isViewMapOption, setIsViewMapOption] = useState(false);

  const kakaoMapChangeLayerRecoilHandler = useSetRecoilState(kakaoMapType);
  const changeKakaoMapChangeLayerRecoilHandler = (type, useYn) => {
    kakaoMapChangeLayerRecoilHandler(type);
  };

  const dataListCmdRecoilHandler = useSetRecoilState(dataListModalViewMode);
  const illegalListCmdRecoilHandler = useSetRecoilState(illegalListModalViewMode);
  const mapEditModeRecoilHandler = useSetRecoilState(mapEditModeType);

  const [dataSeqRecoil, setDataSeqRecoil] = useRecoilState(dataSeq);
  const [isNewDataRecoil, setIsNewDataRecoil] = useRecoilState(isNewData);
  const [pnuCodeRecoil, setPnuCodeRecoil] = useRecoilState(pnuCode);
  const [kakaoMapTypeRecoil] = useRecoilState(kakaoMapType);
  const [isViewPlaneOptionState, setIsViewPlaneOption] = useRecoilState(isViewPlaneOption);

  // 점용 데이터 팝업 보이기/숨기기
  const docModalViewModeRecoilHandler = useSetRecoilState(docModalViewMode);
  const docModalViewModeHandler = async (type) => {
    // 점용키값 초기화
    await setDataSeqRecoil(0);
    // 신규 점용정보 추가
    await setIsNewDataRecoil(true);
    // 점용 데이터 팝업 보이기/숨기기
    await docModalViewModeRecoilHandler((val) => type);
  };
  // 하천점용 데이터 팝업 보이기/숨기기

  // 재산정보 데이터 팝업 보이기/숨기기
  const propertyModalViewModeRecoilHandler = useSetRecoilState(propertyModalViewMode);
  const propertyModalViewModeHandler = async (type) => {
    if (pnuCodeRecoil !== undefined && pnuCodeRecoil) {
      await propertyModalViewModeRecoilHandler((val) => type);
    }
  };
  // 재산정보 데이터 팝업 보이기/숨기기

  const krasModalCmdRecoilHandler = useSetRecoilState(krasModalViewMode);

  const changeKakaoMapTypeHandler = async (e) => {
    const selectedMapType = e.target.id;
    await changeKakaoMapChangeLayerRecoilHandler(selectedMapType === 'daumDefault' ? '다음일반' : '다음스카이뷰', true);
  };

  const dataLawChangeLayerRecoilHandler = useSetRecoilState(dataLawLayerType);

  const changeDataLawLayerRecoilHandler = (type, useYn) => {
    if (useYn === true) {
      dataLawChangeLayerRecoilHandler((arr) => [...arr, type]);
    } else {
      dataLawChangeLayerRecoilHandler((arr) => arr.filter((val) => val !== type));
    }
  };

  const mapEditModeHandler = (type) => {
    mapEditModeRecoilHandler((val) => type);
  };

  // 일필지 팝업
  const krasModalShowHandler = (isShow) => {
    krasModalCmdRecoilHandler((val) => isShow);
  };

  const [checked, setChecked] = useState(['evrlUse', 'cbndUse']);
  const [expanded, setExpanded] = useState([]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 시작
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // componentDidMount
  useEffect(() => {
    changeDataLawLayerRecoilHandler('evrlUse', true);
    changeDataLawLayerRecoilHandler('cbndUse', true);

    changeKakaoMapChangeLayerRecoilHandler('다음스카이뷰', true);
    // changeKakaoMapChangeLayerRecoilHandler('드론영상', true);
  }, []);

  // componentDidUpdate
  useEffect(() => {});

  // componentWillReceiveProps
  useEffect(() => {
    if (!isViewPlaneOptionState) {
      setIsViewMapOption(false);
    }
    if (isViewMapOption) {
      setIsViewPlaneOption(true);
    }
  }, [isViewPlaneOptionState, isViewMapOption]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleToggleMapOption = () => {
    setIsViewLayerOption(false);
    setIsViewMapOption(!isViewMapOption);
  };

  const handleClickLandInfo = () => {
    if (pnuCodeRecoil) {
      krasModalShowHandler(true);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  // 로그인 관련
  const loginHandler = useSetRecoilState(loginState);
  const loginSetHandler = async (data) => {
    await loginHandler((val) => data);
  };

  const tokenRecoilHandler = useSetRecoilState(token);
  const tokenSetHandler = async (data) => {
    await tokenRecoilHandler((val) => data);
  };

  const [loginInfo] = useRecoilState(loginState);

  const handleLogOut = () => {
    loginSetHandler(undefined);
    tokenSetHandler(undefined);
    window.location.href = '/';
  };

  const handleGoSys = () => {
    window.location.href = '/#/sys';
  };
  ///////////////////////////////////////////////////////////////////////////////////////

  const nodes = [
    {
      value: 'cbndUse',
      label: (
        <span style={{ fontSize: '13px' }}>
          <i className='fa fa-square' style={{ color: '#e69800' }}></i> 지적도
        </span>
      ),
    },
    {
      value: 'evrlUse',
      label: (
        <span style={{ fontSize: '13px' }}>
          <i className='fa fa-square' style={{ color: '#C92A2A' }}></i> 하천점용허가
        </span>
      ),
    },
    {
      value: 'evrlUse2',
      label: (
        <span style={{ fontSize: '13px' }}>
          <i className='fa fa-square' style={{ color: '#cc3dc7' }}></i> 하천점용허가(점유지)
        </span>
      ),
    },
    {
      value: 'realUse',
      label: (
        <span style={{ fontSize: '13px' }}>
          <i className='fa fa-square' style={{ color: '#4682B4' }}></i> 실태조사 대상지
        </span>
      ),
    },
    {
      value: 'kNaLand',
      label: (
        <span style={{ fontSize: '13px' }}>
          <i className='fa fa-square' style={{ color: '#FF9191' }}></i> 국유지
        </span>
      ),
    },
    {
      value: 'dNaLand',
      label: (
        <span style={{ fontSize: '13px' }}>
          <i className='fa fa-square' style={{ color: '#FFD700' }}></i> 도유지
        </span>
      ),
    },
    {
      value: 'cNaLand',
      label: (
        <span style={{ fontSize: '13px' }}>
          <i className='fa fa-square' style={{ color: '#008000' }}></i> 시유지
        </span>
      ),
    },
    {
      value: 'uj201',
      label: (
        <span style={{ fontSize: '13px' }}>
          <i className='fa fa-square' style={{ color: '#4CE0E0' }}></i> 하천-용도구역
        </span>
      ),
    },
    {
      value: 'uj301',
      label: (
        <span style={{ fontSize: '13px' }}>
          <i className='fa fa-square' style={{ color: '#4AB1E0' }}></i> 소하천-소하천구역
        </span>
      ),
    },
    {
      value: 'uq165',
      label: (
        <span style={{ fontSize: '13px' }}>
          <i className='fa fa-square' style={{ color: '#0098E1' }}></i> 국토계획-방재시설
        </span>
      ),
    },
  ];

  const onCheck = async (value) => {
    // console.log(value);
    // 면적측정, 거리측정 초기화
    await mapEditModeHandler('');
    // 맵 선택모드 초기화
    await setPnuCodeRecoil('');
    dataLawChangeLayerRecoilHandler(value);
    setChecked(value);
  };

  const onExpand = (value) => {
    setExpanded(value);
  };

  return (
    <div>
      <div className={'pos pos-with-menu pos-with-sidebar pos-mobile-sidebar-toggled'} id='pos'>
        <div className='pos-menu p-0 m-0 w-75px' style={{ background: '#223B37', zIndex: '2000', maxHeight: '100vh' }}>
          <div
            className='logo pt-3 pb-3'
            style={{ padding: '0.20312rem', zIndex: '10', boxShadow: '-4px 0px 8px rgba(0, 0, 0,' + ' .6)' }}
          >
            <Link to='/'>
              <div className='p-0 text-center' style={{ color: 'white', fontWeight: 500 }}>
                <i className='fa d-block fs-18px my-0' style={{ padding: '0.23438rem ' }}>
                  <img style={{ width: '18px', height: '18px' }} src='/oc_favicon.ico' alt='Icon' />
                </i>
                공유재산
              </div>
            </Link>
          </div>
          <div className='nav-container'>
            <PerfectScrollbar className='h-100'>
              <ul className='nav nav-tabs'>
                <li className='nav-item p-0  border-opacity-25 border-white'>
                  <a
                    className={'nav-link'}
                    style={{
                      borderRadius: 0,
                      background: 'rgb(34, 59, 55)',
                      color: 'white',
                      boxShadow: 'rgba(0, 0, 0, 0.6) -4px 0px 8px',
                      zIndex: 1,
                    }}
                    href='#/'
                    onClick={() => handleClickLandInfo()}
                  >
                    <div className='nav-icon p-1' style={{ color: 'white' }}>
                      <i className='fa fa-map d-block fs-18px my-0 pb-2px'></i>
                    </div>
                    <div className='nav-text'>일필지정보</div>
                  </a>
                </li>
                <li className='nav-item p-0  border-opacity-25 border-white'>
                  <a
                    className={'nav-link'}
                    style={{
                      borderRadius: 0,
                      background: 'transparent',
                      color: 'white',
                      boxShadow: 'rgba(0, 0, 0, 0.6) -4px 0px 8px',
                    }}
                    href='#/'
                    onClick={() => propertyModalViewModeHandler(true)}
                  >
                    <div className='nav-icon p-1' style={{ color: 'white' }}>
                      <i className='fa fa-money-check d-block fs-18px my-0 pb-2px'></i>
                    </div>
                    <div className='nav-text'>재산현황</div>
                  </a>
                </li>
              </ul>

              <ul
                className='nav nav-tabs'
                style={{ position: 'absolute', bottom: 0, margin: 0, padding: 0, width: '100%' }}
              >
                <li className='nav-item p-0 '>
                  <button
                    className={'nav-link'}
                    style={{
                      borderRadius: 0,
                      background: 'darkorange',
                      color: 'white',
                      width: '100%',
                    }}
                    onClick={handleLogOut}
                  >
                    <div className='nav-icon p-1' style={{ color: 'white' }}>
                      <i className='fa fa-sign-out d-block fs-18px my-0'></i>
                    </div>
                    <div className='nav-text'>로그아웃</div>
                  </button>
                </li>
                {loginInfo && loginInfo.lvl <= 4 && (
                  <li className='nav-item p-0 '>
                    <button
                      className={'nav-link'}
                      style={{
                        borderRadius: 0,
                        background: 'darkcyan',
                        color: 'white',
                        width: '100%',
                        border: 'none !important',
                        boxShadow: ' inset 0 8px 8px -8px rgba(0, 0, 0, .6)',
                      }}
                      onClick={handleGoSys}
                    >
                      <div className='nav-icon p-1' style={{ color: 'white' }}>
                        <i className='fa fa-lock d-block fs-18px my-0'></i>
                      </div>
                      <div className='nav-text'>관리자</div>
                    </button>
                  </li>
                )}
              </ul>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
      <div id='layerOption' className='option-popup' style={{ display: isViewLayerOption ? '' : 'none' }}>
        <a
          href='#'
          id='option-popup-closer'
          className='option-popup-closer'
          onClick={() => setIsViewLayerOption(false)}
        ></a>
        <div>
          <CheckboxTree nodes={nodes} checked={checked} expanded={expanded} onCheck={onCheck} onExpand={onExpand} />
        </div>
      </div>

      {/*버튼 디자인 2 버전*/}
      {/*<div className='btn-pos-top right_top_nav_item02'>*/}
      {/*  <div className='nav-item   border-opacity-25   '>*/}
      {/*    <a className='nav-link align-center' href='#/' onClick={() => handleToggleMapOption()}>*/}
      {/*      <div className='nav-icon p-1  d-flex justify-content-center'>*/}
      {/*        <i className='fa fa-plane d-block fs-18px my-0  '></i>*/}
      {/*        <div className='nav-text'>항공사진</div>*/}
      {/*      </div>*/}
      {/*    </a>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div id='mapOption' className='map-option-popup' style={{ display: isViewMapOption ? '' : 'none' }}>
        <a
          href='#'
          id='option-popup-closer'
          className='option-popup-closer'
          onClick={() => setIsViewMapOption(false)}
        ></a>
        <div>
          <div>
            <div className='p-1 ps-3'>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  id='daumSky'
                  name='daumMapType'
                  checked={kakaoMapTypeRecoil === '다음스카이뷰'}
                  onChange={changeKakaoMapTypeHandler}
                />
                <label className='form-radio-label' htmlFor='daumSky'>
                  항공사진
                </label>
              </div>
            </div>
            <div className='p-1 ps-3'>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  id='daumDefault'
                  name='daumMapType'
                  checked={kakaoMapTypeRecoil === '다음일반'}
                  onChange={changeKakaoMapTypeHandler}
                />
                <label className='form-radio-label' htmlFor='daumDefault'>
                  기본지도
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default _SideHeader;
