import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCookies } from 'react-cookie';
import {Panel} from "../../../components/panel/panel";

function Medal() {
  const [cookies, setCookie, removeCookie] = useCookies(['gis-pos']);

  return <Panel>매달정보</Panel>;
}

export default Medal;
