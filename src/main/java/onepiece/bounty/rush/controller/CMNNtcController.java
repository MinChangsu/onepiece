package onepiece.bounty.rush.controller;

import onepiece.bounty.rush.common.FileUtil;
import onepiece.bounty.rush.domain.CMNFileDomain;
import onepiece.bounty.rush.domain.CMNNtcDomain;
import onepiece.bounty.rush.domain.CMNPdsDomain;
import onepiece.bounty.rush.repository.CMNBrdRepo;
import onepiece.bounty.rush.repository.CMNFileRepo;
import onepiece.bounty.rush.service.CMNLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

/**
 * @Class Name : CMNNtcController.java
 * @Description : 공지사항 정보
 * @Modification Information
 *
 *   수정일         수정자      수정내용
 *   -----------    --------    -------------------------------------------------------------------------
 *
 * @author
 * @since 2023. 12. 04.
 * @version
 * @see
 *
 */

@RestController
@RequestMapping("/api/cmn")
public class CMNNtcController {

    @Value("${custom.path.files}")
    private String SYSTEM_FILE_PATH;

    private final CMNBrdRepo cmnBrdRepo;

    private final CMNFileRepo cmnFileRepo;

    private static final Logger LOG =  LoggerFactory.getLogger(CMNNtcController.class);

    @Autowired
    public CMNNtcController(CMNBrdRepo cmnBrdRepo,CMNFileRepo cmnFileRepo) {
        this.cmnBrdRepo = cmnBrdRepo;
        this.cmnFileRepo = cmnFileRepo;
    }

    static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");


    // 공지사항 목록
    @GetMapping(value = "/ntcs")
    public HashMap<String, Object> listNtcs(@RequestParam(defaultValue = "") String searchWrd,
                                            @RequestParam(defaultValue = "") String useYn,
                                            @RequestParam(defaultValue = "1") String page,
                                            @RequestParam(defaultValue = "10") String size) throws Exception {

        HashMap<String, Object> rtn = new HashMap<>();
        int totCnt = 0;
        int totPages = 0;
        List<HashMap<String, Object>> resultList = new ArrayList<>();
        String result = "fail";

        try {
            CMNNtcDomain domain = new CMNNtcDomain();
            domain.setSizePerPage(Integer.parseInt(size));
            domain.setPage((Integer.parseInt(page) - 1) * Integer.parseInt(size) + 1);
            domain.setUseYn(useYn);
            domain.setSearchWrd(searchWrd);

            totCnt = this.cmnBrdRepo.SELECT_CNT_NTCS(domain);
            if (totCnt > 0) {
                totPages = (int) Math.ceil(totCnt / Double.parseDouble(size));
                resultList = this.cmnBrdRepo.LIST_NTCS(domain);
            }
            result = "success";
        } catch (SQLException e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 목록 요청 SQL 오류 : {}", e.getMessage());
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 목록 요청 오류 : {}", e.getMessage());
        } finally {
            rtn.put("totCnt", totCnt);
            rtn.put("totPages", totPages);
            rtn.put("resultList", resultList);
            rtn.put("result", result);
        }
        return rtn;
    }

    @GetMapping(value = "/ntc")
    public HashMap<String, Object> selectNtc(String seq) throws Exception {
        HashMap<String, Object> rtn = new HashMap<>();
        String result = "fail";

        try {
            CMNFileDomain fvo = new CMNFileDomain();
            CMNNtcDomain pvo = new CMNNtcDomain();
            fvo.setBrdSeq(Integer.parseInt(seq));
            fvo.setBrdType("NTC");
            pvo.setSeq(Integer.parseInt(seq));

            CMNNtcDomain domain = this.cmnBrdRepo.SELECT_NTC(pvo);
            List<CMNFileDomain> cmnFileList = this.cmnFileRepo.SELECT_LIST_WITH_TYPE(fvo);
            rtn.put("resultData", domain);
            rtn.put("cmnFileList", cmnFileList);
            result = "success";
        } catch (SQLException e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 공지사항 요청 SQL 오류 : {}", e.getMessage());
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 공지사항 요청 오류 : {}", e.getMessage());
        } finally {
            rtn.put("result", result);
        }
        return rtn;
    }

