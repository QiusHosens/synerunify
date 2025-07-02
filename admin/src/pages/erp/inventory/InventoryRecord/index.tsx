import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import { pageErpInventoryRecord, ErpInventoryRecordQueryCondition, ErpInventoryRecordResponse } from '@/api';

export default function ErpInventoryRecord() {
  const { t } = useTranslation();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpInventoryRecordQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpInventoryRecordResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'product_name', headerName: t("erp.common.title.product.name"), flex: 1, minWidth: 100 },
      { field: 'warehouse_name', headerName: t("erp.common.title.warehouse.name"), flex: 1, minWidth: 100 },
      { field: 'quantity', headerName: t("erp.detail.common.title.quantity"), flex: 1, minWidth: 100 },
      { field: 'unit_name', headerName: t("page.erp.product.unit.title.name"), flex: 1, minWidth: 100 },
      { field: 'record_type', headerName: t("page.erp.inventory.record.title.record.type"), flex: 1, minWidth: 100 },
      { field: 'record_date', headerName: t("page.erp.inventory.record.title.record.date"), flex: 1, minWidth: 100 },
      { field: 'remarks', headerName: t("common.title.remark"), flex: 1, minWidth: 100 },
      { field: 'create_time', headerName: t("common.title.create.time"), flex: 1, minWidth: 180 },
    ],
    [t]
  );

  const queryRecords = async (condition: ErpInventoryRecordQueryCondition) => {
    const result = await pageErpInventoryRecord(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpInventoryRecordQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpInventoryRecordQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
    </Box>
  );
}