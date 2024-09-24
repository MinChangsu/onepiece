package onepiece.bounty.rush.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import onepiece.bounty.rush.domain.CMNLogDomain;
import onepiece.bounty.rush.domain.USRDomain;
import onepiece.bounty.rush.repository.CMNLogRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.net.InetAddress;

@Component
public class CMNLogService {

    private static CMNLogRepo cmnLogRepo;

    @Autowired
    public CMNLogService(CMNLogRepo repo) {
        cmnLogRepo = repo;
    }
    public static CMNLogDomain connLog(HttpServletRequest request, HttpSession session, String action) throws Exception {
        // action : LOGIN, VIEW, RGT, DEL, UPD

        CMNLogDomain vo =new CMNLogDomain();
        try {
            String logIp = InetAddress.getByName(request.getRemoteAddr()).getHostAddress();
            // 개발자 로컬 접속
//            if (!logIp.equals("0:0:0:0:0:0:0:1")) {

                String url = request.getServletPath();
                boolean isAdmin = AuthService.checkAuth(session, true, 5);     // 관리자 권한은 5부터 가지고있음
                String usrType = isAdmin ? "S" : "U";
                String usrId;
                String logType = url.contains("sys") ? "SYS" : "MAP";
                ObjectMapper objectMapper = new ObjectMapper();
                USRDomain mvo = (USRDomain) session.getAttribute("gisLogin")==null?objectMapper.readValue(request.getHeader("usrInfo"), USRDomain.class):(USRDomain) session.getAttribute("gisLogin");
                if (mvo != null) {
                    usrId = String.valueOf(mvo.getUsrId());
                } else {
                    usrId = "";
                }
                vo.setUsrType(usrType);
                vo.setUsrId(usrId);
                vo.setLogType(logType);
                vo.setLogAct(action);
                vo.setLogPath(url);
                vo.setLogIp(logIp);
                cmnLogRepo.INSERT_LOG(vo);
//            }
        } catch (Exception ex) {
            System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + ex.getMessage());
        }
        return vo;
    }
    public static CMNLogDomain connLog(HttpServletRequest request, HttpSession session, String action, String errMsg) throws Exception {
        // action : LOGIN, VIEW, RGT, DEL, UPD

        CMNLogDomain vo =new CMNLogDomain();
        try {
            // Null 체크 추가
            if (request == null) {
                throw new IllegalArgumentException("Request 객체가 null입니다.");
            }
            if (session == null) {
                throw new IllegalArgumentException("Session 객체가 null입니다.");
            }

            String logIp = InetAddress.getByName(request.getRemoteAddr()).getHostAddress();
            // 개발자 로컬 접속
//            if (!logIp.equals("0:0:0:0:0:0:0:1")) {

                String url = request.getServletPath();
                boolean isAdmin = AuthService.checkAuth(session, true, 5);     // 관리자 권한은 5부터 가지고있음
                String usrType = isAdmin ? "S" : "U";
                String usrId;
                String logType = url.contains("sys") ? "SYS" : "MAP";
                ObjectMapper objectMapper = new ObjectMapper();
                USRDomain mvo = (USRDomain) session.getAttribute("gisLogin")==null?objectMapper.readValue(request.getHeader("usrInfo"), USRDomain.class):(USRDomain) session.getAttribute("gisLogin");
                if (mvo != null) {
                    usrId = String.valueOf(mvo.getUsrId());
                } else {
                    usrId = "";
                }
                vo.setUsrType(usrType);
                vo.setUsrId(usrId);
                vo.setLogType(logType);
                vo.setLogAct(action);
                vo.setLogPath(url);
                vo.setLogIp(logIp);
                vo.setMsgRes(errMsg);
                cmnLogRepo.INSERT_LOG(vo);
//            }
        } catch (Exception ex) {
            String logIp = InetAddress.getByName(request.getRemoteAddr()).getHostAddress();
            String url = request.getServletPath();
            CMNLogDomain failLog = new CMNLogDomain();
            failLog.setUsrType("ERROR");
            failLog.setUsrId("system");
            failLog.setLogType("ERROR");
            failLog.setLogPath(url);
            failLog.setLogAct(action);
            failLog.setLogIp(logIp);
            failLog.setMsgRes(errMsg);
            cmnLogRepo.INSERT_LOG(failLog);
            System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + ex.getMessage());
        }
        return vo;
    }
}
