import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import ViewIcon from '@/assets/image/svg/view.svg';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { pageErpReceipt, ErpReceiptQueryCondition, ErpReceiptResponse } from '@/api';
import ErpReceiptAdd from './Add';
import ErpReceiptEdit from './Edit';
import ErpReceiptDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import ErpReceiptInfo from './Info';

export default function ErpReceipt() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpReceiptQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpReceiptResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const viewErpReceipt = useRef(null);
  const addErpReceipt = useRef(null);
  const editErpReceipt = useRef(null);
  const deleteErpReceipt = useRef(null);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'order_number', headerName: t("page.erp.receipt.title.order.number"), flex: 1.4, minWidth: 100 },
      { field: 'customer_id', headerName: t("page.erp.receipt.title.customer"), flex: 1, minWidth: 100 },
      { field: 'settlement_account_id', headerName: t("page.erp.receipt.title.settlement.account"), flex: 1, minWidth: 100 },
      { field: 'amount', headerName: t("page.erp.receipt.title.amount"), flex: 1, minWidth: 100 },
      { field: 'discount_amount', headerName: t("page.erp.receipt.title.discount.amount"), flex: 1, minWidth: 100 },
      { field: 'receipt_date', headerName: t("page.erp.receipt.title.receipt.date"), flex: 1, minWidth: 100 },
      { field: 'payment_method', headerName: t("page.erp.receipt.title.payment.method"), flex: 1, minWidth: 100 },
      { field: 'receipt_status', headerName: t("page.erp.receipt.title.receipt.status"), flex: 1, minWidth: 100 },
      { field: 'remarks', headerName: t("page.erp.receipt.title.remarks"), flex: 1, minWidth: 100 },
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
            {hasOperatePermission('erp:financial:receipt:get') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.view') + t('global.page.erp.receipt')}
              startIcon={<ViewIcon />}
              onClick={() => handleClickOpenView(params.row)}
            />}
            {hasOperatePermission('erp:financial:receipt:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.erp.receipt')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('erp:financial:receipt:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.erp.receipt')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t]
  );

  const queryRecords = async (condition: ErpReceiptQueryCondition) => {
    const result = await pageErpReceipt(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addErpReceipt.current as any).show();
  }

  const handleClickOpenView = (erpReceipt: ErpReceiptResponse) => {
    (viewErpReceipt.current as any).show(erpReceipt);
  };

  const handleClickOpenEdit = (erpReceipt: ErpReceiptResponse) => {
    (editErpReceipt.current as any).show(erpReceipt);
  };

  const handleClickOpenDelete = (erpReceipt: ErpReceiptResponse) => {
    (deleteErpReceipt.current as any).show(erpReceipt);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpReceiptQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpReceiptQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('erp:financial:receipt:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <ErpReceiptInfo ref={viewErpReceipt} />
      <ErpReceiptAdd ref={addErpReceipt} onSubmit={refreshData} />
      <ErpReceiptEdit ref={editErpReceipt} onSubmit={refreshData} />
      <ErpReceiptDelete ref={deleteErpReceipt} onSubmit={refreshData} />
    </Box>
  );
}