package onepiece.bounty.rush.domain;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY, getterVisibility=JsonAutoDetect.Visibility.NONE,
        setterVisibility=JsonAutoDetect.Visibility.NONE, creatorVisibility= JsonAutoDetect.Visibility.NONE)
public class TagDomain extends BaseDomain {

     @JsonProperty("seq")                           private int seq = 0;
     @JsonProperty("tagNm")                         private String tagNm = "";
     @JsonProperty("tagEffect1")                    private String tagEffect1 = "";
     @JsonProperty("tagEffect2")                    private String tagEffect2 = "";
     @JsonProperty("tagEffect3")                    private String tagEffect3 = "";
     @JsonProperty("tagEffect4")                    private String tagEffect4 = "";
     @JsonProperty("tagEffect5")                    private String tagEffect5 = "";
     @JsonProperty("tagEffect1Lv")                  private int tagEffect1Lv = 0;
     @JsonProperty("tagEffect2Lv")                  private int tagEffect2Lv = 0;
     @JsonProperty("tagEffect3Lv")                  private int tagEffect3Lv = 0;
     @JsonProperty("tagEffect4Lv")                  private int tagEffect4Lv = 0;
     @JsonProperty("tagEffect5Lv")                  private int tagEffect5Lv = 0;
     @JsonProperty("effectYn")                      private String effectYn = "";
     @JsonProperty("type")                          private String type = "";
     private int currentLv = 0;
}