    @PostMapping(value = "/ntc")
    public HashMap<String, Object> postNtc(CMNNtcDomain vo, HttpServletRequest req,BindingResult bindingResult) throws Exception {
        LOG.debug("■■■■■■■■■■■■■■■ 공지사항 저장 : postNtc(CMNNtcDomain : {}, req : {})", vo, req);
        HashMap<String, Object> rtn = new HashMap<>();
        String mode = "";
        //로그를 위한 변수
        String actionLog = "";
        String msgLog = "";
        String successLog = "성공";
        try {
            if (vo.getSeq() > 0) {
                mode = "수정";
                actionLog = "UPD";
                this.cmnBrdRepo.UPDATE_NTC(vo);
                List<CMNFileDomain> cmnFileDomainList = vo.getCmnFileDomainList();
                if(cmnFileDomainList!=null){
                    for(CMNFileDomain fileDomain : cmnFileDomainList){
                        // 첨부파일 서버 저장
                        if (!makeCmnFileToServer(fileDomain)) {
                            rtn.put("result", "fail");
                            successLog = "실패";
                            msgLog = "공지사항 제목: " + vo.getTitle() + (actionLog.equals("RGT") ? " 등록 " : " 수정 ") + successLog;
                            break;
                        }
                    }
                }
                msgLog = "공지사항 제목: " + vo.getTitle() + (actionLog.equals("RGT") ? " 등록 " : " 수정 ") + successLog;
            } else {
                mode = "등록";
                actionLog = "RGT";
                this.cmnBrdRepo.INSERT_NTC(vo);
                List<CMNFileDomain> cmnFileDomainList = vo.getCmnFileDomainList();
                if(cmnFileDomainList!=null) {
                    for (CMNFileDomain fileDomain : cmnFileDomainList) {
                        fileDomain.setBrdSeq(vo.getSeq());
                        // 첨부파일 서버 저장
                        if (!makeCmnFileToServer(fileDomain)) {
                            rtn.put("result", "fail");
                            successLog = "실패";
                            msgLog = "공지사항 제목: " + vo.getTitle() + (actionLog.equals("RGT") ? " 등록 " : " 수정 ") + successLog;
                            break;
                        }
                    }
                }
                msgLog = "공지사항 제목: " + vo.getTitle() + (actionLog.equals("RGT") ? " 등록 " : " 수정 ") + successLog;
            }
            rtn.put("result", "SUCCESS");
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 공지사항 {} 오류 : {}", mode, e.getMessage());
            successLog = "오류";
            msgLog = "공지사항 제목: " + vo.getTitle() + (actionLog.equals("RGT") ? " 등록 " : " 수정 ") + successLog;
            rtn.put("result", "FAIL");
            CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
        }
        LOG.debug("■■■■■■■■■■■■■■■ 공지사항 {} 완료 : {}", mode, rtn);
        CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
        return rtn;
    }

    @DeleteMapping(value = "/ntc")
    public HashMap<String, Object> deleteNtc(int seq, HttpServletRequest req) throws Exception {
        HashMap<String, Object> rtn = new HashMap<>();
        String result = "fail";
        //로그를 위한 변수
        String actionLog = "DEL";
        String msgLog = "";
        String successLog = "성공";
        CMNFileDomain fvo = new CMNFileDomain();
        CMNNtcDomain pvo = new CMNNtcDomain();
        fvo.setBrdSeq(seq);
        fvo.setBrdType("NTC");
        pvo.setSeq(seq);

        String title = cmnBrdRepo.SELECT_NTC(pvo).getTitle();
        pvo.setTitle(title);

        try {
            List<CMNFileDomain> cmnFileList = cmnFileRepo.SELECT_LIST_WITH_TYPE(fvo);
            for (CMNFileDomain vo : cmnFileList) {
                int deleted = cmnFileRepo.DELETE_FILE_INFO(vo.getSeq());

                String filePath = SYSTEM_FILE_PATH + "uploadCmnFiles/";
                String subPath = vo.getBrdType() + "/";
                filePath += subPath + vo.getCFileName();
                File delFile = new File(filePath);
                if (delFile.exists()) {
                    delFile.delete();
                }
            }
            this.cmnBrdRepo.DELETE_NTC(pvo);
            result = "success";

            msgLog = "공지사항 제목: " + pvo.getTitle() + " 삭제 " + successLog;
        } catch (SQLException e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 공지사항 삭제 SQL 오류 : {}", e.getMessage());
            successLog = "오류";
            msgLog = "공지사항 제목: " + pvo.getTitle() + " 삭제 " + successLog;
            CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 공지사항 삭제 오류 : {}", e.getMessage());
            successLog = "오류";
            msgLog = "공지사항 제목: " + pvo.getTitle() + " 삭제 " + successLog;
            CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
        } finally {
            rtn.put("result", result);
            CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
        }
        return rtn;
    }

