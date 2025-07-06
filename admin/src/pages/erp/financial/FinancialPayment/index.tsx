import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import ViewIcon from '@/assets/image/svg/view.svg';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { pageErpPayment, ErpPaymentQueryCondition, ErpPaymentResponse } from '@/api';
import ErpPaymentAdd from './Add';
import ErpPaymentEdit from './Edit';
import ErpPaymentDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';
import ErpPaymentInfo from './Info';

export default function ErpPayment() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpPaymentQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpPaymentResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const viewErpPayment = useRef(null);
  const addErpPayment = useRef(null);
  const editErpPayment = useRef(null);
  const deleteErpPayment = useRef(null);

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
      { field: 'settlement_account_name', headerName: t("erp.common.title.settlement.account"), flex: 1, minWidth: 100 },
      { field: 'amount', headerName: t("page.erp.payment.title.amount"), flex: 1, minWidth: 100 },
      { field: 'discount_amount', headerName: t("page.erp.payment.title.discount.amount"), flex: 1, minWidth: 100 },
      { field: 'payment_date', headerName: t("page.erp.payment.title.payment.date"), flex: 1.4, minWidth: 100 },
      { field: 'payment_method', headerName: t("page.erp.payment.title.payment.method"), flex: 1, minWidth: 100 },
      { field: 'remarks', headerName: t("common.title.remark"), flex: 1, minWidth: 100 },
      { field: 'payment_status', headerName: t("page.erp.payment.title.payment.status"), flex: 1, minWidth: 100 },
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
            {hasOperatePermission('erp:financial:payment:get') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.view') + t('global.page.erp.payment')}
              startIcon={<ViewIcon />}
              onClick={() => handleClickOpenView(params.row)}
            />}
            {hasOperatePermission('erp:financial:payment:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.erp.payment')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('erp:financial:payment:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.erp.payment')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t]
  );

  const queryRecords = async (condition: ErpPaymentQueryCondition) => {
    const result = await pageErpPayment(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addErpPayment.current as any).show();
  }

  const handleClickOpenView = (erpPayment: ErpPaymentResponse) => {
    (viewErpPayment.current as any).show(erpPayment);
  };

  const handleClickOpenEdit = (erpPayment: ErpPaymentResponse) => {
    (editErpPayment.current as any).show(erpPayment);
  };

  const handleClickOpenDelete = (erpPayment: ErpPaymentResponse) => {
    (deleteErpPayment.current as any).show(erpPayment);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpPaymentQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpPaymentQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('erp:financial:payment:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <ErpPaymentInfo ref={viewErpPayment}/>
      <ErpPaymentAdd ref={addErpPayment} onSubmit={refreshData} />
      <ErpPaymentEdit ref={editErpPayment} onSubmit={refreshData} />
      <ErpPaymentDelete ref={deleteErpPayment} onSubmit={refreshData} />
    </Box>
  );
}