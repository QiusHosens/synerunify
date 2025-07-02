import { Box, Button, DialogProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import { ErpPurchaseOrderQueryCondition, ErpPurchaseOrderResponse, pageErpPurchaseOrder } from '@/api';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import CheckIcon from '@mui/icons-material/Check';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedDictTag from '@/components/CustomizedDictTag';

interface PurchaseOrderSelectProps {
    onSubmit: (id: number) => void;
}

const PurchaseOrderSelect = forwardRef(({ onSubmit }: PurchaseOrderSelectProps, ref) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [maxWidth] = useState<DialogProps['maxWidth']>('lg');

    const [total, setTotal] = useState<number>(0);
    const [condition, setCondition] = useState<ErpPurchaseOrderQueryCondition>({
        page: 1,
        size: 20,
    });

    const [records, setRecords] = useState<Array<ErpPurchaseOrderResponse>>([]);
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [filterModel, setFilterModel] = useState<GridFilterModel>();

    const columns: GridColDef[] = useMemo(
        () => [
            { field: 'order_number', headerName: t("erp.common.title.order.number"), flex: 1.4, minWidth: 100 },
            { field: 'supplier_name', headerName: t("erp.common.title.supplier"), flex: 1, minWidth: 100 },
            { field: 'purchase_date', headerName: t("page.erp.purchase.order.title.purchase.date"), flex: 1.4, minWidth: 100 },
            { field: 'total_amount', headerName: t("erp.common.title.total.amount"), flex: 1, minWidth: 100 },
            { field: 'discount_rate', headerName: t("erp.common.title.discount.rate"), flex: 1, minWidth: 100 },
            {
                field: 'order_status',
                headerName: t("erp.common.title.order.status"),
                flex: 1,
                minWidth: 100,
                renderCell: (params: GridRenderCellParams) => (
                    <>
                        <CustomizedDictTag type='purchase_order_status' value={params.row.order_status} />
                    </>
                )
            },
            { field: 'create_time', headerName: t("common.title.create.time"), flex: 1.4, minWidth: 180 },
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

    const queryRecords = async (condition: ErpPurchaseOrderQueryCondition) => {
        const result = await pageErpPurchaseOrder(condition);
        setRecords(result.list);
        setTotal(result.total);
    };

    const handleClickSelect = (erpPurchaseOrder: ErpPurchaseOrderResponse) => {
        onSubmit(erpPurchaseOrder.id);
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
            setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpPurchaseOrderQueryCondition));
        }
    };

    const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
        setFilterModel(model);
        if (model.items.length > 0) {
            setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpPurchaseOrderQueryCondition));
        }
    }

    return (
        <CustomizedDialog
            open={open}
            onClose={handleClose}
            title={t('erp.common.title.purchase.list')}
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

export default PurchaseOrderSelect;