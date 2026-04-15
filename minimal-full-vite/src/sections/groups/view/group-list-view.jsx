import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { GroupTableRow } from '../group-table-row';
import { GroupTableToolbar } from '../group-table-toolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Group Name' },
  { id: 'level', label: 'Level', width: 120 },
  { id: 'headcount', label: 'Headcount', width: 120 },
  { id: '', width: 88 },
];

const LEVEL_OPTIONS = ['L1', 'L2', 'L3', 'M1', 'M2'];

const INITIAL_GROUPS = [
  { id: '1', name: 'CS-1A', level: 'L1', headcount: 35 },
  { id: '2', name: 'CS-2B', level: 'L2', headcount: 30 },
  { id: '3', name: 'MATH-1A', level: 'L1', headcount: 28 },
];

export function GroupListView() {
  const table = useTable();
  const confirm = useBoolean();
  const openForm = useBoolean();

  const [tableData, setTableData] = useState(INITIAL_GROUPS);
  const [editRow, setEditRow] = useState(null);
  const [formData, setFormData] = useState({ name: '', level: '', headcount: 0, autoSubGroups: false });

  const filters = useSetState({ name: '' });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const notFound = !dataFiltered.length;

  const handleOpenCreate = useCallback(() => {
    setEditRow(null);
    setFormData({ name: '', level: '', headcount: 0, autoSubGroups: false });
    openForm.onTrue();
  }, [openForm]);

  const handleOpenEdit = useCallback(
    (row) => {
      setEditRow(row);
      setFormData({ name: row.name, level: row.level, headcount: row.headcount, autoSubGroups: !!row.isMainGroup });
      openForm.onTrue();
    },
    [openForm]
  );

  const handleSave = useCallback(() => {
    if (!formData.name.trim()) {
      toast.error('Group name is required');
      return;
    }
    if (editRow) {
      setTableData((prev) => prev.map((r) => (r.id === editRow.id ? { ...r, ...formData } : r)));
      toast.success('Group updated!');
    } else {
      const newId = Date.now().toString();
      const newGroups = [{ id: newId, ...formData, isMainGroup: formData.autoSubGroups }];
      
      if (formData.autoSubGroups) {
        newGroups.push({
          id: `${newId}-td`,
          name: `${formData.name}-TD`,
          level: formData.level,
          headcount: Math.ceil(formData.headcount / 2),
          isSubGroup: true,
          parentId: newId
        });
        newGroups.push({
          id: `${newId}-tp`,
          name: `${formData.name}-TP`,
          level: formData.level,
          headcount: Math.floor(formData.headcount / 2),
          isSubGroup: true,
          parentId: newId
        });
      }
      
      setTableData((prev) => [...prev, ...newGroups]);
      toast.success(formData.autoSubGroups ? 'Group and sub-groups created!' : 'Group created!');
    }
    openForm.onFalse();
  }, [editRow, formData, openForm]);

  const handleDeleteRow = useCallback(
    (id) => {
      setTableData((prev) => prev.filter((r) => r.id !== id));
      toast.success('Delete success!');
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table]
  );

  const handleDeleteRows = useCallback(() => {
    setTableData((prev) => prev.filter((r) => !table.selected.includes(r.id)));
    toast.success('Delete success!');
    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Groups"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Groups' },
          ]}
          action={
            <Button
              variant="contained" color="success"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
            >
              New Group
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <GroupTableToolbar filters={filters} onResetPage={table.onResetPage} />

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(checked, dataFiltered.map((row) => row.id))
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 720 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, dataFiltered.map((row) => row.id))
                  }
                />
                <TableBody>
                  {dataFiltered
                    .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                    .map((row) => (
                      <GroupTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleOpenEdit(row)}
                      />
                    ))}
                  <TableEmptyRows
                    height={table.dense ? 56 : 76}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />
                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <Dialog open={openForm.value} onClose={openForm.onFalse} fullWidth maxWidth="sm">
        <DialogTitle>{editRow ? 'Edit Group' : 'New Group'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Group Name"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              fullWidth
            />
            <TextField
              select
              label="Level"
              value={formData.level}
              onChange={(e) => setFormData((p) => ({ ...p, level: e.target.value }))}
              fullWidth
            >
              {LEVEL_OPTIONS.map((l) => (
                <MenuItem key={l} value={l}>{l}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Headcount"
              type="number"
              value={formData.headcount}
              onChange={(e) => setFormData((p) => ({ ...p, headcount: Number(e.target.value) }))}
              fullWidth
            />
            {!editRow && (
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.autoSubGroups}
                    onChange={(e) => setFormData((p) => ({ ...p, autoSubGroups: e.target.checked }))}
                  />
                }
                label="Automatically derive TD/TP sub-groups"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={openForm.onFalse}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleSave}>
            {editRow ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={<>Are you sure you want to delete <strong>{table.selected.length}</strong> item(s)?</>}
        action={
          <Button variant="contained" color="error" onClick={() => { handleDeleteRows(); confirm.onFalse(); }}>
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  if (name) {
    inputData = inputData.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
  }
  return inputData;
}
