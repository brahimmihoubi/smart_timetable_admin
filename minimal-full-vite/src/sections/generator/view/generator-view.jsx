import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function GeneratorView() {
  const [config, setConfig] = useState({
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '08:00',
    endTime: '18:00',
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
    // Simulated delay
    setTimeout(() => {
      toast.success('Schedule generated successfully with 0 conflicts!');
    }, 2000);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Schedule Generator"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Generator' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Card>
            <CardHeader title="Time Slot Configuration" subheader="Define the structure of your working days" />
            <Stack spacing={3} sx={{ p: 3 }}>
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
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardHeader title="Advanced Constraints" subheader="Tweak algorithm behavior" />
            <Stack spacing={2} sx={{ p: 3 }}>
              <FormControlLabel
                control={<Switch checked={config.allowOverlaps} onChange={(e) => setConfig({ ...config, allowOverlaps: e.target.checked })} />}
                label="Allow soft overlaps (Teacher warnings)"
              />
              <FormControlLabel
                control={<Switch checked={config.smartRoomAllocation} onChange={(e) => setConfig({ ...config, smartRoomAllocation: e.target.checked })} />}
                label="Enable Smart Room Allocation (Prioritize capacity fit)"
              />
              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  The engine will attempt to satisfy all hard constraints (No room collisions, No teacher collisions, No group collisions).
                </Typography>
              </Box>

              <Button
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="solar:play-circle-bold" />}
                onClick={handleGenerate}
                sx={{ mt: 2 }}
              >
                Generate Final Schedule
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
