import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ buttons, title, textSize }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  // Attach a click event listener to the document
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleButtonClick = () => {
    // Toggle the visibility of the dropdown
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className="group relative flex justify-start w-fit" ref={dropdownRef}>
      <button
        className={`px-3 pt-2 lg:mt-2 pb-2 ${textSize} text-white group-hover:bg-white group-hover:text-neutral-900 font-semibold whitespace-nowrap rounded transition-all w-fit font-bold"`}
        onClick={handleButtonClick}
      >
        {title}
      </button>
      <div
        className={`${
          isDropdownVisible ? 'block' : 'hidden'
        } w-max p-2 z-40 bg-white rounded transition-all duration-300 text-left absolute left-full lg:left-0 top-0 lg:top-[90%] top-0`}
      >
        <ul>
          {buttons.map((button, index) => (
            <li key={index} className="whitespace-nowrap">
              {button}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;

