import React from 'react';

const ButtonElement = ({ title, onClick, textExtra }) => {
  return (
    <button
      className={`px-3 pt-2 lg:pb-0 pb-2 ${textExtra} font-semibold whitespace-nowrap rounded transition-all duration-300 w-fit font-bold"`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default ButtonElement;
