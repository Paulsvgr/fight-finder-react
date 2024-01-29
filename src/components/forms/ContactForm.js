import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../../utils/axiosConfig';

function ContactForm({ addMessage }) {
    const { t, i18n } = useTranslation(); // Use the t function for translations
    const currentLanguage = i18n.language;

    const [formData, setFormData] = useState({
      email: '',
      name: '',
      message: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();

      const { name, email, message } = formData;

      client.post(
        `/${currentLanguage}/api/send-admin-email/`,
        {
            name: name,
            email: email,
            message: message,
        }
      ).then(function(res) {
            addMessage(res.data.msg, res.data.color)
     }).catch(function(error) {
            if (error.response) {
                console.log(error.response)
                addMessage(t("You can't send more emails to admin for now"), 'red')
            }
    })
    };
  
    return (
    <form
        id="contact-form"
        className="flex flex-col justify-cneter items-center ml-auto mr-auto w-full lg:w-1/2"
        onSubmit={handleSubmit}
        >
        <div className="p-2 rounded-xl flex flex-col justify-start w-full">
            <div>
                <span className="antialiased font-semibold mr-2">
                    {t('Name')}:
                </span>
            </div>
            <div className="border-solid border bg-white border-black">
                <input
                    className='p-1 w-full'
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>
        </div>
        <div className="p-2 rounded-xl flex flex-col justify-start w-full">
            <div>
                <span className="antialiased font-semibold mr-2">
                    {t('Email')}:
                </span>
            </div>
            <div className="border-solid border bg-white border-black">
                <input
                    className='p-1 w-full'
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
        </div>
        <div className="p-2 rounded-xl flex flex-col justify-start w-full">
            <div>
                <span className="antialiased font-semibold mr-2">
                    {t('Message')}:
                </span>
            </div>
            <div className="border-solid border bg-white h-fit border-black">
                <textarea
                    className='p-1 w-full h-full'
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                />
            </div>
        </div>
        <input
            className="bg-gray-200 mb-2 ml-auto mr-auto hover:bg-gray-600 hover:text-white rounded-xl w-fit px-4 py-2 mt-1 font-bold hover:cursor-pointer"
            type="submit"
            value={t('Send')}
        />
    </form>
    );
  }
  
  export default ContactForm;