import { useState } from "react";
import { Webhook } from "lucide-react";
import { Workflow } from "lucide-react";
import { Landmark } from "lucide-react";
import { AlarmClockCheckIcon } from "lucide-react";
import { Calendar } from "lucide-react";
import React from "react";
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const WithdrawSchedule = () => {
  const [schedule, setSchedule] = useState<Record<string, boolean>>(
    Object.fromEntries(days.map((d) => [d, true]))
  );

  const toggleDay = (day: string, value: boolean) => {
    setSchedule((prev) => ({ ...prev, [day]: value }));
  };

  return (
    <div className="">
        
      <h2 className="text-xl font-semibold mb-6">Withdraw Schedule</h2>
      <div className='h-20 bg-gray-200 mt-10 pt-2 dark:bg-gray-800 flex w-full'>
                <button className=' flex p-5 rounded-xl ml-3 dark:text-white h-15 text-blue'><Webhook />Pending Withdraw</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Workflow />Automatic Method</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Landmark />Manual Method</button>
                <button className='bg-sky-700 flex p-5 rounded-xl ml-3 dark:text-white h-15 text-white'><AlarmClockCheckIcon />Withdraw Schedule</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Calendar />Withdraw History</button>
            </div>

      <div className="space-y-4 mt-10">
        {days.map((day) => (
          <div
            key={day}
            className="flex items-center justify-between w-full"
          >
            <span className="w-32 text-gray-700">{day}</span>

            <div className="flex w-full max-w-md">
              {/* Enable Button */}
              <button
                className={`w-1/2 py-2 rounded-l-md font-medium ${
                  schedule[day]
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => toggleDay(day, true)}
              >
                Enable
              </button>

              {/* Disable Button */}
              <button
                className={`w-1/2 py-2 rounded-r-md font-medium ${
                  !schedule[day]
                    ? "bg-purple-100 text-gray-600"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => toggleDay(day, false)}
              >
                Disabled
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <button className="w-100 bg-purple-600 text-white py-3 rounded-lg font-medium flex justify-center">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default WithdrawSchedule;
