import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../../utils/axiosConfig';

function ContactForm({ addMessage }) {
    const { t, i18n } = useTranslation();
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
                className="flex flex-col justify-center items-center mx-auto lg:w-1/2 w-full"
                onSubmit={handleSubmit}
            >
                <div className="w-full p-2 rounded-xl mb-4">
                    <label htmlFor="name" className="font-semibold text-white mb-1">
                        {t('Name')}:
                    </label>
                    <input
                        id="name"
                        className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-neutral-500"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full p-2 rounded-xl mb-4">
                    <label htmlFor="email" className="font-semibold text-white mb-1">
                        {t('Email')}:
                    </label>
                    <input
                        id="email"
                        className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-neutral-500"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full p-2 rounded-xl mb-4">
                    <label htmlFor="message" className="font-semibold text-white mb-1">
                        {t('Message')}:
                    </label>
                    <textarea
                        id="message"
                        className="p-2 border border-gray-300 rounded-md w-full h-40 resize-none focus:outline-none focus:ring focus:border-neutral-500"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-neutral-200 hover:bg-neutral-600 font-bold rounded-xl py-2 px-4 mt-2 transition-colors duration-300 ease-in-out focus:outline-none focus:ring focus:border-neutral-500"
                >
                    {t('Send')}
                </button>
            </form>

    );
  }
  
  export default ContactForm;