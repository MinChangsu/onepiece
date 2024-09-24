import React from 'react';
import App from '../app.js';
import Home from '../pages/gis/home/home.js';
import CmnNtc from '../pages/sys/cmn/cmnNtc';
import { Outlet } from 'react-router-dom';
import CmnPds from '../pages/sys/cmn/cmnPds';
import Usr from '../pages/sys/usr/usr';
import CmnStdCd from '../pages/sys/cmn/cmnStdCd';
import CMNLog from '../pages/sys/cmn/cmnLog';
import SiteMng from '../pages/sys/site/siteMng';
import Surpot from "../pages/gis/home/surpot";
import Medal from "../pages/gis/home/medal";
import Character from "../pages/gis/home/character";
import Board from "../pages/gis/home/board";

const AppRoute = [
  {
    path: '*',
    element: <App />,
    children: [
      { path: '', element: <Home /> },

      {
        path: 'character',
        element: <Character />,
        children: [
        ],
      },
      {
        path: 'surpot',
        element: <Surpot />,
        children: [
        ],
      },
      {
        path: 'medal',
        element: <Medal />,
        children: [
        ],
      },
      {
        path: 'board',
        element: <Board />,
        children: [
        ],
      },

      // {
      //   path: 'sys/usr/*',
      //   element: <Outlet />,
      //   children: [
      //     { path: '', element: <Usr /> },
      //     // { path: 'Auth', element: <Auth /> },
      //   ],
      // },
      //
      // {
      //   path: 'sys/site/*',
      //   element: <Outlet />,
      //   children: [
      //     { path: 'SiteMng', element: <SiteMng /> },
      //     // { path: 'Auth', element: <Auth /> },
      //   ],
      // },
    ],
  },
];

export default AppRoute;
