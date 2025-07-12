import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import {  ErpInventoryRecordQueryCondition } from '@/api';
import { LoggerQueryCondition, LoginLoggerResponse, pageLoginLogger } from '@/api/logger';

export default function ErpInventoryRecord() {
  const { t } = useTranslation();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpInventoryRecordQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<LoginLoggerResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'username', headerName: t("system.audit.logger.title.username"), flex: 1, minWidth: 100 },
      { field: 'result', headerName: t("system.audit.logger.title.result"), flex: 1, minWidth: 100 },
      { field: 'user_ip', headerName: t("system.audit.logger.title.user.ip"), flex: 1, minWidth: 100 },
      { field: 'user_agent', headerName: t("system.audit.logger.title.user.agent"), flex: 1, minWidth: 100 },
      { field: 'department_id', headerName: t("system.audit.logger.title.department"), flex: 1, minWidth: 100 },
      { field: 'operator_nickname', headerName: t("system.audit.logger.title.operator"), flex: 1, minWidth: 100 },
      { field: 'operate_time', headerName: t("system.audit.logger.title.operate.time"), flex: 1, minWidth: 180 },
    ],
    [t]
  );

  const queryRecords = async (condition: LoggerQueryCondition) => {
    const result = await pageLoginLogger(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as LoggerQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as LoggerQueryCondition));
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