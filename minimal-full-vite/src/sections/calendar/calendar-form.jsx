import { z as zod } from 'zod';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';

import { uuidv4 } from 'src/utils/uuidv4';
import { fIsAfter } from 'src/utils/format-time';

import { createEvent, updateEvent, deleteEvent } from 'src/actions/calendar';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';
import { ColorPicker } from 'src/components/color-utils';

// ----------------------------------------------------------------------

const SESSION_TYPES = ['Lecture', 'TD', 'TP'];
const TEACHER_OPTIONS = ['Dr. Ahmed Mansour', 'Dr. Sara Belkacem', 'Dr. Karim Ould'];
const ROOM_OPTIONS = ['A101', 'Lab201', 'S01'];
const GROUP_OPTIONS = ['CS-1A', 'CS-2B', 'MATH-1A'];

export const EventSchema = zod.object({
  title: zod
    .string()
    .min(1, { message: 'Title is required!' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  description: zod.string().optional().default(''),
  // Not required
  color: zod.string(),
  allDay: zod.boolean(),
  start: zod.union([zod.string(), zod.number()]),
  end: zod.union([zod.string(), zod.number()]),
  // Timetable-specific fields
  type: zod.string().optional().default('Lecture'),
  teacher: zod.string().optional().default(''),
  room: zod.string().optional().default(''),
  group: zod.string().optional().default(''),
});

// ----------------------------------------------------------------------

export function CalendarForm({ currentEvent, colorOptions, onClose }) {
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(EventSchema),
    defaultValues: {
      ...currentEvent,
      description: currentEvent?.description || '',
      type: currentEvent?.type || 'Lecture',
      teacher: currentEvent?.teacher || '',
      room: currentEvent?.room || '',
      group: currentEvent?.group || '',
    },
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const dateError = fIsAfter(values.start, values.end);

  const onSubmit = handleSubmit(async (data) => {
    const eventData = {
      id: currentEvent?.id ? currentEvent?.id : uuidv4(),
      color: data?.color,
      title: data?.title,
      allDay: data?.allDay,
      description: data?.description || '',
      end: data?.end,
      start: data?.start,
      // Timetable-specific fields
      type: data?.type || 'Lecture',
      teacher: data?.teacher || '',
      room: data?.room || '',
      group: data?.group || '',
    };

    try {
      if (!dateError) {
        if (currentEvent?.id) {
          await updateEvent(eventData);
          toast.success('Update success!');
        } else {
          await createEvent(eventData);
          toast.success('Create success!');
        }
        onClose();
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  });

  const onDelete = useCallback(async () => {
    try {
      await deleteEvent(`${currentEvent?.id}`);
      toast.success('Delete success!');
      onClose();
    } catch (error) {
      console.error(error);
    }
  }, [currentEvent?.id, onClose]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Scrollbar sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Stack spacing={3}>
          <Field.Text name="title" label="Course / Event Title" />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Session Type"
              >
                {SESSION_TYPES.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="teacher"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Teacher"
              >
                <MenuItem value="">— Select Teacher —</MenuItem>
                {TEACHER_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="room"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Room"
              >
                <MenuItem value="">— Select Room —</MenuItem>
                {ROOM_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="group"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Group"
              >
                <MenuItem value="">— Select Group —</MenuItem>
                {GROUP_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Field.Text name="description" label="Description (optional)" multiline rows={2} />

          <Field.Switch name="allDay" label="All day" />

          <Field.MobileDateTimePicker name="start" label="Start date" />

          <Field.MobileDateTimePicker
            name="end"
            label="End date"
            slotProps={{
              textField: {
                error: dateError,
                helperText: dateError ? 'End date must be later than start date' : null,
              },
            }}
          />

          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <ColorPicker
                selected={field.value}
                onSelectColor={(color) => field.onChange(color)}
                colors={colorOptions}
              />
            )}
          />
        </Stack>
      </Scrollbar>

      <DialogActions sx={{ flexShrink: 0 }}>
        {!!currentEvent?.id && (
          <Tooltip title="Delete event">
            <IconButton onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={dateError}
        >
          Save changes
        </LoadingButton>
      </DialogActions>
    </Form>
  );
}
