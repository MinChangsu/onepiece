import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { krasModalViewMode, pnuCode, propertyModalViewMode } from '../../store/stores';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

const SideHeader = () => {
  const [pnuCodeRecoil, setPnuCodeRecoil] = useRecoilState(pnuCode);

  // 재산정보 데이터 팝업 보이기/숨기기
  const propertyModalViewModeRecoilHandler = useSetRecoilState(propertyModalViewMode);
  const propertyModalViewModeHandler = async (type) => {
    if (pnuCodeRecoil !== undefined && pnuCodeRecoil) {
      await propertyModalViewModeRecoilHandler((val) => type);
    }
  };

  // 일필지 팝업
  const krasModalCmdRecoilHandler = useSetRecoilState(krasModalViewMode);
  const krasModalShowHandler = (isShow) => {
    krasModalCmdRecoilHandler((val) => isShow);
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 시작
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // componentDidMount
  useEffect(() => {}, []);

  // componentDidUpdate
  useEffect(() => {});

  // componentWillReceiveProps
  useEffect(() => {}, []);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleClickLandInfo = () => {
    if (pnuCodeRecoil) {
      krasModalShowHandler(true);
    }
  };
  const sideMenu = {
    borderRadius: '50px',
    height: '40px',
    width: '130px',
    zIndex: 1,
    border: '1px solid rgba(255,255,255,.7)',
  };
  ///////////////////////////////////////////////////////////////////////////////////////

  return (
    <div>
      <div
        className={'pos pos-with-menu pos-with-sidebar pos-mobile-sidebar-toggled'}
        id='pos'
        style={{ position: 'relative', zIndex: '2000' }}
      >
        <div className='pos-menu p-0 m-0' style={{ bottom: 'initial', width: '350px', top: '10px', left: '30px' }}>
          <div className='nav-container'>
            <ul className='nav nav-tabs d-flex'>
              <li className='nav-item p-0 '>
                <a
                  className={'nav-link p-15px d-flex align-items-center justify-content-center text-white main-bg '}
                  style={sideMenu}
                  href='#/'
                  onClick={() => handleClickLandInfo()}
                >
                  <div className='nav-icon p-0 m-0' style={{ color: 'white' }}>
                    <i className='fa fa-map d-block fs-18px my-0 pb-2px'></i>
                  </div>
                  <div className='nav-text ms-10px'>일필지정보</div>
                </a>
              </li>
              <li className='nav-item p-0  ms-20px'>
                <a
                  className={'nav-link  p-15px  d-flex align-items-center justify-content-center text-white main-bg'}
                  style={sideMenu}
                  href='#/'
                  onClick={() => propertyModalViewModeHandler(true)}
                >
                  <div className='nav-icon p-0 m-0 text-white'>
                    <i className='fa fa-money-check d-block fs-18px my-0 pb-2px'></i>
                  </div>
                  <div className='nav-text  ms-10px'>재산현황</div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideHeader;
