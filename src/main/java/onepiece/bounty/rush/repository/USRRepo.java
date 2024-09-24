package onepiece.bounty.rush.repository;

import onepiece.bounty.rush.domain.USRDomain;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Description 사용자 repository
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
public interface USRRepo {

    // 회원 정보 조회
    USRDomain SELECT_USR(int usrSeq) throws Exception;
    USRDomain SELECT_USR_NOT_PW(int usrSeq) throws Exception;
    int SELECT_CNT_USRS(USRDomain domain) throws Exception;
    List<USRDomain> LIST_USRS(USRDomain domain) throws Exception;


    // 로그인 실패 카운트
    void UPDATE_USR_LOGIN_FAIL_CNT(USRDomain domain) throws Exception;

    // TEST에서 회원 이름, 전화번호 일괄 암호화를 위한 작업
    List<USRDomain> SELECT_USRS_FOR_ENCRYPT() throws Exception;
    void UPDATE_USR_FOR_ENCRYPT(USRDomain domain) throws Exception;

    int DUP_CHECK_USR_INFO(USRDomain domain) throws Exception;

    void UPDATE_USR(USRDomain domain) throws Exception;
    void UPDATE_USR_NOT_PW(USRDomain domain) throws Exception;
    void INSERT_USR(USRDomain domain) throws Exception;

    // 로그인
    USRDomain SELECT_LOGIN_USR_WITH_ID(String usrId) throws Exception;
    void UPDATE_USR_LOGIN_FAIL_RESET(USRDomain domain) throws Exception;
    USRDomain SELECT_LOGIN(USRDomain domain) throws Exception;

}