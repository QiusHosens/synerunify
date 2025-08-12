import { Box, Button, styled, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableMallProductCategory, enableMallProductCategory, MallProductCategoryQueryCondition, MallProductCategoryResponse, listMallProductCategory } from '@/api';
import MallProductCategoryAdd from './Add';
import MallProductCategoryEdit from './Edit';
import MallProductCategoryDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import CustomizedDataGridPro from '@/components/CustomizedDataGridPro';
import { getParentNodeLists, Node } from '@/utils/treeUtils';
import { downloadSystemFile } from '@/api/system_file';

export default function MallProductCategory() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [records, setRecords] = useState<Array<MallProductCategoryResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const addMallProductCategory = useRef(null);
  const editMallProductCategory = useRef(null);
  const deleteMallProductCategory = useRef(null);

  const PreviewImage = styled('img')({
    height: '60%',
    objectFit: 'contain',
    top: 0,
    left: 0,
  });

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
      { field: 'name', headerName: t("common.title.name"), flex: 1, minWidth: 200 },
      {
        field: 'file_id',
        headerName: t("page.mall.product.category.title.file"),
        flex: 1,
        minWidth: 200,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            <PreviewImage src={params.row.previewUrl} />
          </Box>
        ),
      },
      { field: 'sort', headerName: t("common.title.sort"), flex: 1, minWidth: 100 },
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
            {hasOperatePermission('mall:product:category:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.mark_translation')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('mall:product:category:delete') && <Button
              sx={{ color: 'error.main' }}
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

  const queryRecords = async () => {
    const result = await listMallProductCategory();
    const nodes: Node[] = [];
    result.forEach(category => {
      nodes.push({
        id: category.id,
        parent_id: category.parent_id == 0 ? undefined : category.parent_id
      } as Node)
    });
    const parentNodeLists = getParentNodeLists(nodes);
    for (let index = 0, len = result.length; index < len; index++) {
      const category = result[index];
      const parentNodes = parentNodeLists.get(category.id);
      category.hierarchy = [];
      if (parentNodes && parentNodes.length > 0) {
        parentNodes.forEach(node => category.hierarchy.push(node.id.toString()));
      }
      category.hierarchy.push(category.id.toString());
    }
    setRecords(result);

    loadImages(result);
  };

  const loadImages = (list: Array<MallProductCategoryResponse>) => {
    for (let index = 0, len = list.length; index < len; index++) {
      const category = list[index];
      // 设置图片
      downloadSystemFile(category.file_id, (progress) => { }).then(file => {
        setRecords(prev =>
          prev.map(item => item.id === category.id ? { ...item, previewUrl: window.URL.createObjectURL(file) } : item)
        )
      })
    }
  }

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
  }, []);

  const getTreeDataPath = (row: any) => row && row.hierarchy;

  const refreshData = () => {
    queryRecords();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('mall:product:category:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
          {t('global.operate.add')}
        </Button>}
      </Box>
      {/* <DataGrid
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
      /> */}
      <CustomizedDataGridPro
        columns={columns}
        initialRows={records}
        getTreeDataPath={getTreeDataPath}
        hideFooter={true}
        initSortModel={sortModel}
      />
      <MallProductCategoryAdd ref={addMallProductCategory} onSubmit={refreshData} />
      <MallProductCategoryEdit ref={editMallProductCategory} onSubmit={refreshData} />
      <MallProductCategoryDelete ref={deleteMallProductCategory} onSubmit={refreshData} />
    </Box>
  );
}