import React, { useState, useEffect } from 'react';

const Countdown = ({ unlockDate, onUnlock }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(unlockDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [hasUnlockedTriggered, setHasUnlockedTriggered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      // Check if unlocked
      const difference = new Date(unlockDate) - new Date();
      if (difference <= 0 && !hasUnlockedTriggered) {
        setHasUnlockedTriggered(true);
        if (onUnlock) onUnlock();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockDate, hasUnlockedTriggered, onUnlock]);

  const addLeadingZero = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  const timeItems = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {timeItems.map((item, idx) => (
        <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 p-2 rounded-2xl">
          <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tabular-nums">
            {addLeadingZero(item.value)}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide uppercase mt-0.5">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
