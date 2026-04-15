import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

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

import { CourseTableRow } from '../course-table-row';
import { CourseTableToolbar } from '../course-table-toolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Course Name' },
  { id: 'code', label: 'Code', width: 120 },
  { id: 'department', label: 'Department', width: 140 },
  { id: 'level', label: 'Level', width: 100 },
  { id: 'teacher', label: 'Teacher', width: 160 },
  { id: 'numLectures', label: 'Lectures', width: 100 },
  { id: 'numTd', label: 'TD', width: 80 },
  { id: 'numTp', label: 'TP', width: 80 },
  { id: '', width: 88 },
];

const LEVEL_OPTIONS = ['L1', 'L2', 'L3', 'M1', 'M2'];
const DEPARTMENT_OPTIONS = ['Computer Science', 'Mathematics', 'Physics'];
const TEACHER_OPTIONS = ['Dr. Ahmed Mansour', 'Dr. Sara Belkacem', 'Dr. Karim Ould'];

const INITIAL_COURSES = [
  { id: '1', name: 'Introduction to Programming', code: 'CS101', department: 'Computer Science', level: 'L1', teacher: 'Dr. Ahmed Mansour', numLectures: 3, numTd: 1, numTp: 1 },
  { id: '2', name: 'Data Structures', code: 'CS201', department: 'Computer Science', level: 'L2', teacher: 'Dr. Ahmed Mansour', numLectures: 3, numTd: 1, numTp: 1 },
  { id: '3', name: 'Calculus I', code: 'MATH101', department: 'Mathematics', level: 'L1', teacher: 'Dr. Sara Belkacem', numLectures: 4, numTd: 2, numTp: 0 },
];

export function CourseListView() {
  const table = useTable();
  const confirm = useBoolean();
  const openForm = useBoolean();

  const [tableData, setTableData] = useState(INITIAL_COURSES);
  const [editRow, setEditRow] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: '',
    level: '',
    teacher: '',
    numLectures: '',
    numTd: '',
    numTp: '',
  });

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
    setFormData({ name: '', code: '', department: '', level: '', teacher: '', numLectures: '', numTd: '', numTp: '' });
    openForm.onTrue();
  }, [openForm]);

  const handleOpenEdit = useCallback(
    (row) => {
      setEditRow(row);
      setFormData({
        name: row.name,
        code: row.code,
        department: row.department,
        level: row.level,
        teacher: row.teacher,
        numLectures: row.numLectures,
        numTd: row.numTd,
        numTp: row.numTp,
      });
      openForm.onTrue();
    },
    [openForm]
  );

  const handleSave = useCallback(() => {
    if (!formData.name.trim()) {
      toast.error('Course name is required');
      return;
    }

    // 3.1.4 Teacher: System enforces the 9-hour/week cap automatically
    const totalHours = Number(formData.numLectures) + Number(formData.numTd) + Number(formData.numTp);
    const existingHours = tableData
      .filter((c) => c.teacher === formData.teacher && (!editRow || c.id !== editRow.id))
      .reduce((sum, c) => sum + Number(c.numLectures) + Number(c.numTd) + Number(c.numTp), 0);

    if (existingHours + totalHours > 9) {
      toast.error(`Warning: ${formData.teacher} exceeds the 9-hour/week cap (${existingHours + totalHours}h total).`);
      // We allow but warn, or we can block. The requirement says "enforces". Let's block.
      return;
    }

    if (editRow) {
      setTableData((prev) => prev.map((r) => (r.id === editRow.id ? { ...r, ...formData } : r)));
      toast.success('Course updated!');
    } else {
      setTableData((prev) => [...prev, { id: Date.now().toString(), ...formData }]);
      toast.success('Course created!');
    }
    openForm.onFalse();
  }, [editRow, formData, openForm, tableData]);

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
          heading="Courses"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Courses' },
          ]}
          action={
            <Button
              variant="contained" color="success"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
            >
              New Course
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <CourseTableToolbar filters={filters} onResetPage={table.onResetPage} />

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
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 760 }}>
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
                      <CourseTableRow
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
        <DialogTitle>{editRow ? 'Edit Course' : 'New Course'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Course Name"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Code"
              value={formData.code}
              onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
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
              select
              label="Teacher"
              value={formData.teacher}
              onChange={(e) => setFormData((p) => ({ ...p, teacher: e.target.value }))}
              fullWidth
            >
              {TEACHER_OPTIONS.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Number of Lectures"
              type="number"
              value={formData.numLectures}
              onChange={(e) => setFormData((p) => ({ ...p, numLectures: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Number of TD"
              type="number"
              value={formData.numTd}
              onChange={(e) => setFormData((p) => ({ ...p, numTd: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Number of TP"
              type="number"
              value={formData.numTp}
              onChange={(e) => setFormData((p) => ({ ...p, numTp: e.target.value }))}
              fullWidth
            />
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
