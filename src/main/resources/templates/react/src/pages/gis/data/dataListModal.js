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

const DataListModal = (props) => {
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
  const [licenseNo, setLicenseNo] = useState('');
  const [sDate, setSDate] = useState('');
  const [eDate, setEDate] = useState('');
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [purpose, setPurpose] = useState('');
  // const [expirDate, setExpirDate] = useState('');

  const umdsRecoil = useRecoilValue(umdList);
  const areaCodeRecoil = useRecoilValue(areaCode);
  const [isNewDataRecoil, setIsNewDataRecoil] = useRecoilState(isNewData);
  const [pnuCodeRecoil, setPnuCodeRecoil] = useRecoilState(pnuCode);

  const sDateRef = useRef(null);
  const eDateRef = useRef(null);

  // 첨부이미지 업로드를 위한 허가번호 recoil
  // const licenseNoDataRecoilHandler = useSetRecoilState(licenseNoData);
  // const licenseNoDataSetHandler = async (data) => {
  //   await licenseNoDataRecoilHandler((val) => data);
  // };
  // 첨부이미지 업로드를 위한 허가번호 recoil

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

  const dataSeqRecoilHandler = useSetRecoilState(dataSeq);
  const dataSeqSetHandler = async (seqVal) => {
    await dataSeqRecoilHandler((val) => seqVal);
  };
  // 하천점용 키 설정

  // 하천점용 상세 모달 창 열기/닫기
  const [docModalViewModeRecoil, setDocModalViewModeRecoil] = useRecoilState(docModalViewMode);
  const handleToggleShowCon = async (dataSeq) => {
    if (dataSeq) {
      await dataSeqSetHandler(dataSeq);
      await setIsNewDataRecoil(false);
      await setDocModalViewModeRecoil(!docModalViewModeRecoil);
    }
  };
  // 하천점용 상세 모달 창 열기/닫기

  // 하천점용 위치이동 키 설정
  const dataSeqToMoveRecoilHandler = useSetRecoilState(dataSeqToMove);
  const dataSeqToMoveSetHandler = async (seqVal) => {
    setPnuCodeRecoil('');
    await dataSeqToMoveRecoilHandler((val) => seqVal);
  };
  // 하천점용 위치이동 키 설정

  const handleOpened = async () => {
    setCurrentPage(1);
    await fetchLicenseApps(1);
  };

  const handleClose = async () => {
    toggleShow();
  };

  const fetchLicenseApps = async (page, size = perPage) => {
    setLoading(true);
    // console.log(moment(sDate).format('YYYY.MM.DD'));
    // console.log(moment(eDate).format('YYYY.MM.DD'));
    let params = {
      areaCd: areaCodeRecoil,
      licenseNo: licenseNo,
      umd: umd,
      ri: ri,
      name: name,
      place: place,
      purpose: purpose,
      // expirDate: expirDate,
      sDate: moment(sDate).isValid() ? moment(sDate).format('YYYY-MM-DD') : '',
      eDate: moment(eDate).isValid() ? moment(eDate).format('YYYY-MM-DD') : '',
      page: page,
      sizePerPage: size,
    };
    await agent.DataInfo.fetchLicenseApps(params)
      .then(({ totCnt, totPages, resultList, result }) => {
        if (result === 'success') {
          setTotalRows(totCnt);
          setDataList(resultList);
          // console.log(resultList);
        } else if (result === 'fail') {
          setTotalRows(0);
          setDataList([]);
        }
      })
      .finally(() => setLoading(false));
  };

  const handlePageChange = (page) => {
    if (!loading) fetchLicenseApps(page).then((r) => setCurrentPage(page));
  };
  const handlePerRowsChange = (newPerPage, page) => {
    if (!loading) fetchLicenseApps(page, newPerPage).then((r) => setPerPage(newPerPage));
  };
  const handleSearchChange = (e) => {
    e.preventDefault();
    switch (e.target.id) {
      case 'licenseNo':
        setLicenseNo(e.target.value);
        break;
      case 'name':
        setName(e.target.value);
        break;
      case 'place':
        setPlace(e.target.value);
        break;
      case 'purpose':
        setPurpose(e.target.value);
        break;
      /*case 'expirDate':
        setExpirDate(e.target.value);
        break;*/
    }
    // e.preventDefault();
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
    fetchLicenseApps(1);
  };
  const handleClickSearchReset = () => {
    setUmd('');
    setRi('');
    setLicenseNo('');
    setSDate('');
    sDateRef.current.state.inputValue = '';
    setEDate('');
    eDateRef.current.state.inputValue = '';
    setName('');
    setPlace('');
    setPurpose('');
    setRis([]);
    setCurrentPage(1);
    // setExpirDate('');
    //fetchLicenseApps(1);
  };
  const handleKeyUpEvent = (e) => {
    if (e.keyCode === 13) {
      if (e.target.value !== '') {
        fetchLicenseApps(1);
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
          /*if (cList && cList.length > 0) {
            setRi(cList[0].value);
          }*/
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
    // 하천점용 이미지 업로드를 위한 licenseNo recoil 초기화
    // licenseNoDataSetHandler('');
    await handleToggleShowCon(v.dataSeq);
  };

  const handleButtonClick = async (e, lSeq) => {
    e.preventDefault();
    // console.log(lSeq);
    await dataSeqToMoveSetHandler(lSeq);
  };

  function toggleExpand(e) {
    e.preventDefault();
    setOpen(!open);
  }

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
        minHeight: '24px !important', // override the row height
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
      name: '관리번호',
      selector: (row) => row.dataSeq,
      sortable: false,
      width: '60px',
      right: true,
      style: { cursor: 'pointer' },
    },
    {
      name: '허가번호',
      selector: (row) => row.lLicenseNo,
      sortable: false,
      width: '115px',
      style: { cursor: 'pointer' },
    },
    {
      name: '점용기간',
      selector: (row) => row.lPeriod,
      sortable: false,
      width: '95px',
      center: true,
      style: { cursor: 'pointer' },
    },
    {
      name: '허가일',
      selector: (row) => row.lLicenseDate,
      sortable: false,
      width: '80px',
      center: true,
      style: { cursor: 'pointer' },
    },
    {
      name: '착공/준공',
      selector: (row) => '',
      sortable: false,
      width: '80px',
      style: { cursor: 'pointer' },
    },

    { name: '신청인', selector: (row) => row.lName, sortable: false, width: '180px', style: { cursor: 'pointer' } },
    {
      name: '점용장소',
      selector: (row) => row.lPlace,
      sortable: false,
      maxWidth: 'auto',
      style: { cursor: 'pointer' },
    },
    {
      name: '점용목적',
      selector: (row) => row.lPurpose,
      sortable: false,
      // width: '200px',
      style: { cursor: 'pointer' },
      maxWidth: 'auto',
    },
    {
      name: '점용물 구조',
      selector: (row) => row.lStruct,
      sortable: false,
      // width: '210px',
      maxWidth: 'auto',
      style: { cursor: 'pointer' },
    },
    {
      name: '지도이동',
      button: true,
      cell: (row) => (
        <button
          className='btn btn-xs btn-info m-0'
          onClick={(e) => {
            handleButtonClick(e, row.dataSeq);
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

  const DraggableModalDialog = ({ ...props }) => {
    return (
      <Draggable handle='.handle' enableUserSelectHack={true} allowAnyClick={false}>
        <ModalDialog {...props} />
      </Draggable>
    );
  };

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
      // dialogAs={DraggableModalDialog}
      backdropClassName='opacity-10'
      className='mt-5'
      // root={bodyRef.current || undefined}
    >
      {/*<Modal size='xl' show={show} onHide={handleClose} backdrop='static' keyboard={false} onEnter={handleOpened} dialogAs={DraggableModalDialog}>*/}
      <Modal.Header closeButton className='p-2 ps-4 pe-4' style={{ alignContent: 'space-evenly' }}>
        <Modal.Title>하천점용 정보</Modal.Title>
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
                <div className='col-12 ms-2 w-150px'>
                  <label className='form-label'>읍면동</label>
                  <Select values={cmbUmds} callback={handleChangeUmd} selected={umd} />
                </div>
                <div className='col-12 w-150px'>
                  <label className='form-label'>리</label>
                  <Select values={cmbRis} callback={handleChangeRi} selected={ri} />
                </div>

                <div className='col-12 ms-2'>
                  <label className='form-label'>허가번호</label>
                  <input
                    type='text'
                    className='form-control w-100px form-control-sm'
                    id='licenseNo'
                    value={licenseNo}
                    onChange={(e) => handleSearchChange(e)}
                    onKeyUp={handleKeyUpEvent}
                  />
                </div>
                <div className='col-12'>
                  <label className='form-label'>허가일자</label>
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
                <div className='col-12'>
                  <label className='form-label'>신청인</label>
                  <input
                    type='text'
                    className='form-control w-100px form-control-sm'
                    id='name'
                    value={name}
                    onChange={handleSearchChange}
                    onKeyUp={handleKeyUpEvent}
                  />
                </div>
                <div className='col-12'>
                  <label className='form-label'>점용장소</label>
                  <input
                    type='text'
                    className='form-control w-150px form-control-sm'
                    id='place'
                    value={place}
                    onChange={handleSearchChange}
                    onKeyUp={handleKeyUpEvent}
                  />
                </div>
                <div className='col-12'>
                  <label className='form-label'>점용목적</label>
                  <input
                    type='text'
                    className='form-control w-150px form-control-sm'
                    id='purpose'
                    value={purpose}
                    onChange={handleSearchChange}
                    onKeyUp={handleKeyUpEvent}
                  />
                </div>
                {/*<div className='col-12'>
                  <label className='form-label'>만료일 조회</label>
                  <div>
                    <select
                      className='form-select form-select-sm w-110px'
                      id='expirDate'
                      onChange={handleSearchChange}
                      value={expirDate}
                    >
                      <option value=''>만료일 선택</option>
                      <option value='-1'>오늘</option>
                      <option value='-3'>3일 이내</option>
                      <option value='-5'>5일 이내</option>
                      <option value='-7'>7일 이내</option>
                      <option value='-10'>10일 이내</option>
                      <option value='-15'>15일 이내</option>
                      <option value='-30'>30일 이내</option>
                      <option value='0'>만료기한 지남</option>
                    </select>
                  </div>
                </div>*/}
                <div className='col-12'>
                  <button className='btn btn-success rounded-3 mt-4 text-center w-80px' onClick={handleClickSearch}>
                    검색
                  </button>
                </div>
                <div className='col-12'>
                  <button
                    className='btn btn-warning rounded-3 mt-4 text-center w-80px'
                    onClick={handleClickSearchReset}
                  >
                    초기화
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
    </Modal>
  );
};

export default DataListModal;
