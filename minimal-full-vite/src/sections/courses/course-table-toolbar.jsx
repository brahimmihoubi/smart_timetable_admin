import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

export function CourseTableToolbar({ filters, onResetPage }) {
  return (
    <Toolbar sx={{ px: 2.5, gap: 2 }}>
      <TextField
        size="small"
        value={filters.state.name}
        placeholder="Search course..."
        onChange={(e) => {
          onResetPage();
          filters.setState({ name: e.target.value });
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ flexGrow: 1, maxWidth: 320 }}
      />
    </Toolbar>
  );
}
