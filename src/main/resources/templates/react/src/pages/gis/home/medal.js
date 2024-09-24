import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCookies } from 'react-cookie';

function Medal() {
  const [cookies, setCookie, removeCookie] = useCookies(['gis-pos']);

  return <div>매달정보</div>;
}

export default Medal;
