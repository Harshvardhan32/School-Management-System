import React, { useContext, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { ThemeContext } from "../utils/ThemeContext";
import styled from "styled-components";

// Set the locale and first day of the week to Monday
const localizer = momentLocalizer(moment);

const BigCalendar = ({ events }) => {

    const { darkMode } = useContext(ThemeContext);
    const [view, setView] = useState(Views.WEEK);

    const handleOnChangeView = (selectedView) => {
        setView(selectedView);
    };

    // Styled component for Calendar
    const StyledCalendar = styled(Calendar)`
    .rbc-timeslot-group {
        background-color: #F8F9FA !important;
    }
    .rbc-header {
        background-color: #1e3a8a;  /* Header background color */
    }
    `;

    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={[Views.WEEK, Views.DAY]}
            view={view}
            onView={handleOnChangeView}
            style={{ height: '98%' }}
            className='dark:bg-slate-900'
            min={moment().set({ hour: 8, minute: 0 }).toDate()}
            max={moment().set({ hour: 17, minute: 0 }).toDate()}
            step={30}
            timeslots={2}
        />
    );
};

export default BigCalendar;