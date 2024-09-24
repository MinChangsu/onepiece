import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCookies } from 'react-cookie';

function Character() {
  const [cookies, setCookie, removeCookie] = useCookies(['gis-pos']);

  return <div>캐릭터정보</div>;
}

export default Character;
