import Calendar from '@fullcalendar/react'; // => request placed at the top

import { useEffect } from 'react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fDate, fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';
import { updateEvent, useGetEvents } from 'src/actions/calendar';

import { Iconify } from 'src/components/iconify';

import { StyledCalendar } from '../styles';
import { useEvent } from '../hooks/use-event';
import { CalendarForm } from '../calendar-form';
import { useCalendar } from '../hooks/use-calendar';
import { CalendarToolbar } from '../calendar-toolbar';
import { CalendarFilters } from '../calendar-filters';
import { CalendarFiltersResult } from '../calendar-filters-result';
import { CalendarGeneratorDialog } from '../calendar-generator-dialog';

// ----------------------------------------------------------------------

export function CalendarView() {
  const theme = useTheme();

  const openFilters = useBoolean();
  const openGenerator = useBoolean();

  const { events, eventsLoading } = useGetEvents();

  const filters = useSetState({
    colors: [],
    startDate: null,
    endDate: null,
    room: 'All',
    teacher: 'All',
    group: 'All',
    department: 'All',
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const {
    calendarRef,
    //
    view,
    date,
    //
    onDatePrev,
    onDateNext,
    onDateToday,
    onDropEvent,
    onChangeView,
    onSelectRange,
    onClickEvent,
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
  } = useCalendar();

  const currentEvent = useEvent(events, selectEventId, selectedRange, openForm);

  useEffect(() => {
    onInitialView();
  }, [onInitialView]);

  const canReset =
    filters.state.colors.length > 0 || 
    (!!filters.state.startDate && !!filters.state.endDate) ||
    filters.state.room !== 'All' ||
    filters.state.teacher !== 'All' ||
    filters.state.group !== 'All' ||
    filters.state.department !== 'All';

  const dataFiltered = applyFilter({ inputData: events, filters: filters.state, dateError });

  const renderResults = (
    <CalendarFiltersResult
      filters={filters}
      totalResults={dataFiltered.length}
      sx={{ mb: { xs: 3, md: 5 } }}
    />
  );

  const flexProps = { flex: '1 1 auto', display: 'flex', flexDirection: 'column' };

  return (
    <>
      <DashboardContent maxWidth="xl" sx={{ ...flexProps }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: { xs: 3, md: 5 } }}
        >
          <Typography variant="h4">Timetable</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="success"
              startIcon={<Iconify icon="solar:play-circle-bold" />}
              onClick={openGenerator.onTrue}
            >
              Generate Timetable
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={onOpenForm}
            >
              New event
            </Button>
          </Stack>
        </Stack>

        {canReset && renderResults}

        <Card sx={{ ...flexProps, minHeight: '50vh' }}>
          <StyledCalendar sx={{ ...flexProps, '.fc.fc-media-screen': { flex: '1 1 auto' } }}>
            <CalendarToolbar
              date={fDate(date)}
              view={view}
              canReset={canReset}
              loading={eventsLoading}
              onNextDate={onDateNext}
              onPrevDate={onDatePrev}
              onToday={onDateToday}
              onChangeView={onChangeView}
              onOpenFilters={openFilters.onTrue}
            />

            <Calendar
              weekends
              editable
              droppable
              selectable
              rerenderDelay={10}
              allDayMaintainDuration
              eventResizableFromStart
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              events={dataFiltered}
              headerToolbar={false}
              select={onSelectRange}
              eventClick={onClickEvent}
              aspectRatio={3}
              hiddenDays={[5]}
              slotMinTime="08:00:00"
              slotMaxTime="17:00:00"
              eventDrop={(arg) => {
                onDropEvent(arg, updateEvent);
              }}
              eventResize={(arg) => {
                onResizeEvent(arg, updateEvent);
              }}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
              eventContent={(eventInfo) => (
                <Stack spacing={0.5} sx={{ p: 0.5, overflow: 'hidden' }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', lineHeight: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                     <Box component="span" sx={{ 
                       px: 0.5, 
                       borderRadius: 0.5, 
                       fontSize: 10, 
                       bgcolor: (eventInfo.event.extendedProps.type === 'Lecture' ? 'info.main' : 
                               (eventInfo.event.extendedProps.type === 'TD' ? 'success.main' : 
                               (eventInfo.event.extendedProps.type === 'TP' ? 'warning.main' : 'error.main'))),
                       color: 'common.white'
                     }}>
                        {eventInfo.event.extendedProps.type === 'Lecture' ? 'C' : eventInfo.event.extendedProps.type}
                     </Box>
                     {eventInfo.event.title}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 10, color: 'text.secondary', display: 'block' }}>
                     {eventInfo.event.extendedProps.teacher} | {eventInfo.event.extendedProps.room}
                  </Typography>
                </Stack>
              )}
            />
          </StyledCalendar>
        </Card>
      </DashboardContent>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openForm}
        onClose={onCloseForm}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
        PaperProps={{
          sx: {
            display: 'flex',
            overflow: 'hidden',
            flexDirection: 'column',
            '& form': { minHeight: 0, display: 'flex', flex: '1 1 auto', flexDirection: 'column' },
          },
        }}
      >
        <DialogTitle sx={{ minHeight: 76 }}>
          {openForm && <> {currentEvent?.id ? 'Edit' : 'Add'} event</>}
        </DialogTitle>

        <CalendarForm
          currentEvent={currentEvent}
          colorOptions={CALENDAR_COLOR_OPTIONS}
          onClose={onCloseForm}
        />
      </Dialog>

      <CalendarFilters
        events={events}
        filters={filters}
        canReset={canReset}
        dateError={dateError}
        open={openFilters.value}
        onClose={openFilters.onFalse}
        onClickEvent={onClickEventInFilters}
        colorOptions={CALENDAR_COLOR_OPTIONS}
      />
      <CalendarGeneratorDialog
        open={openGenerator.value}
        onClose={openGenerator.onFalse}
      />
    </>
  );
}

function applyFilter({ inputData, filters, dateError }) {
  const { colors, startDate, endDate, room, teacher, group, department } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  inputData = stabilizedThis.map((el) => el[0]);

  if (colors.length) {
    inputData = inputData.filter((event) => colors.includes(event.color));
  }

  if (room !== 'All') {
    inputData = inputData.filter((event) => event.room === room);
  }

  if (teacher !== 'All') {
    inputData = inputData.filter((event) => event.teacher === teacher);
  }

  if (group !== 'All') {
    inputData = inputData.filter((event) => event.group === group);
  }

  if (department !== 'All') {
    inputData = inputData.filter((event) => event.department === department);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((event) => fIsBetween(event.start, startDate, endDate));
    }
  }

  return inputData;
}
