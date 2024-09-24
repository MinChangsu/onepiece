package onepiece.bounty.rush.domain;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Class Name : UsrDomain.java
 * @Description : 접속자 정보 도메인
 * @Modification Information
 *
 *   수정일         수정자      수정내용
 *   -----------    --------    -------------------
 *
 * @author 민경서
 * @since 2023. 12. 22.
 * @version
 * @see
 *
 */

@Data
@NoArgsConstructor
@JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY, getterVisibility=JsonAutoDetect.Visibility.NONE,
        setterVisibility=JsonAutoDetect.Visibility.NONE, creatorVisibility= JsonAutoDetect.Visibility.NONE)
public class USRDomain extends BaseDomain{

    @JsonProperty("usrSeq")             private int usrSeq = 0;
    @JsonProperty("usrId")              private String usrId = "";
    @JsonProperty("usrPw")              private String usrPw = "";
    @JsonProperty("eml")                private String eml = "";
    @JsonProperty("usrNm")              private String usrNm = "";
    @JsonProperty("telno")              private String telno = "";
    @JsonProperty("addr")               private String addr = "";
    @JsonProperty("lvl")                private int lvl = 10;
    @JsonProperty("regDt")              private String regDt = "";
    @JsonProperty("mdfcnDt")            private String mdfcnDt = "";
    @JsonProperty("lastCntnDt")         private String lastCntnDt = "";
    @JsonProperty("failLgnCnt")         private int failLgnCnt = 0;
    @JsonProperty("useYn")              private String useYn = "";
    @JsonProperty("delYn")              private String delYn = "";
    @JsonProperty("whdwlYn")            private String whdwlYn = "";
    @JsonProperty("memo")               private String memo = "";
    @JsonProperty("lastFailLgnDt")      private String lastFailLgnDt = "";
    @JsonProperty("whdwlDt")            private String whdwlDt = "";
    @JsonProperty("urIsLoginFail")      private String urIsLoginFail = "";
    @JsonProperty("authNm")             private String authNm = "";
    @JsonProperty("usrToken")           private String usrToken = "";
    @JsonProperty("authCode")           private String authCode = "";


}
