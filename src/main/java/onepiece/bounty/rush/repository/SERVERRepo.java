package onepiece.bounty.rush.repository;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * @Description 서버 관련 repository
 *
 * @author mono
 * @since 20234.08.29.
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
public interface SERVERRepo {

    // DB 접속 테스트
    String SELECT_CONN_TEST() throws Exception;

}
