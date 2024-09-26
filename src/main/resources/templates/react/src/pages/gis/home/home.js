import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCookies } from 'react-cookie';
import {Panel} from "../../../components/panel/panel";

function Home() {
  const [cookies, setCookie, removeCookie] = useCookies(['gis-pos']);

  return <Panel>원바러</Panel>;
}

export default Home;
