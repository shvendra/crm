import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng, e) => {
    e.preventDefault(); // Prevent the default behavior (form submission or page reload)
    i18n.changeLanguage(lng);  // Change the language
  };

  return (
<div>
  <button type="button" onClick={(e) => changeLanguage('en', e)} className="language-btn">English</button>
  <button type="button" onClick={(e) => changeLanguage('hi', e)} className="language-btn">हिंदी</button>
  <button type="button" onClick={(e) => changeLanguage('mr', e)} className="language-btn">मराठी</button>
  <button type="button" onClick={(e) => changeLanguage('gu', e)} className="language-btn">ગુજરાતી</button>
</div>

  );
};

export default LanguageSwitcher;
