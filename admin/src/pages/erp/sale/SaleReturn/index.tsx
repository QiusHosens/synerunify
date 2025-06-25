import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { pageErpSalesReturn, ErpSalesReturnQueryCondition, ErpSalesReturnResponse } from '@/api';
import ErpSalesReturnAdd from './Add';
import ErpSalesReturnEdit from './Edit';
import ErpSalesReturnDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';
import CustomizedDictTag from '@/components/CustomizedDictTag';

export default function ErpSalesReturn() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpSalesReturnQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpSalesReturnResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addErpSalesReturn = useRef(null);
  const editErpSalesReturn = useRef(null);
  const deleteErpSalesReturn = useRef(null);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'order_number',
        headerName: t("page.erp.sales.return.title.order.number"),
        flex: 1.4,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedCopyableText
            text={params.row.order_number}
          />
        )
      },
      {
        field: 'sales_order_number',
        headerName: t("page.erp.sales.return.title.sales.order"),
        flex: 1.4,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedCopyableText
            text={params.row.sales_order_number}
          />
        )
      },
      { field: 'customer_name', headerName: t("page.erp.sales.return.title.customer"), flex: 1, minWidth: 100 },
      { field: 'return_date', headerName: t("page.erp.sales.return.title.return.date"), flex: 1, minWidth: 100 },
      { field: 'total_amount', headerName: t("page.erp.sales.return.title.total.amount"), flex: 1, minWidth: 100 },
      { field: 'discount_rate', headerName: t("page.erp.sales.return.title.discount.rate"), flex: 1, minWidth: 100 },
      { field: 'settlement_account_name', headerName: t("page.erp.sales.return.title.settlement.account"), flex: 1, minWidth: 100 },
      { field: 'remarks', headerName: t("page.erp.sales.return.title.remarks"), flex: 1, minWidth: 100 },
      {
        field: 'order_status',
        headerName: t("page.erp.sales.return.title.order.status"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <>
            <CustomizedDictTag type='sale_return_order_status' value={params.row.order_status} />
          </>
        )
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
            {hasOperatePermission('erp:sale:return:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.erp.sales.return')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('erp:sale:return:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.erp.sales.return')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t]
  );

  const queryRecords = async (condition: ErpSalesReturnQueryCondition) => {
    const result = await pageErpSalesReturn(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addErpSalesReturn.current as any).show();
  }

  const handleClickOpenEdit = (erpSalesReturn: ErpSalesReturnResponse) => {
    (editErpSalesReturn.current as any).show(erpSalesReturn);
  };

  const handleClickOpenDelete = (erpSalesReturn: ErpSalesReturnResponse) => {
    (deleteErpSalesReturn.current as any).show(erpSalesReturn);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpSalesReturnQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpSalesReturnQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('erp:sale:return:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <ErpSalesReturnAdd ref={addErpSalesReturn} onSubmit={refreshData} />
      <ErpSalesReturnEdit ref={editErpSalesReturn} onSubmit={refreshData} />
      <ErpSalesReturnDelete ref={deleteErpSalesReturn} onSubmit={refreshData} />
    </Box>
  );
}