package onepiece.bounty.rush.controller;

import onepiece.bounty.rush.common.FileUtil;
import onepiece.bounty.rush.domain.CMNFileDomain;
import onepiece.bounty.rush.domain.CMNNtcDomain;
import onepiece.bounty.rush.domain.CMNPdsDomain;
import onepiece.bounty.rush.domain.CharacterDomain;
import onepiece.bounty.rush.repository.CMNBrdRepo;
import onepiece.bounty.rush.repository.CMNFileRepo;
import onepiece.bounty.rush.repository.CharacterRepo;
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
public class CharacterController {

    @Value("${custom.path.files}")
    private String SYSTEM_FILE_PATH;

    private final CharacterRepo characterRepo;


    private static final Logger LOG =  LoggerFactory.getLogger(CharacterController.class);

    @Autowired
    public CharacterController(CharacterRepo characterRepo) {
        this.characterRepo = characterRepo;
    }

    static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");


    // 공지사항 목록
    @GetMapping(value = "/characters")
    public HashMap<String, Object> listCharacters(@RequestParam(defaultValue = "") String searchWrd,
                                            @RequestParam(defaultValue = "1") String page,
                                            @RequestParam(defaultValue = "10") String size) throws Exception {

        HashMap<String, Object> rtn = new HashMap<>();
        int totCnt = 0;
        List<CharacterDomain> resultList = new ArrayList<>();
        String result = "fail";

        try {
            CharacterDomain domain = new CharacterDomain();
            domain.setSizePerPage(Integer.parseInt(size));
            domain.setSearchWrd(searchWrd);

            totCnt = this.characterRepo.LIST_CNT_CHARACTERS(domain);
            if (totCnt > 0) {
                resultList = this.characterRepo.LIST_CHARACTERS(domain);
            }
            result = "success";
        } catch (SQLException e) {
            LOG.error("■■■■■■■■■■■■■■■ 캐릭터 목록 요청 SQL 오류 : {}", e.getMessage());
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 캐릭터 목록 요청 오류 : {}", e.getMessage());
        } finally {
            rtn.put("totCnt", totCnt);
            rtn.put("resultList", resultList);
            rtn.put("result", result);
        }
        return rtn;
    }


}