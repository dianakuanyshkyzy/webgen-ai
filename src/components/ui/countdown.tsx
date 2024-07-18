import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="px-4 py-6 mt-4 w-full max-w-[960px] max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        {Object.keys(timeLeft).map((interval, index) => (
          <div key={index} className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow whitespace-nowrap text-neutral-900 max-md:mt-10">
              <div className="justify-center items-center px-3 py-4 text-lg font-bold leading-6 bg-pink-100 rounded-xl max-md:px-5">
                {timeLeft[interval]}
              </div>
              <div className="self-center mt-4 text-sm leading-5">
                {interval.charAt(0).toUpperCase() + interval.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countdown;
