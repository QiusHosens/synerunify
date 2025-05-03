import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Paper, Popover, Select, SvgIcon, Switch, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import SearchIcon from '@/assets/image/svg/search.svg';
import EditIcon from '@/assets/image/svg/edit.svg';
import MoreIcon from '@/assets/image/svg/more.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import DictTypeAdd from './AddDictType';
import DictAdd from './AddDict';
import { DictQueryCondition, listDictType, pageDict, SystemDictDataResponse, SystemDictTypeResponse } from '@/api/dict';
import DictEdit from './EditDict';
import DictTypeEdit from './EditDictType';
import DictDelete from './DeleteDict';

export default function DictManage() {
  const { t } = useTranslation();

  const [pages, setPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<DictQueryCondition>({
    page: 1,
    size: 10,
  });

  const [records, setRecords] = useState<Array<SystemDictDataResponse>>([]);

  const [types, setTypes] = useState<SystemDictTypeResponse[]>([]);

  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const popoverId = open ? 'simple-popover' : undefined;

  const addDict = useRef();
  const addDictType = useRef();
  const editDictType = useRef();
  const editDict = useRef();
  const deleteDict = useRef();

  const columns: GridColDef[] = [
    { field: 'label', headerName: t("page.dict.title.label"), flex: 1, minWidth: 150 },
    { field: 'value', headerName: t("page.dict.title.value"), flex: 1, minWidth: 150 },
    { field: 'remark', headerName: t("page.dict.title.remark"), flex: 1, minWidth: 150 },
    { field: 'sort', headerName: t("page.dict.title.sort"), flex: 1, minWidth: 150 },
    { field: 'dict_type', headerName: t("page.dict.title.type"), flex: 1, minWidth: 150 },
    { field: 'type_name', sortable: false, headerName: t("page.dict.title.type.name"), flex: 1, minWidth: 150 },
    { field: 'color_type', headerName: t("page.dict.title.color.type"), flex: 1, minWidth: 150 },
    { field: 'css_class', headerName: t("page.dict.title.css.class"), flex: 1, minWidth: 150 },
    {
      field: 'status',
      sortable: false,
      headerName: t("page.dict.title.status"),
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
          <Switch checked={params.row.status} onChange={handleStatusChange} />
        </Box>
      ),
    },
    {
      field: 'actions',
      sortable: false,
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
            onClick={() => handleClickEditDict(params.row)}
          />
          <Button
            size="small"
            variant='customOperate'
            aria-describedby={popoverId}
            startIcon={<MoreIcon />}
            // onClick={() => handleEdit(params.row.id)}
            onClick={handleMoreClick}
          />
          <Popover
            id={popoverId}
            open={open}
            anchorEl={anchorEl}
            onClose={handleMoreClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Button
                size="small"
                variant='customOperate'
                title={t('page.dict.operate.edit.type')}
                startIcon={<EditIcon />}
                onClick={() => handleClickEditDictType(params.row.type_id)}
              />
              <Button
                sx={{ mt: 1, color: 'error.main' }}
                size="small"
                variant='customOperate'
                title={t('page.dict.operate.delete')}
                // color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleClickDeleteDict(params.row.id)}
              />
            </Box>
          </Popover>
        </Box>
      ),
    },
  ];

  const queryRecords = async (condition: DictQueryCondition) => {
    const result = await pageDict(condition);
    console.log('dict list', result);
    setRecords(result.list);
  }

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpenDictType = () => {
    (addDictType.current as any).show();
  }

  const handleClickOpenDict = () => {
    (addDict.current as any).show();
  }

  const handleClickEditDictType = (typeId: number) => {
    (editDictType.current as any).show(typeId);
  }

  const handleClickEditDict = (dict: SystemDictDataResponse) => {
    (editDict.current as any).show(dict);
  }

  const handleClickDeleteDict = (id: number) => {
    (deleteDict.current as any).show(id);
  }

  useEffect(() => {
    queryRecords(condition);
    listType();
  }, []);

  const listType = async () => {
    const types = await listDictType();
    setTypes(types);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('target', e.target);
    const { name, value, type } = e.target;
    if (type == 'number') {
      const numberValue = Number(value);

      Object.assign(condition, { [name]: numberValue });
      setCondition(condition);
    } else {
      Object.assign(condition, { [name]: value });
      setCondition(condition);
    }

    queryRecords(condition);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('target', e.target);
    const { name, value, type } = e.target;

  };

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    console.log('sort model change', model, details);
    Object.assign(condition, model[0]);
    setCondition(condition);
    queryRecords(condition);
  }

  const refreshData = () => {
    queryRecords(condition);
  }

  const refreshType = () => {
    listType();
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <FormControl sx={{ minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
            <InputLabel size="small" id="dict-type-select-label">{t("page.dict.title.type")}</InputLabel>
            <Select
              size="small"
              labelId="dict-type-select-label"
              name="dict_type"
              value={condition.dict_type}
              onChange={handleInputChange}
              label={t("page.menu.title.type")}
            >
              <MenuItem value={undefined}>请选择</MenuItem>
              {types.map(item => (<MenuItem key={item.id} value={item.type}>{item.name}</MenuItem>))}
            </Select>
          </FormControl>
          <FormControl sx={{ ml: 2, minWidth: 120, '& .MuiTextField-root': { width: '200px' } }}>
            <TextField
              size="small"
              sx={{ m: 0, width: '200px' }}
              label={t('global.condition.keyword')}
              name="keyword"
              value={condition.keyword}
              onChange={handleInputChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon component={SearchIcon} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </FormControl>
        </Box>
        <Box>
          <Button variant="customContained" onClick={handleClickOpenDictType}>
            {t('global.operate.add')}{t('global.page.dict.type')}
          </Button>
          <Button variant="customContained" onClick={handleClickOpenDict} sx={{ ml: 2 }}>
            {t('global.operate.add')}{t('global.page.dict')}
          </Button>
        </Box>
      </Box>
      <Paper sx={{ flex: 1, width: '100%' }}>
        <DataGrid
          // pageSizeOptions={[20, 30, 50, 100]}
          columns={columns}
          rows={records}
          getRowId={(row) => row.id}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          // paginationMode='server'
          // paginationModel={{ page: condition.page, pageSize: condition.size }}
        />
      </Paper>
      <DictTypeAdd ref={addDictType} onSubmit={refreshType} />
      <DictAdd ref={addDict} onSubmit={refreshData} />
      <DictTypeEdit ref={editDictType} onSubmit={refreshType} />
      <DictEdit ref={editDict} onSubmit={refreshData} />
      <DictDelete ref={deleteDict} onSubmit={refreshData} />
    </Box >
  );
}