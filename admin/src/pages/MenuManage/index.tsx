import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { MenuQueryCondition, pageMenu, SystemMenuResponse } from '@/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';


export default function MenuManage() {
  const { t } = useTranslation();

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [pages, setPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>();

  const [records, setRecords] = useState<Array<SystemMenuResponse>>([]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
  ];

  const queryRecords = async () => {
    let condition: MenuQueryCondition = {
      page,
      size,
      keyword
    };
    let result = await pageMenu(condition);
    setRecords(result.list);
  }

  useEffect(() => {
    queryRecords();
  }, []);

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}