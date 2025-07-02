import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import ViewIcon from '@/assets/image/svg/view.svg';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { ErpOutboundOrderQueryCondition, ErpOutboundOrderResponse, pageSaleErpOutboundOrder } from '@/api';
import ErpOutboundOrderAdd from './Add';
import ErpOutboundOrderEdit from './Edit';
import ErpOutboundOrderDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import ErpOutboundOrderInfo from './Info';

export default function ErpOutboundOrder() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpOutboundOrderQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpOutboundOrderResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const viewErpOutboundOrder = useRef(null);
  const addErpOutboundOrder = useRef(null);
  const editErpOutboundOrder = useRef(null);
  const deleteErpOutboundOrder = useRef(null);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'order_number', headerName: t("erp.common.title.order.number"), flex: 1, minWidth: 100 },
      { field: 'sale_id', headerName: t("erp.common.title.sale"), flex: 1, minWidth: 100 },
      { field: 'customer_id', headerName: t("erp.common.title.customer"), flex: 1, minWidth: 100 },
      { field: 'outbound_date', headerName: t("page.erp.sale.outbound.title.outbound.date"), flex: 1, minWidth: 100 },
      { field: 'remarks', headerName: t("common.title.remark"), flex: 1, minWidth: 100 },
      { field: 'discount_rate', headerName: t("erp.common.title.discount.rate"), flex: 1, minWidth: 100 },
      { field: 'other_cost', headerName: t("erp.common.title.other.cost"), flex: 1, minWidth: 100 },
      { field: 'settlement_account_id', headerName: t("erp.common.title.settlement.account"), flex: 1, minWidth: 100 },
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
            {hasOperatePermission('erp:sale:outbound:get') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.view') + t('global.page.erp.sale.outbound')}
              startIcon={<ViewIcon />}
              onClick={() => handleClickOpenView(params.row)}
            />}
            {hasOperatePermission('erp:sale:outbound:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.erp.sale.outbound')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('erp:sale:outbound:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.erp.sale.outbound')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t]
  );

  const queryRecords = async (condition: ErpOutboundOrderQueryCondition) => {
    const result = await pageSaleErpOutboundOrder(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addErpOutboundOrder.current as any).show();
  }

  const handleClickOpenView = (erpOutboundOrder: ErpOutboundOrderResponse) => {
    (viewErpOutboundOrder.current as any).show(erpOutboundOrder);
  };

  const handleClickOpenEdit = (erpOutboundOrder: ErpOutboundOrderResponse) => {
    (editErpOutboundOrder.current as any).show(erpOutboundOrder);
  };

  const handleClickOpenDelete = (erpOutboundOrder: ErpOutboundOrderResponse) => {
    (deleteErpOutboundOrder.current as any).show(erpOutboundOrder);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpOutboundOrderQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpOutboundOrderQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('erp:sale:outbound:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <ErpOutboundOrderInfo ref={viewErpOutboundOrder} />
      <ErpOutboundOrderAdd ref={addErpOutboundOrder} onSubmit={refreshData} />
      <ErpOutboundOrderEdit ref={editErpOutboundOrder} onSubmit={refreshData} />
      <ErpOutboundOrderDelete ref={deleteErpOutboundOrder} onSubmit={refreshData} />
    </Box>
  );
}