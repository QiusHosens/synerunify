import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, SvgIcon, Switch, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import SearchIcon from '@/assets/image/svg/search.svg';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import DictTypeAdd from './AddDictType';
import DictAdd from './AddDict';
import { DictQueryCondition, disableDict, enableDict, listDictType, pageDict, SystemDictDataResponse, SystemDictTypeResponse } from '@/api/dict';
import DictEdit from './EditDict';
import DictTypeEdit from './EditDictType';
import DictDelete from './DeleteDict';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';

export default function DictManage() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<DictQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<SystemDictDataResponse>>([]);
  const [types, setTypes] = useState<SystemDictTypeResponse[]>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addDict = useRef(null);
  const addDictType = useRef(null);
  const editDictType = useRef(null);
  const editDict = useRef(null);
  const deleteDict = useRef(null);

  const handleStatusChange = useCallback(
    async (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: SystemDictDataResponse) => {
      if (checked) {
        await enableDict(data.id);
      } else {
        await disableDict(data.id);
      }

      // 更新表格
      setRecords((prev) =>
        prev.map((r) =>
          r.id === data.id ? { ...r, status: checked ? 0 : 1 } : r
        )
      );
    },
    []
  );

  const statusDisabled = (status: number): boolean => {
    return (status && !hasOperatePermission('config:dict:enable')) || (!status && !hasOperatePermission('config:dict:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'label', headerName: t("page.dict.title.label"), flex: 1, minWidth: 80 },
      { field: 'value', headerName: t("page.dict.title.value"), flex: 1, minWidth: 60 },
      { field: 'remark', headerName: t("common.title.remark"), flex: 1, minWidth: 80 },
      { field: 'sort', headerName: t("common.title.sort"), flex: 1, minWidth: 60 },
      { field: 'dict_type', headerName: t("common.title.type"), flex: 1, minWidth: 100 },
      { field: 'type_name', sortable: false, headerName: t("page.dict.title.type.name"), flex: 1, minWidth: 100 },
      { field: 'color_type', headerName: t("page.dict.title.color.type"), flex: 1, minWidth: 100 },
      { field: 'css_class', headerName: t("page.dict.title.css.class"), flex: 1, minWidth: 100 },
      {
        field: 'status',
        sortable: false,
        headerName: t("common.title.status"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            <Switch name="status" checked={!params.row.status} disabled={statusDisabled(params.row.status)} onChange={(event, checked) => handleStatusChange(event, checked, params.row)} />
          </Box>
        ),
      },
      {
        field: 'actions',
        sortable: false,
        resizable: false,
        headerName: t("global.operate.actions"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedAutoMore>
            {hasOperatePermission('config:dict:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('page.dict.operate.edit')}
              startIcon={<EditIcon />}
              onClick={() => handleClickEditDict(params.row)}
            />}
            {hasOperatePermission('config:dict:type:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('page.dict.operate.edit.type')}
              startIcon={<EditIcon />}
              onClick={() => handleClickEditDictType(params.row.type_id)}
            />}
            {hasOperatePermission('config:dict:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('page.dict.operate.delete')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickDeleteDict(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: DictQueryCondition) => {
    const result = await pageDict(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenDictType = () => {
    (addDictType.current as any).show();
  };

  const handleClickOpenDict = () => {
    (addDict.current as any).show();
  };

  const handleClickEditDictType = (typeId: number) => {
    (editDictType.current as any).show(typeId);
  };

  const handleClickEditDict = (dict: SystemDictDataResponse) => {
    (editDict.current as any).show(dict);
  };

  const handleClickDeleteDict = (dict: SystemDictDataResponse) => {
    (deleteDict.current as any).show(dict);
  };

  useEffect(() => {
    listType();
  }, []);

  useEffect(() => {
    refreshData();
  }, [condition]);

  const listType = async () => {
    const types = await listDictType();
    setTypes(types);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      const numberValue = Number(value);
      setCondition((prev) => ({ ...prev, [name]: numberValue }));
    } else {
      setCondition((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSortModelChange = (model: GridSortModel, _details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as DictQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as DictQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  const refreshType = () => {
    listType();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          {/* <SvgIcon component={ReactIcon} /> */}
          <FormControl sx={{ minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
            <InputLabel size="small" id="dict-type-select-label">{t('global.error.select.please') + t("page.dict.title.type")}</InputLabel>
            <Select
              size="small"
              labelId="dict-type-select-label"
              name="dict_type"
              value={condition.dict_type || ''}
              // onChange={handleInputChange}
              onChange={event => handleInputChange(event as any)}
              label={t('global.error.select.please') + t('page.dict.title.type')}
            >
              <MenuItem value="">{t('global.error.select.please')}</MenuItem>
              {types.map(item => (
                <MenuItem key={item.id} value={item.type}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ ml: 2, minWidth: 120, '& .MuiTextField-root': { width: '200px' } }}>
            <TextField
              size="small"
              sx={{ m: 0, width: '200px' }}
              label={t('global.condition.keyword')}
              name="keyword"
              value={condition.keyword || ''}
              onChange={handleInputChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      {/* <SvgIcon component={SearchIcon} /> */}
                      <SvgIcon fontSize="small" component={SearchIcon} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </FormControl>
        </Box>
        <Box>
          {hasOperatePermission('config:dict:type:add') && <Button variant="customContained" onClick={handleClickOpenDictType}>
            {t('global.operate.add')}{t('global.page.dict.type')}
          </Button>}
          {hasOperatePermission('config:dict:add') && <Button variant="customContained" onClick={handleClickOpenDict} sx={{ ml: 2 }}>
            {t('global.operate.add')}{t('global.page.dict')}
          </Button>}
        </Box>
      </Box>
      <DataGrid
        rowCount={total}
        rows={records}
        columns={columns}
        getRowId={(row) => row.id}
        pagination
        paginationMode="server"
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        filterModel={filterModel}
        onFilterModelChange={handleFilterModelChange}
        pageSizeOptions={[10, 20, 50, 100]}
        paginationModel={{ page: condition.page - 1, pageSize: condition.size }}
        onPaginationModelChange={(model) => {
          setCondition((prev) => ({
            ...prev,
            page: model.page + 1,
            size: model.pageSize,
          }));
        }}
      />
      <DictTypeAdd ref={addDictType} onSubmit={refreshType} />
      <DictAdd ref={addDict} onSubmit={refreshData} />
      <DictTypeEdit ref={editDictType} onSubmit={refreshType} />
      <DictEdit ref={editDict} onSubmit={refreshData} />
      <DictDelete ref={deleteDict} onSubmit={refreshData} />
    </Box>
  );
}