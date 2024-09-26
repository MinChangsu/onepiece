import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCookies } from 'react-cookie';
import {Panel} from "../../../components/panel/panel";

function Board() {
  const [cookies, setCookie, removeCookie] = useCookies(['gis-pos']);

  return <Panel>게시판</Panel>;
}

export default Board;
