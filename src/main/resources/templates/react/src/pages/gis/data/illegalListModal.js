import React, { useContext, useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Panel, PanelBody } from '../../../components/panel/panel';
import agent from '../../../agents';
import { AppSettings } from '../../../config/app-settings';
import { Collapse, Modal, ModalDialog } from 'react-bootstrap';
import Draggable from 'react-draggable';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { docModalViewMode, dataSeq, dataSeqToMove, umdList, areaCode, isNewData, pnuCode } from '../../../store/stores';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/ko';
import moment from 'moment';
import Select from '../../../components/custom/select';
import Loading from '../../../composables/loading';
import PropertyModal from '../home/propertyModal';
import IllegalModal from '../home/illegalModal';

const IllegalListModal = (props) => {
  const { show, toggleShow } = props;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(25);
  const [dataList, setDataList] = useState([]);
  const editorRef = useRef(null);
  const [maxDateDisabled, setMaxDateDisabled] = useState(true);
  const [ris, setRis] = useState([]);
  const [umd, setUmd] = useState('');
  const [ri, setRi] = useState('');
  const [iOwner, setIOwner] = useState('');
  const [sDate, setSDate] = useState('');
  const [eDate, setEDate] = useState('');

  const umdsRecoil = useRecoilValue(umdList);
  const areaCodeRecoil = useRecoilValue(areaCode);
  const [isNewDataRecoil, setIsNewDataRecoil] = useRecoilState(isNewData);
  const sDateRef = useRef(null);
  const eDateRef = useRef(null);

  const [isShowModal, setIsShowModal] = useState(false);
  const [illegalSeq, setIllegalSeq] = useState(0);

  const minDateChange = (value) => {
    setMaxDateDisabled(false);
    editorRef.current = value;
  };
  const context = useContext(AppSettings);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 시작
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // componentDidMount
  useEffect(() => {}, []);

  // componentDidUpdate
  // useEffect(() => {
  //   console.log("componentDidUpdate");
  // });

  // componentWillReceiveProps
  // useEffect(() => {
  // }, []);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleOpened = async () => {
    setCurrentPage(1);
    await fetchIllegals(1);
  };

  const handleClose = async () => {
    toggleShow();
  };

  const fetchIllegals = async (page, size = perPage) => {
    setLoading(true);
    let params = {
      areaCd: areaCodeRecoil,
      umd: umd,
      ri: ri,
      iOwner: iOwner,
      sDate: moment(sDate).isValid() ? moment(sDate).format('YYYY-MM-DD') : '',
      eDate: moment(eDate).isValid() ? moment(eDate).format('YYYY-MM-DD') : '',
      page: page,
      sizePerPage: size,
    };
    await agent.IllegalInfo.fetchIllegals(params)
      .then(({ totCnt, resultList, result }) => {
        if (result === 'success') {
          setTotalRows(totCnt);
          setDataList(resultList);
        } else if (result === 'fail') {
          setTotalRows(0);
          setDataList([]);
        }
      })
      .finally(() => setLoading(false));
  };

  const handlePageChange = (page) => {
    if (!loading) fetchIllegals(page).then((r) => setCurrentPage(page));
  };
  const handlePerRowsChange = (newPerPage, page) => {
    if (!loading) fetchIllegals(page, newPerPage).then((r) => setPerPage(newPerPage));
  };
  const handleSearchChange = (e) => {
    e.preventDefault();
    switch (e.target.id) {
      case 'iOwner':
        setIOwner(e.target.value);
        break;
    }
  };
  const handleChangeSDate = (date) => {
    minDateChange(date);
    setSDate(date);
  };
  const handleChangeEDate = (date) => {
    setEDate(date);
  };
  const handleClickSearch = () => {
    setCurrentPage(1);
    fetchIllegals(1);
  };
  const handleClickSearchReset = () => {
    setUmd('');
    setRi('');
    setSDate('');
    sDateRef.current.state.inputValue = '';
    setEDate('');
    eDateRef.current.state.inputValue = '';
    // setName('');
    setRis([]);
    setIOwner('');
    setCurrentPage(1);
    fetchIllegals(1);
  };
  const handleKeyUpEvent = (e) => {
    if (e.keyCode === 13) {
      if (e.target.value !== '') {
        fetchIllegals(1);
      }
    }
  };
  const handleChangeUmd = (emdCd) => {
    setUmd(emdCd);
    setRi('');
    fetchRis(emdCd);
  };

  const fetchRis = async (emdCd) => {
    setLoading(true);
    await agent.AddrInfo.fetchRis(areaCodeRecoil, emdCd)
      .then(({ resultList, result }) => {
        if (result === 'success') {
          const cList = resultList.map(function (row) {
            return { value: row.riCd, text: row.riNm };
          });
          setRis(cList);
        } else if (result === 'fail') {
          setRis([]);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleChangeRi = (riCd) => {
    setRi(riCd);
  };

  const handleClickRow = async (v) => {
    await handleToggleShowIllegalModal(v.seq);
  };

  const handleClickToMove = async (e, lSeq) => {
    e.preventDefault();
    // await dataSeqToMoveSetHandler(lSeq);
  };

  const handleClickNew = () => {
    setIllegalSeq(0);
    setIsShowModal(!isShowModal);
  };

  const toggleExpand = (e) => {
    e.preventDefault();
    setOpen(!open);
  };

  const handleToggleShowIllegalModal = (val) => {
    setIllegalSeq(val);
    setIsShowModal(!isShowModal);
    // fetchIllegals(1);
  };

  const customStyle = {
    noData: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      },
    },
    rows: {
      style: {
        zIndex: 2,
        minHeight: '24px !important',
        fontSize: '13px',
        whiteSpace: 'pre',
      },
    },
    table: {
      style: {
        zIndex: 1,
      },
    },
    headRow: {
      style: {
        minHeight: '24px',
      },
    },
    headCells: {
      style: {
        fontSize: '13px',
        justifyContent: 'center',
        wordWrap: 'breakWord',
      },
    },
    subHeader: {
      style: {
        minHeight: '24px',
      },
    },
    pagination: {
      style: {
        minHeight: '20px',
      },
      pageButtonsStyle: {
        borderRadius: '50%',
        height: '40px',
        width: '40px',
        padding: '8px',
        margin: 'px',
        cursor: 'pointer',
      },
    },
  };

  const columns = [
    {
      name: '순번',
      selector: (row) => row.rowNo,
      sortable: false,
      width: '60px',
      right: true,
      style: { cursor: 'pointer' },
    },
    {
      name: '소재지',
      selector: (row) => row.addr,
      sortable: false,
      style: { cursor: 'pointer' },
    },
    {
      name: '점유구분',
      selector: (row) => (row.iType === 'Y' ? '전체' : '일부'),
      sortable: false,
      width: '70px',
      center: true,
      style: { cursor: 'pointer' },
    },
    {
      name: '점유자',
      selector: (row) => row.iOwner,
      sortable: false,
      width: '110px',
      center: true,
      style: { cursor: 'pointer' },
    },
    {
      name: '연락처',
      selector: (row) => row.iTel,
      sortable: false,
      width: '150px',
      center: true,
      style: { cursor: 'pointer' },
    },
    {
      name: '사용용도',
      selector: (row) => row.iUseType,
      sortable: false,
      width: '80px',
      center: true,
      style: { cursor: 'pointer' },
    },
    {
      name: '점유면적',
      selector: (row) => Number(row.iArea).toLocaleString(),
      right: true,
      sortable: false,
      width: '110px',
      style: { cursor: 'pointer' },
    },
    {
      name: '점유시작일',
      selector: (row) => row.iStDay,
      sortable: false,
      width: '120px',
      center: true,
      style: { cursor: 'pointer' },
    },
    {
      name: '점유종료일',
      selector: (row) => row.iEndDay,
      sortable: false,
      width: '120px',
      center: true,
      style: { cursor: 'pointer' },
    },
    {
      name: '지도이동',
      button: true,
      cell: (row) => (
        <button
          className='btn btn-xs btn-info m-0'
          onClick={(e) => {
            handleClickToMove(e, row.seq);
            return false;
          }}
        >
          이동
        </button>
      ),
      sortable: false,
      width: '70px',
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.rowNo % 2 === 0,
      style: { backgroundColor: '#F5F5F6' },
    },
  ];

  const cmbUmds = [{ value: '', text: '전체' }, ...umdsRecoil];
  const cmbRis = [{ value: '', text: '전체' }, ...ris];

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop='static'
      keyboard={true}
      onEnter={handleOpened}
      dialogClassName='doc-list-modal'
      backdropClassName='opacity-10'
      className='mt-5'
    >
      <Modal.Header closeButton className='p-2 ps-4 pe-4' style={{ alignContent: 'space-evenly' }}>
        <Modal.Title>무단점유 정보</Modal.Title>
        <div className='d-flex justify-content-end' style={{ width: '89%' }}>
          <a href='#' onClick={(e) => toggleExpand(e)} className='mt-1'>
            {open ? (
              <i className='fa fa-caret-down' style={{ fontSize: '20px' }}></i>
            ) : (
              <i className='fa fa-caret-up' style={{ fontSize: '20px' }}></i>
            )}
          </a>
        </div>
      </Modal.Header>
      <Modal.Body className='p-1'>
        <Collapse in={open}>
          <Panel className='mb-0 w-100'>
            <PanelBody className='p-0 docGrid'>
              <div className='row mb-1 row-cols-lg-auto g-3 align-items-center'>
                <div className='ms-2 w-150px'>
                  <label className='form-label'>읍면동</label>
                  <Select values={cmbUmds} callback={handleChangeUmd} selected={umd} />
                </div>
                <div className='w-150px'>
                  <label className='form-label'>리</label>
                  <Select values={cmbRis} callback={handleChangeRi} selected={ri} />
                </div>

                <div className='ms-2'>
                  <label className='form-label'>점유자</label>
                  <input
                    type='text'
                    className='form-control w-100px form-control-sm'
                    id='iOwner'
                    value={''}
                    value={iOwner}
                    onChange={(e) => handleSearchChange(e)}
                    onKeyUp={handleKeyUpEvent}
                  />
                </div>
                <div>
                  <label className='form-label'>점유일</label>
                  <div className='d-flex'>
                    <DateTime
                      locale='ko'
                      ref={sDateRef}
                      inputProps={{ placeholder: '시작일' }}
                      closeOnSelect={true}
                      onChange={(date) => handleChangeSDate(date)}
                      className='w-100px'
                      dateFormat='YYYY-MM-DD'
                      timeFormat={false}
                      value={sDate}
                    />
                    <DateTime
                      locale='ko'
                      ref={eDateRef}
                      inputProps={{ placeholder: '종료일', disabled: maxDateDisabled }}
                      closeOnSelect={true}
                      onChange={(date) => handleChangeEDate(date)}
                      className='w-100px'
                      dateFormat='YYYY-MM-DD'
                      timeFormat={false}
                      value={eDate}
                    />
                  </div>
                </div>
                <div>
                  <button
                    className='btn btn-success rounded-3 mt-4 me-2 text-center w-80px'
                    onClick={handleClickSearch}
                  >
                    검색
                  </button>
                  <button
                    className='btn btn-warning rounded-3 mt-4 text-center w-80px'
                    onClick={handleClickSearchReset}
                  >
                    초기화
                  </button>
                </div>
                <div>
                  <button className='btn btn-primary rounded-3 mt-4 ms-5 text-center w-80px' onClick={handleClickNew}>
                    추가
                  </button>
                </div>
              </div>
              {/*{loading && <Loading/>}*/}
              <DataTable
                columns={columns}
                customStyles={customStyle}
                data={dataList}
                responsive
                noDataComponent='데이터가 없습니다.'
                // progressPending={loading}
                striped={false}
                dense
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationDefaultPage={currentPage}
                paginationPerPage={perPage}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                conditionalRowStyles={conditionalRowStyles}
                onRowClicked={handleClickRow}
              />
            </PanelBody>
          </Panel>
        </Collapse>
      </Modal.Body>
      <IllegalModal show={isShowModal} toggleShow={handleToggleShowIllegalModal} seq={illegalSeq} />
    </Modal>
  );
};

export default IllegalListModal;
