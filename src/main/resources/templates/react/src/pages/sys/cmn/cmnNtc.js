import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable, { defaultThemes } from 'react-data-table-component';
import { Panel, PanelBody } from '../../../components/panel/panel';
import agent from '../../../agents';
import CmnNtcModal from './cmnNtcModal';
import { AppSettings } from '../../../config/app-settings';
import { useRecoilState } from 'recoil';
import loginState from '../../../store/loginState';
import Pagination from 'react-js-pagination';

const CmnNtc = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const [searchWrd, setSearchWrd] = useState('');
  const [ntcList, setNtcList] = useState([]);
  const [isViewModal, setIsViewModal] = useState(false);
  const [ntcSeq, setNtcSeq] = useState(0);
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
    context.handleSetAppContentNone(false);

    if (loginInfo && loginInfo.lvl > 4) {
      window.location.href = '/';
    }

    fetchNtcs(1);
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

  const fetchNtcs = async (page, size = perPage) => {
    setLoading(true);
    let params = {
      searchWrd: searchWrd,
      useYn: '',
      page: page,
      size: size,
    };
    await agent.BrdInfo.fetchNtcs(params)
      .then(({ totCnt, totPages, resultList, result }) => {
        if (result === 'success') {
          setTotalRows(totCnt);
          setNtcList(resultList);
        } else if (result === 'fail') {
          setTotalRows(0);
          setNtcList([]);
        }
      })
      .finally(() => setLoading(false));
  };

  const handlePageChange = (page) => {
    fetchNtcs(page).then((r) => setCurrentPage(page));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    fetchNtcs(page, newPerPage).then((r) => setPerPage(newPerPage));
  };

  const handleSearchChange = (e) => {
    setSearchWrd(e.target.value);
  };

  const handleClickSearch = () => {
    fetchNtcs(1);
  };

  const handleKeyUpEvent = (e) => {
    if (e.keyCode === 13) fetchNtcs(1);
  };

  const handleInsert = (v) => {
    setNtcSeq(0);
    handleToggleShow();
  };
  const handleToggleShow = () => {
    setIsViewModal((p) => !p);
  };

  const handleUpdate = (v) => {
    setNtcSeq(v.seq);
    handleToggleShow();
  };

  const columns = [
    {
      name: '번호',
      selector: (row) => row.rowNo,
      sortable: false,
      width: '100px',
      center: true,
      style: {
        textAlign: 'center',
      },
    },
    {
      name: '제목',
      selector: (row) => row.title,
      sortable: false,
    },
    {
      name: '사용유무',
      selector: (row) => (row.useYn === 'Y' ? '사용' : '미사용'),
      sortable: false,
      width: '100px',
      center: true,
      style: {
        textAlign: 'center',
      },
    },
    {
      name: '등록일',
      selector: (row) => row.regDt,
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
        <li className='breadcrumb-item'>기본 관리</li>
        <li className='breadcrumb-item active'>공지사항 관리</li>
      </ol>
      <h1 className='page-header ms-3 mb-2 pt-2'>공지사항 관리</h1>
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

          <DataTable
            columns={columns}
            data={ntcList}
            responsive
            progressPending={loading}
            striped={true}
            customStyles={customStyles}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            conditionalRowStyles={conditionalRowStyles}
            onRowClicked={handleUpdate}
          />
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
              <div className='text-end mt-1'>
                <button className='btn btn-primary rounded-3 text-center w-90px' onClick={handleInsert}>
                  등록
                </button>
              </div>
            </div>
          </div>
        </PanelBody>
      </Panel>
      <CmnNtcModal show={isViewModal} toggleShow={handleToggleShow} reloadParentList={fetchNtcs} seq={ntcSeq} />
    </div>
  );
};

export default CmnNtc;
