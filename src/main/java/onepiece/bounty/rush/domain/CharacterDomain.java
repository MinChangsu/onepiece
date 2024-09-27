package onepiece.bounty.rush.domain;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY, getterVisibility=JsonAutoDetect.Visibility.NONE,
        setterVisibility=JsonAutoDetect.Visibility.NONE, creatorVisibility= JsonAutoDetect.Visibility.NONE)
public class CharacterDomain extends BaseDomain {

    @JsonProperty("seq")                private int seq = 0;
    @JsonProperty("lv")                 private int lv = 0;
    @JsonProperty("nickNm")             private String nickNm = "";
    @JsonProperty("name")               private String name = "";
    @JsonProperty("color")              private String color = "";
    @JsonProperty("type")               private String type = "";
    @JsonProperty("skill1Nm")           private String skill1Nm = "";
    @JsonProperty("skill1Effect")       private String skill1Effect = "";
    @JsonProperty("skill1Dtl")          private String skill1Dtl = "";
    @JsonProperty("skill1_2Nm")         private String skill1_2Nm = "";
    @JsonProperty("skill1_2Effect")     private String skill1_2Effect = "";
    @JsonProperty("skill1_2Dtl")        private String skill1_2Dtl = "";
    @JsonProperty("skill2Nm")           private String skill2Nm = "";
    @JsonProperty("skill2Effect")       private String skill2Effect = "";
    @JsonProperty("skill2Dtl")          private String skill2Dtl = "";
    @JsonProperty("skill2_2Nm")         private String skill2_2Nm = "";
    @JsonProperty("skill2_2Effect")     private String skill2_2Effect = "";
    @JsonProperty("skill2_2Dtl")        private String skill2_2Dtl = "";
    @JsonProperty("team_bu")            private String team_bu = "";
    @JsonProperty("basic_special")      private String basic_special = "";
    @JsonProperty("special1")           private String special1 = "";
    @JsonProperty("special2")           private String special2 = "";
    @JsonProperty("bu_special")         private String bu_special = "";
    @JsonProperty("big_special")        private String big_special = "";
}
