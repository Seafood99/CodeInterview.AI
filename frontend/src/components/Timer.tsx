import React from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  timer: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const Timer: React.FC<TimerProps> = ({ timer }) => (
  <div className="flex items-center space-x-2 text-gray-600">
    <Clock className="h-4 w-4" />
    <span className="font-mono">{formatTime(timer)}</span>
  </div>
);

export default Timer;
