package onepiece.bounty.rush.controller;

import onepiece.bounty.rush.domain.USRDomain;
import onepiece.bounty.rush.repository.USRRepo;
import onepiece.bounty.rush.service.CMNLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * @Class Name : USRController.java
 * @Description : 유저 정보
 * @Modification Information
 *
 *   수정일         수정자      수정내용
 *   -----------    --------    -------------------------------------------------------------------------
 *
 * @author  민경서
 * @since 2023. 12. 22.
 * @version 1
 * @see
 *
 */
@RestController
@RequestMapping("/api")
public class USRController {

    private final USRRepo usrRepo;

    private static final Logger LOG =  LoggerFactory.getLogger(CMNNtcController.class);

    @Autowired
    public USRController(USRRepo usrRepo) {
        this.usrRepo = usrRepo;
    }

    // 사용자 목록
    @GetMapping(value = "/usrs")
    public HashMap<String, Object> listUsrs(@RequestParam(defaultValue = "") String searchWrd,
                                            @RequestParam(defaultValue = "1") String page,
                                            @RequestParam(defaultValue = "10") String size) throws Exception {

        HashMap<String, Object> rtn = new HashMap<>();
        int totCnt = 0;
        int totPages = 0;
        List<USRDomain> resultList = new ArrayList<>();
        String result = "FAIL";

        try {
            USRDomain domain = new USRDomain();
            domain.setSizePerPage(Integer.parseInt(size));
            domain.setPage((Integer.parseInt(page) - 1) * Integer.parseInt(size) + 1);
            domain.setSearchWrd(searchWrd);

            totCnt = this.usrRepo.SELECT_CNT_USRS(domain);
            if (totCnt > 0) {
                totPages = (int) Math.ceil(totCnt / Double.parseDouble(size));
                resultList = this.usrRepo.LIST_USRS(domain);
            }
            result = "SUCCESS";
        } catch (SQLException e) {
            LOG.error("■■■■■■■■■■■■■■■ 사용자 목록 요청 SQL 오류 : {}", e.getMessage());
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 사용자 목록 요청 오류 : {}", e.getMessage());
        } finally {
            rtn.put("totCnt", totCnt);
            rtn.put("totPages", totPages);
            rtn.put("resultList", resultList);
            rtn.put("result", result);
        }
        return rtn;
    }

    @GetMapping(value = "/usr")
    public HashMap<String, Object> selectUsr(@RequestParam(defaultValue = "0") String usrSeq) throws Exception {

        HashMap<String, Object> rtn = new HashMap<>();
        String result = "FAIL";
        USRDomain uVO = null;
        try {
            uVO = usrRepo.SELECT_USR_NOT_PW(Integer.parseInt(usrSeq));
            if(uVO!=null){
                result = "SUCCESS";
            }
        } catch (SQLException e) {
            LOG.error("■■■■■■■■■■■■■■■ 사용자 목록 요청 SQL 오류 : {}", e.getMessage());
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 사용자 목록 요청 오류 : {}", e.getMessage());
        } finally {
            rtn.put("resultData", uVO);
            rtn.put("result", result);
        }
        return rtn;
    }

    @PostMapping(value = "/dupCheckUsrInfo")
    public boolean dupCheckUsrInfo( @RequestBody USRDomain vo ) throws Exception {
        boolean result = false;
        try {
            int usrCnt = usrRepo.DUP_CHECK_USR_INFO(vo);
            if(usrCnt<1){
                result = true ;
            }

        } catch (SQLException e) {
            LOG.error("■■■■■■■■■■■■■■■ 사용자 아이디 중복체크 요청 SQL 오류 : {}", e.getMessage());
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 사용자 아이디 중복체크 요청 : {}", e.getMessage());
        }
        return result;
    }

    @PostMapping(value = "/usr")
    public HashMap<String, Object> postUsr(@RequestBody USRDomain vo, HttpServletRequest req, BindingResult bindingResult) throws Exception {
        LOG.debug("■■■■■■■■■■■■■■■ 사용자 저장 : postUsr(USRDomain : {}, req : {})", vo, req);
        HashMap<String, Object> rtn = new HashMap<>();
        String mode = "";
        String result = "FAIL";
        //로그를 위한 변수
        String actionLog = "";
        String msgLog = "";
        String successLog = "성공";

        try {

            // 레벨 4이하이면 ADMIN, 그렇지 않으면 USER
            if (vo.getLvl() <= 4) {
                vo.setAuthCode("ADMIN");
            } else {
                vo.setAuthCode("USER");
            }

            USRDomain existingUsr = null;

            if (vo.getUsrSeq() > 0) {
                existingUsr = this.usrRepo.SELECT_USR(vo.getUsrSeq());
                mode = "수정";
                actionLog = "UPD";

                StringBuilder changes = new StringBuilder();
                if (existingUsr != null) {
                    if (!existingUsr.getUsrNm().equals(vo.getUsrNm())) {
                        changes.append("이름, ");
                    }  if (!existingUsr.getUsrPw().equals(vo.getUsrPw())) {
                        changes.append("비밀번호, ");
                    }  if (!existingUsr.getEml().equals(vo.getEml())) {
                        changes.append("이메일, ");
                    }  if (!existingUsr.getTelno().equals(vo.getTelno())) {
                        changes.append("연락처, ");
                    }  if (!existingUsr.getUseYn().equals(vo.getUseYn())) {
                        changes.append("사용여부, ");
                    }  if (!(existingUsr.getLvl() == vo.getLvl())) {
                        changes.append("권한, ");
                    }

                    if(changes.length()>0){
                        msgLog += "수정된 항목: " + changes.substring(0, changes.length() - 2);
                    }
                }
                if(vo.getUsrPw().isEmpty()){
                    this.usrRepo.UPDATE_USR_NOT_PW(vo);
                }
                else{
                    this.usrRepo.UPDATE_USR(vo);
                }
            } else {
                mode = "등록";
                actionLog = "RGT";
                this.usrRepo.INSERT_USR(vo);
            }
            result = "SUCCESS";

        } catch (SQLException e) {
            successLog = "오류";
            LOG.error("■■■■■■■■■■■■■■■ 사용자 {} SQL 오류 : {}",mode, e.getMessage());
            msgLog = (vo.getAuthCode().equals("ADMIN") ? "관리자 " : "사용자 ") + vo.getUsrId() + (actionLog.equals("RGT") ? " 등록 " : " 수정 ") + successLog  ;
            CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
        } catch (Exception e) {
            successLog = "오류";
            LOG.error("■■■■■■■■■■■■■■■ 사용자 {} 요청 : {}",mode, e.getMessage());
            msgLog = (vo.getAuthCode().equals("ADMIN") ? "관리자 " : "사용자 ") + vo.getUsrId() + (actionLog.equals("RGT") ? " 등록 " : " 수정 ") + successLog  ;
            CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
        } finally {
            rtn.put("result",result);
            msgLog = (vo.getAuthCode().equals("ADMIN") ? "관리자 " : "사용자 ") + vo.getUsrId() + (actionLog.equals("RGT") ? " 등록 " : " 수정 ") + successLog + (msgLog.isEmpty() ? "" : " | " + msgLog);
            CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
        }
        return rtn;
    }

}
