import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

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

import { TeacherTableRow } from '../teacher-table-row';
import { TeacherTableToolbar } from '../teacher-table-toolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Teacher Name' },
  { id: 'email', label: 'Email', width: 220 },
  { id: 'department', label: 'Department', width: 160 },
  { id: 'maxHours', label: 'Max Hours/Week', width: 140 },
  { id: 'specializations', label: 'Specializations', width: 220 },
  { id: '', width: 88 },
];

const DEPARTMENT_OPTIONS = ['Computer Science', 'Mathematics', 'Physics'];

const INITIAL_TEACHERS = [
  { id: '1', name: 'Dr. Ahmed Mansour', email: 'ahmed@uni.edu', department: 'Computer Science', maxHours: 9, specializations: 'Algorithms, AI', availability: ['Mon', 'Wed'] },
  { id: '2', name: 'Dr. Sara Belkacem', email: 'sara@uni.edu', department: 'Mathematics', maxHours: 9, specializations: 'Statistics', availability: ['Fri'] },
  { id: '3', name: 'Dr. Karim Ould', email: 'karim@uni.edu', department: 'Physics', maxHours: 9, specializations: 'Optics, Quantum', availability: [] },
];

const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function TeacherListView() {
  const table = useTable();
  const confirm = useBoolean();
  const openForm = useBoolean();

  const [tableData, setTableData] = useState(INITIAL_TEACHERS);
  const [editRow, setEditRow] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', department: '', maxHours: '9', specializations: '', availability: [] });

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
    setFormData({ name: '', email: '', department: '', maxHours: '9', specializations: '', availability: [] });
    openForm.onTrue();
  }, [openForm]);

  const handleOpenEdit = useCallback(
    (row) => {
      setEditRow(row);
      setFormData({
        name: row.name,
        email: row.email,
        department: row.department,
        maxHours: row.maxHours,
        specializations: row.specializations,
        availability: row.availability || [],
      });
      openForm.onTrue();
    },
    [openForm]
  );

  const handleSave = useCallback(() => {
    if (!formData.name.trim()) {
      toast.error('Teacher name is required');
      return;
    }
    if (editRow) {
      setTableData((prev) => prev.map((r) => (r.id === editRow.id ? { ...r, ...formData } : r)));
      toast.success('Teacher updated!');
    } else {
      setTableData((prev) => [...prev, { id: Date.now().toString(), ...formData }]);
      toast.success('Teacher created!');
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
          heading="Teachers"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Teachers' },
          ]}
          action={
            <Button
              variant="contained" color="success"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
            >
              New Teacher
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <TeacherTableToolbar filters={filters} onResetPage={table.onResetPage} />

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
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
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
                      <TeacherTableRow
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
        <DialogTitle>{editRow ? 'Edit Teacher' : 'New Teacher'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              fullWidth
            />
            <TextField
              select
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
              fullWidth
            >
              {DEPARTMENT_OPTIONS.map((d) => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Max Hours / Week"
              type="number"
              value={formData.maxHours}
              onChange={(e) => setFormData((p) => ({ ...p, maxHours: e.target.value }))}
              helperText="Default is 9 hours per week"
              fullWidth
            />
            <TextField
              label="Specializations"
              value={formData.specializations}
              onChange={(e) => setFormData((p) => ({ ...p, specializations: e.target.value }))}
              helperText="Comma-separated (e.g. Algorithms, AI, Databases)"
              fullWidth
            />
            <TextField
              select
              label="Unavailable Days"
              value={formData.availability}
              onChange={(e) => setFormData((p) => ({ ...p, availability: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value }))}
              SelectProps={{ multiple: true }}
              fullWidth
            >
              {DAY_OPTIONS.map((day) => (
                <MenuItem key={day} value={day}>{day}</MenuItem>
              ))}
            </TextField>
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