    @GetMapping(value = "/mng/ntc")
    public HashMap<String, Object> fetchSiteInfo() {
        HashMap<String, Object> rtn = new HashMap<>();
        String result = "fail";

        try {
            String mainViewBoardYn = cmnBrdRepo.SELECT_SITE_INFO();
            rtn.put("main_view_board_yn", mainViewBoardYn);
            result = "success";
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 공지사항 표시 상태 조회 오류 : {}", e.getMessage());
        } finally {
            rtn.put("result", result);
        }
        return rtn;
    }

    @PostMapping(value = "/mng/ntc")
    public HashMap<String, Object> updateSiteInfo(@RequestBody HashMap<String, String> params) {
        HashMap<String, Object> rtn = new HashMap<>();
        String result = "fail";

        try {
            String mainViewBoardYn = params.get("main_view_board_yn");

            cmnBrdRepo.UPDATE_SITE_INFO(mainViewBoardYn);
            result = "success";
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 공지사항 표시 상태 조회 오류 : {}", e.getMessage());
        } finally {
            rtn.put("result", result);
        }
        return rtn;
    }










    @GetMapping(value = "/pdss")
    public HashMap<String, Object> listPdss(@RequestParam(defaultValue = "") String searchWrd,
                                            @RequestParam(defaultValue = "") String useYn,
                                            @RequestParam(defaultValue = "1") String page,
                                            @RequestParam(defaultValue = "10") String size) throws Exception {

        HashMap<String, Object> rtn = new HashMap<>();
        int totCnt = 0;
        int totPages = 0;
        List<HashMap<String, Object>> resultList = new ArrayList<>();
        String result = "fail";

        try {
            CMNPdsDomain domain = new CMNPdsDomain();
            domain.setSizePerPage(Integer.parseInt(size));
            domain.setPage((Integer.parseInt(page) - 1) * Integer.parseInt(size) + 1);
            domain.setUseYn(useYn);
            domain.setSearchWrd(searchWrd);

            totCnt = this.cmnBrdRepo.SELECT_CNT_PDSS(domain);
            if (totCnt > 0) {
                totPages = (int) Math.ceil(totCnt / Double.parseDouble(size));
                resultList = this.cmnBrdRepo.LIST_PDSS(domain);
            }
            result = "success";
        } catch (SQLException e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 목록 요청 SQL 오류 : {}", e.getMessage());
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 목록 요청 오류 : {}", e.getMessage());
        } finally {
            rtn.put("totCnt", totCnt);
            rtn.put("totPages", totPages);
            rtn.put("resultList", resultList);
            rtn.put("result", result);
        }
        return rtn;
    }

    @GetMapping(value = "/pds")
    public HashMap<String, Object> selectPds(String seq) throws Exception {
        HashMap<String, Object> rtn = new HashMap<>();
        String result = "fail";

        try {
            CMNFileDomain fvo = new CMNFileDomain();
            CMNPdsDomain pvo = new CMNPdsDomain();
            pvo.setSeq(Integer.parseInt(seq));
            fvo.setBrdSeq(Integer.parseInt(seq));
            fvo.setBrdType("PDS");
            CMNPdsDomain domain = this.cmnBrdRepo.SELECT_PDS(pvo);
            List<CMNFileDomain> cmnFileList = this.cmnFileRepo.SELECT_LIST_WITH_TYPE(fvo);
            rtn.put("resultData", domain);
            rtn.put("cmnFileList", cmnFileList);
            result = "success";
        } catch (SQLException e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 목록 요청 SQL 오류 : {}", e.getMessage());
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 목록 요청 오류 : {}", e.getMessage());
        } finally {
            rtn.put("result", result);
        }
        return rtn;
    }

