import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { MallProductPropertyQueryCondition, MallProductPropertyResponse, pageMallProductProperty } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import CheckIcon from '@mui/icons-material/Check';

interface PropertySelectProps {
  onSubmit: (id: number) => void;
}

const PropertySelect = forwardRef(({ onSubmit }: PropertySelectProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<MallProductPropertyQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<MallProductPropertyResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("common.title.name"), flex: 1, minWidth: 100 },
      { field: 'remark', headerName: t("common.title.remark"), flex: 1, minWidth: 100 },
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
            <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.select') + t('global.page.erp.purchase.order')}
              startIcon={<CheckIcon />}
              onClick={() => handleClickSelect(params.row)}
            />
          </CustomizedAutoMore>
        ),
      },
    ],
    [t]
  );

  useImperativeHandle(ref, () => ({
    show() {
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const handleClose = () => {
    setOpen(false);
  };

  const queryRecords = async (condition: MallProductPropertyQueryCondition) => {
    const result = await pageMallProductProperty(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickSelect = (mallProductProperty: MallProductPropertyResponse) => {
    onSubmit(mallProductProperty.id);
    handleClose();
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as MallProductPropertyQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as MallProductPropertyQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('page.mall.product.title.property.list')}
      maxWidth={maxWidth}
    >
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
    </CustomizedDialog>
  );
});

export default PropertySelect;