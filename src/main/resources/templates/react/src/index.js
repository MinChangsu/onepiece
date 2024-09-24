import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter, useRoutes } from 'react-router-dom';
import AppRoute from './config/app-route.jsx';

// bootstrap
import 'bootstrap';

// css
import '@fortawesome/fontawesome-free/css/all.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './index.css';
import './scss/font.scss';
import './scss/react.scss';
import './scss/custom.scss';
import { RecoilRoot } from 'recoil';

const container = document.getElementById('root');
const root = createRoot(container);
function App() {
  return useRoutes(AppRoute);
}

root.render(
  <RecoilRoot>
    {/*<BrowserRouter>*/}
    <HashRouter>
      <App />
    </HashRouter>
    {/*</BrowserRouter>*/}
  </RecoilRoot>,
);
