import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCookies } from 'react-cookie';
import {Panel} from "../../components/panel/panel";
import {Card, CardBody} from "react-bootstrap";
import {Link} from "react-router-dom";

function Character() {
  const [cookies, setCookie, removeCookie] = useCookies(['gis-pos']);

  const [character, setCharacter] = useState({
    전체: true,
    공격수: false,
    수비수: false,
    득점자: false,
  });

  const toggle = (value) => {
    const newCharacter = {
      전체: false,
      공격수: false,
      수비수: false,
      득점자: false,
    };

    switch (value) {
      case '전체':
        newCharacter.전체 = true;
        break;
      case '공격수':
        newCharacter.공격수 = true;
        break;
      case '수비수':
        newCharacter.수비수 = true;
        break;
      case '득점자':
        newCharacter.득점자 = true;
        break;
      default:
        break;
    }

    setCharacter(newCharacter);
    console.log(newCharacter)
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
                  <div class="form-group">
                    <input type="text" className="form-control" placeholder="캐릭터 검색"/>
                    <button className="btn btn-search">
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
                        <button onClick={() => toggle('전체')}
                                className={'btn btn-white btn-sm border-0 me-1 mb-1 ' + (character.전체 ? 'active' : '')}>
                          전체
                        </button>
                        <button onClick={() => toggle('공격수')}
                                className={'btn btn-white btn-sm border-0 me-1 mb-1 ' + (character.공격수 ? 'active' : '')}>
                          공격수
                        </button>
                        <button onClick={() => toggle('수비수')}
                                className={'btn btn-white btn-sm border-0 me-1 mb-1 ' + (character.수비수 ? 'active' : '')}>
                          수비수
                        </button>
                        <button onClick={() => toggle('득점자')}
                                className={'btn btn-white btn-sm border-0 me-1 mb-1 ' + (character.득점자 ? 'active' : '')}>
                          득점자
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>


            <div id="character" className="character row gx-0">
              <div className={'col-lg-2 col-md-2 ' + (character.공격수 || character.전체 ? '' : 'd-none ')}>
                <div className="image w-100">
                  <div className="image-inner">
                    <Link to="/character">
                      <img src="/assets/img/character/Luffy.png" alt=""/>
                    </Link>
                    <p className="image-caption">
                      <img style={{width: '30px', height: '30px'}} src="/assets/img/cmm/b_at.png" alt=""/>
                    </p>
                  </div>
                  <div className="image-info">
                    <h5 className="title">내꿈은 해적왕 루피</h5>
                    <div className="desc">
                      루피 존나쌤
                    </div>
                  </div>
                </div>
              </div>
              <div className={'col-lg-2 col-md-2 ' + (character.공격수 || character.전체 ? '' : 'd-none ')}>
                <div className="image w-100">
                  <div className="image-inner">
                    <Link to="/character">
                      <img src="/assets/img/character/zoro.png" alt=""/>
                    </Link>
                    <p className="image-caption">
                      <img style={{width: '30px', height: '30px'}} src="/assets/img/cmm/r_at-c.png" alt=""/>
                    </p>
                  </div>
                  <div className="image-info">
                    <h5 className="title">오니가시마 조로</h5>
                    <div className="desc">
                      조로 존나쌤
                    </div>
                  </div>
                </div>
              </div>
              <div className={'col-lg-2 col-md-2 ' + (character.득점자 || character.전체 ? '' : 'd-none ')}>
                <div className="image w-100">
                  <div className="image-inner">
                    <Link to="/character">
                      <img src="/assets/img/character/sangdi.png" alt=""/>
                    </Link>
                    <p className="image-caption">
                      <img style={{width: '30px', height: '30px'}} src="/assets/img/cmm/g_gt.png" alt=""/>
                    </p>
                  </div>
                  <div className="image-info">
                    <h5 className="title">소마마스크 상디</h5>
                    <div className="desc">
                      상디 병신임
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Card>


      </>
  );
}

export default Character;
