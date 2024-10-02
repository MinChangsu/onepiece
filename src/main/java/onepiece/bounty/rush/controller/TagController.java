package onepiece.bounty.rush.controller;

import onepiece.bounty.rush.domain.CharacterDomain;
import onepiece.bounty.rush.domain.TagDomain;
import onepiece.bounty.rush.repository.CharacterRepo;
import onepiece.bounty.rush.repository.TagRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
public class TagController {
    private static final Logger LOG =  LoggerFactory.getLogger(TagController.class);

    private final TagRepo tagRepo;
    @Autowired
    public TagController(TagRepo tagRepo) {
        this.tagRepo = tagRepo;
    }

    // 캐릭터 목록
    @GetMapping(value = "/tags")
    public HashMap<String, Object> listTags(@RequestParam(defaultValue = "") String effectYn) throws Exception {


        HashMap<String, Object> rtn = new HashMap<>();
        List<TagDomain> resultList = new ArrayList<>();
        String result = "fail";

        try {
            TagDomain domain = new TagDomain();
            domain.setEffectYn(effectYn);
            resultList = this.tagRepo.LIST_TAGS(domain);
            result = "success";
        } catch (SQLException e) {
            LOG.error("■■■■■■■■■■■■■■■ 태그 목록 요청 SQL 오류 : {}", e.getMessage());
        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ 태그 목록 요청 오류 : {}", e.getMessage());
        } finally {
            rtn.put("resultList", resultList);
            rtn.put("result", result);
        }
        return rtn;
    }
}
