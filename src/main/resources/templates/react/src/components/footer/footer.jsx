import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../panel/panel';
import { AppSettings } from '../../config/app-settings';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Highlight from 'react-highlight';

function PageWithFooter() {
  const context = React.useContext(AppSettings);
  const [code1, setCode1] = useState();

  useEffect(() => {
    context.handleSetAppContentFullHeight(true);
    context.handleSetAppContentClass(' p-0 d-flex flex-column');
    //
    // fetch('/assets/data/page-with-fixed-footer/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });

    return () => {
      context.handleSetAppContentFullHeight(false);
      context.handleSetAppContentClass('');
    };
    // eslint-disable-next-line
  }, []);

  return (

      <div id="footer" className="app-footer m-0">
        &copy; 2024 OnePieceBountyRush Util by MinChangSu
        <br/>
        &copy; Eiichiro Oda/2022 "One Piece" production committee
        <br/>
        &copy; Eiichiro Oda/Shueisha, Toei Animation
        <br/>
        &copy; Bandai Namco Entertainment Inc.
      </div>

  );
}

export default PageWithFooter;