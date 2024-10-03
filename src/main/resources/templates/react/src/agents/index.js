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
// 캐릭터 정보

const CharacterInfo = {
    fetchCharacters: (values = {}) => requests.get([`/characters?`, `searchWrd=${values.searchWrd}`].join('')),

};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 태그 정보

const TagInfo = {
    fetchTags: (values = {}) => requests.get([`/tags?`, `searchWrd=${values.effectYn}`].join('')),

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


export default {
    UsrInfo,
    BrdInfo,
    DocFileInfo,
    CmnInfo,
    LoginInfo,
    CharacterInfo,
    TagInfo
};
