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

const AppRoute = [
  {
    path: '*',
    element: <App />,
    children: [
      { path: '', element: <Home /> },
      { path: 'sys', element: <Usr /> },

      {
        path: 'sys/cmn/*',
        element: <Outlet />,
        children: [
          { path: 'CMNNtc', element: <CmnNtc /> },
          { path: 'CMNStdCd', element: <CmnStdCd /> },
          { path: 'CMNPds', element: <CmnPds /> },
          { path: 'CMNLog', element: <CMNLog /> },
          // { path: 'CMNHist', element: <CmnHist /> },
        ],
      },

      {
        path: 'sys/usr/*',
        element: <Outlet />,
        children: [
          { path: '', element: <Usr /> },
          // { path: 'Auth', element: <Auth /> },
        ],
      },

      {
        path: 'sys/site/*',
        element: <Outlet />,
        children: [
          { path: 'SiteMng', element: <SiteMng /> },
          // { path: 'Auth', element: <Auth /> },
        ],
      },
    ],
  },
];

export default AppRoute;
