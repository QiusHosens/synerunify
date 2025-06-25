import { Box, Button, DialogProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import { ErpSalesOrderQueryCondition, ErpSalesOrderResponse, pageErpSalesOrder } from '@/api';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import CheckIcon from '@mui/icons-material/Check';
import CustomizedDialog from '@/components/CustomizedDialog';

interface SalesOrderSelectProps {
    onSubmit: (id: number) => void;
}

const SalesOrderSelect = forwardRef(({ onSubmit }: SalesOrderSelectProps, ref) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [maxWidth] = useState<DialogProps['maxWidth']>('lg');

    const [total, setTotal] = useState<number>(0);
    const [condition, setCondition] = useState<ErpSalesOrderQueryCondition>({
        page: 1,
        size: 20,
    });

    const [records, setRecords] = useState<Array<ErpSalesOrderResponse>>([]);
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [filterModel, setFilterModel] = useState<GridFilterModel>();

    const columns: GridColDef[] = useMemo(
        () => [
            { field: 'order_number', headerName: t("page.erp.sale.order.title.order.number"), flex: 1.4, minWidth: 100 },
            { field: 'customer_id', headerName: t("page.erp.sale.order.title.customer"), flex: 1, minWidth: 100 },
            { field: 'order_date', headerName: t("page.erp.sale.order.title.order.date"), flex: 1.4, minWidth: 100 },
            { field: 'total_amount', headerName: t("page.erp.sale.order.title.total.amount"), flex: 1, minWidth: 100 },
            { field: 'discount_rate', headerName: t("page.erp.sale.order.title.discount.rate"), flex: 1, minWidth: 100 },
            { field: 'deposit', headerName: t("page.erp.sale.order.title.deposit"), flex: 1, minWidth: 100 },
            { field: 'create_time', headerName: t("global.title.create.time"), flex: 1.4, minWidth: 180 },
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
                            title={t('global.operate.select') + t('global.page.erp.sale.order')}
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

    const queryRecords = async (condition: ErpSalesOrderQueryCondition) => {
        const result = await pageErpSalesOrder(condition);
        setRecords(result.list);
        setTotal(result.total);
    };

    const handleClickSelect = (erpSalesOrder: ErpSalesOrderResponse) => {
        onSubmit(erpSalesOrder.id);
        handleClose();
    };

    const refreshData = useCallback(() => {
        queryRecords(condition);
    }, [condition]);

    useEffect(() => {
        refreshData();
    }, [condition, refreshData]);

    const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
        setSortModel(model);
        if (model.length > 0) {
            setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpSalesOrderQueryCondition));
        }
    };

    const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
        setFilterModel(model);
        if (model.items.length > 0) {
            setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpSalesOrderQueryCondition));
        }
    }

    return (
        <CustomizedDialog
            open={open}
            onClose={handleClose}
            title={t('global.title.erp.sales.list')}
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

export default SalesOrderSelect;