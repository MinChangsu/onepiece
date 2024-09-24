import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelBody } from '../../../components/panel/panel';
import { AppSettings } from '../../../config/app-settings';
import { Tree } from 'react-arborist';
import CmnStdCdRgtModal from './cmnStdCdRgtModal';
import agent from '../../../agents';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useRecoilState } from 'recoil';
import loginState from '../../../store/loginState';

const CmnStdCd = () => {
  const context = useContext(AppSettings);
  const treeRef = useRef();
  const [treeData, setTreeData] = useState([]);
  const [isViewModal, setIsViewModal] = useState(false);
  // const [stdSeq, setStdSeq] = useState(0);
  const [loginInfo] = useRecoilState(loginState);

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

    fetchStdCds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // componentDidUpdate
  // useEffect(() => {
  //   console.log("componentDidUpdate");
  // });

  // componentWillReceiveProps
  useEffect(() => {
    // console.log('Prop Received: ', props.data);
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 목록 조회
  const fetchStdCds = () => {
    let params = {
      prntCd: 'ROOT',
    };
    agent.CmnInfo.fetchStdCds(params)
      .then(({ resultList, result }) => {
        if (result === 'success') {
          setTreeData(resultList);
        } else if (result === 'fail') {
          setTreeData([]);
        }
      })
      .finally();
  };
  // 상세 조회
  const fetchStdCd = (seq) => {
    // console.log(seq);
    agent.CmnInfo.fetchStdCd(seq)
      .then(({ resultData, result }) => {
        if (result === 'success') {
          handleSetData(resultData);
        } else if (result === 'fail') {
          handleSetData(undefined);
        }
      })
      .finally();
  };
  // 업데이트
  const updateStdCd = (val) => {
    if (!val || !val.seq || !val.cd || !val.cdNm) {
      alert('먼저 정보를 등록해주세요.');
      return;
    }
    agent.CmnInfo.postStdCd(val)
      .then((data) => {
        let rtn = JSON.parse(data.text);
        //console.log(rtn);
        if (rtn.result === 'success') {
          alert('수정되었습니다.');
          fetchStdCds();
          handleClickReset();
        } else if (rtn.result === 'fail') {
          alert('오류가 발생했습니다.');
          fetchStdCds();
        }
      })
      .finally();
  };

  // 영구삭제

  const handleToggleShow = () => {
    setIsViewModal((p) => !p);
  };

  const handleTreeSelect = (e) => {
    if (e && e.length > 0) {
      // console.log(e[0].id, e[0].data['seq']);
      fetchStdCd(e[0].data['seq']);
    }
  };

  const handleClickReset = () => {
    // setStdSeq(0);
    handleSetData(undefined);
    const tree = treeRef.current;
    tree.deselectAll();
  };

  const handleClickRootNodeInsert = () => {
    handleClickReset();
    handleToggleShow();
  };

  const handleClickSubNodeInsert = () => {
    handleToggleShow();
  };

  const handleDeleteStdCd = () => {
    let curCd = formik.values['cd'];
    if (curCd && curCd !== '') {
      // 하위 노드 확인
      agent.CmnInfo.hasChildStdCd(curCd)
        .then((data) => {
          if (data.result > 0) {
            alert('하위 코드가 있습니다. 먼저 하위코드를 삭제해주세요.');
          } else {
            let seq = formik.values['seq'];
            agent.CmnInfo.deleteStdCd(curCd).then((data) => {
              if (data.result === 'success') {
                alert('정상적으로 삭제되었습니다.');
                handleClickReset();
                fetchStdCds();
              } else {
                alert('오류가 발생했습니다.');
              }
            });
          }
        })
        .finally();
    }
  };

  const handleChangeUseYn = (e) => {
    let v = e.target.checked ? 'Y' : 'N';
    formik.setFieldValue('useYn', v);
  };

  const Node = ({ node, style, dragHandle }) => {
    return (
      <div className='node-container' style={style} ref={dragHandle}>
        <div className='node-content' onClick={() => node.isInternal && node.toggle()}>
          {node.children.length > 0 ? (
            <>{node.isOpen ? <i className='fa fa-folder-open' /> : <i className='fa fa-folder-closed' />}</>
          ) : (
            <i className='fa fa-circle-chevron-right' />
          )}
          <span className={`m-2 ${node.state.isSelected ? 'bg-danger white' : ''}`}>
            <span>{node.data.name}</span>
          </span>
        </div>
      </div>
    );
  };

  // formik ////////////////////////////////////////////////////////////////////////////////
  const validateSchema = Yup.object().shape({
    cd: Yup.string().min(2, '대문자 2글자 숫자 2~19글자로 조합해주세요').required('코드를 입력해주세요.'),
    cdNm: Yup.string().required('코드명을 입력해주세요.'),
  });

  const formik = useFormik({
    initialValues: {
      seq: '',
      prntCd: '',
      cd: '',
      cdNm: '',
      lvl: '',
      useYn: '',
      regDt: '',
      memo: '',
    },
    validationSchema: validateSchema,
    onSubmit: (values) => {
      updateStdCd(values);
    },
  });

  const handleSetData = (val) => {
    if (val) {
      // console.log(val);
      formik.setFieldValue('seq', val.seq);
      formik.setFieldValue('prntCd', val.prntCd);
      formik.setFieldValue('cd', val.cd);
      formik.setFieldValue('cdNm', val.cdNm);
      formik.setFieldValue('lvl', val.lvl);
      formik.setFieldValue('useYn', val.useYn);
      formik.setFieldValue('regDt', val.regDt);
      formik.setFieldValue('memo', val.memo);
    } else {
      formik.setFieldValue('seq', '');
      formik.setFieldValue('prntCd', '');
      formik.setFieldValue('cd', '');
      formik.setFieldValue('cdNm', '');
      formik.setFieldValue('lvl', '');
      formik.setFieldValue('useYn', '');
      formik.setFieldValue('regDt', '');
      formik.setFieldValue('memo', '');
    }
  };

  // formik ////////////////////////////////////////////////////////////////////////////////

  return (
    <div>
      <ol className='breadcrumb float-xl-end me-3'>
        <li className='breadcrumb-item'>
          <Link to='/sys'>Home</Link>
        </li>
        <li className='breadcrumb-item'>기본 관리</li>
        <li className='breadcrumb-item active'>공통코드 관리</li>
      </ol>
      <h1 className='page-header ms-3 mb-2 pt-2'>공통코드 관리</h1>
      <Panel>
        <PanelBody>
          <div className='row'>
            <div className='widget widget-stats w-500px bg-secondary'>
              <div className='stats-content'>
                <Tree
                  className='Tree'
                  data={treeData}
                  openByDefault={false}
                  disableDrop={true}
                  disableDrag={true}
                  indent={15}
                  rowHeight={24}
                  onSelect={handleTreeSelect}
                  ref={treeRef}
                  // paddingBottom={10}
                  width={600}
                  height={600}
                  // overscanCount={1}
                >
                  {Node}
                </Tree>
                <span className='d-flex justify-content-end mt-4'>
                  <button className='btn btn-primary fw-bold me-3' onClick={handleClickReset}>
                    코드선택해제
                  </button>
                  <button className='btn btn-success fw-bold me-3' onClick={handleClickRootNodeInsert}>
                    신규등록
                  </button>
                  <button className='btn btn-success fw-bold' onClick={handleClickSubNodeInsert}>
                    하위코드등록
                  </button>
                </span>
              </div>
            </div>
            <div className='widget w-50 ms-3'>
              <Panel className='mb-0 w-100'>
                <PanelBody className='pb-0'>
                  <div className='d-flex justify-content-between'>
                    <div>
                      <h4 className='card-title fw-bold'>코드 상세 정보</h4>
                      <p className='card-title-desc'>코드 정보를 수정할 수 있습니다.</p>
                    </div>
                  </div>

                  <form id='updFrm'>
                    <div className='row'>
                      <div className='col-6'>
                        <div className='form-group'>
                          <label htmlFor='seq'>시퀀스번호</label>
                          <input
                            type='text'
                            className='form-control'
                            id='seq'
                            readOnly
                            disabled
                            {...formik.getFieldProps('seq')}
                          />
                        </div>
                      </div>
                      <div className='col-6'>
                        <div className='form-group'>
                          <label htmlFor='prntCd'>상위코드</label>
                          <input
                            type='text'
                            className='form-control'
                            id='prntCd'
                            readOnly
                            disabled
                            {...formik.getFieldProps('prntCd')}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='row mt-2'>
                      <div className='col-6'>
                        <div className='form-group'>
                          <label htmlFor='cd'>
                            코드&nbsp;<span className='text-danger'>*</span>
                          </label>
                          <input
                            className='form-control'
                            type='text'
                            id='cd'
                            placeholder='대문자 2글자 숫자 2~19글자로 조합해주세요.'
                            maxLength='20'
                            {...formik.getFieldProps('cd')}
                          />
                          {formik.touched.cd && formik.errors.cd && (
                            <span className='text-danger' role='alert'>
                              {formik.errors.cd}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='col-6'>
                        <div className='form-group'>
                          <label htmlFor='cdNm'>
                            코드명&nbsp;<span className='text-danger'>*</span>
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            id='cdNm'
                            placeholder='2 ~ 30자 내로 작성해주세요.'
                            maxLength='30'
                            {...formik.getFieldProps('cdNm')}
                          />
                          {formik.touched.cdNm && formik.errors.cdNm && (
                            <span className='text-danger' role='alert'>
                              {formik.errors.cdNm}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='row mt-2'>
                      <div className='col-3'>
                        <div className='form-group'>
                          <label htmlFor='lvl'>코드레벨</label>
                          <input
                            type='text'
                            className='form-control'
                            id='lvl'
                            readOnly
                            disabled
                            {...formik.getFieldProps('lvl')}
                          />
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='form-group'>
                          <label htmlFor='useYn'>사용여부</label>
                          <div className='col-md-11'>
                            <div className='form-check mt-2'>
                              <input
                                className='form-check-input'
                                type='checkbox'
                                id='useYn'
                                checked={formik.values.useYn === 'Y'}
                                onChange={handleChangeUseYn}
                              />
                              <label className='form-check-label' htmlFor='useYn'>
                                사용
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='form-group'>
                          <label htmlFor='regDt'>등록일시</label>
                          <input
                            className='form-control'
                            id='regDt'
                            value=''
                            readOnly
                            disabled
                            {...formik.getFieldProps('regDt')}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='row mt-2'>
                      <div className='col-12'>
                        <div className='form-group'>
                          <label htmlFor='memo'>메모</label>
                          <textarea
                            className='form-control'
                            id='memo'
                            rows='6'
                            {...formik.getFieldProps('memo')}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </form>

                  <span className='mt-3 d-flex justify-content-end'>
                    <button id='deleteBtn' className='btn btn-danger fw-bold me-3' onClick={handleDeleteStdCd}>
                      영구삭제
                    </button>
                    <button className='btn btn-primary fw-bold w-100px' onClick={formik.handleSubmit}>
                      수정
                    </button>
                  </span>
                </PanelBody>
              </Panel>
            </div>
          </div>
        </PanelBody>
      </Panel>
      <CmnStdCdRgtModal
        show={isViewModal}
        toggleShow={handleToggleShow}
        reloadParentList={fetchStdCds}
        values={formik.values}
      />
    </div>
  );
};

export default CmnStdCd;
