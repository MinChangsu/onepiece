package onepiece.bounty.rush.domain;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY, getterVisibility=JsonAutoDetect.Visibility.NONE,
        setterVisibility=JsonAutoDetect.Visibility.NONE, creatorVisibility= JsonAutoDetect.Visibility.NONE)
public class BaseDomain {
    private int rowNo = 0;
    private int page = 1;
    private int sizePerPage = 0;
    private String sDate = "";          // 검색 시작일
    private String eDate = "";          // 검색 종료일
    private String searchWrd = "";
}
