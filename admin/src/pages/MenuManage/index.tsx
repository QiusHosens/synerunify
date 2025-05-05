import { Box, Button, InputAdornment, Paper, Popover, SvgIcon, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { listMenu, MenuQueryCondition, SystemMenuResponse } from '@/api';
import { GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import CustomizedDataGridPro from '@/components/CustomizedDataGridPro';
import SearchIcon from '@/assets/image/svg/search.svg';
import EditIcon from '@/assets/image/svg/edit.svg';
import MoreIcon from '@/assets/image/svg/more.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import MenuAdd from './Add';
import { SystemDictDataResponse } from '@/api/dict';

export default function MenuManage() {
  const { t } = useTranslation();

  const [records, setRecords] = useState<Array<SystemMenuResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const addMenu = useRef();

  const columns: GridColDef[] = [
    { field: 'name', headerName: t("page.menu.title.name"), flex: 1, width: 200 },
    { field: 'permission', headerName: t("page.menu.title.permission"), flex: 1, width: 200 },
    {
      field: 'type',
      headerName: t("page.menu.title.type"),
      flex: 1,
      width: 200,
    },
    {
      field: 'sort',
      headerName: t("page.menu.title.sort"),
      flex: 1,
      width: 200,
    },
    {
      field: 'actions',
      sortable: false,
      resizable: false,
      headerName: t("global.operate.actions"),
      flex: 1,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            size="small"
            variant='customOperate'
            title={t('page.dict.operate.edit')}
            startIcon={<EditIcon />}
          // onClick={() => handleClickEditDict(params.row)}
          />
          <Button
            sx={{ color: 'error.main' }}
            size="small"
            variant='customOperate'
            title={t('page.dict.operate.delete')}
            startIcon={<DeleteIcon />}
          // onClick={() => handleClickDeleteDict(params.row.id)}
          />
        </Box>
      ),
    },
  ];

  // const handleClickOpenDictType = () => {
  //   (addDictType.current as any).show();
  // };

  // const handleClickOpenDict = () => {
  //   (addDict.current as any).show();
  // };

  // const handleClickEditDictType = (typeId: number) => {
  //   (editDictType.current as any).show(typeId);
  // };

  // const handleClickEditDict = (dict: SystemDictDataResponse) => {
  //   (editDict.current as any).show(dict);
  // };

  // const handleClickDeleteDict = (id: number) => {
  //   (deleteDict.current as any).show(id);
  // };

  const queryRecords = async () => {
    const result = await listMenu();
    console.log('menu list', result);
    result.forEach(menu => {
      const path = menu.path;
      const hierarchy = [];
      if (path) {
        const paths = path.split('/');
        for (const p of paths) {
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
        <Box></Box>
        <Button variant="customContained" onClick={handleClickOpen}>
          {t('global.operate.add')}
        </Button>
      </Box>
      <CustomizedDataGridPro
        columns={columns}
        initialRows={records}
        getTreeDataPath={getTreeDataPath}
        hideFooter={true}
      />
      <MenuAdd ref={addMenu} />
    </Box>
  );
}