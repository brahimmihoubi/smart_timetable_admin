import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
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

import { DepartmentTableRow } from '../department-table-row';
import { DepartmentTableToolbar } from '../department-table-toolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Department Name' },
  { id: 'code', label: 'Code', width: 140 },
  { id: '', width: 88 },
];

const INITIAL_DEPARTMENTS = [
  { id: '1', name: 'Computer Science', code: 'CS' },
  { id: '2', name: 'Mathematics', code: 'MATH' },
  { id: '3', name: 'Physics', code: 'PHY' },
];

export function DepartmentListView() {
  const table = useTable();
  const confirm = useBoolean();
  const openForm = useBoolean();

  const [tableData, setTableData] = useState(INITIAL_DEPARTMENTS);
  const [editRow, setEditRow] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '' });

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
    setFormData({ name: '', code: '' });
    openForm.onTrue();
  }, [openForm]);

  const handleOpenEdit = useCallback(
    (row) => {
      setEditRow(row);
      setFormData({ name: row.name, code: row.code });
      openForm.onTrue();
    },
    [openForm]
  );

  const handleSave = useCallback(() => {
    if (!formData.name.trim()) {
      toast.error('Department name is required');
      return;
    }
    if (editRow) {
      setTableData((prev) => prev.map((r) => (r.id === editRow.id ? { ...r, ...formData } : r)));
      toast.success('Department updated!');
    } else {
      setTableData((prev) => [...prev, { id: Date.now().toString(), ...formData }]);
      toast.success('Department created!');
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
          heading="Departments"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Departments' },
          ]}
          action={
            <Button
              variant="contained" color="success"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
            >
              New Department
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <DepartmentTableToolbar filters={filters} onResetPage={table.onResetPage} />

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
                      <DepartmentTableRow
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
        <DialogTitle>{editRow ? 'Edit Department' : 'New Department'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Department Name"
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
