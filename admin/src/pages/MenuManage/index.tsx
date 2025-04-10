import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { MenuQueryCondition, pageMenu, SystemMenuResponse } from '@/api';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';


export default function MenuManage() {
  const { t } = useTranslation();

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [pages, setPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>();

  const [records, setRecords] = useState<Array<SystemMenuResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'recruitmentDate', sort: 'asc' },
  ]);


  const columns: GridColDef[] = [
    { field: 'name', headerName: '菜单名', width: 130 },
    { field: 'permission', headerName: '权限标识', width: 130 },
    {
      field: 'type',
      headerName: '菜单类型',
      width: 90,
    },
    {
      field: 'sort',
      headerName: '显示顺序',
      type: 'number',
      width: 160,
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

  const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) => row.hierarchy;

  useEffect(() => {
    queryRecords();
  }, []);

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGridPro
        treeData
        rows={records}
        columns={columns}
        getTreeDataPath={getTreeDataPath}
        // sortModel={sortModel}
        onSortModelChange={setSortModel}
        defaultGroupingExpansionDepth={-1}
      />
    </Paper>
  );
}