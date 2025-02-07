import moment from 'moment';
import styled from 'styled-components';
import { useContext, useState } from 'react';
import { ThemeContext } from '../utils/ThemeContext';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';

const localizer = momentLocalizer(moment);

// Styled component for Calendar
const StyledCalendar = styled(Calendar)`
    .rbc-timeslot-group {
        background-color: ${(props) => props.darkMode ? '#1e293b' : '#F8F9FA'} !important;
    },
    .rbc-time-view {
        border-color: ${(props) => props.darkMode ? '#374151 ' : '#eee'} !important;
    }
    .rbc-time-content > * + * > * {
        border-color: ${(props) => props.darkMode ? '#374151 ' : '#eee'} !important;
    }
    .rbc-timeslot-group {
        border-color: ${(props) => props.darkMode ? '#374151 ' : '#eee'} !important;
    }
    .rbc-day-slot .rbc-time-slot {
        border-color: ${(props) => props.darkMode ? '374151' : '#eee'} !important;  
    }
`;

const BigCalender = ({ events }) => {

    const { darkMode } = useContext(ThemeContext);
    const [view, setView] = useState(Views.WEEK);

    const handleOnChangeView = (selectedView) => {
        setView(selectedView);
    };

    return (
        <StyledCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={[Views.WEEK, Views.DAY]}
            view={view}
            onView={handleOnChangeView}
            style={{ height: '98%' }}
            className="dark:text-gray-200 dark:bg-slate-900"
            darkMode={darkMode}
            min={moment().set({ hour: 8, minute: 0 }).toDate()}
            max={moment().set({ hour: 17, minute: 0 }).toDate()}
            step={30}
            timeslots={2}
        />
    );
};

export default BigCalender;