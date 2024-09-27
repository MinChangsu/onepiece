import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCookies } from 'react-cookie';
import {Panel} from "../../components/panel/panel";

function Surpot() {
  const [cookies, setCookie, removeCookie] = useCookies(['gis-pos']);

  return <Panel>서포터정보</Panel>;
}

export default Surpot;
