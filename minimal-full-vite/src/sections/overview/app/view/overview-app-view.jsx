import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useMockedUser } from 'src/auth/hooks';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useMockedUser();
  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            description="Manage your university scheduling system. Generate conflict-free timetables and monitor resource utilization."
            img={<SeoIllustration hideBackground />}
            action={
              <Button variant="contained" color="success" onClick={() => toast.info('Starting schedule generation engine...')}>
                Generate Timetable
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
           <AppWidget
              title="Generation Status"
              total={100}
              icon="solar:check-read-linear"
              chart={{ series: 100 }}
              sx={{ height: '100%' }}
            />
        </Grid>

        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Total Rooms"
            percent={0}
            total={42}
            chart={{
              colors: [theme.vars.palette.primary.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [42, 42, 42, 42, 42, 42, 42, 42],
            }}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Total Teachers"
            percent={2.5}
            total={156}
            chart={{
              colors: [theme.vars.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [140, 142, 145, 148, 150, 152, 154, 156],
            }}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Total Courses"
            percent={-0.5}
            total={84}
            chart={{
              colors: [theme.vars.palette.warning.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [90, 89, 88, 87, 86, 85, 84, 84],
            }}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Active Conflicts"
            percent={-100}
            total={0}
            chart={{
              colors: [theme.vars.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [12, 10, 8, 5, 3, 2, 1, 0],
            }}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <AppAreaInstalled
            title="Resource Utilization"
            subheader="Comparison of Room vs Teacher load"
            chart={{
              categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
              series: [
                {
                  name: 'Current Week',
                  data: [
                    { name: 'Room Occupancy', data: [85, 90, 75, 80, 70, 40] },
                    { name: 'Teacher Load', data: [70, 75, 80, 85, 60, 30] },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>System Overview</Typography>
            <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Main Building Capacity</Typography>
                  <Typography variant="subtitle2">85%</Typography>
               </Box>
               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Teacher Availability</Typography>
                  <Typography variant="subtitle2">92%</Typography>
               </Box>
               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Constraint Satisfaction</Typography>
                  <Typography variant="subtitle2">100%</Typography>
               </Box>
            </Box>
            <Button variant="outlined" color="success" sx={{ mt: 3 }} startIcon={<Iconify icon="solar:chart-bold" />}>
              View Detailed Analytics
            </Button>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
