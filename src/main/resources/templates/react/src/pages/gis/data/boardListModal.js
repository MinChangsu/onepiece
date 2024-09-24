import React, { useContext, useEffect, useRef, useState } from 'react';
import { Panel, PanelBody } from '../../../components/panel/panel';
import { AppSettings } from '../../../config/app-settings';
import { Collapse, Modal, ModalDialog } from 'react-bootstrap';
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/ko';
import DataTable from 'react-data-table-component';
import agent from '../../../agents';

const BoardListModal = (props) => {
  const { show, toggleShow } = props;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const context = useContext(AppSettings);
  // 공지사항
  const [ntcList, setNtcList] = useState([]);
  const [ntcCurrentPage, setNtcCurrentPage] = useState(1);
  const [ntcTotalRows, setNtcTotalRows] = useState(0);
  const [ntcPerPage, setNtcPerPage] = useState(5);

  // 자료실
  const [pdsList, setPdsList] = useState([]);
  const [pdsCurrentPage, setPdsCurrentPage] = useState(1);
  const [pdsTotalRows, setPdsTotalRows] = useState(0);
  const [pdsPerPage, setPdsPerPage] = useState(5);

  // 상세내용
  const [detailShow, setDetailShow] = useState(false);
  const [detailContent, setDetailContent] = useState({});

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

  const fetchNtcs = async (page, size = ntcPerPage) => {
    setLoading(true);
    let params = {
      searchWrd: '',
      useYn: 'Y',
      page: page,
      size: size,
    };
    await agent.BrdInfo.fetchNtcs(params)
      .then(({ totCnt, totPages, resultList, result }) => {
        if (result === 'success') {
          setNtcTotalRows(totCnt);
          setNtcList(resultList);
        } else if (result === 'fail') {
          setNtcTotalRows(0);
          setNtcList([]);
        }
      })
      .finally(() => setLoading(false));
  };

  const fetchPdss = async (page, size = pdsPerPage) => {
    setLoading(true);
    let params = {
      searchWrd: '',
      useYn: 'Y',
      page: page,
      size: size,
    };
    //console.log(params);
    await agent.BrdInfo.fetchPdss(params)
      .then(({ totCnt, totPages, resultList, result }) => {
        if (result === 'success') {
          setPdsTotalRows(totCnt);
          setPdsList(resultList);
        } else if (result === 'fail') {
          setPdsTotalRows(0);
          setPdsList([]);
        }
      })
      .finally(() => setLoading(false));
  };

  // 공지사항
  const handleNtcPageChange = (page) => {
    fetchNtcs(page).then((r) => setNtcCurrentPage(page));
  };
  const handleNtcClickRow = async (v) => {
    setDetailContent(v);
    setDetailShow(true);
  };

  // 자료실
  const handlePdsPageChange = (page) => {
    fetchPdss(page).then((r) => setPdsCurrentPage(page));
  };
  const handlePdsClickRow = async (v) => {
    setDetailContent(v);
    setDetailShow(true);
  };

  const handleClose = async () => {
    toggleShow();
  };

  const handleDetailClose = async () => {
    setDetailShow(false);
  };

  const handleOpened = async () => {
    // setCurrentPage(1);
    // await fetchLicenseApps(1);
    fetchNtcs(1);
    fetchPdss(1);
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

  const conditionalRowStyles = [
    {
      when: (row) => row.rowNo % 2 === 0,
      style: { backgroundColor: '#F5F5F6' },
    },
  ];

  const noticeColumns = [
    { name: '제목', selector: (row) => row.title, sortable: false, style: { cursor: 'pointer' } },
    {
      name: '등록일',
      selector: (row) => row.regDt.substring(0, 10),
      sortable: false,
      width: '150px',
      center: true,
      style: { cursor: 'pointer' },
    },
  ];

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop='true'
      // keyboard={true}
      onEnter={handleOpened}
      dialogClassName='board-list-modal'
      backdropClassName='opacity-10'
      className='mt-5'
    >
      <Modal.Header closeButton className='p-2 ps-4 pe-4' style={{ alignContent: 'space-evenly' }}>
        <Modal.Title className='h6'>
          <ul className='nav nav-pills'>
            <li className='nav-item'>
              <a href='#board-tab-1' data-bs-toggle='tab' className='nav-link active pt-2 pb-2'>
                <span className='d-sm-none'>공지사항</span>
                <span className='d-sm-block d-none'>공지사항</span>
              </a>
            </li>
            <li className='nav-item'>
              <a href='#board-tab-2' data-bs-toggle='tab' className='nav-link pt-2 pb-2'>
                <span className='d-sm-none'>자료실</span>
                <span className='d-sm-block d-none'>자료실</span>
              </a>
            </li>
          </ul>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='p-1'>
        <Collapse in={open}>
          <Panel className='mb-0'>
            <PanelBody className='p-0 docGrid'>
              <div className='tab-content panel rounded-0 rounded-bottom mb-0'>
                <div className='tab-pane fade active show' id='board-tab-1' name='board-tab'>
                  <DataTable
                    columns={noticeColumns}
                    customStyles={customStyle}
                    data={ntcList}
                    responsive
                    noDataComponent='데이터가 없습니다.'
                    striped={true}
                    dense
                    pagination
                    paginationServer
                    paginationComponentOptions={{ noRowsPerPage: true }}
                    paginationTotalRows={ntcTotalRows}
                    paginationDefaultPage={ntcCurrentPage}
                    paginationPerPage={ntcPerPage}
                    onChangePage={handleNtcPageChange}
                    conditionalRowStyles={conditionalRowStyles}
                    onRowClicked={handleNtcClickRow}
                  />
                </div>
                <div className='tab-pane fade' id='board-tab-2' name='board-tab'>
                  <DataTable
                    columns={noticeColumns}
                    customStyles={customStyle}
                    data={pdsList}
                    responsive
                    noDataComponent='데이터가 없습니다.'
                    striped={true}
                    dense
                    pagination
                    paginationServer
                    paginationComponentOptions={{ noRowsPerPage: true }}
                    paginationTotalRows={pdsTotalRows}
                    paginationDefaultPage={pdsCurrentPage}
                    paginationPerPage={pdsPerPage}
                    onChangePage={handlePdsPageChange}
                    conditionalRowStyles={conditionalRowStyles}
                    onRowClicked={handlePdsClickRow}
                  />
                </div>
              </div>
            </PanelBody>
          </Panel>
        </Collapse>
      </Modal.Body>

      <Modal
        show={detailShow}
        onHide={handleDetailClose}
        backdrop='true'
        // onEnter={handleDetailOpened}
        dialogClassName='board-list-modal'
        backdropClassName='opacity-50'
        style={{ marginTop: '320px' }}
      >
        <Modal.Header closeButton className='p-2 ps-4 pe-4'>
          <Modal.Title className='h6'>
            상세내용 {detailContent.title && ' [ ' + detailContent.title + ' ] '}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='p-1'>
          <Panel className='mb-0'>
            <PanelBody className='p-0 docGrid'>
              <div
                className='m-2'
                style={{ maxHeight: '350px', overflowY: 'auto' }}
                dangerouslySetInnerHTML={{ __html: detailContent.cn }}
              />
            </PanelBody>
          </Panel>
        </Modal.Body>
      </Modal>
    </Modal>
  );
};

export default BoardListModal;
