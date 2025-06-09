import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { pageErpSalesOrder, ErpSalesOrderQueryCondition, ErpSalesOrderResponse } from '@/api';
import ErpSalesOrderAdd from './Add';
import ErpSalesOrderEdit from './Edit';
import ErpSalesOrderDelete from './Delete';
import { useHomeStore } from '@/store';

export default function ErpSalesOrder() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpSalesOrderQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpSalesOrderResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addErpSalesOrder = useRef(null);
  const editErpSalesOrder = useRef(null);
  const deleteErpSalesOrder = useRef(null);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'order_number', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'customer_id', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'user_id', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'order_date', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'total_amount', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'order_status', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'discount_rate', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'settlement_account_id', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'deposit', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'department_code', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'department_id', headerName: t("page."), flex: 1, minWidth: 100 },
      
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
    [t]
  );

  const queryRecords = async (condition: ErpSalesOrderQueryCondition) => {
    const result = await pageErpSalesOrder(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addErpSalesOrder.current as any).show();
  }

  const handleClickOpenEdit = (erpSalesOrder: ErpSalesOrderResponse) => {
    (editErpSalesOrder.current as any).show(erpSalesOrder);
  };

  const handleClickOpenDelete = (erpSalesOrder: ErpSalesOrderResponse) => {
    (deleteErpSalesOrder.current as any).show(erpSalesOrder);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpSalesOrderQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpSalesOrderQueryCondition));
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
      <ErpSalesOrderAdd ref={addErpSalesOrder} onSubmit={refreshData} />
      <ErpSalesOrderEdit ref={editErpSalesOrder} onSubmit={refreshData} />
      <ErpSalesOrderDelete ref={deleteErpSalesOrder} onSubmit={refreshData} />
    </Box>
  );
}