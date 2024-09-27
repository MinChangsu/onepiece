package onepiece.bounty.rush.repository;

import onepiece.bounty.rush.domain.CMNNtcDomain;
import onepiece.bounty.rush.domain.CMNPdsDomain;
import onepiece.bounty.rush.domain.CharacterDomain;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

@Mapper
@Repository
public interface CharacterRepo {
   List<CharacterDomain> LIST_CHARACTERS(CharacterDomain domain) throws Exception;
   int LIST_CNT_CHARACTERS(CharacterDomain domain) throws Exception;
}
