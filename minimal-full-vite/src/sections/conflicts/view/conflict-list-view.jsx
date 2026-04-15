import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

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

import { ConflictTableRow } from '../conflict-table-row';
import { ConflictTableToolbar } from '../conflict-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'type', label: 'Type', width: 140 },
  { id: 'severity', label: 'Severity', width: 120 },
  { id: 'description', label: 'Description' },
  { id: 'affectedEntities', label: 'Affected Entities', width: 220 },
  { id: 'suggestedResolution', label: 'Suggested Resolution' },
  { id: '', width: 88 },
];

const INITIAL_CONFLICTS = [
  {
    id: '1',
    type: 'Instructor Collision',
    severity: 'error',
    description: 'Dr. Ahmed Mansour is assigned to two courses at the same time.',
    affectedEntities: 'CS101, CS201',
    suggestedResolution: 'Move CS201 to Tuesday 10:00 AM',
  },
  {
    id: '2',
    type: 'Room Under-Capacity',
    severity: 'warning',
    description: 'A101 has capacity 60 but Group CS-1A has 35 students.',
    affectedEntities: 'A101, CS-1A',
    suggestedResolution: 'Use S01 (Seminar Room) instead',
  },
  {
    id: '3',
    type: 'Level Overlap',
    severity: 'error',
    description: 'Level L1 has two sessions scheduled in the same slot.',
    affectedEntities: 'L1',
    suggestedResolution: 'Reschedule one session to a different slot',
  },
];

// ----------------------------------------------------------------------

export function ConflictListView() {
  const table = useTable();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(INITIAL_CONFLICTS);

  const filters = useSetState({ type: '' });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const notFound = !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id) => {
      setTableData((prev) => prev.filter((row) => row.id !== id));
      toast.success('Conflict resolved (removed)!');
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table]
  );

  const handleDeleteRows = useCallback(() => {
    setTableData((prev) => prev.filter((row) => !table.selected.includes(row.id)));
    toast.success('Conflicts resolved (removed)!');
    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Conflict Dashboard"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Conflicts' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <ConflictTableToolbar filters={filters} onResetPage={table.onResetPage} />

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Clear Resolved">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <ConflictTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Resolve Conflicts"
        content={
          <>
            Are you sure you want to mark <strong> {table.selected.length} </strong> conflicts as resolved?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Resolve
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { type } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (type) {
    inputData = inputData.filter(
      (item) => item.type.toLowerCase().indexOf(type.toLowerCase()) !== -1
    );
  }

  return inputData;
}
