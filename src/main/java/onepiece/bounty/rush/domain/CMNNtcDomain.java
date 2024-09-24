package onepiece.bounty.rush.domain;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @Class Name : MemDomain.java
 * @Description : 게시판 정보 도메인
 * @Modification Information
 *
 *   수정일         수정자      수정내용
 *   -----------    --------    -------------------
 *
 * @author mono
 * @since 2023. 10. 11.
 * @version
 * @see
 *
 */

@Data
@NoArgsConstructor
@JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY, getterVisibility=JsonAutoDetect.Visibility.NONE,
        setterVisibility=JsonAutoDetect.Visibility.NONE, creatorVisibility= JsonAutoDetect.Visibility.NONE)
public class CMNNtcDomain {
    @JsonProperty("rowNo")              private int rowNo = 0;
    @JsonProperty("seq")                private int seq = 0;
    @JsonProperty("title")              private String title = "";
    @JsonProperty("brdType")            private String brdType = "BORD";
    @JsonProperty("cn")                 private String cn = "";
    @JsonProperty("regDt")              private String regDt = "";
    @JsonProperty("mdfcnDt")            private String mdfcnDt = "";
    @JsonProperty("inqCnt")             private int inqCnt = 0;
    @JsonProperty("useYn")              private String useYn = "";
    @JsonProperty("brdFile")            private int brdFile = -1;
    @JsonProperty("boardName")          private String boardName;
    // 첨부파일순번
    private List<CMNFileDomain>cmnFileDomainList ;
    private int page = 1;
    private int sizePerPage = 0;
    private String sDate = "";          // 검색 시작일
    private String eDate = "";          // 검색 종료일
    private String searchWrd = "";

}
