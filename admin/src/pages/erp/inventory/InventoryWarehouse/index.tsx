import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableErpWarehouse, enableErpWarehouse, pageErpWarehouse, ErpWarehouseQueryCondition, ErpWarehouseResponse } from '@/api';
import ErpWarehouseAdd from './Add';
import ErpWarehouseEdit from './Edit';
import ErpWarehouseDelete from './Delete';
import { useHomeStore } from '@/store';

export default function ErpWarehouse() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpWarehouseQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpWarehouseResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addErpWarehouse = useRef(null);
  const editErpWarehouse = useRef(null);
  const deleteErpWarehouse = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: ErpWarehouseResponse) => {
      if (checked) {
        await enableErpWarehouse(data.id);
      } else {
        await disableErpWarehouse(data.id);
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
    return (status && !hasOperatePermission('erp:inventory:warehouse:enable')) || (!status && !hasOperatePermission('erp:inventory:warehouse:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("page.erp.inventory.warehouse.title.name"), flex: 1, minWidth: 100 },
      { field: 'location', headerName: t("page.erp.inventory.warehouse.title.location"), flex: 1, minWidth: 100 },
      { field: 'sort', headerName: t("page.erp.inventory.warehouse.title.sort.order"), flex: 1, minWidth: 60 },
      { field: 'manager', headerName: t("page.erp.inventory.warehouse.title.manager"), flex: 1, minWidth: 100 },
      { field: 'remarks', headerName: t("page.erp.inventory.warehouse.title.remarks"), flex: 1, minWidth: 100 },
      {
        field: 'status',
        sortable: false,
        headerName: t("page.erp.inventory.warehouse.title.status"),
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
          <Box sx={ { height: '100%', display: 'flex', gap: 1, alignItems: 'center' } }>
            {hasOperatePermission('erp:inventory:warehouse:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.erp.inventory.warehouse')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('erp:inventory:warehouse:delete') && <Button
              sx={ {color: 'error.main'} }
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.erp.inventory.warehouse')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </Box>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: ErpWarehouseQueryCondition) => {
    const result = await pageErpWarehouse(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addErpWarehouse.current as any).show();
  }

  const handleClickOpenEdit = (erpWarehouse: ErpWarehouseResponse) => {
    (editErpWarehouse.current as any).show(erpWarehouse);
  };

  const handleClickOpenDelete = (erpWarehouse: ErpWarehouseResponse) => {
    (deleteErpWarehouse.current as any).show(erpWarehouse);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpWarehouseQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpWarehouseQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={ {height: '100%', display: 'flex', flexDirection: 'column'} }>
      <Box sx={ {mb: 2, display: 'flex', justifyContent: 'space-between'} }>
        <Box></Box>
        {hasOperatePermission('erp:inventory:warehouse:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <ErpWarehouseAdd ref={addErpWarehouse} onSubmit={refreshData} />
      <ErpWarehouseEdit ref={editErpWarehouse} onSubmit={refreshData} />
      <ErpWarehouseDelete ref={deleteErpWarehouse} onSubmit={refreshData} />
    </Box>
  );
}