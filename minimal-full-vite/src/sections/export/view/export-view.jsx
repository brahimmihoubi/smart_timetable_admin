import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export function ExportView() {
  const handleExport = (type) => {
    toast.success(`Exporting as ${type}...`);
    // Logic for actual export would go here
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Export Timetable"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Export' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        <Card sx={{ textAlign: 'center', p: 5 }}>
          <Iconify icon="vscode-icons:file-type-pdf2" width={64} sx={{ mb: 2, mx: 'auto' }} />
          <Typography variant="h6">PDF Document</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, mb: 3 }}>
            Export the current schedule as a high-quality PDF.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:download-fill" />}
            onClick={() => handleExport('PDF')}
          >
            Download PDF
          </Button>
        </Card>

        <Card sx={{ textAlign: 'center', p: 5 }}>
          <Iconify icon="vscode-icons:file-type-excel" width={64} sx={{ mb: 2, mx: 'auto' }} />
          <Typography variant="h6">Excel Spreadsheet</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, mb: 3 }}>
            Export all data as an Excel file (.xlsx).
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={<Iconify icon="eva:download-fill" />}
            onClick={() => handleExport('Excel')}
          >
            Export Excel
          </Button>
        </Card>

        <Card sx={{ textAlign: 'center', p: 5 }}>
          <Iconify icon="vscode-icons:file-type-text" width={64} sx={{ mb: 2, mx: 'auto' }} />
          <Typography variant="h6">CSV File</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, mb: 3 }}>
            Standard comma-separated values for data analysis.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="info"
            startIcon={<Iconify icon="eva:download-fill" />}
            onClick={() => handleExport('CSV')}
          >
            Export CSV
          </Button>
        </Card>
      </Box>

      <Card sx={{ mt: 5 }}>
        <CardHeader title="Print Options" subheader="Configure specific views for printing" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="body2">
            Generate print-friendly versions for specific groups or teachers.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<Iconify icon="solar:users-group-rounded-bold" />}>
              Group Printouts
            </Button>
            <Button variant="outlined" startIcon={<Iconify icon="solar:user-bold" />}>
              Teacher Schedules
            </Button>
          </Stack>
        </Stack>
      </Card>
    </DashboardContent>
  );
}
