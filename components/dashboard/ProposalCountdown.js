import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const calculateTimeRemaining = (endTime) => {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const timeLeft = end - now;

  if (timeLeft <= 0) {
    return { expired: true };
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    expired: false,
  };
};

const TimeRemaining = ({ endTime }) => {
  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(endTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeRemaining.expired) {
    return (
      <div className="flex items-center text-warning">
        <Clock className="w-3 h-3 mr-1" />
        <span className="text-xs">Voting ended</span>
      </div>
    );
  }

  // Dynamic color based on time remaining
  const getTimeColor = () => {
    const totalHours = timeRemaining.days * 24 + timeRemaining.hours;
    if (totalHours < 1) return "text-error";
    if (totalHours < 12) return "text-warning";
    return "text-success";
  };

  const timeColor = getTimeColor();

  return (
    <div className={`inline-flex items-center gap-1.5 ${timeColor}`}>
      <Clock className="w-3 h-3" />
      <div className="text-xs font-medium">
        {timeRemaining.days > 0 && <span>{timeRemaining.days}d </span>}
        <span>
          {String(timeRemaining.hours).padStart(2, "0")}:
          {String(timeRemaining.minutes).padStart(2, "0")}:
          {String(timeRemaining.seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

const TimeRemainingBadge = ({ endTime }) => {
  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(endTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeRemaining.expired) {
    return (
      <div className="bg-warning/10 text-warning px-2 py-1 rounded-full text-xs flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Ended
      </div>
    );
  }

  // Dynamic styles based on time remaining
  const getStyles = () => {
    const totalHours = timeRemaining.days * 24 + timeRemaining.hours;
    if (totalHours < 1) {
      return {
        bgColor: "bg-error/10",
        textColor: "text-error",
      };
    }
    if (totalHours < 12) {
      return {
        bgColor: "bg-warning/10",
        textColor: "text-warning",
      };
    }
    return {
      bgColor: "bg-success/10",
      textColor: "text-success",
    };
  };

  const { bgColor, textColor } = getStyles();

  let timeDisplay;
  if (timeRemaining.days > 0) {
    timeDisplay = `${timeRemaining.days}d ${timeRemaining.hours}h left`;
  } else if (timeRemaining.hours > 0) {
    timeDisplay = `${timeRemaining.hours}h ${timeRemaining.minutes}m left`;
  } else {
    timeDisplay = `${timeRemaining.minutes}m ${timeRemaining.seconds}s left`;
  }

  return (
    <div
      className={`${bgColor} ${textColor} px-2 py-1 rounded-full text-xs flex items-center gap-1`}
    >
      <Clock className="w-3 h-3" />
      {timeDisplay}
    </div>
  );
};

export { TimeRemaining, TimeRemainingBadge };
