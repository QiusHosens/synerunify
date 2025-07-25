import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import ViewIcon from '@/assets/image/svg/view.svg';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { pageErpPurchaseReturn, ErpPurchaseReturnQueryCondition, ErpPurchaseReturnResponse } from '@/api';
import ErpPurchaseReturnAdd from './Add';
import ErpPurchaseReturnEdit from './Edit';
import ErpPurchaseReturnDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import ErpPurchaseReturnInfo from './Info';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';
import CustomizedDictTag from '@/components/CustomizedDictTag';

export default function ErpPurchaseReturn() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpPurchaseReturnQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpPurchaseReturnResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const viewErpPurchaseReturn = useRef(null);
  const addErpPurchaseReturn = useRef(null);
  const editErpPurchaseReturn = useRef(null);
  const deleteErpPurchaseReturn = useRef(null);

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
      {
        field: 'purchase_order_number',
        headerName: t("erp.common.title.purchase"),
        flex: 1.4,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedCopyableText
            text={params.row.purchase_order_number}
          />
        )
      },
      { field: 'supplier_name', headerName: t("erp.common.title.supplier"), flex: 1, minWidth: 100 },
      { field: 'return_date', headerName: t("page.erp.purchase.return.title.return.date"), flex: 1, minWidth: 100 },
      { field: 'total_amount', headerName: t("erp.common.title.total.amount"), flex: 1, minWidth: 100 },
      { field: 'discount_rate', headerName: t("erp.common.title.discount.rate"), flex: 1, minWidth: 100 },
      { field: 'settlement_account_name', headerName: t("erp.common.title.settlement.account"), flex: 1, minWidth: 100 },
      { field: 'remarks', headerName: t("common.title.remark"), flex: 1, minWidth: 100 },
      {
        field: 'order_status',
        headerName: t("erp.common.title.order.status"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <>
            <CustomizedDictTag type='purchase_return_order_status' value={params.row.order_status} />
          </>
        )
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
            {hasOperatePermission('erp:purchase:return:get') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.view') + t('global.page.erp.purchase.return')}
              startIcon={<ViewIcon />}
              onClick={() => handleClickOpenView(params.row)}
            />}
            {hasOperatePermission('erp:purchase:return:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.erp.purchase.return')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('erp:purchase:return:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.erp.purchase.return')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t]
  );

  const queryRecords = async (condition: ErpPurchaseReturnQueryCondition) => {
    const result = await pageErpPurchaseReturn(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addErpPurchaseReturn.current as any).show();
  }

  const handleClickOpenView = (erpPurchaseReturn: ErpPurchaseReturnResponse) => {
    (viewErpPurchaseReturn.current as any).show(erpPurchaseReturn);
  };

  const handleClickOpenEdit = (erpPurchaseReturn: ErpPurchaseReturnResponse) => {
    (editErpPurchaseReturn.current as any).show(erpPurchaseReturn);
  };

  const handleClickOpenDelete = (erpPurchaseReturn: ErpPurchaseReturnResponse) => {
    (deleteErpPurchaseReturn.current as any).show(erpPurchaseReturn);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpPurchaseReturnQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpPurchaseReturnQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('erp:purchase:return:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <ErpPurchaseReturnInfo ref={viewErpPurchaseReturn} />
      <ErpPurchaseReturnAdd ref={addErpPurchaseReturn} onSubmit={refreshData} />
      <ErpPurchaseReturnEdit ref={editErpPurchaseReturn} onSubmit={refreshData} />
      <ErpPurchaseReturnDelete ref={deleteErpPurchaseReturn} onSubmit={refreshData} />
    </Box>
  );
}