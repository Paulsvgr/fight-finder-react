import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../../utils/axiosConfig';

function ContactForm({ addMessage, userUUID }) {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const [formData, setFormData] = useState({
      email: '',
      name: '',
      message: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      let newValue = value;

      // Enforce character limits
      if (name === 'name' && value.length > 100) {
        newValue = value.slice(0, 100);
      } else if (name === 'email' && value.length > 100) {
        newValue = value.slice(0, 100);
      } else if (name === 'message' && value.length > 500) {
        newValue = value.slice(0, 500);
      }

      setFormData({
        ...formData,
        [name]: newValue,
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
            useruuid: toString(userUUID)
        }
      ).then(function() {
            addMessage(t("Message send successfully!"), "green")
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
                className="flex flex-col justify-center items-center mx-auto w-full"
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
                        maxLength={100}
                        required
                    />
                    <span className="text-sm text-gray-400">
                        {formData.name.length}/{100} {t('characters')}
                    </span>
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
                        maxLength={100}
                        required
                    />
                    <span className="text-sm text-gray-400">
                        {formData.email.length}/{100} {t('characters')}
                    </span>
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
                        maxLength={250}
                        required
                    />
                    <span className="text-sm text-gray-400">
                        {formData.message.length}/{250} {t('characters')}
                    </span>
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
