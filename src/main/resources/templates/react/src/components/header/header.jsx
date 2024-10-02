import React from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from '../../config/app-settings';
import PageWithMixedMenu from "./dropdown/mega";
import PageWithMegaMenu from "./dropdown/mega";
import TopMenu from "../top-menu/top-menu";
import DropdownMegaMenu from "./dropdown/mega";

function Header() {
  return (
    <AppSettings.Consumer>
      {({
        toggleAppSidebarMobile,
        toggleAppSidebarEnd,
        toggleAppSidebarEndMobile,
        toggleAppTopMenuMobile,
        appHeaderLanguageBar,
        appHeaderMegaMenu,
        appHeaderInverse,
        appSidebarTwo,
        appTopMenu,
        appSidebarNone,
      }) => (
          <div id="header" className="app-header" style={{backgroundImage:'url(/assets/img/cmm/headerbg.png)',backgroundSize: 'cover'}} data-bs-theme={appHeaderInverse ? 'dark' : ''}>
            <div className="navbar-header" >
              {appSidebarTwo && (
                  <button type="button" className="navbar-mobile-toggler" onClick={toggleAppSidebarEndMobile}>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
              )}
              <Link to='/' className='navbar-brand' style={{backgroundImage:'url(/assets/img/cmm/logocover.png)',backgroundSize: 'cover'}}>
                <img className='me-1' src='/assets/img/logo.png' width='160px' height='90px' alt='f'/>
                {/*<b>OnePiece</b> BountyRush*/}
              </Link>

              {appHeaderMegaMenu && (
                  <button type="button" className="navbar-mobile-toggler" data-bs-toggle="collapse"
                          data-bs-target="#top-navbar">
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
              )}
              {appTopMenu && !appSidebarNone && (
                  <button type="button" className="navbar-mobile-toggler" onClick={toggleAppTopMenuMobile}>
							<span className="fa-stack fa-lg text-inverse">
								<i className="far fa-square fa-stack-2x"></i>
								<i className="fa fa-cog fa-stack-1x"></i>
							</span>
                  </button>
              )}
              {appSidebarNone && appTopMenu && (
                  <button type="button" className="navbar-mobile-toggler" onClick={toggleAppTopMenuMobile}>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
              )}
              {!appSidebarNone && (
                  <button type="button" className="navbar-mobile-toggler" onClick={toggleAppSidebarMobile}>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
              )}
            </div>

            {appHeaderMegaMenu && (
                <DropdownMegaMenu/>
            )}

            {/*<div className="navbar-nav">*/}
            {/*  {appSidebarTwo && (*/}
            {/*      <div className="navbar-divider d-none d-md-block"></div>*/}
            {/*  )}*/}
            {/*  {appSidebarTwo && (*/}
            {/*      <div className="navbar-item d-none d-md-block">*/}
            {/*        <Link to="/" onClick={toggleAppSidebarEnd} className="navbar-link icon">*/}
            {/*          <i className="fa fa-th"></i>*/}
            {/*        </Link>*/}
            {/*      </div>*/}
            {/*  )}*/}
            {/*</div>*/}
          </div>
      )}
    </AppSettings.Consumer>
  );
}

export default Header;
