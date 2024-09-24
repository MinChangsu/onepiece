import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable, { defaultThemes } from 'react-data-table-component';

import { Panel, PanelBody } from '../../../components/panel/panel';
import agent from '../../../agents';
import { AppSettings } from '../../../config/app-settings';
import { useRecoilState } from 'recoil';
import loginState from '../../../store/loginState';
import Pagination from 'react-js-pagination';

const CmnLog = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const [searchWrd, setSearchWrd] = useState('');
  const [logList, setLogList] = useState([]);
  const [selectedLogAct, setSelectedLogAct] = useState('');
  const [loginInfo] = useRecoilState(loginState);
  const context = useContext(AppSettings);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMsgRes, setSelectedMsgRes] = useState('');

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 시작
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // componentDidMount
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

    fetchLogs(1);
  }, []);

  // componentDidUpdate
  // useEffect(() => {
  //   console.log("componentDidUpdate");
  // });

  // componentWillReceiveProps
  // useEffect(() => {
  //   console.log("Prop Received: ", props.data);
  // }, [props.data]);
  useEffect(() => {
    fetchLogs(1);
  }, [selectedLogAct]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  const fetchLogs = async (page, size = perPage) => {
    setLoading(true);
    setCurrentPage(1);
    let params = {
      searchWrd: searchWrd,
      logAct: selectedLogAct,
      page: page,
      size: size,
    };

    try {
      const { totCnt, totPages, resultList, result } = await agent.CmnInfo.fetchLogs(params);

      if (result === 'success') {
        if (resultList.length > 0) {
          setLogList(resultList);
          setTotalRows(totCnt);
        }
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchLogs(page).then((r) => setCurrentPage(page));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    fetchLogs(page, newPerPage).then((r) => setPerPage(newPerPage));
  };

  const handleSearchChange = (e) => {
    setSearchWrd(e.target.value);
  };

  const handleClickSearch = () => {
    fetchLogs(1);
  };

  const handleKeyUpEvent = (e) => {
    if (e.keyCode === 13) fetchLogs(1);
  };

  const handleLogActChange = (e) => {
    setLogList([]);
    setTotalRows(0);
    setSelectedLogAct(e.target.value);
  };

  // 팝업 열기
  const handleShowPopup = (msgRes) => {
    setSelectedMsgRes(msgRes);
    setShowPopup(true);
  };

  // 모달 닫기
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const customStyles = {
    header: {
      style: {
        minHeight: '56px',
      },
    },
    headCells: {
      style: {
        '&:not(:first-of-type)': {
          borderLeftStyle: 'solid ',
          borderLeftWidth: '1px ',
          borderLeftColor: defaultThemes.default.divider.default,
        },
      },
    },
  };

  const columns = [
    {
      name: '사용자구분',
      selector: (row) => (row.usrType === 'S' ? '관리자' : '사용자'),
      sortable: false,
      width: '100px',
      center: true,
      style: {
        textAlign: 'center',
      },
    },
    {
      name: '이름',
      selector: (row) => row.usrNm,
      sortable: false,
      width: '120px',
      center: true,
      style: {
        textAlign: 'center',
      },
    },
    {
      name: '접속구분',
      selector: (row) => (row.logType === 'MAP' ? '점용' : '관리'),
      sortable: false,
      width: '110px',
      center: true,
      style: {
        textAlign: 'center',
      },
    },
    {
      name: '접속행위',
      selector: (row) => row.logAct,
      sortable: false,
      width: '110px',
      center: true,
      style: {
        textAlign: 'center',
      },
    },
    {
      name: '접속경로',
      selector: (row) => row.logPath,
      sortable: false,
      center: true,
      style: {
        textAlign: 'center',
      },
    },
    {
      name: '행위결과',
      selector: (row) =>
        row.msg_res.length > 30 ? (
          <div>
            {row.msg_res.substring(0, 30)}...
            <button className='btn btn-link p-0 m-0' onClick={() => handleShowPopup(row.msg_res)}>
              상세보기
            </button>
          </div>
        ) : (
          row.msg_res
        ),
      sortable: false,
      center: true,
      style: {
        textAlign: 'center',
      },
    },
    {
      name: '접속IP',
      selector: (row) => row.logIp,
      sortable: false,
      width: '180px',
      center: true,
      style: {
        textAlign: 'center',
      },
    },
    {
      name: '접속시간',
      selector: (row) => row.logHr,
      sortable: false,
      width: '200px',
      center: true,
      style: {
        textAlign: 'center',
      },
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.rowNo % 2 === 0,
      style: { backgroundColor: '#F5F5F6' },
    },
  ];

  return (
    <div>
      <ol className='breadcrumb float-xl-end me-3'>
        <li className='breadcrumb-item'>
          <Link to='/sys'>Home</Link>
        </li>
        <li className='breadcrumb-item'>기본 관리</li>
        <li className='breadcrumb-item active'>이력 관리</li>
      </ol>
      <h1 className='page-header ms-3 mb-2 pt-2'>이력 관리</h1>
      <Panel>
        <PanelBody>
          <div className='row justify-content-between align-items-center'>
            <div className={'col'}>
              TOTAL <span style={{ fontWeight: 600 }}>{totalRows}</span> 건
            </div>

            <div className='col d-flex mb-1 me-3 justify-content-end'>
              <div className='me-3 d-flex justify-content-center align-items-center '>
                <label>
                  <input
                    type='radio'
                    name='logAct'
                    value=''
                    checked={selectedLogAct === ''}
                    onChange={handleLogActChange}
                  />{' '}
                  전체
                </label>
                <label className='ms-2'>
                  <input
                    type='radio'
                    name='logAct'
                    value='LOGIN'
                    checked={selectedLogAct === 'LOGIN'}
                    onChange={(e) => {
                      handleLogActChange(e);
                    }}
                  />{' '}
                  로그인
                </label>
                <label className='ms-2'>
                  <input
                    type='radio'
                    name='logAct'
                    value='VIEW'
                    checked={selectedLogAct === 'VIEW'}
                    onChange={handleLogActChange}
                  />{' '}
                  조회
                </label>
                <label className='ms-2'>
                  <input
                    type='radio'
                    name='logAct'
                    value='RGT'
                    checked={selectedLogAct === 'RGT'}
                    onChange={handleLogActChange}
                  />{' '}
                  등록
                </label>
                <label className='ms-2'>
                  <input
                    type='radio'
                    name='logAct'
                    value='DEL'
                    checked={selectedLogAct === 'DEL'}
                    onChange={handleLogActChange}
                  />{' '}
                  삭제
                </label>
                <label className='ms-2'>
                  <input
                    type='radio'
                    name='logAct'
                    value='UPD'
                    checked={selectedLogAct === 'UPD'}
                    onChange={handleLogActChange}
                  />{' '}
                  수정
                </label>
              </div>
              <input
                type='text'
                className='form-control w-200px me-1'
                id='search'
                value={searchWrd || ''}
                onChange={handleSearchChange}
                onKeyUp={handleKeyUpEvent}
              />
              <button className='btn btn-success rounded-3 text-center w-80px' onClick={handleClickSearch}>
                검색
              </button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={logList}
            responsive
            progressPending={loading}
            striped={true}
            customStyles={customStyles}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            conditionalRowStyles={conditionalRowStyles}
          />
          <div className='row mt-3'>
            <div className='col-md-12 d-flex justify-content-center'>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={perPage}
                totalItemsCount={totalRows}
                pageRangeDisplayed={10}
                onChange={handlePageChange}
                itemClass={'page-item'}
                linkClass={'page-link'}
                prevPageText={<i class='fa-solid fa-angle-left'></i>}
                firstPageText={<i class='fa-solid fa-angles-left'></i>}
                nextPageText={<i class='fa-solid fa-angle-right'></i>}
                lastPageText={<i class='fa-solid fa-angles-right'></i>}
              />
            </div>
          </div>
        </PanelBody>
      </Panel>
      {/* 커스텀 팝업 구현 */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            width: '600px',
            borderRadius: '8px',
          }}
        >
          <h5>행위결과 상세보기</h5>
          <hr />
          <p style={{ maxHeight: '300px', overflowY: 'auto' }}>{selectedMsgRes}</p>
          <div className='d-flex justify-content-end'>
            <button className='btn btn-primary' onClick={handleClosePopup}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CmnLog;
