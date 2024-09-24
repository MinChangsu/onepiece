package onepiece.bounty.rush.repository;

import onepiece.bounty.rush.domain.CMNLogDomain;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * @Description 로그정보 repository
 *
 * @author
 * @since 2024.04.04.
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
public interface CMNLogRepo {
    void INSERT_LOG(CMNLogDomain domain) throws Exception;
    int SELECT_CNT_LOG(CMNLogDomain domain) throws Exception;
    List<CMNLogDomain> LIST_LOG(CMNLogDomain domain) throws Exception;
}
