import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableMallProductCategory, enableMallProductCategory, pageMallProductCategory, MallProductCategoryQueryCondition, MallProductCategoryResponse } from '@/api';
import MallProductCategoryAdd from './Add';
import MallProductCategoryEdit from './Edit';
import MallProductCategoryDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';

export default function MallProductCategory() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<MallProductCategoryQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<MallProductCategoryResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addMallProductCategory = useRef(null);
  const editMallProductCategory = useRef(null);
  const deleteMallProductCategory = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: MallProductCategoryResponse) => {
      if (checked) {
        await enableMallProductCategory(data.id);
      } else {
        await disableMallProductCategory(data.id);
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
    return (status && !hasOperatePermission('mall:product:category:enable')) || (!status && !hasOperatePermission('mall:product:category:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'parent_id', headerName: t("common.title.parent"), flex: 1, minWidth: 100 },
      { field: 'name', headerName: t("common.title.name"), flex: 1, minWidth: 100 },
      { field: 'sort', headerName: t("common.title.sort"), flex: 1, minWidth: 100 },
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
            {hasOperatePermission('mall:product:category:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.mark_translation')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('mall:product:category:delete') && <Button
              sx={ {color: 'error.main'} }
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.mark_translation')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: MallProductCategoryQueryCondition) => {
    const result = await pageMallProductCategory(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addMallProductCategory.current as any).show();
  }

  const handleClickOpenEdit = (mallProductCategory: MallProductCategoryResponse) => {
    (editMallProductCategory.current as any).show(mallProductCategory);
  };

  const handleClickOpenDelete = (mallProductCategory: MallProductCategoryResponse) => {
    (deleteMallProductCategory.current as any).show(mallProductCategory);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as MallProductCategoryQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as MallProductCategoryQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={ {height: '100%', display: 'flex', flexDirection: 'column'} }>
      <Box sx={ {mb: 2, display: 'flex', justifyContent: 'space-between'} }>
        <Box></Box>
        {hasOperatePermission('mall:product:category:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <MallProductCategoryAdd ref={addMallProductCategory} onSubmit={refreshData} />
      <MallProductCategoryEdit ref={editMallProductCategory} onSubmit={refreshData} />
      <MallProductCategoryDelete ref={deleteMallProductCategory} onSubmit={refreshData} />
    </Box>
  );
}