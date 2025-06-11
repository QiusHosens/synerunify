import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableErpCustomer, enableErpCustomer, pageErpCustomer, ErpCustomerQueryCondition, ErpCustomerResponse } from '@/api';
import ErpCustomerAdd from './Add';
import ErpCustomerEdit from './Edit';
import ErpCustomerDelete from './Delete';
import { useHomeStore } from '@/store';

export default function ErpCustomer() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpCustomerQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpCustomerResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addErpCustomer = useRef(null);
  const editErpCustomer = useRef(null);
  const deleteErpCustomer = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: ErpCustomerResponse) => {
      if (checked) {
        await enableErpCustomer(data.id);
      } else {
        await disableErpCustomer(data.id);
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
    return (status && !hasOperatePermission('erp:sale:customer:enable')) || (!status && !hasOperatePermission('erp:sale:customer:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("page.erp.sale.customer.title.name"), flex: 1, minWidth: 100 },
      { field: 'contact_person', headerName: t("page.erp.sale.customer.title.contact.person"), flex: 1, minWidth: 100 },
      { field: 'phone', headerName: t("page.erp.sale.customer.title.phone"), flex: 1, minWidth: 100 },
      { field: 'address', headerName: t("page.erp.sale.customer.title.address"), flex: 1, minWidth: 100 },
      { field: 'sort', headerName: t("page.erp.sale.customer.title.sort"), flex: 1, minWidth: 60 },
      { field: 'remarks', headerName: t("page.erp.sale.customer.title.remarks"), flex: 1, minWidth: 100 },
      {
        field: 'status',
        sortable: false,
        headerName: t("global.title.status"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
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
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            {hasOperatePermission('erp:sale:customer:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.erp.sale.customer')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('erp:sale:customer:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.erp.sale.customer')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </Box>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: ErpCustomerQueryCondition) => {
    const result = await pageErpCustomer(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addErpCustomer.current as any).show();
  }

  const handleClickOpenEdit = (erpCustomer: ErpCustomerResponse) => {
    (editErpCustomer.current as any).show(erpCustomer);
  };

  const handleClickOpenDelete = (erpCustomer: ErpCustomerResponse) => {
    (deleteErpCustomer.current as any).show(erpCustomer);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpCustomerQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpCustomerQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('erp:sale:customer:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <ErpCustomerAdd ref={addErpCustomer} onSubmit={refreshData} />
      <ErpCustomerEdit ref={editErpCustomer} onSubmit={refreshData} />
      <ErpCustomerDelete ref={deleteErpCustomer} onSubmit={refreshData} />
    </Box>
  );
}