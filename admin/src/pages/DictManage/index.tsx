import { Box, Button, InputAdornment, Paper, SvgIcon, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { listMenu, MenuQueryCondition, SystemMenuResponse } from '@/api';
import { GridColDef } from '@mui/x-data-grid';
import CustomizedDataGridPro from '@/components/CustomizedDataGridPro';
import SearchIcon from '@/assets/image/svg/search.svg';
import MenuAdd from './Add';

export default function DictManage() {
  const { t } = useTranslation();

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [pages, setPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>();

  const [records, setRecords] = useState<Array<SystemMenuResponse>>([]);

  const addMenu = useRef();

  const columns: GridColDef[] = [
    { field: 'name', headerName: t("page.dict.title.name"), width: 200 },
    { field: 'type', headerName: t("page.dict.title.type"), width: 200 },
    {
      field: 'type',
      headerName: t("page.dict.title.type.remark"),
      width: 200,
    },
    {
      field: 'sort',
      headerName: t("page.dict.title.sort"),
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

  const handleClickOpen = () => {
    (addMenu.current as any).show();
  }

  useEffect(() => {
    queryRecords();
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label={t('global.condition.keyword')}
          sx={{ m: 0, width: '200px' }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon component={SearchIcon} inheritViewBox />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button variant="contained" onClick={handleClickOpen}>
          {t('global.operate.add')}
        </Button>
      </Box>
      <Paper sx={{ flex: 1, width: '100%' }}>
        <CustomizedDataGridPro
          columns={columns}
          initialRows={records}
          getTreeDataPath={getTreeDataPath}
          hideFooter={true}
        />
      </Paper>
      <MenuAdd ref={addMenu} />
    </Box>
  );
}