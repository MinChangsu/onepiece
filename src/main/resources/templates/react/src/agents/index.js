import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

// export const CONTEXT_ROOT = 'http://localhost:15271'; // 로컬서버
export const CONTEXT_ROOT = 'http://43.200.83.147'; // 실서버
const API_ROOT = CONTEXT_ROOT;
const superagent = superagentPromise(_superagent, global.Promise);
const agent = _superagent.agent();
const responseBody = (res) => res.body;
const tokenPlugin = (req) => {
  let token = window.sessionStorage.getItem('jwt');
  // console.log('session token >>>>>>>>>>>>>>>>> ' + token);
  if (token) req.set('Authorization', `Bearer ${token}`);
};
const handleErrors = (err) => {
  // let memInfoStore = new MEMInfoStore(null);
  // if (err && err.response && err.response.status === 401) memInfoStore.logout();
  return err;
};

/*const requests = {
  del: (url) =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).use(usrInfoPlugin).end(handleErrors).then(responseBody),
  get: (url) =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).use(usrInfoPlugin).end(handleErrors).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).use(usrInfoPlugin).end(handleErrors).then(body),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).use(usrInfoPlugin).end(handleErrors).then(body),
  upload: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).use(usrInfoPlugin).end(handleErrors).then(body),
  down: (url) =>
    superagent
      .get(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .use(usrInfoPlugin)
      .responseType('blob')
      .end(handleErrors)
      .then(responseBody),
};*/

