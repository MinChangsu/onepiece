package onepiece.bounty.rush.repository;

import onepiece.bounty.rush.domain.USRAuthDomain;
import onepiece.bounty.rush.domain.USRDomain;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Description 사용자 권한 repository
 *
 * @author 민경서
 * @since 2023.12.22
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일        수정자     수정내용
 *   -----------   --------   ------------------------------------------------
 *
 * </pre>
 */
@Mapper
@Repository
public interface USRAuthRepo {

    int SELECT_CNT_USRAUTHS(USRAuthDomain domain) throws Exception;
    List<USRDomain> LIST_USRAUTHS(USRAuthDomain domain) throws Exception;
}