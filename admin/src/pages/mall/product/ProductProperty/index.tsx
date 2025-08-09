import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableMallProductProperty, enableMallProductProperty, pageMallProductProperty, MallProductPropertyQueryCondition, MallProductPropertyResponse } from '@/api';
import MallProductPropertyAdd from './Add';
import MallProductPropertyEdit from './Edit';
import MallProductPropertyDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';

export default function MallProductProperty() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<MallProductPropertyQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<MallProductPropertyResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addMallProductProperty = useRef(null);
  const editMallProductProperty = useRef(null);
  const deleteMallProductProperty = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: MallProductPropertyResponse) => {
      if (checked) {
        await enableMallProductProperty(data.id);
      } else {
        await disableMallProductProperty(data.id);
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
    return (status && !hasOperatePermission('mall:product:property:enable')) || (!status && !hasOperatePermission('mall:product:property:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("common.title.name"), flex: 1, minWidth: 100 },
      { field: 'remark', headerName: t("common.title.remark"), flex: 1, minWidth: 100 },
      {
        field: 'status',
        sortable: false,
        headerName: t("global.title.status"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={ { height: '100%', display: 'flex', gap: 1, alignItems: 'center' } }>
            <Switch name="status" checked={!params.row.status} disabled={statusDisabled(params.row.status)} onChange={(event, checked) => handleStatusChange(event, checked, params.row)} />
          </Box>
        ),
      },
      { field: 'create_time', headerName: t("global.title.create.time"), flex: 1, minWidth: 180 },
      {
        field: 'actions',
        sortable: false,
        resizable: false,
        headerName: t("global.operate.actions"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedAutoMore>
            {hasOperatePermission('mall:product:property:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.common')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('mall:product:property:delete') && <Button
              sx={ {color: 'error.main'} }
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.common')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: MallProductPropertyQueryCondition) => {
    const result = await pageMallProductProperty(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addMallProductProperty.current as any).show();
  }

  const handleClickOpenEdit = (mallProductProperty: MallProductPropertyResponse) => {
    (editMallProductProperty.current as any).show(mallProductProperty);
  };

  const handleClickOpenDelete = (mallProductProperty: MallProductPropertyResponse) => {
    (deleteMallProductProperty.current as any).show(mallProductProperty);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as MallProductPropertyQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as MallProductPropertyQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={ {height: '100%', display: 'flex', flexDirection: 'column'} }>
      <Box sx={ {mb: 2, display: 'flex', justifyContent: 'space-between'} }>
        <Box></Box>
        {hasOperatePermission('mall:product:property:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
          {t('global.operate.add')}
        </Button>}
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
        paginationModel={ {page: condition.page - 1, pageSize: condition.size} }
        onPaginationModelChange={(model) => {
          setCondition((prev) => ({
            ...prev,
            page: model.page + 1,
            size: model.pageSize,
          }));
        }}
      />
      <MallProductPropertyAdd ref={addMallProductProperty} onSubmit={refreshData} />
      <MallProductPropertyEdit ref={editMallProductProperty} onSubmit={refreshData} />
      <MallProductPropertyDelete ref={deleteMallProductProperty} onSubmit={refreshData} />
    </Box>
  );
}