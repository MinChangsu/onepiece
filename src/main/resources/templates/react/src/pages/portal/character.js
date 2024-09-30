import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCookies } from 'react-cookie';
import {Panel} from "../../components/panel/panel";
import {Card, CardBody} from "react-bootstrap";
import {Link} from "react-router-dom";
import agent from "../../agents";
import CharacterInfoModal from "../modal/CharacterInfoModal";

function Character() {
  const [cookies, setCookie, removeCookie] = useCookies(['gis-pos']);
  const [characterList, setCharacterList] = useState([]);
  const [filterItems, setFilterItems] = useState(['전체', '공격수', '수비수', '득점자','적','청','녹','빛','어둠','선장','자연계 능력자','초인계 능력자','동물계 능력자', '혁명군','코즈키 가문/코즈키 가문 가신','돈기호테 패밀리','이스트 블루','흰 수염 해적단','밀짚모자 일당','로저 해적단/전 로저 해적단','백수 해적단','샬롯 가','최악의 세대','그랜드 라인','어인','해군','신세계','칠무해','원거리 일반 공격','버기즈 딜리버리','바로크 워크스','사이퍼 폴','능력자','검은 수염 해적단','빨간 머리 해적단','구사 해적단','제르마 66','닌자','알라바스타 왕국','샴블즈','밍크족']);
  const [characterFilter, setCharacterFilter] = useState({});
  const [searchWrd, setSearchWrd] = useState("");

  // 모달
  const [isViewModal, setIsViewModal] = useState(false);
  const [seq, setSeq] = useState(0);
  const [selectCharacter, setSelectCharacter] = useState({});
  const handleToggleShow = () => {
    setIsViewModal((p) => !p);
  };


  const fetchFilterItems = async () => {
    // const items = await agent.getFilterItems(); // 서버에서 항목 가져옴 (API 요청)
    // setFilterItems(items);

    // 가져온 항목들을 기반으로 초기 상태 설정
    const initialFilterState = filterItems.reduce((acc, item) => {
      acc[item] = false;
      return acc;
    }, {});
    initialFilterState.전체 = true;

    setCharacterFilter(initialFilterState);
  };

  const toggle = (value) => {

    const updatedFilter = { ...characterFilter };
    if (value === '전체') {
      Object.keys(updatedFilter).forEach((key) => {
        updatedFilter[key] = key === '전체';
      });
    } else {
      updatedFilter[value] = !updatedFilter[value];
      updatedFilter["전체"] = false;
    }
    setCharacterFilter(updatedFilter);
  };

  useEffect(()=>{
    fetchFilterItems();
    fetchCharacters();

  },[])


  const fetchCharacters = async () => {
    let params = {
      searchWrd: searchWrd,
    };

    await agent.CharacterInfo.fetchCharacters(params)
        .then(({ resultList, result }) => {
          if (result === 'success') {
            setCharacterList(resultList);
            console.log(resultList)
          } else if (result === 'fail') {
            console.log(result)
            setCharacterList([]);
          }
        })
        .finally(() => {});
  };
  const handleSearchChange = (e) => {
    setSearchWrd(e.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchCharacters();
    }
  };

  const handleCharacterClick = (data) => {
    setSelectCharacter(data);
    setIsViewModal(true);
  };

  return (
      <>
        <Card>
          <div className="character-container p-2">
            <div className="d-flex justify-content-center" style={{fontSize: '1.1em', fontWeight: 'bold'}}>
              캐릭터정보
            </div>
            <div className="searchBar my-2">
              <div className="row p-0 m-0">
                <div className="col-9 col-md-10 col-lg-11 p-0 m-0">
                  <div className="form-group">
                    <input type="text" className="form-control" onKeyDown={handleKeyDown} onChange={handleSearchChange} placeholder="캐릭터 이름 또는 특성 검색"/>
                    <button onClick={fetchCharacters} className="btn btn-search">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>

                </div>
                <div className="col-3 col-md-2 col-lg-1 p-0 m-0 d-flex justify-content-center align-items-center">
                  <button className="btn btn-warning" type="button" data-bs-toggle="collapse"
                          data-bs-target="#collapseOne">
                    필터
                  </button>
                </div>

                <div id="collapseOne" className="collapse mt-2">
                  <div className="bg-gray-900 text-white p-2">
                    <div id="options" className="mb-3">
                      <div className="d-flex flex-wrap text-nowrap mb-n1" id="filter">
                        {Object.keys(characterFilter).map((item) => (
                            <button
                                key={item}
                                onClick={() => toggle(item)}
                                className={
                                    'btn btn-white btn-sm border-0 me-1 mb-1 ' + (characterFilter[item] ? 'active' : '')
                                }
                            >
                              {item}
                            </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>


            <div id="character" className="character row gx-0">
              {characterList.map(character => {
                const tagList = character.tags.split(',').map(tag => tag.trim()); // 캐릭터의 tag를 배열로 변환
                tagList.push(character.color)
                // 필터에서 활성화된 항목을 배열로 변환 (전체를 제외한 활성화된 필터)
                const activeFilters = Object.keys(characterFilter).filter(key => characterFilter[key] && key !== '전체');

                // 모든 필터 조건이 tagList에 포함되어 있는지 확인 (AND 조건)
                const isVisible = activeFilters.every(filter => tagList.includes(filter)) || characterFilter['전체'];

                let characterImgPath = "/assets/img/character/zoro.png";
                if(character.color==="녹" || character.color==="어둠" || character.color==="빛"){
                  characterImgPath = "/assets/img/character/ill/"+character.enNm+".png";
                }

                return(
                  <div
                      key={character.seq}
                      className={'col-lg-2 col-md-2 ' + (isVisible ? '' : 'd-none')}
                      onClick={() => handleCharacterClick(character)}
                  >
                    <div className="image w-100">
                      <div className="image-inner">
                        <Link to="/character">
                          <img src={characterImgPath} alt={character.name} />
                        </Link>
                        <p className="image-caption">
                          <img style={{width: '30px', height: '30px'}} src={"/assets/img/cmm/"+character.enStyle+".png"} alt=""/>
                        </p>
                      </div>
                      <div className="image-info">
                        <h5 className="title">{character.nickNm}</h5>
                        <h5 className="title">{character.name}</h5>
                        {/*<div className="desc">{character.description}</div>*/}
                      </div>
                    </div>
                  </div>
              )})}
            </div>

          </div>
        </Card>
        <CharacterInfoModal show={isViewModal} toggleShow={handleToggleShow} character={selectCharacter}/>
      </>
  );
}

export default Character;
