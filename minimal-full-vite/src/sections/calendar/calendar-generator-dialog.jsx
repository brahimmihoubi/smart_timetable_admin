import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function CalendarGeneratorDialog({ open, onClose }) {
  const [config, setConfig] = useState({
    workingDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    startTime: '08:00',
    endTime: '17:00',
    slotDuration: 90,
    allowOverlaps: false,
    smartRoomAllocation: true,
  });

  const handleDayToggle = (day) => {
    const selected = config.workingDays.includes(day)
      ? config.workingDays.filter((d) => d !== day)
      : [...config.workingDays, day];
    setConfig({ ...config, workingDays: selected });
  };

  const handleGenerate = () => {
    toast.info('Schedule generation started...');
    onClose();
    setTimeout(() => {
      toast.success('Schedule generated successfully with 0 conflicts!');
    }, 2000);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Schedule Generator Settings</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Start Time"
              type="time"
              value={config.startTime}
              onChange={(e) => setConfig({ ...config, startTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Time"
              type="time"
              value={config.endTime}
              onChange={(e) => setConfig({ ...config, endTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <TextField
            select
            fullWidth
            label="Slot Duration"
            value={config.slotDuration}
            onChange={(e) => setConfig({ ...config, slotDuration: e.target.value })}
          >
            {[60, 90, 120, 180].map((duration) => (
              <MenuItem key={duration} value={duration}>
                {duration} minutes
              </MenuItem>
            ))}
          </TextField>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Working Days</Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {DAYS.map((day) => (
                <Button
                  key={day}
                  variant={config.workingDays.includes(day) ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => handleDayToggle(day)}
                >
                  {day}
                </Button>
              ))}
            </Box>
          </Box>

          <Stack spacing={1}>
            <FormControlLabel
              control={<Switch checked={config.allowOverlaps} onChange={(e) => setConfig({ ...config, allowOverlaps: e.target.checked })} />}
              label="Allow soft overlaps (Teacher warnings)"
            />
            <FormControlLabel
              control={<Switch checked={config.smartRoomAllocation} onChange={(e) => setConfig({ ...config, smartRoomAllocation: e.target.checked })} />}
              label="Enable Smart Room Allocation"
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<Iconify icon="solar:play-circle-bold" />}
          onClick={handleGenerate}
        >
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
