package onepiece.bounty.rush.repository;
import onepiece.bounty.rush.domain.CMNNtcDomain;
import onepiece.bounty.rush.domain.CMNPdsDomain;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

/**
 * @Description 게시판용(공지사항, 자료실) repository
 *
 * @author mono
 * @since 2023.10.10.
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *   수정일        수정자     수정내용
 *   -----------   --------   -------------------------------------------------------------------------------

 * </pre>
 */


@Mapper
@Repository
public interface CMNBrdRepo {

    // 공지사항 목록
    int SELECT_CNT_NTCS(CMNNtcDomain domain) throws Exception;
    List<HashMap<String, Object>> LIST_NTCS(CMNNtcDomain domain) throws Exception;
    CMNNtcDomain SELECT_NTC(CMNNtcDomain domain) throws Exception;
    @Options(useGeneratedKeys = true, keyProperty = "seq")
    void INSERT_NTC(CMNNtcDomain domain) throws Exception;
    void UPDATE_NTC(CMNNtcDomain domain) throws Exception;
    void DELETE_NTC(CMNNtcDomain domain) throws Exception;
    String SELECT_SITE_INFO() throws Exception;
    void UPDATE_SITE_INFO(String mainViewBoardYn) throws Exception;
    // 자료실
    int SELECT_CNT_PDSS(CMNPdsDomain domain) throws Exception;
    List<HashMap<String, Object>> LIST_PDSS(CMNPdsDomain domain) throws Exception;
    CMNPdsDomain SELECT_PDS(CMNPdsDomain domain) throws Exception;
    @Options(useGeneratedKeys = true, keyProperty = "seq")
    void INSERT_PDS(CMNPdsDomain domain) throws Exception;
    void UPDATE_PDS(CMNPdsDomain domain) throws Exception;
    void DELETE_PDS(CMNPdsDomain domain) throws Exception;
}
