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
  const [filterItems, setFilterItems] = useState([]);
  const [characterFilter, setCharacterFilter] = useState({});
  const [searchWrd, setSearchWrd] = useState("");

  // 모달
  const [isViewModal, setIsViewModal] = useState(false);
  const [seq, setSeq] = useState(0);
  const [selectCharacter, setSelectCharacter] = useState({});
  const handleToggleShow = () => {
    setIsViewModal((p) => !p);
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
    fetchTags("");
    fetchCharacters();

  },[])
  const fetchTags = async (effectYn) => {
    let params = {
      effectYn: effectYn,
    };

    await agent.TagInfo.fetchTags(params)
        .then(({ resultList, result }) => {
          if (result === 'success') {

            // 가져온 항목들을 기반으로 초기 상태 설정
            const initialFilterState = resultList.reduce((acc, item) => {
              acc[item.tagNm] = false;
              return acc;
            }, {});
            const orderedFilterState = {
              '전체': true,         // '전체'를 맨 앞에 추가
              ...initialFilterState // 나머지 필터 상태를 뒤에 추가
            };
            setCharacterFilter(orderedFilterState);
            setFilterItems(resultList);
          } else if (result === 'fail') {
            console.log(result)
            setCharacterFilter([]);
            setFilterItems([]);
          }
        })
        .finally(() => {});
  };

  const fetchCharacters = async () => {
    let params = {
      searchWrd: searchWrd,
    };

    await agent.CharacterInfo.fetchCharacters(params)
        .then(({ resultList, result }) => {
          if (result === 'success') {
            setCharacterList(resultList);
          } else if (result === 'fail') {
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
        <Card className="onepieceCard" style={{backgroundImage:'url(/assets/img/cmm/bodyLine2.png)'}}>
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


            <div id="character" className="character row gx-0 characterList2">
              {characterList.map(character => {
                const tagList = character.tags.split(',').map(tag => tag.trim()); // 캐릭터의 tag를 배열로 변환
                tagList.push(character.color)
                // 필터에서 활성화된 항목을 배열로 변환 (전체를 제외한 활성화된 필터)
                const activeFilters = Object.keys(characterFilter).filter(key => characterFilter[key] && key !== '전체');

                // 모든 필터 조건이 tagList에 포함되어 있는지 확인 (AND 조건)
                const isVisible = activeFilters.every(filter => tagList.includes(filter)) || characterFilter['전체'];

                let characterImgPath = "/assets/img/character/ill/" + character.enNm + ".png";

                return(
                  <div
                      key={character.seq}
                      className={'col-lg-3 col-md-2 ' + (isVisible ? '' : 'd-none')}
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
