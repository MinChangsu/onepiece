package onepiece.bounty.rush.domain;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Class Name : MemDomain.java
 * @Description : 접속로그 정보 도메인
 * @Modification Information
 *
 *   수정일         수정자      수정내용
 *   -----------    --------    -------------------
 *
 * @author mono
 * @since 2024. 04. 04.
 * @version
 * @see
 *
 */

@Data
@NoArgsConstructor
@JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY, getterVisibility=JsonAutoDetect.Visibility.NONE,
        setterVisibility=JsonAutoDetect.Visibility.NONE, creatorVisibility= JsonAutoDetect.Visibility.NONE)
public class CMNLogDomain {

    @JsonProperty("seq")        private int rowNo = 0;
    @JsonProperty("usrType")    private String usrType = "";
    @JsonProperty("usrId")      private String usrId = "";
    @JsonProperty("logType")    private String logType = "";        // MAP, SYS
    @JsonProperty("logAct")     private String logAct = "";         // LOGIN, VIEW, RGT, DEL, UPD
    @JsonProperty("logPath")    private String logPath = "";
    @JsonProperty("logIp")      private String logIp = "";
    @JsonProperty("logHr")      private String logHr = "";
    @JsonProperty("usrNm")      private String usrNm = "";
    @JsonProperty("msg_res")      private String msgRes = "";

    private int page = 1;
    private int sizePerPage = 0;
    private String sDate = "";          // 검색 시작일
    private String eDate = "";          // 검색 종료일
    private String searchWrd = "";

}
