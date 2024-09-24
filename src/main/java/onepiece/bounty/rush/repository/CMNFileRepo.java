package onepiece.bounty.rush.repository;

import onepiece.bounty.rush.domain.CMNFileDomain;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Description 첨부파일 repository
 *
 * @author mks
 * @since 2024.02.20.
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
public interface CMNFileRepo {

    void INSERT_FILE_INFO(CMNFileDomain domain) throws Exception;
    CMNFileDomain SELECT_FILE_INFO(CMNFileDomain domain) throws Exception;
    List<CMNFileDomain> SELECT_LIST_WITH_TYPE(CMNFileDomain domain) throws Exception;
    int DELETE_FILE_INFO(int seq) throws Exception;
}
