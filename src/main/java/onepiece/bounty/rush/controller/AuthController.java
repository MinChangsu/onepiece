package onepiece.bounty.rush.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import onepiece.bounty.rush.domain.USRAuthDomain;
import onepiece.bounty.rush.domain.USRDomain;
import onepiece.bounty.rush.repository.USRAuthRepo;
import onepiece.bounty.rush.repository.USRRepo;
import onepiece.bounty.rush.service.CMNLogService;
import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;
import java.util.*;

@RestController
public class AuthController {

    private static final Logger LOG = LoggerFactory.getLogger(AuthController.class);

    @Value("${myapp.loginFailCnt}")
    private int loginFailCnt;

    @Value("${server.port}")
    private String port;

    private USRRepo usrRepo;
    private USRAuthRepo usrAuthRepo;

    @Autowired
    public AuthController(USRRepo usrRepo,USRAuthRepo usrAuthRepo) {
        this.usrRepo = usrRepo;
        this.usrAuthRepo = usrAuthRepo;
    }


    @PostMapping(value = "/api/login")
    public HashMap<String, Object> login(@RequestBody USRDomain domain, HttpServletRequest req) throws Exception {
        HashMap<String, Object> rtn = new HashMap<>();
        //로그를 위한 변수
        String actionLog = "LOGIN";
        String msgLog = "";
        String successLog = "성공";

        LOG.info("■■■■■■■■■■■■■■■ 로그인 시작 : login(USRDomain : {}, req : {})", domain, req);

        try {

            //PrivateKey privateKey = (PrivateKey) req.getSession().getAttribute("__rsaPrivateKey__");

            //String decryptedUserID = RSA.decryptRsa(privateKey, domain.getUserId());
            //domain.setUserId(decryptedUserID);
            //String decryptedMemPwd = RSA.decryptRsa(privateKey, domain.getMemPwd());

//            String sha256MemPwd = keyEncrypt.getHex(domain.getMemPwd(), domain.getUserId());
//            domain.setMemPwd(sha256MemPwd);

            USRDomain usrVO = usrRepo.SELECT_LOGIN_USR_WITH_ID(domain.getUsrId());
            if (usrVO == null) {
                String log = domain.getUsrId() + " 님의 계정이 없습니다.(원인: ID 불일치)";
                rtn.put("msg", log);
                msgLog = domain.getUsrId() + " 님의 계정이 없습니다.(원인: ID 불일치)";
                LOG.error("■■■■■■■■■■■■■■■ 로그인 오류 {}",  "[AuthController] " + log);
                rtn.put("result", "fail");
            } else if (usrVO.getFailLgnCnt() >= loginFailCnt) {
                String log = domain.getUsrId() + "님의 로그인이 실패하였습니다.(원인: 로그인 시도 횟수 초과)";
                rtn.put("msg", log);
                msgLog = domain.getUsrId() + "님의 로그인이 실패하였습니다.(원인: 로그인 시도 횟수 초과)";
                LOG.error("■■■■■■■■■■■■■■■ 로그인 오류 {}", "[AuthController] " +log);
                rtn.put("result", "cntFail");
            } else {

                domain.setLvl(usrVO.getLvl());
                USRDomain loginVO = usrRepo.SELECT_LOGIN(domain);
                if (loginVO == null || loginVO.getUseYn().equals("N")) {
                    // 사용가능하면서 ID나 비밀번호 입력오류일 때만 로그인 실패 cnt 증가
                    if (loginVO == null) {
                        int loginFailCnt = usrVO.getFailLgnCnt() + 1;
                        usrVO.setFailLgnCnt(loginFailCnt);
                        usrRepo.UPDATE_USR_LOGIN_FAIL_CNT(usrVO);
                    }
                    String log = domain.getUsrId() + " 님의 로그인이 실패하였습니다.(원인: ID 또는 비밀번호 불일치)";
                    rtn.put("msg", log);
                    msgLog = domain.getUsrId() + " 님의 로그인이 실패하였습니다.(원인: ID 또는 비밀번호 불일치)";
                    LOG.error("■■■■■■■■■■■■■■■ 로그인 실패 {}", "[AuthController] " + log);
                    rtn.put("result", "fail");
                } else {
//                    loginVO.setUsrPw(domain.getUsrPw());
                    usrVO.setFailLgnCnt(0);
                    usrRepo.UPDATE_USR_LOGIN_FAIL_RESET(usrVO);  //  로그인 성공시 실패 카운트 리셋
                    String log = "[AuthController] " + domain.getUsrId() + "님이 로그인 하였습니다.";
                    msgLog = domain.getUsrId() + "님이 로그인 하였습니다.";

                    // 로그인 session 생성
                    req.getSession().setAttribute("gisLogin", loginVO);
                    // privateKey 삭제
                    req.getSession().removeAttribute("__rsaPrivateKey__");

                    // oAuth2 토큰 얻기
                    ResponseEntity<String> response = null;
                    RestTemplate restTemplate = new RestTemplate();

                    String credentials = "GIS_WEB_SYSTEM:CDDFB91DA563EF94EE9D50B7C43A233DF6306C8925532D6159EE332A0A87C194";
                    String encodedCredentials = new String(Base64.encodeBase64(credentials.getBytes()));

                    HttpHeaders headers = new HttpHeaders();
                    headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
                    headers.add("Authorization", "Basic " + encodedCredentials);

                    HttpEntity<String> request = new HttpEntity<String>(headers);

                    String access_token_url = "http://localhost:" + port + "/oauth/token";
                    access_token_url += "?username=" + loginVO.getUsrId() + "&password=" + loginVO.getUsrPw();
                    access_token_url += "&grant_type=password";
                    response = restTemplate.exchange(access_token_url, HttpMethod.POST, request, String.class);

                    ObjectMapper mapper = new ObjectMapper();
                    Map<String, String> tmap = mapper.readValue(response.getBody(), new TypeReference<Map<String, String>>(){});

                    // 접속 사용자 정보
                    HashMap<String, Object> usrInfo = new HashMap<>();

                    usrInfo.put("usrId", loginVO.getUsrId());
                    usrInfo.put("usrNm", loginVO.getUsrNm());
//                    memInfo.put("memEmail", loginVO.getMemEmail());
//                    memInfo.put("memTel", loginVO.getMemTel());
                    //memInfo.put("strCode", loginVO.getStrCode())itk;
                    usrInfo.put("lvl", loginVO.getLvl());
                    rtn.put("token", tmap.get("access_token"));
                    rtn.put("usrInfo", usrInfo);
//                    rtn.put("menuInfo", menuInfo);
                    rtn.put("result", "success");

                    LOG.info("■■■■■■■■■■■■■■■ 로그인 완료 : {}", rtn);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            successLog = "오류";
            msgLog = domain.getUsrId() + " 로그인 " + successLog  ;
            LOG.error("■■■■■■■■■■■■■■■ 로그인 오류 : {}", e.getMessage());
            CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
            rtn.put("msg", msgLog);
            rtn.put("result", "fail");
        }
        CMNLogService.connLog(req, req.getSession(), actionLog, msgLog);
        return rtn;
    }

    // 사용자 목록
    @GetMapping(value = "/api/usr/auths")
    public HashMap<String, Object> listUsrAuths(@RequestParam(defaultValue = "") String searchWrd,
                                            @RequestParam(defaultValue = "1") String page,
                                            @RequestParam(defaultValue = "10") String size) throws Exception {

        HashMap<String, Object> rtn = new HashMap<>();
        int totCnt = 0;
        int totPages = 0;
        List<USRDomain> resultList = new ArrayList<>();
        String result = "FAIL";

        try {
            USRAuthDomain domain = new USRAuthDomain();


            totCnt = usrAuthRepo.SELECT_CNT_USRAUTHS(domain);
            if (totCnt > 0) {
                totPages = (int) Math.ceil(totCnt / Double.parseDouble(size));
                resultList = usrAuthRepo.LIST_USRAUTHS(domain);
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


}
