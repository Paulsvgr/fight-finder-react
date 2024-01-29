import GreenCrossSVG from '../static/svg/green_cross.svg';
import RedCrossSVG from '../static/svg/red_cross.svg';
import GrayCrossSVG from '../static/svg/gray_cross.svg';
import React, { useState } from 'react';

function Message({ message }) {

  const [text, code, index] = message

  console.log("REPSSONSE HERERE",message)

  const [isDismissed, setIsDismissed] = useState(false);

  const handleDelete = () => {
    setIsDismissed(true);
  };

  const getClassName = (code) => {
    let className = "rounded border-2 w-4/5 text-semibold whitespace-normal message";
    
    if (code === "green") {
      className += " bg-green-200 border-green-600 text-green-600";
    } else if (code === "red") {
      className += " bg-red-200 border-red-600 text-red-600";
    } else if (code === "gray") {
      className += " bg-gray-200 border-gray-600 text-gray-600";
    }
  
    return className;
  };

  return (
    !isDismissed && (
      <div index={index} className={getClassName(code)}>
        <div className="w-full flex justify-between">
          <div className="p-2 pr-0">
            <p className="text-xl whitespace-normal">{text}</p>
          </div>
          <div className="flex justify-end items-center h-min">
            <div className="w-[20px] h-[20px] m-2">
              <img
                onClick={handleDelete}
                className="hover:cursor-pointer close"
                src={code === 'green' ? GreenCrossSVG : code === 'red' ? RedCrossSVG : GrayCrossSVG}
                alt="Close"
              />
            </div>
          </div>
        </div>
      </div>
    )
  );
}


export default Message;
