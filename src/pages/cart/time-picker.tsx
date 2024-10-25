import React, { FC, useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { shippingInfoState } from "state";
import { displayHalfAnHourTimeRange, fromMilisToDate } from "utils/date";
import { matchStatusBarColor } from "utils/device";
import { Picker } from "zmp-ui";

export const TimePicker: FC = () => {
  const [globalState, setGlobalState] = useRecoilState(shippingInfoState)
  const [date, setDate] = useState(+new Date());
  const [milis, setMilis] = useState(globalState.shippingTime);

  useEffect(() => {
    onChoosingShipTime()
  }, [])

  const availableDates = useMemo(() => {
    const days: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      days.push(nextDay);
    }
    return days;
  }, []);

  const availableTimes = useMemo(() => {
    const times: Date[] = [];
    const now = new Date(date); // Use the current date from state
    let time = new Date();
    // If the current time is after 4 PM, set the starting time to 7 AM tomorrow
    if (now.getHours() >= 17) {
      time.setHours(7);
      time.setMinutes(0);
    } else if (now.getDate() === new Date().getDate()) {
      // Starting time is the current time rounded up to the nearest 30 minutes
      const minutes = Math.ceil(now.getMinutes() / 30) * 30;
      time.setHours(now.getHours());
      time.setMinutes(minutes);
    } else {
      // Starting time is 7:00
      time.setHours(7);
      time.setMinutes(0);
    }

    time.setSeconds(0);
    time.setMilliseconds(0);

    const endTime = new Date();
    endTime.setHours(17);
    endTime.setMinutes(30);
    endTime.setSeconds(0);
    endTime.setMilliseconds(0);

    while (time <= endTime) {
      times.push(new Date(time));
      time.setMinutes(time.getMinutes() + 30);
    }
    return times;
  }, [date]);

  const onChoosingShipTime = () => {
    let mutabletMilis = milis
    // Check if the selected date is today
    const selectedDate = new Date();
    const today = new Date();
    if (selectedDate.getDate() === today.getDate() && selectedDate.getHours() >= 17) {
      mutabletMilis = +milis + 86400000
    }
    setGlobalState({ ...globalState, shippingTime: mutabletMilis })
  }

  return (
    <Picker
      mask
      maskClosable
      onVisibilityChange={(visbile) => matchStatusBarColor(visbile)}
      inputClass="border-none bg-transparent text-sm text-primary font-medium text-md m-0 p-0 h-auto"
      placeholder="Chọn thời gian nhận hàng"
      title="Thời gian nhận hàng"
      value={{
        date,
        time: availableTimes.find((t) => +t === milis)
          ? milis
          : +availableTimes[0],
      }}
      formatPickedValueDisplay={({ date, time }) => 
        time
          ? displayHalfAnHourTimeRange(new Date(time.value))
        // `${displayHalfAnHourTimeRange(new Date(time.value))}, ${displayDate(new Date(date.value),)}`
          : `Chọn thời gian`
      }
      onChange={({ date, time }) => {
        if (date) {
          setDate(+date.value);
        }
        if (time) {
          setMilis(+time.value);
        }
      }}
      data={[
        {
          options: availableTimes.map((time, i) => ({
            displayName: displayHalfAnHourTimeRange(time),
            value: +time,
          })),
          name: "time",
        },
        // {
        //   options: availableDates.map((date, i) => ({
        //     displayName: displayDate(date, true),
        //     value: +date,
        //   })),
        //   name: "date",
        // },
      ]}
      action={{
        text: "Chọn thời gian giao hàng này",
        onClick: onChoosingShipTime,
        close: true
      }}
    />
  );
};
