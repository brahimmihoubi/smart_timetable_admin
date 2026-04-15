import { useRef, useState, useCallback } from 'react';

import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export function useCalendar() {
  const calendarRef = useRef(null);

  const smUp = useResponsive('up', 'sm');

  const [date, setDate] = useState(new Date());

  const [openForm, setOpenForm] = useState(false);

  const [selectEventId, setSelectEventId] = useState('');

  const [selectedRange, setSelectedRange] = useState(null);

  const [view, setView] = useState(smUp ? 'dayGridMonth' : 'listWeek');

  const onOpenForm = useCallback(() => {
    setOpenForm(true);
  }, []);

  const onCloseForm = useCallback(() => {
    setOpenForm(false);
    setSelectedRange(null);
    setSelectEventId('');
  }, []);

  const onInitialView = useCallback(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();

      const newView = smUp ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [smUp]);

  const onChangeView = useCallback(
    (newView) => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();

        calendarApi.changeView(newView);
        setView(newView);
      }
    },
    []
  );

  const onDateToday = useCallback(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  }, []);

  const onDatePrev = useCallback(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  }, []);

  const onDateNext = useCallback(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  }, []);

  const onSelectRange = useCallback(
    (arg) => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();

        calendarApi.unselect();
      }

      onOpenForm();
      setSelectedRange({ start: arg.startStr, end: arg.endStr });
    },
    [onOpenForm]
  );

  const onClickEvent = useCallback(
    (arg) => {
      const { event } = arg;

      onOpenForm();
      setSelectEventId(event.id);
    },
    [onOpenForm]
  );

  const onResizeEvent = useCallback((arg, updateEvent) => {
    const { event } = arg;

    updateEvent({
      id: event.id,
      allDay: event.allDay,
      start: event.startStr,
      end: event.endStr,
      // Preserve timetable properties
      type: event.extendedProps?.type,
      teacher: event.extendedProps?.teacher,
      room: event.extendedProps?.room,
      group: event.extendedProps?.group,
      color: event.backgroundColor || event.extendedProps?.color,
      title: event.title,
      description: event.extendedProps?.description,
    });
  }, []);

  const onDropEvent = useCallback((arg, updateEvent) => {
    const { event } = arg;

    updateEvent({
      id: event.id,
      allDay: event.allDay,
      start: event.startStr,
      end: event.endStr,
      // Preserve timetable properties
      type: event.extendedProps?.type,
      teacher: event.extendedProps?.teacher,
      room: event.extendedProps?.room,
      group: event.extendedProps?.group,
      color: event.backgroundColor || event.extendedProps?.color,
      title: event.title,
      description: event.extendedProps?.description,
    });
  }, []);

  const onClickEventInFilters = useCallback(
    (eventId) => {
      if (eventId) {
        onOpenForm();
        setSelectEventId(eventId);
      }
    },
    [onOpenForm]
  );

  return {
    calendarRef,
    //
    view,
    date,
    //
    onDatePrev,
    onDateNext,
    onDateToday,
    onDropEvent,
    onClickEvent,
    onChangeView,
    onSelectRange,
    onResizeEvent,
    onInitialView,
    //
    openForm,
    onOpenForm,
    onCloseForm,
    //
    selectEventId,
    selectedRange,
    //
    onClickEventInFilters,
  };
}
