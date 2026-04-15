import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ConflictTableRow({ row, selected, onSelectRow, onDeleteRow }) {
  const { type, severity, description, affectedEntities, suggestedResolution } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{type}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (severity === 'error' && 'error') ||
            (severity === 'warning' && 'warning') ||
            'default'
          }
        >
          {severity}
        </Label>
      </TableCell>

      <TableCell sx={{ minWidth: 240 }}>{description}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{affectedEntities}</TableCell>

      <TableCell sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
        {suggestedResolution}
      </TableCell>

      <TableCell align="right">
        <IconButton color="success" onClick={onDeleteRow}>
          <Iconify icon="eva:checkmark-circle-2-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
