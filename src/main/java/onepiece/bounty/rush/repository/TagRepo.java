package onepiece.bounty.rush.repository;

import onepiece.bounty.rush.domain.TagDomain;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface TagRepo {
   List<TagDomain> LIST_TAGS(TagDomain domain) throws Exception;
   int LIST_CNT_TAGS(TagDomain domain) throws Exception;
}
