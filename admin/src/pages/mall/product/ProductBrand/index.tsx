import { Box, Button, styled, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableMallProductBrand, enableMallProductBrand, pageMallProductBrand, MallProductBrandQueryCondition, MallProductBrandResponse } from '@/api';
import MallProductBrandAdd from './Add';
import MallProductBrandEdit from './Edit';
import MallProductBrandDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import { downloadSystemFile } from '@/api/system_file';

export default function MallProductBrand() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<MallProductBrandQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<MallProductBrandResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addMallProductBrand = useRef(null);
  const editMallProductBrand = useRef(null);
  const deleteMallProductBrand = useRef(null);

  const PreviewImage = styled('img')({
    height: '60%',
    objectFit: 'contain',
    top: 0,
    left: 0,
  });

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: MallProductBrandResponse) => {
      if (checked) {
        await enableMallProductBrand(data.id);
      } else {
        await disableMallProductBrand(data.id);
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
    return (status && !hasOperatePermission('mall:product:brand:enable')) || (!status && !hasOperatePermission('mall:product:brand:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("common.title.name"), flex: 1, minWidth: 100 },
      {
        field: 'file_id',
        headerName: t("page.mall.product.brand.title.file"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            <PreviewImage src={params.row.previewUrl} />
          </Box>
        ),
      },
      { field: 'sort', headerName: t("common.title.sort"), flex: 1, minWidth: 100 },
      { field: 'description', headerName: t("common.title.description"), flex: 1, minWidth: 100 },
      {
        field: 'status',
        sortable: false,
        headerName: t("global.title.status"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
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
            {hasOperatePermission('mall:product:brand:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.common')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('mall:product:brand:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.common')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: MallProductBrandQueryCondition) => {
    const result = await pageMallProductBrand(condition);
    const list = result.list;
    setRecords(list);
    setTotal(result.total);

    loadImages(list);
  };

  const loadImages = (list: Array<MallProductBrandResponse>) => {
    for (let index = 0, len = list.length; index < len; index++) {
      const brand = list[index];
      // 设置图片
      downloadSystemFile(brand.file_id, (progress) => { }).then(file => {
        setRecords(prev =>
          prev.map(item => item.id === brand.id ? { ...item, previewUrl: window.URL.createObjectURL(file) } : item)
        )
      })
    }
  }

  const handleClickOpenAdd = () => {
    (addMallProductBrand.current as any).show();
  }

  const handleClickOpenEdit = (mallProductBrand: MallProductBrandResponse) => {
    (editMallProductBrand.current as any).show(mallProductBrand);
  };

  const handleClickOpenDelete = (mallProductBrand: MallProductBrandResponse) => {
    (deleteMallProductBrand.current as any).show(mallProductBrand);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as MallProductBrandQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as MallProductBrandQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('mall:product:brand:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <MallProductBrandAdd ref={addMallProductBrand} onSubmit={refreshData} />
      <MallProductBrandEdit ref={editMallProductBrand} onSubmit={refreshData} />
      <MallProductBrandDelete ref={deleteMallProductBrand} onSubmit={refreshData} />
    </Box>
  );
}