const requests = {
  del: (url) => superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).end(handleErrors).then(responseBody),
  get: (url) => superagent.get(`${API_ROOT}${url}`).end(handleErrors).then(responseBody),
  put: (url, body) => superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).end(handleErrors).then(body),
  post: (url, body) => superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).end(handleErrors).then(body),
  upload: (url, body) => superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).end(handleErrors).then(body),
  down: (url) =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).responseType('blob').end(handleErrors).then(responseBody),
};




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 재산정보
const PropertyInfo = {
  postProperty: (obj) => requests.post(`/doc/property?`, obj),
  fetchProperty: (values = {}) => {
    const baseUrl = `/doc/property?`;
    const queryParams = [`pnu=${values.pnu}`, `&type=${values.type}`];
    if (values.page > 0) {
      queryParams.push(`&page=${values.page}`);
      queryParams.push(`&sizePerPage=${values.sizePerPage}`);
    }
    const url = [baseUrl, ...queryParams].join('');
    //console.log(url, 'url');
    return requests.get(url);
  },
  fetchBuildingInfo: (values = {}) =>
    requests.get([`/doc/buildingInfo?`, `&seq=${values.seq}`, `&ownerGbn=${values.ownerGbn}`].join('')),
  deleteProperty: (pnu) => requests.del(`/doc/property?pnu=${pnu}`),
  postPropertyUpload: (obj) => requests.post('/doc/mng/property?', obj),
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 대부정보
const LoanInfo = {
  postLoan: (obj) => requests.post(`/doc/loan?`, obj),
  fetchLoan: (values = {}) => requests.get([`/doc/loan?`, `pnu=${values.pnu}`].join('')),
  deleteLoan: (pnu) => requests.del(`/doc/loan?pnu=${pnu}`),
  postLoanHist: (obj) => requests.post(`/doc/loanHist?`, obj),
  fetchLoanHist: (seq) => requests.get(`/doc/loanHist?seq=${seq}`),
  deleteLoanHist: (seq) => requests.del(`/doc/loanHist?seq=${seq}`),
  fetchLoanHists: (values = {}) =>
    requests.get(
      [`/doc/loanHists?`, `&pnu=${values.pnu}`, `&page=${values.page}`, `&sizePerPage=${values.sizePerPage}`].join(''),
    ),
};

const CharacterInfo = {
    fetchCharacters: (values = {}) => requests.get([`/characters?`, `searchWrd=${values.searchWrd}`].join('')),

};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 첨부파일 정보
const DocFileInfo = {
  postDataUpload: (obj) => requests.upload(`/doc/dataUpload?`, obj),
  fetchDocFiles: (values = {}) =>
    requests.get([`/doc/files?`, `dataSeq=${values.dataSeq}`, `&iType=${values.iType}`].join('')),
  deleteDocFile: (obj) => requests.del(`/doc/file?seq=${obj.seq}&areaCd=${obj.areaCd}`),

  postPropertyDataUpload: (obj) => requests.upload(`/doc/property/dataUpload?`, obj),
  fetchDocPropertyFiles: (values = {}) => requests.get([`/doc/property/files?`, `pnu=${values.pnu}`].join('')),
  deleteDocPropertyFile: (obj) => requests.del(`/doc/property/file?seq=${obj.seq}&areaCd=${obj.areaCd}`),
  downloadPropertyFile: (seq) => requests.down(`/doc/property/fileDown?seq=${seq}`),
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 회원정보
const UsrInfo = {
  login: (obj) => requests.post(`/login`, obj),
  fetchUsrs: (values = {}) =>
    requests.get([`/usrs?`, `&searchWrd=${values.searchWrd}`, `&page=${values.page}`, `&size=${values.size}`].join('')),
  fetchUsr: (seq) => requests.get([`/usr?`, `&usrSeq=${seq}`].join('')),
  postDupCheckUsrInfo: (obj) => requests.post(`/dupCheckUsrInfo?`, obj),
  postUsr: (obj) => requests.post(`/usr?`, obj),
  fetchAuths: (values = {}) =>
    requests.get(
      [`/usr/auths?`, `&searchWrd=${values.searchWrd}`, `&page=${values.page}`, `&size=${values.size}`].join(''),
    ),
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 게시판 정보
const BrdInfo = {
  // 공지사항
  // 목록
  fetchNtcs: (values = {}) =>
    requests.get(
      [
        `/cmn/ntcs?`,
        `&searchWrd=${values.searchWrd}`,
        `&useYn=${values.useYn}`,
        `&page=${values.page}`,
        `&size=${values.size}`,
      ].join(''),
    ),
  fetchNtc: (seq) => requests.get([`/cmn/ntc?`, `&seq=${seq}`].join('')),
  postNtc: (obj) => requests.post(`/cmn/ntc?`, obj),
  deleteNtc: (seq) => requests.del([`/cmn/ntc?`, `&seq=${seq}`].join('')),
  // 자료실
  fetchPdss: (values = {}) =>
    requests.get(
      [
        `/cmn/pdss?`,
        `&searchWrd=${values.searchWrd}`,
        `&useYn=${values.useYn}`,
        `&page=${values.page}`,
        `&size=${values.size}`,
      ].join(''),
    ),
  fetchPds: (seq) => requests.get([`/cmn/pds?`, `&seq=${seq}`].join('')),
  postPds: (obj) => requests.post(`/cmn/pds?`, obj),
  deletePds: (seq) => requests.del([`/cmn/pds?`, `&seq=${seq}`].join('')),
  //공통
  deleteCmnFile: (seq) => requests.del(`/cmn/file?seq=${seq}`),
  downloadCmnFile: (seq) => requests.down(`/cmn/fileDown?seq=${seq}`),
  fetchCmnFiles: (seq, brdType) => requests.get(`/cmn/files?seq=${seq}&brdType=${brdType}`),
  fetchSiteInfo: () => requests.get('/cmn/mng/ntc'),
  updateSiteInfo: (param) => requests.post('/cmn/mng/ntc', param),
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 주소 정보
const AddrInfo = {
  fetchUmds: (areaCd) => requests.get(`/cmn/addr/umds?areaCd=${areaCd}`),
  fetchRis: (areaCd, emdCd) => requests.get(`/cmn/addr/ris?areaCd=${areaCd}&emdCd=${emdCd}`),
  fetchJibuns: (values = {}) =>
    requests.get(
      [
        `/cmn/addr/jibuns?`,
        `&areaCd=${values.areaCd}`,
        `&emdCd=${values.emdCd}`,
        `&riCd=${values.riCd}`,
        `&jibun=${values.jibun}`,
        `&bobn=${values.bobn}`,
        `&bubn=${values.bubn}`,
        `&san=${values.san}`,
        `&propertyYn=${values.propertyYn}`,
        `&loanYn=${values.loanYn}`,
      ].join(''),
    ),
  fetchAddrDetailFromPnu: (areaCd, pnu) => requests.get(`/cmn/addr/addessDetailFromPnu?areaCd=${areaCd}&pnu=${pnu}`),
  fetchAddrFromPnu: (areaCd, pnu) => requests.get(`/cmn/addr/addessFromPnu?areaCd=${areaCd}&pnu=${pnu}`),
  fetchUmdRiNm: (values) =>
    requests.get(`/cmn/addr/umdriNm?longitudeX=${values.longitudeX}&longitudeY=${values.longitudeY}`),
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 공통코드, 이력정보
const CmnInfo = {
  //공통코드
  fetchStdCds: (obj = {}) => requests.get([`/cmn/stdcds?`, `&prntCd=${obj.prntCd}`].join('')),
  fetchStdCd: (seq) => requests.get([`/cmn/stdcd?`, `seq=${seq}`].join('')),
  postStdCd: (obj) => requests.post(`/cmn/stdcd?`, obj),
  dupChkStdCd: (obj) => requests.post(`/cmn/dupChkStdcd?`, obj),
  hasChildStdCd: (cd) => requests.get([`/cmn/hasChildStdCd?`, `cd=${cd}`].join('')),
  deleteStdCd: (cd) => requests.del(`/cmn/stdcd?cd=${cd}`),
  fetchStdcdsByParent: (prntCd) => requests.get(`/cmn/stdcdsByParent?prntCd=${prntCd}`),

  // 로그 목록
  // 목록
  fetchLogs: (values = {}) =>
    requests.get(
      [
        `/cmn/logs?`,
        `&searchWrd=${values.searchWrd}`,
        `&page=${values.page}`,
        `&size=${values.size}`,
        `&logAct=${values.logAct}`,
      ].join(''),
    ),
};

const LoginInfo = {
  login: (obj) => requests.post(`/login`, obj),
};

// 착공준공 정보
const WorkInfo = {
  fetchWorks: (values = {}) =>
    requests.get(
      [`/doc/works?`, `&dataSeq=${values.dataSeq}`, `&page=${values.page}`, `&sizePerPage=${values.sizePerPage}`].join(
        '',
      ),
    ),
  fetchWork: (values = {}) => requests.get([`/doc/work?`, `wSeq=${values.wSeq}`].join('')),
  postWork: (obj) => requests.post(`/doc/work?`, obj),
  deleteWork: (val) => requests.del(`/doc/work?wSeq=${val}`),
};

// 변경이력 정보
const HistoryInfo = {
  fetchHistories: (values = {}) =>
    requests.get(
      [`/doc/histories?`, `&laSeq=${values.laSeq}`, `&page=${values.page}`, `&sizePerPage=${values.sizePerPage}`].join(
        '',
      ),
    ),
  fetchHistory: (values = {}) => requests.get([`/doc/history?`, `hSeq=${values.hSeq}`].join('')),
  postHistory: (obj) => requests.post(`/doc/history?`, obj),
  deleteHistory: (val) => requests.del(`/doc/history?hSeq=${val}`),
};

// 통계 정보
const StatInfo = {
  fetchLicenseWithUmd: (umd) => requests.get(`/stat/licenseWithUmd?umd=${umd}`),
  fetchLogInfo: (obj) =>
    requests.get(
      [`/stat/logInfo?`, `&startDate=${obj?.startDate}`, `&endDate=${obj?.endDate}`, `&unit=${obj?.unit}`].join(''),
    ),
};

// 연계정보
const ConnInfo = {
  fetchConn: () => requests.get(`/cmn/conn`),
  postConn: (obj) => requests.post(`/cmn/conn?`, obj),
};

const IllegalInfo = {
  postIllegal: (obj) => requests.post(`/doc/illegal?`, obj),
  fetchIllegals: (values = {}) =>
    requests.get(
      [
        `/doc/illegals?`,
        `&areaCd=${values.areaCd}`,
        `&umd=${values.umd}`,
        `&ri=${values.ri}`,
        `&iOwner=${values.iOwner}`,
        `&sDate=${values.sDate}`,
        `&eDate=${values.eDate}`,
        `&page=${values.page}`,
        `&sizePerPage=${values.sizePerPage}`,
      ].join(''),
    ),
  fetchIllegal: (values = {}) => requests.get([`/doc/illegal?`, `seq=${values.seq}`].join('')),
  deleteIllegal: (val) => requests.del(`/doc/illegal?seq=${val}`),
};

const KrasInfo = {
  krasBase: (pnu) => requests.get(`/kras/krasBase?pnu=${pnu}`),
  krasToji: (pnu) => requests.get(`/kras/krasToji?pnu=${pnu}`),
  krasBldg: (pnu) => requests.get(`/kras/krasBldg?pnu=${pnu}`),
  krasPlan: (pnu) => requests.get(`/kras/krasPlan?pnu=${pnu}`),
  krasMoney: (pnu) => requests.get(`/kras/krasMoney?pnu=${pnu}`),
};

const LayerInfo = {
  fetchLayers: () => requests.get(`/layer/layers`),
  postLayer: (obj) => requests.post(`/layer/layer`, obj),
  initLayer: () => requests.post(`/layer/layerInit`),
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 레이어관리정보
const LayerMngInfo = {
  postLayerMng: (obj) => requests.put(`/layer/mng/layer`, obj),
  fetchLayerMngs: (obj) =>
    requests.get(
      [
        `/layer/mng/layers?`,
        `&searchWrd=${obj?.searchWrd}`,
        `&useYn=${obj?.useYn}`,
        `&page=${obj?.page}`,
        `&sizePerPage=${obj?.size}`,
      ].join(''),
    ),
  fetchLayerMng: (obj) => requests.post(`/layer/mng/layer`, obj),
  deleteLayerMng: (val) => requests.del(`/layer/mng/layer?lSeq=${val}`),
};

export default {
  UsrInfo,
  BrdInfo,
  AddrInfo,
  DocFileInfo,
  CmnInfo,
  LoginInfo,
  WorkInfo,
  HistoryInfo,
  StatInfo,
  ConnInfo,
  KrasInfo,
  PropertyInfo,
  LoanInfo,
  IllegalInfo,
  LayerInfo,
  LayerMngInfo,
  CharacterInfo
};
