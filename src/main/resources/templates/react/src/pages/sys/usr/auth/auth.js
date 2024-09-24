import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable, { defaultThemes } from 'react-data-table-component';
import agent from '../../../../agents';
import { Panel, PanelBody } from '../../../../components/panel/panel';
import { AppSettings } from '../../../../config/app-settings';
import { useRecoilState } from 'recoil';
import loginState from '../../../../store/loginState';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [searchWrd, setSearchWrd] = useState('');
  const [usrList, setUsrList] = useState([]);
  const [isViewModal, setIsViewModal] = useState(false);
  const [isViewRgtModal, setIsViewRgtModal] = useState(false);
  const [usrSeq, setUsrSeq] = useState(0);
  const [loginInfo] = useRecoilState(loginState);

  const context = useContext(AppSettings);

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

    if (loginInfo && loginInfo.lvl > 4) {
      window.location.href = '/';
    }

    fetchAuths(1);
  }, []);

  // componentDidUpdate
  // useEffect(() => {
  //   console.log("componentDidUpdate");
  // });

  // componentWillReceiveProps
  // useEffect(() => {
  //   console.log("Prop Received: ", props.data);
  // }, [props.data]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  const fetchAuths = async (page, size = perPage) => {
    setLoading(true);
    let params = {
      searchWrd: searchWrd,
      page: page,
      size: size,
    };
    //console.log(params);
    await agent.UsrInfo.fetchAuths(params)
      .then(({ totCnt, totPages, resultList, result }) => {
        if (result === 'SUCCESS') {
          setTotalRows(totCnt);
          setUsrList(resultList);
        } else if (result === 'FAIL') {
          setTotalRows(0);
          setUsrList([]);
        }
      })
      .finally(() => setLoading(false));
  };

  const handlePageChange = (page) => {
    fetchAuths(page).then((r) => setCurrentPage(page));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    fetchAuths(page, newPerPage).then((r) => setPerPage(newPerPage));
  };

  const handleSearchChange = (e) => {
    setSearchWrd(e.target.value);
  };

  const handleClickSearch = () => {
    fetchAuths(1);
  };

  const handleKeyUpEvent = (e) => {
    if (e.keyCode === 13) fetchAuths(1);
  };

  const handleInsert = (v) => {
    setUsrSeq(0);
    handleRgtToggleShow();
  };
  const handleToggleShow = () => {
    setIsViewModal((p) => !p);
  };

  const handleRgtToggleShow = () => {
    setIsViewRgtModal((p) => !p);
  };

  const handleUpdate = (v) => {
    // setUsrSeq(v.usrSeq);
    // handleToggleShow();
  };

  const columns = [
    { name: '권한', selector: (row) => row.authLvl, sortable: false },
    { name: '이름', selector: (row) => row.authNm, sortable: false },
    { name: '생성일', selector: (row) => row.regDt, sortable: false },
    { name: '수정일', selector: (row) => row.mdfcnDt, sortable: false },
    { name: '사용여부', selector: (row) => row.useYn, sortable: false },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.authLvl % 2 !== 0,
      style: { backgroundColor: '#F5F5F6' },
    },
  ];

  const customStyles = {
    header: {
      style: {
        minHeight: '56px',
      },
    },

    headCells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
  };

  return (
    <div>
      <ol className='breadcrumb float-xl-end me-3'>
        <li className='breadcrumb-item'>
          <Link to='/sys'>Home</Link>
        </li>
        <li className='breadcrumb-item'>사용자 관리</li>
        <li className='breadcrumb-item active'>권한 관리</li>
      </ol>
      <h1 className='page-header ms-3 mb-2 pt-2'>권한 관리</h1>
      <Panel>
        <PanelBody>
          <div className='row mb-1 me-3 float-end'>
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
          <DataTable
            columns={columns}
            data={usrList}
            responsive
            progressPending={loading}
            striped={true}
            pagination
            paginationServer
            customStyles={customStyles}
            paginationTotalRows={totalRows}
            paginationDefaultPage={currentPage}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            conditionalRowStyles={conditionalRowStyles}
            onRowClicked={handleUpdate}
          />
          {/*<div className='text-end mt-1'>*/}
          {/*  <button className='btn btn-primary rounded-3 text-center w-90px' onClick={handleInsert}>*/}
          {/*    등록*/}
          {/*  </button>*/}
          {/*</div>*/}
        </PanelBody>
      </Panel>
    </div>
  );
};

export default Auth;
