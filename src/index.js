import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom'
import i18n, { defaultLanguage } from './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <App currentLanguage={defaultLanguage} />
      </I18nextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);