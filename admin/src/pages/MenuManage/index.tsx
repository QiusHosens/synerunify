import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { listMenu, SystemMenuResponse } from '@/api';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import CustomizedDataGridPro from '@/components/CustomizedDataGridPro';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import MenuAdd from './Add';
import { getParentNodeLists, Node } from '@/utils/treeUtils';
import MenuEdit from './Edit';
import MenuDelete from './Delete';
import CustomizedDictTag from '@/components/CustomizedDictTag';

export default function MenuManage() {
  const { t } = useTranslation();

  const [records, setRecords] = useState<Array<SystemMenuResponse>>([]);

  const addMenu = useRef(null);
  const editMenu = useRef(null);
  const deleteMenu = useRef(null);

  const columns: GridColDef[] = [
    { field: 'name', headerName: t("page.menu.title.name"), flex: 1, width: 200 },
    { field: 'permission', headerName: t("page.menu.title.permission"), flex: 1, width: 200 },
    {
      field: 'types',
      sortable: false,
      resizable: false,
      filterable: false,
      headerName: t("page.menu.title.type"),
      flex: 1,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <CustomizedDictTag type='menu_type' value={params.row.type} />
        </>
      )
    },
    {
      field: 'sort',
      headerName: t("page.menu.title.sort"),
      flex: 1,
      width: 200,
    },
    {
      field: 'actions',
      sortable: false,
      resizable: false,
      headerName: t("global.operate.actions"),
      flex: 1,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            size="small"
            variant='customOperate'
            title={t('page.dict.operate.edit')}
            startIcon={<EditIcon />}
            onClick={() => handleClickOpenEdit(params.row)}
          />
          <Button
            sx={{ color: 'error.main' }}
            size="small"
            variant='customOperate'
            title={t('page.dict.operate.delete')}
            startIcon={<DeleteIcon />}
            onClick={() => handleClickOpenDelete(params.row)}
          />
        </Box>
      ),
    },
  ];

  const handleClickOpenAdd = () => {
    (addMenu.current as any).show();
  }

  const handleClickOpenEdit = (dict: SystemMenuResponse) => {
    (editMenu.current as any).show(dict);
  };

  const handleClickOpenDelete = (dict: SystemMenuResponse) => {
    (deleteMenu.current as any).show(dict);
  };

  const queryRecords = async () => {
    const result = await listMenu();
    // console.log('menu list', result);
    const nodes: Node[] = [];
    result.forEach(menu => {
      nodes.push({
        id: menu.id,
        parent_id: menu.parent_id == 0 ? undefined : menu.parent_id
      } as Node)
    });
    const parentNodeLists = getParentNodeLists(nodes);
    // console.log('parent node list', parentNodeLists);
    result.forEach(menu => {
      const parentNodes = parentNodeLists.get(menu.id);
      menu.hierarchy = [];
      if (parentNodes && parentNodes.length > 0) {
        parentNodes.forEach(node => menu.hierarchy.push(node.id.toString()));
      }
      menu.hierarchy.push(menu.id.toString());
    })
    setRecords(result);
  }

  const getTreeDataPath = (row: any) => row.hierarchy;

  const refreshData = () => {
    queryRecords();
  };

  useEffect(() => {
    queryRecords();
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        <Button variant="customContained" onClick={handleClickOpenAdd}>
          {t('global.operate.add')}
        </Button>
      </Box>
      <CustomizedDataGridPro
        columns={columns}
        initialRows={records}
        getTreeDataPath={getTreeDataPath}
        hideFooter={true}
      />
      <MenuAdd ref={addMenu} onSubmit={refreshData} />
      <MenuEdit ref={editMenu} onSubmit={refreshData} />
      <MenuDelete ref={deleteMenu} onSubmit={refreshData} />
    </Box>
  );
}