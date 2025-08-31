import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableMallTradeDeliveryExpressTemplate, enableMallTradeDeliveryExpressTemplate, pageMallTradeDeliveryExpressTemplate, MallTradeDeliveryExpressTemplateQueryCondition, MallTradeDeliveryExpressTemplateResponse } from '@/api';
import MallTradeDeliveryExpressTemplateAdd from './Add';
import MallTradeDeliveryExpressTemplateEdit from './Edit';
import MallTradeDeliveryExpressTemplateDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';

export default function MallTradeDeliveryExpressTemplate() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<MallTradeDeliveryExpressTemplateQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<MallTradeDeliveryExpressTemplateResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addMallTradeDeliveryExpressTemplate = useRef(null);
  const editMallTradeDeliveryExpressTemplate = useRef(null);
  const deleteMallTradeDeliveryExpressTemplate = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: MallTradeDeliveryExpressTemplateResponse) => {
      if (checked) {
        await enableMallTradeDeliveryExpressTemplate(data.id);
      } else {
        await disableMallTradeDeliveryExpressTemplate(data.id);
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
    return (status && !hasOperatePermission('mall:trade:delivery:express:template:enable')) || (!status && !hasOperatePermission('mall:trade:delivery:express:template:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("page.mall.trade.delivery.express.template.title.name"), flex: 1, minWidth: 100 },
      { field: 'charge_mode', headerName: t("page.mall.trade.delivery.express.template.title.charge.mode"), flex: 1, minWidth: 100 },
      { field: 'sort', headerName: t("page.mall.trade.delivery.express.template.title.sort"), flex: 1, minWidth: 100 },
      { field: 'status', headerName: t("page.mall.trade.delivery.express.template.title.status"), flex: 1, minWidth: 100 },
      
      {
        field: 'status',
        sortable: false,
        headerName: t("global.title.status"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={ { height: '100%', display: 'flex', gap: 1, alignItems: 'center' } }>
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
          <CustomizedAutoMore>
            {hasOperatePermission('mall:trade:delivery:express:template:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.mall.trade.delivery.express.template')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('mall:trade:delivery:express:template:delete') && <Button
              sx={ {color: 'error.main'} }
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.mall.trade.delivery.express.template')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: MallTradeDeliveryExpressTemplateQueryCondition) => {
    const result = await pageMallTradeDeliveryExpressTemplate(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addMallTradeDeliveryExpressTemplate.current as any).show();
  }

  const handleClickOpenEdit = (mallTradeDeliveryExpressTemplate: MallTradeDeliveryExpressTemplateResponse) => {
    (editMallTradeDeliveryExpressTemplate.current as any).show(mallTradeDeliveryExpressTemplate);
  };

  const handleClickOpenDelete = (mallTradeDeliveryExpressTemplate: MallTradeDeliveryExpressTemplateResponse) => {
    (deleteMallTradeDeliveryExpressTemplate.current as any).show(mallTradeDeliveryExpressTemplate);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as MallTradeDeliveryExpressTemplateQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as MallTradeDeliveryExpressTemplateQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={ {height: '100%', display: 'flex', flexDirection: 'column'} }>
      <Box sx={ {mb: 2, display: 'flex', justifyContent: 'space-between'} }>
        <Box></Box>
        {hasOperatePermission('mall:trade:delivery:express:template:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <MallTradeDeliveryExpressTemplateAdd ref={addMallTradeDeliveryExpressTemplate} onSubmit={refreshData} />
      <MallTradeDeliveryExpressTemplateEdit ref={editMallTradeDeliveryExpressTemplate} onSubmit={refreshData} />
      <MallTradeDeliveryExpressTemplateDelete ref={deleteMallTradeDeliveryExpressTemplate} onSubmit={refreshData} />
    </Box>
  );
}