    @PostMapping(value = "/pds")
    public HashMap<String, Object> postPds(CMNPdsDomain vo, HttpServletRequest req, BindingResult bindingResult) throws Exception {
        LOG.debug("■■■■■■■■■■■■■■■ 자료실 저장 : postPds(CMNPdsDomain : {}, req : {})", vo, req);
        HashMap<String, Object> rtn = new HashMap<>();
        String mode = "";
        //로그를 위한 변수
        String actionLog = "";
        String msgLog = "";
        String successLog = "성공";


        try {
            if (vo.getSeq() > 0) {
                mode = "수정";
                actionLog = "UPD";
                this.cmnBrdRepo.UPDATE_PDS(vo);
                List<CMNFileDomain> cmnFileDomainList = vo.getCmnFileDomainList();
                if(cmnFileDomainList!=null){
                    for(CMNFileDomain fileDomain : cmnFileDomainList){
                        // 첨부파일 서버 저장
                        if (!makeCmnFileToServer(fileDomain)) {
                            rtn.put("result", "fail");
                            successLog = "실패";
                            msgLog = "자료실: " + vo.getTitle() + (actionLog.equals("RGT") ? " 등록 " : " 수정 ") + successLog  ;
                            break;
                        }
                    }
                }

            } else {
                mode = "등록";
                actionLog = "RGT";
                this.cmnBrdRepo.INSERT_PDS(vo);
                List<CMNFileDomain> cmnFileDomainList = vo.getCmnFileDomainList();
                if(cmnFileDomainList!=null) {
                    for (CMNFileDomain fileDomain : cmnFileDomainList) {
                        fileDomain.setBrdSeq(vo.getSeq());
                        // 첨부파일 서버 저장
                        if (!makeCmnFileToServer(fileDomain)) {
                            rtn.put("result", "fail");
                            successLog = "실패";
                            msgLog = "자료실 제목: " + vo.getTitle() + (actionLog.equals("RGT") ? " 등록 " : " 수정 ") + successLog  ;
                            break;
                        }
                    }
                }
            }
            rtn.put("result", "SUCCESS");
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 자료실 {} 오류 : {}", mode, e.getMessage());
            successLog = "오류";
            msgLog = "자료실 제목: " + vo.getTitle() + (actionLog.equals("RGT") ? " 등록 " : " 수정 ") + successLog  ;
            rtn.put("result", "FAIL");
            CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
        } finally {
            LOG.debug("■■■■■■■■■■■■■■■ 자료실 {} 완료 : {}", mode, rtn);
            msgLog = "자료실 제목: " + vo.getTitle() + (actionLog.equals("RGT") ? " 등록 " : " 수정 ") + successLog  ;
            CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
        }
        return rtn;
    }

    @DeleteMapping(value = "/pds")
    public HashMap<String, Object> deletePds(int seq, HttpServletRequest req) throws Exception {
        HashMap<String, Object> rtn = new HashMap<>();
        String result = "fail";
        // 로그를 위한 변수
        String actionLog = "DEL";
        String msgLog = "";
        String successLog = "성공";
        CMNFileDomain fvo = new CMNFileDomain();
        CMNPdsDomain pvo = new CMNPdsDomain();
        fvo.setBrdSeq(seq);
        fvo.setBrdType("PDS");
        pvo.setSeq(seq);

        String title = cmnBrdRepo.SELECT_PDS(pvo).getTitle();
        pvo.setTitle(title);

        try {
            List<CMNFileDomain> cmnFileList = cmnFileRepo.SELECT_LIST_WITH_TYPE(fvo);
            for (CMNFileDomain vo : cmnFileList) {
                int deleted = cmnFileRepo.DELETE_FILE_INFO(vo.getSeq());

                String filePath = SYSTEM_FILE_PATH + "uploadCmnFiles/";
                String subPath = vo.getBrdType() + "/";
                filePath += subPath + vo.getCFileName();
                File delFile = new File(filePath);
                if (delFile.exists()) {
                    delFile.delete();
                }
            }
            this.cmnBrdRepo.DELETE_PDS(pvo);
            result = "success";
            msgLog = "자료실 제목: " + pvo.getTitle() + " 삭제 " + successLog;
        } catch (SQLException e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 자료실 삭제 SQL 오류 : {}", e.getMessage());
            successLog = "오류";
            msgLog = "자료실 제목: " + pvo.getTitle() + " 삭제 " + successLog;
            CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 자료실 삭제 오류 : {}", e.getMessage());
            successLog = "오류";
            msgLog = "자료실 제목: " + pvo.getTitle() + " 삭제 " + successLog;
            CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
        } finally {
            rtn.put("result", result);
            CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
        }
        return rtn;
    }



    @GetMapping(value = "/files")
    public HashMap<String, Object> selectFiles(int seq, String brdType, HttpServletRequest req) throws Exception {
        LOG.debug("■■■■■■■■■■■■■■■ 게시판 첨부파일 목록 : selectFiles(seq : {}, req : {})", seq, req);
        HashMap<String, Object> rtn = new HashMap<>();
        CMNFileDomain fvo = new CMNFileDomain();

        try {
            fvo.setBrdSeq(seq);
            fvo.setBrdType(brdType);
            List<CMNFileDomain> cmnFileList = this.cmnFileRepo.SELECT_LIST_WITH_TYPE(fvo);
            rtn.put("cmnFileList", cmnFileList);
            rtn.put("result", "success");
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 첨부파일 목록 오류 : {}", e.getMessage());
            rtn.put("result", "fail");
        }
        LOG.debug("■■■■■■■■■■■■■■■ 게시판 첨부파일 목록 완료 : {}", rtn);
        return rtn;
    }



