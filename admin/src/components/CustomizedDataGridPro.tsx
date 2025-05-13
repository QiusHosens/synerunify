import React, { useState, useMemo } from 'react';
import { DataGrid, GridColDef, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import { SxProps, Theme } from '@mui/material/styles';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Props 类型定义
interface CustomizedDataGridProProps {
  columns: GridColDef[];
  initialRows: any[];
  getTreeDataPath: (row: any) => string[];
  hideFooter?: boolean;
  sx?: SxProps<Theme>;
}

const CustomizedDataGridPro: React.FC<CustomizedDataGridProProps> = ({
  columns,
  initialRows,
  getTreeDataPath,
  hideFooter,
  sx,
}) => {
  // 状态管理
  const [expandedGroups, setExpandedGroups] = useState(new Set<string>());
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });

  // 分组数据处理
  const rows = useMemo(() => {
    // 构建树状结构
    const tree: {
      [key: string]: { children: any; rows: any[]; path: string; data?: any };
    } = {};
    initialRows.forEach((row) => {
      const path = getTreeDataPath(row) || [];
      let currentLevel = tree;
      path.forEach((segment, index) => {
        const pathSoFar = path.slice(0, index + 1).join('/');
        if (!currentLevel[segment]) {
          currentLevel[segment] = { children: {}, rows: [], path: pathSoFar };
        }
        if (index === path.length - 1) {
          currentLevel[segment].rows.push(row);
          currentLevel[segment].data = row; // 存储节点数据
        }
        currentLevel = currentLevel[segment].children;
      });
    });

    // console.log('tree', tree);

    // 生成平坦的行数据
    const newRows: any[] = [];
    const addGroupRows = (node: any, level = 0) => {
      // 按排序模型排序节点
      const sortedKeys = Object.keys(node).sort((a, b) => {
        if (!sortModel.length) return a.localeCompare(b);
        const field = sortModel[0].field;
        const sort = sortModel[0].sort || 'asc';
        const aValue = node[a].data?.[field] ?? a;
        const bValue = node[b].data?.[field] ?? b;
        if (sort === 'asc') return aValue > bValue ? 1 : -1;
        return aValue < bValue ? 1 : -1;
      });

      // console.log('sort keys', node, sortedKeys);

      sortedKeys.forEach((segment) => {
        const groupPath = node[segment].path;
        const groupId = `group-${groupPath}`;
        // 添加组头
        const groupRow = {
          id: groupId,
          isGroupHeader: true,
          groupKey: segment,
          path: groupPath,
          level,
          rowCount: node[segment].rows.length,
          childrenCount: Object.keys(node[segment].children).length,
          name: node[segment].data?.name || segment,
          value: node[segment].data?.value || null,
          ...node[segment].data, // 包含所有父级数据
        };
        newRows.push(groupRow);

        // console.log('new rows', newRows);

        // 如果组展开，添加子节点和行
        if (expandedGroups.has(groupPath)) {
          // 添加子组
          addGroupRows(node[segment].children, level + 1);
          // 添加原始行（避免重复）
          node[segment].rows
            .filter((row: any) => getTreeDataPath(row).join('/') !== groupPath)
            .forEach((row: any) => {
              newRows.push({
                ...row,
                level: level + 1,
                groupPath,
                path: getTreeDataPath(row) || [],
              });
            });
          // console.log('expanded new rows', newRows);
        }
      });
    };

    addGroupRows(tree);
    console.log('new rows', newRows);
    return newRows;
  }, [initialRows, getTreeDataPath, expandedGroups, sortModel]);

  // 处理组展开/折叠
  const handleGroupToggle = (groupPath: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupPath)) {
      newExpanded.delete(groupPath);
    } else {
      newExpanded.add(groupPath);
    }
    setExpandedGroups(newExpanded);
  };

  // 自定义行渲染
  const getRowClassName = (params: any) => {
    return params.row.isGroupHeader ? 'group-header' : '';
  };

  // 自定义单元格渲染
  const renderCell = (params: any) => {
    if (params.row.isGroupHeader && params.field === 'name') {
      // const groupPath = params.row.path || '';
      const path = getTreeDataPath(params.row) || [];
      const groupPath = path.join('/');
      // const groupPath = path;
      return (
        <div
          style={{ paddingLeft: 10 + (params.row.level || 0) * 20, display: 'flex', alignItems: 'center' }}
        >
          {/* {params.row.childrenCount > 0 ? (expandedGroups.has(groupPath) ? '▼' : '▶') : ''} {params.row.name || params.row.groupKey || 'Unnamed'}  */}
          <div className='toggle-div'
            style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}
            onClick={() => groupPath && handleGroupToggle(groupPath)}>
            {params.row.childrenCount > 0 ? (expandedGroups.has(groupPath) ? <KeyboardArrowDownIcon sx={{ fontSize: '1rem' }} /> : <KeyboardArrowRightIcon sx={{ fontSize: '1rem' }} />) : ''}
          </div>

          {params.row.name || params.row.groupKey || 'Unnamed'}
          {params.row.childrenCount > 0 ? `(${params.row.childrenCount})` : ''}
        </div>
      );
    }
    return params.value;
  };

  // 更新列定义以支持分组头和路径显示
  const updatedColumns = columns.map((col) => ({
    ...col,
    renderCell: col.field === 'name' ? renderCell : (col.renderCell != null ? col.renderCell : undefined),
    valueGetter:
      col.field === 'path'
        ? (params: any) => getTreeDataPath(params.row)?.join(' / ') || ''
        : col.valueGetter,
  }));

  return (
    // <div style={{ height: 400, width: '100%' }}>
    <DataGrid
      rows={rows}
      columns={updatedColumns}
      getRowClassName={getRowClassName}
      // disableSelectionOnClick
      sortModel={sortModel}
      onSortModelChange={setSortModel}
      filterModel={filterModel}
      onFilterModelChange={setFilterModel}
      hideFooter={hideFooter}
      // treeData
      // getTreeDataPath={(row) => row.path || []} // DataGrid 的树状结构支持
      sx={{
        '& .toggle-div:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)'
        },
        ...sx
      }}
    // sx={{
    //   '& .group-header': {
    //     backgroundColor: '#f5f5f5',
    //     fontWeight: 'bold',
    //   },
    // }}
    />
    // </div>
  );
};

export default CustomizedDataGridPro;