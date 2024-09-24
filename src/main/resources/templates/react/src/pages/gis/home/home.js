import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCookies } from 'react-cookie';

function Home() {
  const [cookies, setCookie, removeCookie] = useCookies(['gis-pos']);

  return <div>원바러</div>;
}

export default Home;