    @DeleteMapping(value = "/file")
    public HashMap<String, Object> deleteCmnFile(int seq, HttpServletRequest req) throws Exception {
        LOG.debug("■■■■■■■■■■■■■■■ 게시판 첨부파일 삭제 : deleteCmnFile(seq : {}, req : {})", seq, req);
        HashMap<String, Object> rtn = new HashMap<>();
        try {
            CMNFileDomain param = new CMNFileDomain();
            param.setSeq(seq);
            CMNFileDomain vo = cmnFileRepo.SELECT_FILE_INFO(param);
            int deleted = cmnFileRepo.DELETE_FILE_INFO(seq);
            if (deleted > 0) {
                // 실제 파일 삭제
                String filePath = SYSTEM_FILE_PATH + "uploadCmnFiles/";
                String subPath = vo.getBrdType() + "/";
                filePath += subPath + vo.getCFileName();
                File delFile = new File(filePath);
                if (delFile.exists()) {
                    delFile.delete();
                }
            }
            rtn.put("result", "success");
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 파일 삭제 오류 : {}", e.getMessage());
            rtn.put("result", "fail");
        }
        LOG.debug("■■■■■■■■■■■■■■■ 게시판 파일 삭제 완료 : {}", rtn);
        return rtn;
    }

    @GetMapping(value = "/fileDown")
    public void DownloadCmnFile(int seq, HttpServletRequest req, HttpServletResponse res) throws Exception {
        try {
            CMNFileDomain param = new CMNFileDomain();
            param.setSeq(seq);
            CMNFileDomain vo = cmnFileRepo.SELECT_FILE_INFO(param);

            if (vo !=null) {
                // 실제 파일 삭제
                String filePath = SYSTEM_FILE_PATH + "uploadCmnFiles/";
                String subPath = vo.getBrdType() + "/";
                filePath += subPath + vo.getCFileName();
                File donwFile = new File(filePath);
                FileUtil fileUtil = new FileUtil();
                fileUtil.download(donwFile,vo.getCFileOrgName(),req,res);

            }

        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 게시판 첨부파일 다운 오류 : {}", e.getMessage());
        }
        LOG.debug("■■■■■■■■■■■■■■■ 게시판 첨부파일 다운 완료 : {}", "SUCCESS");
    }







    private boolean makeCmnFileToServer(CMNFileDomain vo) throws Exception {
        boolean rtn = false;
        // 파일명 생성
        // 파일내용 DB 저장
        // 파일을 서버에 저장

        try {
            // 실제 저장될 파일경로
            String filePath = SYSTEM_FILE_PATH + "uploadCmnFiles/";
            String subPath = vo.getBrdType() + "/";
            filePath += subPath;
            File folder = new File(filePath);
            if (!folder.exists()) {
                try {
                    folder.mkdirs();
                } catch (Exception e) {
                    LOG.error("■■■■■■■■■■■■■■■ 폴더생성 에러 : {} {}", filePath, e.getMessage());
                }
            }
            LOG.info("FILEPATH : " + filePath);

            LocalDateTime today = LocalDateTime.now();
            // 날짜를 YYYYMMDD 형식으로 포맷팅
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            String todayStr = today.format(formatter);
            Random random = new Random();
// 100 이상 200 미만의 정수 난수 생성
            String randomNumber = String.valueOf(random.nextInt(100) + 100);
            String fileNamePattern = todayStr+"_"+randomNumber+"_";
            for (MultipartFile file : vo.getFiles()) {
                // 파일명
                String ext ="";
                String saveName="";
                String fName = "";
                if(file.getOriginalFilename().lastIndexOf(".")!=0){
                    String [] fileNmList = file.getOriginalFilename().split("\\.");
                    ext = fileNmList[1];
                    fName =fileNmList[0];
                }

                ext = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1);
                saveName = fileNamePattern + fName + "." + ext;

                // 웹상에서 접근이 가능한 경로
                String webPath = "/attach/uploadCmnFiles/" + subPath;

                vo.setCFileName(saveName);
                vo.setCFilePath(webPath);
                vo.setCFileOrgName(file.getOriginalFilename());

                cmnFileRepo.INSERT_FILE_INFO(vo);
                LOG.info("FILENAME : " + fName);

                Path serverPath = Paths.get(filePath).toAbsolutePath().normalize().resolve(saveName);
                Files.copy(file.getInputStream(), serverPath, StandardCopyOption.REPLACE_EXISTING);
            }
            rtn = true;
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 첨부파일 DB저장 및 업로드 오류 : {}", e.getMessage());
        }

        return rtn;
    }
}