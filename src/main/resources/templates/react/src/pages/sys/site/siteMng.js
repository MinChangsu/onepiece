import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelBody } from '../../../components/panel/panel';
import agent from '../../../agents';
import { AppSettings } from '../../../config/app-settings';
import { useRecoilState } from 'recoil';
import loginState from '../../../store/loginState';

const SiteMng = () => {
  const [showNotice, setShowNotice] = useState(false);
  const [loginInfo] = useRecoilState(loginState);

  const context = useContext(AppSettings);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 시작
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // componentDidMount
  // useEffect(() => {
  // }, []);
  useEffect(() => {
    // 관리자화면은 기본으로 등록해야 함.
    context.handleSetAppThemePanelNone(true);
    context.handleSetAppHeaderNone(true);
    context.handleSetAppSysHeaderNone(false);
    context.handleSetAppSidebarNone(false);
    context.handleSetAppHeaderFixed(true);
    context.handleSetAppContentNone(false);

    if (loginInfo && loginInfo.lvl > 4) {
      window.location.href = '/';
    }

    fetchNoticeStatus();
  }, []);

  // componentDidUpdate
  // useEffect(() => {
  //   console.log("componentDidUpdate");
  // });

  // componentWillReceiveProps
  // useEffect(() => {
  //   console.log("Prop Received: ", props.data);
  // }, [props.data]);// showNotice 상태가 변경될 때마다 실행
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  const fetchNoticeStatus = async () => {
    try {
      const response = await agent.BrdInfo.fetchSiteInfo();
      if (response.main_view_board_yn === 'Y') {
        setShowNotice(true);
      } else {
        setShowNotice(false);
      }
    } catch (error) {
      //console.log('Failed to fetch notice status: ', error);
    }
  };

  const handleCheckboxChange = async (event) => {
    const isChecked = event.target.checked;
    setShowNotice(isChecked);
    let param = {
      main_view_board_yn: isChecked ? 'Y' : 'N',
    };
    try {
      await agent.BrdInfo.updateSiteInfo(param);
    } catch (error) {
      //console.error('Failed to update notice status: ', error);
    }
  };

  return (
    <div>
      <ol className='breadcrumb float-xl-end me-3'>
        <li className='breadcrumb-item'>
          <Link to='/sys'>Home</Link>
        </li>
        <li className='breadcrumb-item active'>사이트 관리</li>
      </ol>
      <h1 className='page-header ms-3 mb-2 pt-2'>사이트 관리</h1>
      <Panel>
        <PanelBody>
          <div className='row'>
            <div className='col-6 col-xl-6 col-lg-12 col-md-12 col-sm-12'>
              <Panel className='mb-0 w-100'>
                <PanelBody className='pb-0'>
                  <div className='mb-3'>
                    <h4 className='card-title fw-bold'>공유재산 업무지원시스템 사이트 관리</h4>
                  </div>
                  <hr />
                  <div className='row '>
                    <div className='col-3'>
                      <h5>공지사항 표시여부</h5>
                    </div>
                    <div className='col-3'>
                      <div className='form-group'>
                        <label htmlFor='noticeToggle' className='form-label me-2'>
                          공지사항 표시
                        </label>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='noticeToggle'
                          checked={showNotice}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    </div>
                  </div>
                </PanelBody>
              </Panel>
            </div>
          </div>
        </PanelBody>
      </Panel>
    </div>
  );
};

export default SiteMng;
