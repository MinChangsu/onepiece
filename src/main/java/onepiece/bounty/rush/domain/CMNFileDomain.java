package onepiece.bounty.rush.domain;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

/**
 * @Class Name : DOCFileDomain.java
 * @Description : 첨부파일 정보 도메인
 * @Modification Information
 *
 *   수정일         수정자      수정내용
 *   -----------    --------    -------------------
 *
 * @author
 * @since 2023. 12. 04.
 * @version
 * @see
 *
 */

@Data
@NoArgsConstructor
@JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY, getterVisibility=JsonAutoDetect.Visibility.NONE,
        setterVisibility=JsonAutoDetect.Visibility.NONE, creatorVisibility= JsonAutoDetect.Visibility.NONE)
public class CMNFileDomain {

    @JsonProperty("seq")            private int seq = 0;
    @JsonProperty("cOrd")           private int cOrd = 0;                   //순번
    @JsonProperty("brdType")        private String brdType = "";            //게시물 타입
    @JsonProperty("cFileName")      private String cFileName = "";          //저장될 파일명
    @JsonProperty("cFileOrgName")   private String cFileOrgName = "";    //저장될 파일명
    @JsonProperty("cFilePath")      private String cFilePath = "";          //저장될 경로
    @JsonProperty("brdSeq")         private int brdSeq = 0;
    private MultipartFile[] files;      //첨부파일
}
