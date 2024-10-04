import React, {useEffect, useState, useLayoutEffect} from 'react';
import {useRecoilState} from "recoil";
import {NavLink, Outlet, useLocation} from "react-router-dom";
import Header from "../components/header/header";
import Sidebar from "../components/sidebar/sidebar";
import TopMenu from "../components/top-menu/top-menu";
import Content from "../components/content/content";
import Login from "./login";
import {AppSettings} from '../config/app-settings.js';
import {slideToggle} from "../composables/slideToggle";
import loginState from "../store/loginState";
import { Link } from 'react-router-dom';
import Footer from "../components/custom/footer";
import PerfectScrollbar from "react-perfect-scrollbar";
import PageWithFooter from "../components/footer/footer";


const Main: React.FC = () => {
  const [appTheme] = useState('');
  const [appDarkMode, setAppDarkMode] = useState(true);
  const [appGradientEnabled, setAppGradientEnabled] = useState(false);
  const [appHeaderNone, setAppHeaderNone] = useState(false);
  const [appSysHeaderNone, setAppSysHeaderNone] = useState(true);
  const [appHeaderFixed, setAppHeaderFixed] = useState(true);
  const [appHeaderInverse, setAppHeaderInverse] = useState(false);
  const [appHeaderMegaMenu, setAppHeaderMegaMenu] = useState(true);
  const [appHeaderLanguageBar, setAppHeaderLanguageBar] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);
  const [appSidebarNone, setAppSidebarNone] = useState(true);
  const [appSidebarWide, setAppSidebarWide] = useState(false);
  const [appSidebarLight, setAppSidebarLight] = useState(false);
  const [appSidebarMinify, setAppSidebarMinify] = useState(false);
  const [appSidebarMobileToggled, setAppSidebarMobileToggled] = useState(false);
  const [appSidebarTransparent, setAppSidebarTransparent] = useState(false);
  const [appSidebarSearch, setAppSidebarSearch] = useState(false);
  const [appSidebarFixed, setAppSidebarFixed] = useState(true);
  const [appSidebarGrid, setAppSidebarGrid] = useState(false);
  const [appContentNone, setAppContentNone] = useState(false);
  const [appContentClass, setAppContentClass] = useState('');
  const [appContentFullHeight, setAppContentFullHeight] = useState(false);
  const [appTopMenu, setAppTopMenu] = useState(false);
  const [appTopMenuMobileToggled] = useState(false);
  const [appSidebarTwo, setAppSidebarTwo] = useState(false);
  const [appSidebarEnd, setAppSidebarEnd] = useState(false);
  const [appSidebarEndToggled, setAppSidebarEndToggled] = useState(false);
  const [appSidebarEndMobileToggled, setAppSidebarEndMobileToggled] = useState(false);

  const [isTopBtnVisible, setIsTopBtnVisible] = useState(false);

  // 추가
  const [appThemePanelNone, setAppThemePanelNone] = useState(false);
  const [loginInfo] = useRecoilState(loginState);
  const location = useLocation();

  const handleSetAppHeaderNone = (value) => {
    setAppHeaderNone(value);
  };

  const handleSetAppHeaderInverse = (value) => {
    setAppHeaderInverse(value);
  };

  const handleSetAppHeaderLanguageBar = (value) => {
    setAppHeaderLanguageBar(value);
  };

  const handleSetAppHeaderMegaMenu = (value) => {
    setAppHeaderMegaMenu(value);
  };

  const handleSetAppHeaderFixed = (value) => {
    if (value === false && appSidebarFixed) {
      alert('Default Header with Fixed Sidebar option is not supported. Proceed with Default Header with Default Sidebar.');
      setAppSidebarFixed(false);
      if (localStorage) {
        localStorage.appSidebarFixed = false;
      }
    }
    setAppHeaderFixed(value);
    if (localStorage) {
      localStorage.appHeaderFixed = value;
    }
  };

  const handleSetAppSidebarNone = (value) => {
    setAppSidebarNone(value);
  };

  const handleSetAppSidebarWide = (value) => {
    setAppSidebarWide(value);
  };

  const handleSetAppSidebarLight = (value) => {
    setAppSidebarLight(value);
  };

  const handleSetAppSidebarMinified = (value) => {
    setAppSidebarMinify(value);
  };

  const handleSetAppSidebarTransparent = (value) => {
    setAppSidebarTransparent(value);
  };

  const handleSetAppSidebarSearch = (value) => {
    setAppSidebarSearch(value);
  };

  const handleSetAppSidebarFixed = (value) => {
    if (value === true && !appHeaderFixed) {
      alert('Default Header with Fixed Sidebar option is not supported. Proceed with Fixed Header with Fixed Sidebar.');
      setAppHeaderFixed(true);
      if (localStorage) {
        localStorage.appHeaderFixed = true;
      }
    }
    setAppSidebarFixed(value);
    if (localStorage) {
      localStorage.appSidebarFixed = value;
    }
  };

  const handleSetAppSidebarGrid = (value) => {
    setAppSidebarGrid(value);
    if (localStorage) {
      localStorage.appSidebarGrid = value;
    }
  };

  const toggleAppSidebarMinify = (e) => {
    e.preventDefault();
    setAppSidebarMinify(!appSidebarMinify);
    if (localStorage) {
      localStorage.appSidebarMinify = !appSidebarMinify;
    }
  };

  const toggleAppSidebarMobile = (e) => {
    e.preventDefault();
    setAppSidebarMobileToggled(!appSidebarMobileToggled);
  };

  const handleSetAppSidebarEnd = (value) => {
    setAppSidebarEnd(value);
  };

  const handleSetAppContentNone = (value) => {
    setAppContentNone(value);
  };

  const handleSetAppContentClass = (value) => {
    setAppContentClass(value);
  };

  const handleSetAppContentFullHeight = (value) => {
    setAppContentFullHeight(value);
  };

  const handleSetAppTopMenu = (value) => {
    setAppTopMenu(value);
  };

  const toggleAppTopMenuMobile = (e) => {
    e.preventDefault();
    slideToggle(document.querySelector('.app-top-menu'));
  };

  const handleSetAppSidebarTwo = (value) => {
    setAppSidebarTwo(value);
    setAppSidebarEndToggled(value);
  };

  const handleSetAppBoxedLayout = (value) => {
    if (value === true) {
      document.body.classList.add('boxed-layout');
    } else {
      document.body.classList.remove('boxed-layout');
    }
  };

  const handleSetAppDarkMode = (value) => {
    if (value === true) {
      document.querySelector('html').setAttribute('data-bs-theme', 'dark');
    } else {
      document.querySelector('html').removeAttribute('data-bs-theme');
    }
    setAppDarkMode(value);
    if (localStorage) {
      localStorage.appDarkMode = value;
    }
    document.dispatchEvent(new Event('theme-reload'));
  };

  const handleSetAppGradientEnabled = (value) => {
    setAppGradientEnabled(value);
    if (localStorage) {
      localStorage.appGradientEnabled = value;
    }
  };

  const handleSetAppTheme = (value) => {
    var newTheme = 'theme-' + value;
    for (var x = 0; x < document.body.classList.length; x++) {
      if (document.body.classList[x].indexOf('theme-') > -1 && document.body.classList[x] !== newTheme) {
        document.body.classList.remove(document.body.classList[x]);
      }
    }
    document.body.classList.add(newTheme);

    if (localStorage && value) {
      localStorage.appTheme = value;
    }
    document.dispatchEvent(new Event('theme-reload'));
  };

  const handleSetAppThemePanelNone = (value) => {
    setAppThemePanelNone(value);
  };
  const handleSetAppSysHeaderNone = (value) => {
    setAppSysHeaderNone(value);
  };

  const toggleAppSidebarEnd = (e) => {
    e.preventDefault();
    setAppSidebarEndToggled(!appSidebarEndToggled);
  };

  const toggleAppSidebarEndMobile = (e) => {
    e.preventDefault();
    setAppSidebarEndMobileToggled(!appSidebarEndMobileToggled);
  };

  useEffect(() => {
    handleSetAppTheme(appTheme);
    if (appDarkMode) {
      handleSetAppDarkMode(true);
    }

    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsTopBtnVisible(true);
      } else {
        setIsTopBtnVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [appTheme, appDarkMode]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'  // 부드러운 스크롤
    });
  };

  //<--뒤로가기시 관리자페이지 헤더나오는 오류 수정 시작(09.04)
  // useLayoutEffect(() => {
  //   // /#인 경우 남아있는 오류 수정 추가
  //   if(location.pathname === '/'  || location.pathname === '/' &&  location.hash === '#' ){
  //     handleSetAppHeaderNone(false)
  //     handleSetAppThemePanelNone(false);
  //     handleSetAppSysHeaderNone(true);
  //     handleSetAppSidebarNone(true);
  //   }
  // }, [location.pathname, location.hash ]);
  //뒤로가기시 관리자페이지 헤더나오는 오류 수정 끝 (09.04)  -->


  if (true) {
    return (
        <AppSettings.Provider
            value={{
              appTheme,
              appDarkMode,
              appGradientEnabled,
              appHeaderNone,
              appHeaderFixed,
              appHeaderInverse,
              appHeaderMegaMenu,
              appHeaderLanguageBar,
              hasScroll,
              handleSetAppHeaderNone,
              handleSetAppHeaderInverse,
              handleSetAppHeaderLanguageBar,
              handleSetAppHeaderMegaMenu,
              handleSetAppHeaderFixed,
              appSidebarNone,
              appSidebarWide,
              appSidebarLight,
              appSidebarMinify,
              appSidebarMobileToggled,
              appSidebarTransparent,
              appSidebarSearch,
              appSidebarFixed,
              appSidebarGrid,
              handleSetAppSidebarNone,
              handleSetAppSidebarWide,
              handleSetAppSidebarLight,
              handleSetAppSidebarMinified,
              handleSetAppSidebarTransparent,
              handleSetAppSidebarSearch,
              handleSetAppSidebarFixed,
              handleSetAppSidebarGrid,
              toggleAppSidebarMinify,
              toggleAppSidebarMobile,
              appContentNone,
              appContentClass,
              appContentFullHeight,
              handleSetAppContentNone,
              handleSetAppContentClass,
              handleSetAppContentFullHeight,
              appTopMenu,
              appTopMenuMobileToggled,
              toggleAppTopMenuMobile,
              handleSetAppTopMenu,
              appSidebarTwo,
              handleSetAppSidebarTwo,
              appSidebarEnd,
              appSidebarEndToggled,
              appSidebarEndMobileToggled,
              toggleAppSidebarEnd,
              toggleAppSidebarEndMobile,
              handleSetAppSidebarEnd,
              handleSetAppBoxedLayout,
              handleSetAppDarkMode,
              handleSetAppGradientEnabled,
              handleSetAppTheme,
              handleSetAppThemePanelNone,
              handleSetAppSysHeaderNone,
            }}
        >

          <div
              className={
                  'app app-content-full-height2 app-without-header app-sidebar-fixed app-without-sidebar '
              }
          >
            <div className="d-none d-lg-flex">
              <Header/>
            </div>
            {appTopMenu && <TopMenu/>}
            <div className="d-lg-flex d-none h-100 d-flex flex-column">
              <div style={{
                backgroundImage: 'url(/assets/img/cmm/mainBg.png)',
                backgroundSize: '100% 100%',
                backgroundRepeat: "no-repeat",
                height: '100vh',
              }}>
                <Link to='/'>
                  <h1 className="top-main--logo">
                    <span>
                      <img src="/assets/img/cmm/logo.png" alt="ONE PIECE BOUNTY RUSH"/>
                    </span>
                  </h1>
                </Link>
                <div class="top-main--store"
                     style={{backgroundImage: 'url(/assets/img/cmm/bg_store-btn-large.png.webp)'}}>
                  <ul class="top-main--store-list">
                    <li className="top-main--store-list__item">
                      <a href="https://app.adjust.com/drv77ri?campaign=iOS&amp;fallback=https://apps.apple.com/us/app/id1343688545?mt=8%E2%80%BB%E3%82%A2%E3%83%A1%E3%83%AA%E3%82%AB"
                         target="_blank">
                        <img src="/assets/img/cmm/btn_appstore.png.webp" alt="Download on the App Store"/>
                      </a>
                    </li>
                    <li className="top-main--store-list__item">
                      <a href="https://app.adjust.com/4lkrf6e?campaign=Android&amp;fallback=https://play.google.com/store/apps/details?id=com.bandainamcoent.opbrww"
                         target="_blank">
                        <img src="/assets/img/cmm/btn_googleplay.png.webp" alt=""/>
                      </a>
                    </li>
                    <li className="top-main--store-list__item">
                      <a href="https://store.steampowered.com/app/2918150/ONE_PIECE/" target="_blank">
                        <img src="/assets/img/cmm/btn_steam.png.webp" alt="Steam"/>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="d-lg-none d-flex h-100 d-flex flex-column">
              <div style={{
                backgroundImage: 'url(/assets/img/cmm/mainBg2.png.webp)',
                height: '100vh',
                backgroundSize: 'cover',
              }}>
                <Link to='/'>
                  <h1 className="top-main--logo">
                    <span>
                      <img src="/assets/img/cmm/logo.png" alt="ONE PIECE BOUNTY RUSH"/>
                    </span>
                  </h1>
                </Link>
                <div className="top-main-menu px-5">
                  <Link className="main-link" to='/content/character'>
                    <div className="m-2 top-main-menu-item"
                         style={{backgroundImage: 'url(/assets/img/cmm/bg_btn.png.webp)'}}>캐릭터 정보 확인 >
                    </div>
                  </Link>
                  <Link className="main-link" to='/content/surpot'>
                    <div className="m-2 top-main-menu-item"
                         style={{backgroundImage: 'url(/assets/img/cmm/bg_btn.png.webp)'}}>서포터 맞추기 >
                    </div>
                  </Link>
                  <Link className="main-link" to='/content/medal'>
                    <div className="m-2 top-main-menu-item"
                         style={{backgroundImage: 'url(/assets/img/cmm/bg_btn.png.webp)'}}>매달 정보 확인 >
                    </div>
                  </Link>
                  <Link className="main-link" to='/content/board'>
                    <div className="m-2 top-main-menu-item"
                         style={{backgroundImage: 'url(/assets/img/cmm/bg_btn.png.webp)'}}>게시판 >
                    </div>
                  </Link>
                </div>
                <div class="top-main--store "
                     style={{backgroundImage: 'url(/assets/img/cmm/bg_store-btn-large.png.webp)'}}>
                  <ul class="top-main--store-list">
                    <li className="top-main--store-list__item">
                      <a href="https://app.adjust.com/drv77ri?campaign=iOS&amp;fallback=https://apps.apple.com/us/app/id1343688545?mt=8%E2%80%BB%E3%82%A2%E3%83%A1%E3%83%AA%E3%82%AB"
                         target="_blank">
                        <img src="/assets/img/cmm/btn_appstore.png.webp" alt="Download on the App Store"/>
                      </a>
                    </li>
                    <li className="top-main--store-list__item">
                      <a href="https://app.adjust.com/4lkrf6e?campaign=Android&amp;fallback=https://play.google.com/store/apps/details?id=com.bandainamcoent.opbrww"
                         target="_blank">
                        <img src="/assets/img/cmm/btn_googleplay.png.webp" alt=""/>
                      </a>
                    </li>
                    <li className="top-main--store-list__item">
                      <a href="https://store.steampowered.com/app/2918150/ONE_PIECE/" target="_blank">
                        <img src="/assets/img/cmm/btn_steam.png.webp" alt="Steam"/>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>



            <button
                className={`btn btn-icon btn-circle btn-theme btn-scroll-to-top ${isTopBtnVisible ? 'show' : ''}`}
                onClick={scrollToTop}
            ><img src="/assets/img/cmm/pagetop.png" alt=""/></button>
            <PageWithFooter/>
          </div>
        </AppSettings.Provider>

    )
        ;
  } else {
    return (
        <AppSettings.Provider
            value={{
              handleSetAppHeaderNone,
              handleSetAppSidebarNone,
              handleSetAppContentClass,
              handleSetAppThemePanelNone,
              handleSetAppSysHeaderNone,
            }}>
          <Login/>
        </AppSettings.Provider>
    );
  }
}

export default Main;
