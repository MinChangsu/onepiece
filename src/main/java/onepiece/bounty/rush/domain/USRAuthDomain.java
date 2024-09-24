package onepiece.bounty.rush.domain;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY, getterVisibility=JsonAutoDetect.Visibility.NONE,
        setterVisibility=JsonAutoDetect.Visibility.NONE, creatorVisibility= JsonAutoDetect.Visibility.NONE)
public class USRAuthDomain {

    @JsonProperty("authLvl") private int authLvl = 0;
    @JsonProperty("authNm") private String authNm = "";
    @JsonProperty("regDt") private String regDt = "";
    @JsonProperty("mdfcnDt") private String mdfcnDt = "";
    @JsonProperty("memo") private String memo = "";
    @JsonProperty("searchWrd") private String searchWrd = "";
    @JsonProperty("mngrAuth") private String mngrAuth = "N";
    @JsonProperty("useYn") private String useYn = "Y";
}
