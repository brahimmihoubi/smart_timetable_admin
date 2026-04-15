import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { orderBy } from 'src/utils/helper';
import { fDate, fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ColorPicker } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export function CalendarFilters({
  open,
  events,
  onClose,
  filters,
  canReset,
  dateError,
  colorOptions,
  onClickEvent,
}) {
  const handleFilterColors = useCallback(
    (newValue) => {
      filters.setState({ colors: newValue });
    },
    [filters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      filters.setState({ startDate: newValue });
    },
    [filters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      filters.setState({ endDate: newValue });
    },
    [filters]
  );

  const renderHead = (
    <>
      <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Filters
        </Typography>

        <Tooltip title="Reset">
          <IconButton onClick={filters.onResetState}>
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:restart-bold" />
            </Badge>
          </IconButton>
        </Tooltip>

        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </>
  );

  const renderColors = (
    <Box display="flex" flexDirection="column" sx={{ my: 3, px: 2.5 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Colors
      </Typography>
      <ColorPicker
        colors={colorOptions}
        selected={filters.state.colors}
        onSelectColor={handleFilterColors}
      />
    </Box>
  );

  const renderDateRange = (
    <Box display="flex" flexDirection="column" sx={{ mb: 3, px: 2.5 }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Range
      </Typography>

      <DatePicker
        label="Start date"
        value={filters.state.startDate}
        onChange={handleFilterStartDate}
        sx={{ mb: 2.5 }}
      />

      <DatePicker
        label="End date"
        value={filters.state.endDate}
        onChange={handleFilterEndDate}
        slotProps={{
          textField: {
            error: dateError,
            helperText: dateError ? 'End date must be later than start date' : null,
          },
        }}
      />
    </Box>
  );

  const renderDropdownFilters = (
    <Box display="flex" flexDirection="column" sx={{ mb: 3, px: 2.5, gap: 2 }}>
      <TextField
        select
        fullWidth
        label="Room"
        value={filters.state.room}
        onChange={(e) => filters.setState({ room: e.target.value })}
      >
        <MenuItem value="All">All Rooms</MenuItem>
        {['A101', 'Lab201', 'S01'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Teacher"
        value={filters.state.teacher}
        onChange={(e) => filters.setState({ teacher: e.target.value })}
      >
        <MenuItem value="All">All Teachers</MenuItem>
        {['Dr. Ahmed Mansour', 'Dr. Sara Belkacem', 'Dr. Karim Ould'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Group"
        value={filters.state.group}
        onChange={(e) => filters.setState({ group: e.target.value })}
      >
        <MenuItem value="All">All Groups</MenuItem>
        {['CS-1A', 'CS-2B', 'MATH-1A'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Department"
        value={filters.state.department}
        onChange={(e) => filters.setState({ department: e.target.value })}
      >
        <MenuItem value="All">All Departments</MenuItem>
        {['Computer Science', 'Mathematics', 'Physics'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
    </Box>
  );

  const renderEvents = (
    <>
      <Typography variant="subtitle2" sx={{ px: 2.5, mb: 1 }}>
        Events ({events.length})
      </Typography>

      <Box component="ul">
        {orderBy(events, ['end'], ['desc']).map((event) => (
          <Box component="li" key={event.id}>
            <ListItemButton
              onClick={() => onClickEvent(`${event.id}`)}
              sx={{
                py: 1.5,
                borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              }}
            >
              <Box
                sx={{
                  top: 16,
                  left: 0,
                  width: 0,
                  height: 0,
                  position: 'absolute',
                  borderRight: '10px solid transparent',
                  borderTop: `10px solid ${event.color}`,
                }}
              />

              <ListItemText
                disableTypography
                primary={
                  <Typography variant="subtitle2" sx={{ fontSize: 13, mt: 0.5 }}>
                    {event.title}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{ fontSize: 11, color: 'text.disabled' }}
                  >
                    {event.allDay
                      ? fDate(event.start)
                      : `${fDateTime(event.start)} - ${fDateTime(event.end)}`}
                  </Typography>
                }
                sx={{ display: 'flex', flexDirection: 'column-reverse' }}
              />
            </ListItemButton>
          </Box>
        ))}
      </Box>
    </>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: 320 } }}
    >
      {renderHead}

      <Scrollbar>
        {renderColors}
        {renderDateRange}
        {renderDropdownFilters}
        {renderEvents}
      </Scrollbar>
    </Drawer>
  );
}
