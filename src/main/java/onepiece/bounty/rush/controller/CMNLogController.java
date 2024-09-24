package onepiece.bounty.rush.controller;

import onepiece.bounty.rush.domain.CMNLogDomain;
import onepiece.bounty.rush.repository.CMNLogRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * @Class Name : CMNLogController.java
 * @Description : 접속로그 정보
 * @Modification Information
 *
 *   수정일         수정자      수정내용
 *   -----------    --------    -------------------------------------------------------------------------
 *
 * @author
 * @since 2024. 04. 04.
 * @version
 * @see
 *
 */

@RestController
@RequestMapping("/api/cmn")
public class CMNLogController {

    private final CMNLogRepo cmnLogRepo;
    private static final Logger LOG =  LoggerFactory.getLogger(CMNLogController.class);

    @Autowired
    public CMNLogController(CMNLogRepo repo) {
        this.cmnLogRepo = repo;
    }

    // 목록
    @GetMapping(value = "/logs")
    public HashMap<String, Object> listLogs(@RequestParam(defaultValue = "") String searchWrd,
                                           @RequestParam(defaultValue = "1") String page,
                                           @RequestParam(defaultValue = "") String logAct,
                                           @RequestParam(defaultValue = "15") String size) throws Exception {

        HashMap<String, Object> rtn = new HashMap<>();
        int totCnt = 0;
        int totPages = 0;
        List<CMNLogDomain> resultList = new ArrayList<>();
        String result = "fail";

        try {
            CMNLogDomain domain = new CMNLogDomain();
            domain.setSizePerPage(Integer.parseInt(size));
            domain.setPage((Integer.parseInt(page) - 1) * Integer.parseInt(size) + 1);
            domain.setLogAct(logAct);
            domain.setSearchWrd(searchWrd);

            totCnt = this.cmnLogRepo.SELECT_CNT_LOG(domain);
            if (totCnt > 0) {
                totPages = (int) Math.ceil(totCnt / Double.parseDouble(size));
                resultList = this.cmnLogRepo.LIST_LOG(domain);
            }
            result = "success";
        } catch (SQLException e) {
            LOG.error("■■■■■■■■■■■■■■■ 로그정보 목록 요청 SQL 오류 : {}", e.getMessage());
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 로그정보 요청 오류 : {}", e.getMessage());
        } finally {
            rtn.put("totCnt", totCnt);
            rtn.put("totPages", totPages);
            rtn.put("resultList", resultList);
            rtn.put("result", result);
        }
        return rtn;
    }
}
