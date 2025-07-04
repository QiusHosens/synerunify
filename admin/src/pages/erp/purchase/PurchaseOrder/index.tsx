import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import ViewIcon from '@/assets/image/svg/view.svg';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { pageErpPurchaseOrder, ErpPurchaseOrderQueryCondition, ErpPurchaseOrderResponse } from '@/api';
import ErpPurchaseOrderAdd from './Add';
import ErpPurchaseOrderEdit from './Edit';
import ErpPurchaseOrderDelete from './Delete';
import { useHomeStore } from '@/store';
import ErpPurchaseOrderInfo from './Info';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ErpPurchaseOrderCancel from './Cancel';
import ErpPurchaseOrderReceived from './Received';
import CustomizedDictTag from '@/components/CustomizedDictTag';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';

export default function ErpPurchaseOrder() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpPurchaseOrderQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpPurchaseOrderResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const viewErpPurchaseOrder = useRef(null);
  const addErpPurchaseOrder = useRef(null);
  const editErpPurchaseOrder = useRef(null);
  const deleteErpPurchaseOrder = useRef(null);
  const receivedErpPurchaseOrder = useRef(null);
  const cancelErpPurchaseOrder = useRef(null);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'order_number',
        headerName: t("erp.common.title.order.number"),
        flex: 1.4,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedCopyableText
            text={params.row.order_number}
          />
        )
      },
      { field: 'supplier_name', headerName: t("erp.common.title.supplier"), flex: 1, minWidth: 100 },
      { field: 'purchase_date', headerName: t("page.erp.purchase.order.title.purchase.date"), flex: 1.4, minWidth: 100 },
      { field: 'total_amount', headerName: t("erp.common.title.total.amount"), flex: 1, minWidth: 100 },
      { field: 'discount_rate', headerName: t("erp.common.title.discount.rate"), flex: 1, minWidth: 100 },
      { field: 'settlement_account_name', headerName: t("erp.common.title.settlement.account"), flex: 1, minWidth: 100 },
      { field: 'deposit', headerName: t("erp.common.title.deposit"), flex: 1, minWidth: 100 },
      { field: 'remarks', headerName: t("common.title.remark"), flex: 1, minWidth: 100 },
      {
        field: 'order_status',
        headerName: t("erp.common.title.order.status"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <>
            <CustomizedDictTag type='purchase_order_status' value={params.row.order_status} />
          </>
        )
      },
      { field: 'create_time', headerName: t("common.title.create.time"), flex: 1.4, minWidth: 180 },
      {
        field: 'actions',
        sortable: false,
        resizable: false,
        headerName: t("global.operate.actions"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedAutoMore>
            {hasOperatePermission('erp:purchase:order:get') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.view') + t('global.page.erp.purchase.order')}
              startIcon={<ViewIcon />}
              onClick={() => handleClickOpenView(params.row)}
            />}
            {hasOperatePermission('erp:purchase:order:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.erp.purchase.order')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('erp:purchase:order:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.erp.purchase.order')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
            {hasOperatePermission('erp:purchase:order:received') && params.row.order_status == 0 && <Button
              size="small"
              variant='customOperate'
              title={t('page.erp.purchase.order.operate.received')}
              startIcon={<CheckCircleIcon />}
              onClick={() => handleClickOpenReceived(params.row)}
            />}
            {hasOperatePermission('erp:purchase:order:edit') && (params.row.order_status == 0 || params.row.order_status == 1) && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('page.erp.purchase.order.operate.cancel')}
              startIcon={<CancelIcon />}
              onClick={() => handleClickOpenCancel(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t]
  );

  const queryRecords = async (condition: ErpPurchaseOrderQueryCondition) => {
    const result = await pageErpPurchaseOrder(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenView = (erpPurchaseOrder: ErpPurchaseOrderResponse) => {
    (viewErpPurchaseOrder.current as any).show(erpPurchaseOrder);
  };

  const handleClickOpenAdd = () => {
    (addErpPurchaseOrder.current as any).show();
  }

  const handleClickOpenEdit = (erpPurchaseOrder: ErpPurchaseOrderResponse) => {
    (editErpPurchaseOrder.current as any).show(erpPurchaseOrder);
  };

  const handleClickOpenDelete = (erpPurchaseOrder: ErpPurchaseOrderResponse) => {
    (deleteErpPurchaseOrder.current as any).show(erpPurchaseOrder);
  };

  const handleClickOpenReceived = (erpPurchaseOrder: ErpPurchaseOrderResponse) => {
    (receivedErpPurchaseOrder.current as any).show(erpPurchaseOrder);
  };

  const handleClickOpenCancel = (erpPurchaseOrder: ErpPurchaseOrderResponse) => {
    (cancelErpPurchaseOrder.current as any).show(erpPurchaseOrder);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpPurchaseOrderQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpPurchaseOrderQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('erp:purchase:order:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <ErpPurchaseOrderInfo ref={viewErpPurchaseOrder} />
      <ErpPurchaseOrderAdd ref={addErpPurchaseOrder} onSubmit={refreshData} />
      <ErpPurchaseOrderEdit ref={editErpPurchaseOrder} onSubmit={refreshData} />
      <ErpPurchaseOrderDelete ref={deleteErpPurchaseOrder} onSubmit={refreshData} />
      <ErpPurchaseOrderReceived ref={receivedErpPurchaseOrder} onSubmit={refreshData} />
      <ErpPurchaseOrderCancel ref={cancelErpPurchaseOrder} onSubmit={refreshData} />
    </Box>
  );
}