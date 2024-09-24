import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCookies } from 'react-cookie';

function Home() {
  const [cookies, setCookie, removeCookie] = useCookies(['gis-pos']);

  return <div>gkgk</div>;
}

export default Home;
