import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {  useNavigate, useLocation } from 'react-router-dom';
import QueryString from 'query-string';

const StripeRedirect = ({ addMessage }) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const navigate = useNavigate();
    const location = useLocation();
    const params = QueryString.parse(location.search);
    
    console.log("PARAMS", params)
    useEffect(() => {
        if (params.canceled) {
            if (params.product) {
                addMessage(`${t('Payment for')} ${params.product} was canceled`, 'red')
            } else {
                addMessage(t('Payment was canceled'), 'red')
            }
        } else if (params.successed) {
            if (params.product) {
                addMessage(`${t('Payment for')} ${params.product} was successfull`, 'green')
            } else {
                addMessage(t('Payment was successfull'), 'green')
            }
        }
        if (params.page) {
            navigate(`/${currentLanguage}/${params.page}/`)
        } else {
            navigate(`/${currentLanguage}/home/`)
        }
    }, [addMessage, params, navigate, t, currentLanguage]);

    return (
        <div className='w-full h-full bg-neutral-700'>
        </div>
    );
};

export default StripeRedirect;