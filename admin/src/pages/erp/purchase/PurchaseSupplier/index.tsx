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
import CustomizedAutoMore from '@/components/CustomizedAutoMore';

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
    return (status && !hasOperatePermission('erp:purchase:supplier:enable')) || (!status && !hasOperatePermission('erp:purchase:supplier:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("common.title.name"), flex: 1, minWidth: 100 },
      { field: 'contact_person', headerName: t("common.title.contact.person"), flex: 1, minWidth: 100 },
      { field: 'phone', headerName: t("common.title.phone"), flex: 1, minWidth: 100 },
      { field: 'tax_rate', headerName: t("page.erp.purchase.supplier.title.tax.rate"), flex: 1, minWidth: 100 },
      { field: 'remarks', headerName: t("common.title.remark"), flex: 1, minWidth: 100 },
      { field: 'sort', headerName: t("common.title.sort"), flex: 1, minWidth: 100 },
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
      { field: 'create_time', headerName: t("common.title.create.time"), flex: 1, minWidth: 180 },
      {
        field: 'actions',
        sortable: false,
        resizable: false,
        headerName: t("global.operate.actions"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedAutoMore>
            {hasOperatePermission('erp:purchase:supplier:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.erp.purchase.supplier')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('erp:purchase:supplier:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.erp.purchase.supplier')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('erp:purchase:supplier:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
        paginationModel={{ page: condition.page - 1, pageSize: condition.size }}
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