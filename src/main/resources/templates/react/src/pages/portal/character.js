import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCookies } from 'react-cookie';
import {Panel} from "../../components/panel/panel";
import {Card, CardBody} from "react-bootstrap";
import {Link} from "react-router-dom";
import agent from "../../agents";

function Character() {
  const [cookies, setCookie, removeCookie] = useCookies(['gis-pos']);
  const [characterList, setCharacterList] = useState([]);
  const [filterItems, setFilterItems] = useState(['전체', '공격수', '수비수', '득점자']);
  const [characterFilter, setCharacterFilter] = useState({});
  const [searchWrd, setSearchWrd] = useState("");

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

    setCharacterFilter((prevFilter) => {
      const updatedFilter = { ...prevFilter };

      if (value === '전체') {
        // '전체'를 선택하면 나머지를 모두 false로
        Object.keys(updatedFilter).forEach((key) => {
          updatedFilter[key] = key === '전체'; // 전체만 true, 나머지 false
        });
      } else {
        Object.keys(updatedFilter).forEach((key) => {
          updatedFilter[key] = key === value; // 전체만 true, 나머지 false
        });
      }

      return updatedFilter;
    });
  };

  useEffect(()=>{
  console.log(characterFilter);
  },[characterFilter])

  useEffect(()=>{
    fetchFilterItems();
    fetchCharacters();

  },[])

  useEffect(()=>{

    // fetchCharacters();
console.log(characterList);
  },[characterList])

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
                    <input type="text" className="form-control" onChange={handleSearchChange} placeholder="캐릭터 이름 또는 특성 검색"/>
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
                        {filterItems.map((item) => (
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
              {characterList.map(character => (
                  <div
                      key={character.seq}
                      className={'col-lg-2 col-md-2 ' + (characterFilter[character.type] || characterFilter['전체'] ? '' : 'd-none')}
                  >
                    <div className="image w-100">
                      <div className="image-inner">
                        <Link to="/character">
                          <img src="/assets/img/character/zoro.png" alt={character.name} />
                        </Link>
                        <p className="image-caption">
                          <img style={{width: '30px', height: '30px'}} src="/assets/img/cmm/r_at-c.png" alt=""/>
                        </p>
                      </div>
                      <div className="image-info">
                        <h5 className="title">{character.nickNm}</h5>
                        <h5 className="title">{character.name}</h5>
                        {/*<div className="desc">{character.description}</div>*/}
                      </div>
                    </div>
                  </div>
              ))}
            </div>

          </div>
        </Card>


      </>
  );
}

export default Character;
