import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCookies } from 'react-cookie';

function Board() {
  const [cookies, setCookie, removeCookie] = useCookies(['gis-pos']);

  return <div>게시판</div>;
}

export default Board;
