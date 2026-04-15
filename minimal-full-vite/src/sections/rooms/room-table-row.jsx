import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

export function RoomTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.code}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.building}</TableCell>
        <TableCell>{row.type}</TableCell>
        <TableCell>{row.capacity}</TableCell>
        <TableCell sx={{ minWidth: 160 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
             <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={row.occupancy || 0} color={(row.occupancy > 80 ? 'error' : (row.occupancy > 50 ? 'warning' : 'success'))} />
             </Box>
             <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.occupancy || 0}%</Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={() => { confirm.onTrue(); popover.onClose(); }} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
          <MenuItem onClick={() => { onEditRow(); popover.onClose(); }}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete this room?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
