import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCookies } from 'react-cookie';
import {Panel} from "../../components/panel/panel";
import {Card, CardBody} from "react-bootstrap";
import {Link} from "react-router-dom";
import agent from "../../agents";
import CharacterInfoModal from "../modal/CharacterInfoModal";

function Surpot() {
  const [cookies, setCookie, removeCookie] = useCookies(['gis-pos']);
  const [characterList, setCharacterList] = useState([]);
  const [tagItems, setTagItems] = useState([]);
  const [characterFilter, setCharacterFilter] = useState({});
  const [searchWrd, setSearchWrd] = useState("");
  const [selectSurpot, setSelectSurpot] = useState([{},{},{},{},{},{},{},{},{},{}]);

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
    console.log(updatedFilter);

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
            const filteredResultList = resultList.filter(item => item.effectYn === 'Y');
            setTagItems(filteredResultList);
          } else if (result === 'fail') {
            console.log(result)
            setCharacterFilter([]);
            setTagItems([]);
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
  const handleSurputClick = (index,isVisible,tags,lv) => {
    if(isVisible){
      const newArray = [...selectSurpot];
      newArray[index] = {}; // 원하는 데이터를 추가
      let tagList = tags.split(",");
      console.log(tagList);
      let tagArray = [...tagItems];
      for(let i of tagList){
        let index = tagItems.findIndex(item => item.tagNm === i);
        if(index !== -1){
          tagItems[index].currentLv = tagItems[index].currentLv-=lv;
        }
      }
      console.log(tagArray);
      setTagItems(tagArray);

      setSelectSurpot(newArray); // 상태 업데이트

    }
  };
  const handleCharacterListClick = (data) =>{
    const isDuplicate = selectSurpot.some(item => item.enNm === data.enNm);
    const index = selectSurpot.findIndex(item => Object.keys(item).length === 0);
    if (index === -1) {
      alert('빈 자리가 없습니다. 삭제 후 추가 해주세요');

    } else if(isDuplicate) {
      alert('이미 추가된 서포터 입니다!');
       // 중복된 경우 추가하지 않음
    }
    else{
      const newArray = [...selectSurpot];
      newArray[index] = data; // 원하는 데이터를 추가
      let tagList = data.tags.split(",");
      console.log(tagList);
      let tagArray = [...tagItems];
      for(let i of tagList){
        let index = tagItems.findIndex(item => item.tagNm === i);
        if(index !== -1){
          tagItems[index].currentLv = tagItems[index].currentLv+=100;
        }
      }
      console.log(tagArray);
      setTagItems(tagArray);

      setSelectSurpot(newArray); // 상태 업데이트

    }
    // 첫 번째 빈 객체를 찾음
  }


  return (
    <>
      <div className="row p-0 m-0">
        <div className="surpot-container col-12 col-md-6 p-2">
          <Card className="p-2 mb-3">
            <div className="d-flex justify-content-center" style={{fontSize: '1.1em', fontWeight: 'bold'}}>
              서포터 배치
            </div>
            <div className="row surpot-list m-0">
              {selectSurpot.map((item,index) => {
                let characterImgPath = "/assets/img/cmm/bodybg.png";
                let name = "";
                let tags = "";
                let lv = 0;
                let isVisible = false;
                if(Object.keys(item).length === 0){

                }else{
                  characterImgPath = "/assets/img/character/ov/" + item.enNm + "_ov.png";
                  name = item.name;
                  tags = item.tags;
                  lv = 100;
                  isVisible =true;
                }
                return (
                    <div
                        key={index}
                        className={'col m-2'}
                        onClick={() => handleSurputClick(index,isVisible,tags,lv)}
                    >
                      <div className="image w-100">
                        <div className="image-inner">
                          <img src={characterImgPath} alt={name} width={'120px'} height={'120px'}/>
                        </div>
                        <div className={'image-info ' + (isVisible ? '' : 'd-none')}>
                          <div className="desc">{name}</div>
                        </div>
                      </div>
                    </div>
                )
              })}
            </div>
          </Card>
          <Card className="p-2">
            <div className="d-flex justify-content-center" style={{fontSize: '1.1em', fontWeight: 'bold'}}>
              서포터 타입효과
            </div>
            <div className="row m-0">
              {tagItems.map((item, index) => {
                let isVisible = false;
                let maxLv = item.tagEffect5Lv;
                let currentLvPersent = 0;
                let currentLv = item.currentLv;
                let ableEffect = "";
                if (item.currentLv > 0) {
                  isVisible = true;
                  currentLvPersent = Math.ceil((currentLv/maxLv)*100);
                  console.log(currentLvPersent)
                  if(currentLv >= item.tagEffect5Lv){
                    ableEffect = item.tagEffect5;
                  }else if(currentLv >= item.tagEffect4Lv){
                    ableEffect = item.tagEffect4;
                  }
                  else if(currentLv >= item.tagEffect3Lv){
                    ableEffect = item.tagEffect3;
                  }
                  else if(currentLv >= item.tagEffect2Lv){
                    ableEffect = item.tagEffect2;
                  }
                  else if(currentLv >= item.tagEffect1Lv){
                    ableEffect = item.tagEffect1;
                  }
                }



                return (
                    <div
                        key={index}
                        className={'col-sm-6 ' + (isVisible ? '' : 'd-none')}
                    >
                      <div>{item.tagNm}</div>
                      <div className="progress rounded-pill mb-2">
                        <div
                            className="progress-bar bg-indigo progress-bar-striped progress-bar-animated rounded-pill fs-10px fw-bold"
                            style={{width: currentLvPersent + '%'}}
                        >
                          {item.currentLv}
                        </div>
                      </div>
                      <div className="progress" style={{height: '15px'}}>
                        <div
                            className={"progress-bar fs-10px fw-bold " + (currentLv >= item.tagEffect1Lv ? 'bg-lime' : 'bg-dark')}
                            style={{width: '20%', border: '.7px solid black'}}>{item.tagEffect1Lv}</div>
                        <div
                            className={"progress-bar fs-10px fw-bold " + (currentLv >= item.tagEffect2Lv ? 'bg-lime' : 'bg-dark')}
                            style={{width: '20%', border: '.7px solid black'}}>{item.tagEffect2Lv}</div>
                        <div
                            className={"progress-bar fs-10px fw-bold " + (currentLv >= item.tagEffect3Lv ? 'bg-lime' : 'bg-dark')}
                            style={{width: '20%', border: '.7px solid black'}}>{item.tagEffect3Lv}</div>
                        <div
                            className={"progress-bar fs-10px fw-bold " + (currentLv >= item.tagEffect4Lv ? 'bg-lime' : 'bg-dark')}
                            style={{width: '20%', border: '.7px solid black'}}>{item.tagEffect4Lv}</div>
                        <div
                            className={"progress-bar fs-10px fw-bold " + (currentLv >= item.tagEffect5Lv ? 'bg-lime' : 'bg-dark')}
                            style={{width: '20%', border: '.7px solid black'}}>{item.tagEffect5Lv}</div>
                      </div>
                      <div>{ableEffect}</div>
                    </div>

                );
              })}

            </div>
          </Card>
        </div>
        <div className="character-container col-md-6 p-2">
          <Card className="p-2">
            <div className="d-flex justify-content-center" style={{fontSize: '1.1em', fontWeight: 'bold'}}>
              캐릭터정보
            </div>
            <div className="searchBar my-2">
              <div className="row p-0 m-0">
                <div className="col-9 col-md-10 col-lg-11 p-0 m-0">
                  <div className="form-group">
                    <input type="text" className="form-control" onKeyDown={handleKeyDown}
                           onChange={handleSearchChange} placeholder="캐릭터 이름 또는 특성 검색"/>
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
          <div id="character-surpot" className="character-surpot row gx-0">
            {characterList.map(character => {
              const tagList = character.tags.split(',').map(tag => tag.trim()); // 캐릭터의 tag를 배열로 변환
              tagList.push(character.color);
              // 필터에서 활성화된 항목을 배열로 변환 (전체를 제외한 활성화된 필터)
              const activeFilters = Object.keys(characterFilter).filter(key => characterFilter[key] && key !== '전체');

              // 모든 필터 조건이 tagList에 포함되어 있는지 확인 (AND 조건)
              const isVisible = activeFilters.every(filter => tagList.includes(filter)) || characterFilter['전체'];
              console.log(isVisible);



              let characterImgPath = "/assets/img/character/sum/" + character.enNm + ".png";


              return (
                  <div
                      key={character.seq}
                      className={'col-6 col-md-4 col-lg-3 col-xl-2 ' + (isVisible ? '' : 'd-none')}
                      onClick={() => handleCharacterListClick(character)}
                  >
                    <div className="image w-100">
                      <div className="image-inner">
                        <img src={characterImgPath} alt={character.name}/>
                        <p className="image-caption">
                          <img style={{width: '30px', height: '30px'}}
                               src={"/assets/img/cmm/" + character.enStyle + ".png"} alt=""/>
                        </p>
                      </div>
                      {/*<div className="image-info">*/}
                      {/*  <div className="desc">{character.nickNm}</div>*/}
                      {/*  <div className="desc">{character.name}</div>*/}
                      {/*</div>*/}
                    </div>
                  </div>
              )
            })}
          </div>
        </Card>
        </div>
        </div>
      <CharacterInfoModal show={isViewModal} toggleShow={handleToggleShow} character={selectCharacter}/>
    </>
  );
}

export default Surpot;
