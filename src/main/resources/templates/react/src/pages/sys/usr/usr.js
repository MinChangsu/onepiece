import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable, { defaultThemes } from 'react-data-table-component';
import { Panel, PanelBody } from '../../../components/panel/panel';
import agent from '../../../agents';
import { AppSettings } from '../../../config/app-settings';
import UsrModal from './usrModal';
import UsrRgtModal from './usrRgtModal';
import { useRecoilState } from 'recoil';
import loginState from '../../../store/loginState';
import Pagination from 'react-js-pagination';
import moment from 'moment';

const Usr = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const [searchWrd, setSearchWrd] = useState('');
  const [usrList, setUsrList] = useState([]);
  const [authList, setAuthList] = useState([]);
  const [isViewModal, setIsViewModal] = useState(false);
  const [isViewRgtModal, setIsViewRgtModal] = useState(false);
  const [usrSeq, setUsrSeq] = useState(0);
  const [loginInfo] = useRecoilState(loginState);

  const context = useContext(AppSettings);
  // console.log(usrList, 'usrList');
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

    const arr = [
      { authLvl: 0, authNm: '권한없음' },
      { authLvl: 1, authNm: '관리자: 1' },
      { authLvl: 2, authNm: '관리자: 2' },
      { authLvl: 3, authNm: '관리자: 3' },
      { authLvl: 4, authNm: '관리자: 4' },
      { authLvl: 5, authNm: '사용자: 5' },
      { authLvl: 6, authNm: '사용자: 6' },
      { authLvl: 7, authNm: '사용자: 7' },
      { authLvl: 8, authNm: '사용자: 8' },
      { authLvl: 9, authNm: '사용자: 9' },
    ];
    setAuthList(arr);
    fetchUsrs(1);
    //fetchAuths();
  }, []);

  // componentDidUpdate
  // useEffect(() => {
  //   console.log("componentDidUpdate");
  // });

  // componentWillReceivePropsa
  // useEffect(() => {
  //   console.log("Prop Received: ", props.data);
  // }, [props.data]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  const fetchUsrs = async (page, size = perPage) => {
    setLoading(true);
    let params = {
      searchWrd: searchWrd,
      page: page,
      size: size,
    };
    // console.log(params);
    await agent.UsrInfo.fetchUsrs(params)
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
    fetchUsrs(page).then((r) => setCurrentPage(page));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    fetchUsrs(page, newPerPage).then((r) => setPerPage(newPerPage));
  };

  const handleSearchChange = (e) => {
    setSearchWrd(e.target.value);
  };

  const handleClickSearch = () => {
    fetchUsrs(1);
  };

  const handleKeyUpEvent = (e) => {
    if (e.keyCode === 13) fetchUsrs(1);
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
    console.log(v);

    setUsrSeq(v.usrSeq);
    handleToggleShow();
  };

  const columns = [
    {
      name: '번호',
      selector: (row) => row.rowNo,
      sortable: false,
      center: true,
      style: {
        textAlign: 'center',
      },
      width: '100px',
    },
    {
      name: '아이디',
      selector: (row) => row.usrId,
      sortable: false,
      center: true,
      style: {
        textAlign: 'center',
      },
    },
    {
      name: '이름',
      selector: (row) => row.usrNm,
      sortable: false,
      center: true,
      style: {
        textAlign: 'center',
      },
    },
    {
      name: '이메일',
      selector: (row) => row.eml,
      sortable: false,
      center: true,
      style: {
        textAlign: 'center',
      },
    },
    {
      name: '레벨',
      selector: (row) => row.lvl,
      sortable: false,
      center: true,
      style: {
        textAlign: 'center',
      },
      width: '100px',
    },
    {
      name: '권한',
      selector: (row) => row.lvl,
      cell: (row) => {
        if (row.lvl === 0) {
          return '권한없음';
        } else if (row.lvl > 4) {
          return '사용자';
        } else {
          return '관리자';
        }
      },
      center: true,
      style: {
        textAlign: 'center',
      },
    },
    {
      name: '연락처',
      selector: (row) => row.telno,
      sortable: false,
      center: true,
      style: {
        textAlign: 'center',
      },
    },
    {
      name: '가입일',
      selector: (row) => row.regDt,
      sortable: false,
      center: true,
      style: {
        textAlign: 'center',
      },
      cell: (row) => {
        return moment(row.regDt).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      name: '접속제한',
      selector: (row) => (row.failLgnCnt > 5 ? '제한' : '정상'),
      sortable: false,
      center: true,
      style: {
        textAlign: 'center',
      },
      width: '150px',
    },
    {
      name: '사용여부',
      selector: (row) => row.useYn,
      sortable: false,
      center: true,
      style: {
        textAlign: 'center',
      },
      width: '100px',
      cell: (row) => {
        if (row.useYn === 'Y') {
          return '사용';
        } else if (row.useYn === 'N') {
          return '미사용';
        }
      },
    },
    {
      name: '삭제처리',
      selector: (row) => row.delYn,
      sortable: false,
      center: true,
      style: {
        textAlign: 'center',
      },
      width: '100px',
      cell: (row) => {
        if (row.delYn === 'Y') {
          return '삭제';
        } else if (row.delYn === 'N') {
          return '미삭제';
        }
      },
    },

    {
      name: '탈퇴여부',
      selector: (row) => row.whdwlYn,
      sortable: false,
      center: true,
      style: {
        textAlign: 'center',
      },
      width: '100px',
      cell: (row) => {
        if (row.whdwlYn === 'Y') {
          return '탈퇴';
        } else if (row.whdwlYn === 'N') {
          return '미탈퇴';
        }
      },
    },
  ];
  const conditionalRowStyles = [
    {
      when: (row) => row.rowNo % 2 !== 0,
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
        '&:not(:first-of-type)': {
          borderLeftStyle: 'solid ',
          borderLeftWidth: '1px ',
          borderLeftColor: defaultThemes.default.divider.default,
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
        <li className='breadcrumb-item active'>사용자 관리</li>
      </ol>
      <h1 className='page-header ms-3 mb-2 pt-2'>사용자 관리</h1>
      <Panel>
        <PanelBody>
          <div className='row justify-content-between align-items-center'>
            <div className={'col'}>
              TOTAL <span style={{ fontWeight: 600 }}>{totalRows}</span> 건
            </div>

            <div className='col d-flex mb-1 me-3 justify-content-end'>
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

          <div style={{ overflowY: 'auto', overflowX: 'hidden', width: '100%', maxHeight: '75vh' }}>
            <DataTable
              columns={columns}
              data={usrList}
              responsive
              progressPending={loading}
              striped={true}
              customStyles={customStyles}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              conditionalRowStyles={conditionalRowStyles}
              onRowClicked={handleUpdate}
            />
          </div>
          <div className='row mt-3'>
            <div className='col-md-11 d-flex justify-content-center'>
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
            <div className=' col-md-1 px-2 justify-content-end d-flex'>
              <div className='text-end justify-content-star'>
                <button className='btn btn-primary rounded-3 text-center w-90px' onClick={handleInsert}>
                  등록
                </button>
              </div>
            </div>
          </div>
        </PanelBody>
      </Panel>
      <UsrModal
        show={isViewModal}
        toggleShow={handleToggleShow}
        reloadParentList={fetchUsrs}
        usrSeq={usrSeq}
        authList={authList}
      />
      <UsrRgtModal
        show={isViewRgtModal}
        rgtToggleShow={handleRgtToggleShow}
        reloadParentList={fetchUsrs}
        usrSeq={usrSeq}
        authList={authList}
      />
    </div>
  );
};

export default Usr;
