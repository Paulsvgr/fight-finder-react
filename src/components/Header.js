import React, { useState, useEffect, useRef } from 'react'
import logoSvg from '../static/svg/logo.svg';
import hamburgerSvg from '../static/svg/hamburger.svg';
import whiteCrossSvg from '../static/svg/cross.svg';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Button from './NavButton';
import NavDropDown from './NavDropdown';
import { defaultLanguage } from '../i18n';

const Header = ({ addMessage }) => {
  const navbarRef = useRef(null);


  const { t, i18n } = useTranslation();

  const { langFromParams } = useParams();
  const [lang, setLang] = useState(langFromParams || defaultLanguage);
  const navigate = useNavigate();

  const showNavDefault = window.innerWidth >= 1024;
  const [showNav, setShowNav] = useState(showNavDefault);
  
  const handleResize = () => {
    setShowNav(window.innerWidth >= 1024);
  };

  const handleDocumentClick = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      window.innerWidth < 1024 &&
      !event.target.classList.contains('hamburger')
    ) {
      setShowNav(false);
    }
  };
  
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleDocumentClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);
  
  const handleSectionChange = (section) => {
    if (section !== '') {
      navigate(section);
      if (window.innerWidth < 1024) {
        setShowNav(false);
      };
      } else {
        setShowNav(!showNav);
    };
  };

  const changeLanguage = (newLanguage) => {
    const languageToUse = i18n.options.resources[newLanguage] ? newLanguage : defaultLanguage;
  
    i18n.changeLanguage(languageToUse);
  
    setLang(languageToUse);
    const updatedPathname = window.location.pathname.substring(3);

    navigate(`/${newLanguage}${updatedPathname}`);
  };
  
  return (
    <header className="z-40 w-full lg:w-full bg-transparent fixed top-0 right-0 lg:left-0 lg:bg-opacity-30 lg:hover:bg-opacity-95 lg:bg-black">
      <div className="flex items-center w-full justify-end lg:justify-between py-2">
        <div className="hidden lg:block w-full lg:w-fit">
          <button onClick={() => handleSectionChange(`/${lang}/home`)} className="flex ml-2 items-center">
                <img src={logoSvg} className="h-20 mr-3 bg-white pr-1 rounded-full" alt="Logo" />
            <h1 className="text-3xl font-bold whitespace-nowrap text-white">Fight Finder</h1>
          </button>
        </div>
        <div className="flex flex-col px-2 justify-end w-full">
          <button
            onClick={() => handleSectionChange(``)}
            id="navbar-btn"
            type="button"
            className="inline-flex items-center fixed top-0 right-0 m-4 ml-auto rounded-lg lg:hidden hamburger"
          >
            {showNav ? (
              <img className="hover:cursor-pointer hamburger h-[35px]" src={whiteCrossSvg} alt="Close" />
              ) : (
              <img className="hover:cursor-pointer hamburger h-[35px]" src={hamburgerSvg} alt="Menu" />
            )}
          </button>
          <div className="w-full flex justify-end lg:absolute lg:block lg:ml-[100px] lg:top-3 lg:w-fit">
          { showNav && (
            <nav ref={navbarRef} className="font-mono items-center justify-between lg:w-fit w-full max-w-[400px] min-w-[300px] lg:flex bg-black lg:bg-transparent bg-opacity-90 lg:bg-opacity-100 rounded-xl border-tr-none">
              <ul className="flex flex-col text-center lg:w-full lg:h-fit h-full justify-between lg:flex-row p-4 lg:p-0 mt-4 font-medium">
                <div className='flex flex-col text-center lg:flex-row font-medium'>
                  <Button onClick={() => handleSectionChange(`/${lang}/home`)} textExtra={'text-xl text-white'} title={t('Home')} />
                  {/* <Button onClick={() => handleSectionChange(`/${lang}/search`)} textExtra={'text-white'} title={t('Search')} /> */}
                  <NavDropDown title="Language" textExtra={'tewt-white'} buttons={
                    [
                      <Button onClick={() => changeLanguage('en')} textExtra={'text-neutral-900'} title='English' />,
                      <Button onClick={() => changeLanguage('sv')} textExtra={'text-neutral-900'} title='Svenska' />,
                    ]
                  }/>
                </div>
                <Button onClick={() => handleSectionChange(`/${lang}/admin`)} textExtra={'text-transparent hover:text-white'} title={t('Admin')} />
              </ul>
            </nav>
            )}
          </div>
        </div>
      </div>
    </header> 
  )
}

export default Header
