import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
    const [view, setView] = useState(Views.WORK_WEEK);

    const handleOnChangeView = (selectedView) => {
        setView(selectedView);
    };

    const calendarEvents = [
        {
            allDay: false,
            endDate: new Date('December 10, 2017 11:13:00'),
            startDate: new Date('December 09, 2017 11:13:00'),
            title: 'hi',
        },
        {
            allDay: true,
            endDate: new Date('December 09, 2017 11:13:00'),
            startDate: new Date('December 09, 2017 11:13:00'),
            title: 'All Day Event',
        },
    ];

    return (
        <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            views={[Views.WORK_WEEK, Views.DAY]}  // Use Views constants here
            view={view}
            style={{ height: "98%" }}
            onView={handleOnChangeView}
            min={new Date(2025, 1, 0, 8, 0, 0)}
            max={new Date(2025, 1, 0, 17, 0, 0)}
        />
    );
};

export default BigCalendar;