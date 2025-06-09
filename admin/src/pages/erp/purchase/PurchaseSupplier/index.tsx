import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableErpSupplier, enableErpSupplier, pageErpSupplier, ErpSupplierQueryCondition, ErpSupplierResponse } from '@/api';
import ErpSupplierAdd from './Add';
import ErpSupplierEdit from './Edit';
import ErpSupplierDelete from './Delete';
import { useHomeStore } from '@/store';

export default function ErpSupplier() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpSupplierQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpSupplierResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addErpSupplier = useRef(null);
  const editErpSupplier = useRef(null);
  const deleteErpSupplier = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: ErpSupplierResponse) => {
      if (checked) {
        await enableErpSupplier(data.id);
      } else {
        await disableErpSupplier(data.id);
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
    return (status && !hasOperatePermission('system:post:enable')) || (!status && !hasOperatePermission('system:post:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'supplier_name', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'contact_person', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'phone', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'email', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'address', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'status', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'tax_id', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'tax_rate', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'bank_name', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'bank_account', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'bank_address', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'remarks', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'sort_order', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'department_code', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'department_id', headerName: t("page."), flex: 1, minWidth: 100 },
      
      {
        field: 'status',
        sortable: false,
        headerName: t("page.post.title.status"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={ { height: '100%', display: 'flex', gap: 1, alignItems: 'center' } }>
            <Switch name="status" checked={!params.row.status} disabled={statusDisabled(params.row.status)} onChange={(event, checked) => handleStatusChange(event, checked, params.row)} />
          </Box>
        ),
      },
      { field: 'create_time', headerName: t("page.post.title.create.time"), flex: 1, minWidth: 180 },
      {
        field: 'actions',
        sortable: false,
        resizable: false,
        headerName: t("global.operate.actions"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={ { height: '100%', display: 'flex', gap: 1, alignItems: 'center' } }>
            {hasOperatePermission('system:post:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('page.post.operate.edit')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('system:post:delete') && <Button
              sx={ {color: 'error.main'} }
              size="small"
              variant='customOperate'
              title={t('page.post.operate.delete')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </Box>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: ErpSupplierQueryCondition) => {
    const result = await pageErpSupplier(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addErpSupplier.current as any).show();
  }

  const handleClickOpenEdit = (erpSupplier: ErpSupplierResponse) => {
    (editErpSupplier.current as any).show(erpSupplier);
  };

  const handleClickOpenDelete = (erpSupplier: ErpSupplierResponse) => {
    (deleteErpSupplier.current as any).show(erpSupplier);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpSupplierQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpSupplierQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={ {height: '100%', display: 'flex', flexDirection: 'column'} }>
      <Box sx={ {mb: 2, display: 'flex', justifyContent: 'space-between'} }>
        <Box></Box>
        {hasOperatePermission('system:post:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <ErpSupplierAdd ref={addErpSupplier} onSubmit={refreshData} />
      <ErpSupplierEdit ref={editErpSupplier} onSubmit={refreshData} />
      <ErpSupplierDelete ref={deleteErpSupplier} onSubmit={refreshData} />
    </Box>
  );
}