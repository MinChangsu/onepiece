import React, { useContext, useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Panel, PanelBody } from '../../components/panel/panel';
import agent from '../../agents';
import { AppSettings } from '../../config/app-settings';
import { Collapse, Modal, ModalDialog } from 'react-bootstrap';
import Draggable from 'react-draggable';
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/ko';
import Loading from '../../composables/loading';
import {Link} from "react-router-dom";

const CharacterInfoModal = ({ show ,toggleShow,character}) => {
  console.log(character)

  const [loading, setLoading] = useState(false);


  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 시작
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // componentDidMount
  useEffect(() => {}, []);


  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  const imgNmEdit = (value,type) =>{
    if (type === "bg"){
      if (value==="적"){
        return "bg_red.png"
      }else if(value ==="녹"){
        return "bg_green.png"
      }
      else if(value ==="청"){
        return "bg_bule.png"
      }
      else if(value ==="빛"){
        return "bg_white.png"
      }
      else if(value ==="어둠"){
        return "bg_dark.png"
      }
    }else{

    }
  }

  const handleOpened = async () => {

  };

  const handleClose = async () => {
    toggleShow();
  };
  let characterImgPath = "/assets/img/character/ov/"+character.enNm+"_ov.png";
  if(character.color==="녹" || character.color==="어둠" || character.color==="빛"){
    characterImgPath = "/assets/img/character/ill/"+character.enNm+".png";
  }


  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop='static'
      keyboard={true}
      onEnter={handleOpened}
      dialogClassName='characterInfo-modal modal-xl-dialog '
      // backdropClassName='opacity-10'
      className='mt-5'
      size ="xl"
    >
      <Modal.Header closeButton className='p-2 ps-4 pe-4' style={{ alignContent: 'space-evenly' }}>
        <Modal.Title>캐릭터 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body className='p-1' style={{backgroundImage:`url(${character.bgPath})`,backgroundSize:'5%'}}>
        <div>
          <ul className="nav nav-pills mb-2">
            <li className="nav-item">
              <a href="#nav-pills-tab-1" data-bs-toggle="tab" className="nav-link active">
                <span className="d-sm-none">기본정보</span>
                <span className="d-sm-block d-none">기본정보</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#nav-pills-tab-2" data-bs-toggle="tab" className="nav-link">
                <span className="d-sm-none">스킬</span>
                <span className="d-sm-block d-none">스킬</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#nav-pills-tab-3" data-bs-toggle="tab" className="nav-link">
                <span className="d-sm-none">특성</span>
                <span className="d-sm-block d-none">특성</span>
              </a>
            </li>
          </ul>
          <div className="tab-content p-3 rounded-top panel rounded-0 m-0" style={{backgroundImage:`url(/assets/img/cmm/characterModalbg.png),url(${character.bgPath})`,backgroundSize: 'cover,5%'}}>
          <div className="tab-pane fade active show p-2" id="nav-pills-tab-1" >
            <div className="row p-0 m-0">
              <div className="col-md-4 col-12">
                <div className="character">
                  <div className="image w-100">
                    <div className="image-inner">
                      <img src={characterImgPath} alt={character.name}/>
                      <p className="image-caption">
                        <img style={{width: '30px', height: '30px'}} src={"/assets/img/cmm/"+character.enStyle+".png"} alt=""/>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8 mt-md-0 mt-2 col-12">
                <div style={{fontWeight: "bold", fontSize: "1.1rem"}}>
                  <div className="character-modal-label ps-2"
                       style={{backgroundImage: 'url(/assets/img/cmm/bg_hatching.png)'}}>이름
                  </div>
                  <div className="mt-2">
                    <div>{character.nickNm}</div>
                    <div>{character.name}</div>
                  </div>
                  <div className="character-modal-label mt-2 ps-2"
                       style={{backgroundImage: 'url(/assets/img/cmm/bg_hatching.png)'}}>속성 / 스타일
                  </div>
                  <div className="mt-2">
                    <div>{character.color}색 / {character.type}</div>
                  </div>

                  <div className="character-modal-label mt-2 ps-2"
                       style={{backgroundImage: 'url(/assets/img/cmm/bg_hatching.png)'}}>초기 등급
                  </div>
                  <div className="mt-2">
                    <div className="rating">
                      {Array.from({length: 4}, (v, i) => (
                          <span
                              key={i}
                              className={`star ${i < character.lv ? 'active' : ''}`} // lv 값에 따라 active 클래스 추가
                          ></span>
                      ))}
                    </div>
                  </div>
                  <div className="character-modal-label mt-2 ps-2"
                       style={{backgroundImage: 'url(/assets/img/cmm/bg_hatching.png)'}}>팀 부스트
                  </div>
                  <div className="mt-2">
                    {character.teamBu}
                  </div>

                  <div className="character-modal-label mt-2 ps-2"
                       style={{backgroundImage: 'url(/assets/img/cmm/bg_hatching.png)'}}>태그
                  </div>
                  <div className="mt-2">
                    {character.tags}
                  </div>


                  <div className="my-2">

                  </div>
                </div>

              </div>


            </div>
          </div>
            <div className="tab-pane fade p-2" id="nav-pills-tab-2">
              <div style={{fontWeight: "bold", fontSize: "1.1rem"}}>
                <div className="character-modal-label mt-2 ps-2"
                     style={{backgroundImage: 'url(/assets/img/cmm/bg_hatching.png)'}}>스킬 1 : {character.skill1Nm}
                </div>
              </div>
              <div className="mt-2">
                {character.skill1Effect}
              </div>
              <div className="mt-2">
                {character.skill1Dtl}
              </div>
              {character.skill1_2Nm && (
                <>
                  <div style={{fontWeight: "bold", fontSize: "1.1rem"}}>
                    <div className="character-modal-label mt-2 ps-2"
                         style={{backgroundImage: 'url(/assets/img/cmm/bg_hatching.png)'}}>스킬 1_2 : {character.skill1_2Nm}
                    </div>
                  </div>
                  <div className="mt-2">
                    {character.skill1_2Effect}
                  </div>
                  <div className="mt-2">
                    {character.skill1_2Dtl}
                  </div>
                </>
            )}
            <hr/>

            <div style={{fontWeight: "bold", fontSize: "1.1rem"}}>
              <div className="character-modal-label mt-2 ps-2"
                   style={{backgroundImage: 'url(/assets/img/cmm/bg_hatching.png)'}}>스킬 2 : {character.skill2Nm}
                </div>
              </div>
              <div className="mt-2">
                {character.skill2Effect}
              </div>
              <div className="mt-2">
                {character.skill2Dtl}
              </div>
              {character.skill2_2Nm && (
                <>
                  <div style={{fontWeight: "bold", fontSize: "1.1rem"}}>
                    <div className="character-modal-label mt-2 ps-2"
                         style={{backgroundImage: 'url(/assets/img/cmm/bg_hatching.png)'}}>스킬 2_2 : {character.skill2_2Nm}
                    </div>
                  </div>
                  <div className="mt-2">
                    {character.skill2_2Effect}
                  </div>
                  <div className="mt-2">
                    {character.skill2_2Dtl}
                  </div>
                </>
              )}
            </div>
            <div className="tab-pane fade p-2" id="nav-pills-tab-3">
              {character.basicSpecial && (
                  <>
                    <div style={{fontWeight: "bold", fontSize: "1.1rem"}}>
                      <div className="character-modal-label mt-2 ps-2"
                           style={{backgroundImage: 'url(/assets/img/cmm/bg_hatching.png)'}}>캐릭터 특성
                      </div>
                    </div>
                    <div className="mt-2">
                      {character.basicSpecial}
                    </div>
                  </>
              )}
              <div style={{fontWeight: "bold", fontSize: "1.1rem"}}>
                <div className="character-modal-label mt-2 ps-2"
                     style={{backgroundImage: 'url(/assets/img/cmm/bg_hatching.png)'}}>특성 1
                </div>
              </div>
              <div className="mt-2">
                {character.special1}
              </div>
              <div style={{fontWeight: "bold", fontSize: "1.1rem"}}>
                <div className="character-modal-label mt-2 ps-2"
                     style={{backgroundImage: 'url(/assets/img/cmm/bg_hatching.png)'}}>특성 2
                </div>
              </div>
              <div className="mt-2">
                {character.special2}
              </div>
              <div style={{fontWeight: "bold", fontSize: "1.1rem"}}>
                <div className="character-modal-label mt-2 ps-2"
                     style={{backgroundImage: 'url(/assets/img/cmm/bg_hatching.png)'}}>부스터 특성
                </div>
              </div>
              <div className="mt-2">
                {character.buSpecial}
              </div>
              {character.bigSpecial && (
                  <>
                    <div style={{fontWeight: "bold", fontSize: "1.1rem"}}>
                      <div className="character-modal-label mt-2 ps-2"
                           style={{backgroundImage: 'url(/assets/img/cmm/bg_hatching.png)'}}>빅 캐릭터 특성
                      </div>
                    </div>
                    <div className="mt-2">
                      {character.bigSpecial}
                    </div>
                  </>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>  &nbsp; </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CharacterInfoModal;
