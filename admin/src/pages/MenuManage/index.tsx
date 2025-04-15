import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { listMenu, MenuQueryCondition, pageMenu, SystemMenuResponse } from '@/api';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';
import CustomizedDataGridPro from '@/components/CustomizedDataGridPro';


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
    { field: 'name', headerName: '菜单名', width: 200 },
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
    let result = await listMenu();
    console.log('menu list', result);
    result.forEach(menu => {
      let path = menu.path;
      let hierarchy = [];
      if (path) {
        let paths = path.split('/');
        for (let p of paths) {
          if (p) {
            hierarchy.push(p);
          }
        }
      }
      menu.hierarchy = hierarchy;
    })
    setRecords(result);
  }

  const getTreeDataPath = (row: any) => row.hierarchy;

  useEffect(() => {
    queryRecords();
  }, []);

  // const columns: GridColDef[] = [
  //   { field: 'name', headerName: 'Name', width: 150 },
  //   {
  //     field: 'path',
  //     headerName: 'Path',
  //     width: 200,
  //   },
  //   { field: 'value', headerName: 'Value', width: 100 },
  // ];

  // const initialRows = [
  //   { id: 1, name: 'Root A', path: ['a'], value: 100 },
  //   { id: 2, name: 'Child B', path: ['a', 'b'], value: 20 },
  //   { id: 3, name: 'Grandchild C', path: ['a', 'b', 'c'], value: 30 },
  //   { id: 4, name: 'Root D', path: ['d'], value: 400 },
  //   { id: 5, name: 'Child E', path: ['d', 'e'], value: 50 },
  // ];

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <CustomizedDataGridPro
        columns={columns}
        initialRows={records}
        // getTreeDataPath={(row) => row?.path || []}
        getTreeDataPath={getTreeDataPath}
        hideFooter={true}
      />
    </Paper>
  );
}