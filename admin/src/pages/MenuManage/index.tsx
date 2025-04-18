import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, InputAdornment, InputLabel, MenuItem, Paper, Select, SvgIcon, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { listMenu, MenuQueryCondition, pageMenu, SystemMenuResponse } from '@/api';
import { GridColDef, GridSortModel } from '@mui/x-data-grid';
import CustomizedDataGridPro from '@/components/CustomizedDataGridPro';
import SearchIcon from '@/assets/image/svg/search.svg';
import { DialogProps } from '@mui/material/Dialog';
import { SelectChangeEvent } from '@mui/material/Select';
import MenuAdd from './Add';

export default function MenuManage() {
  const { t } = useTranslation();

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [pages, setPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>();

  const [records, setRecords] = useState<Array<SystemMenuResponse>>([]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: t("page.menu.title.name"), width: 200 },
    { field: 'permission', headerName: t("page.menu.title.permission"), width: 200 },
    {
      field: 'type',
      headerName: t("page.menu.title.type"),
      width: 200,
    },
    {
      field: 'sort',
      headerName: t("page.menu.title.sort"),
      // type: 'number',
      width: 200,
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

  const addMenu = () => {

  }

  useEffect(() => {
    queryRecords();
  }, []);

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', }}>
        <TextField
          label={t('global.condition.keyword')}
          // id="outlined-start-adornment"
          sx={{ m: 0, width: '25ch' }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">
                <SvgIcon component={SearchIcon} inheritViewBox />
              </InputAdornment>,
            },
          }}
        />
        <Button variant="contained" onClick={handleClickOpen}>{t('global.operate.add')}</Button>
      </Box>
      <Paper sx={{ height: 400, width: '100%' }}>
        <CustomizedDataGridPro
          columns={columns}
          initialRows={records}
          // getTreeDataPath={(row) => row?.path || []}
          getTreeDataPath={getTreeDataPath}
          hideFooter={true}
        />
      </Paper>
      <MenuAdd></MenuAdd>
    </>
  );
}