import React, { useEffect, useMemo } from "react";
import { useAreaStore } from "@/store";
import CustomizedCascader, { CascaderOption } from "./CustomizedCascader";
import { useTranslation } from "react-i18next";
import { findAreaPathById } from "@/utils/treeUtils";

// 定义区域节点类型
interface AreaNode {
  id: number;
  name: string;
  children?: AreaNode[];
}

interface AreaCascaderProps {
  label?: string;
  name?: string;
  value?: string[] | number;
  onChange?: (name: string, value: string[]) => void;
  error?: boolean;
  helperText?: React.ReactNode;
}

const AreaCascader: React.FC<AreaCascaderProps> = ({
  name, 
  label, 
  value, 
  onChange, 
  error,
  helperText,
}) => {
  const { t } = useTranslation();
  const { areaTree, fetchAndSetAreaTree } = useAreaStore();

  useEffect(() => {
    if (!areaTree || areaTree.length === 0) {
      fetchAndSetAreaTree();
    }
  }, [areaTree, fetchAndSetAreaTree]);

  const mapToOptions = useMemo(() => {
    return (nodes: AreaNode[]): CascaderOption[] => {
      return (nodes || []).map((node) => ({
        label: node.name,
        value: String(node.id),
        children: node.children && node.children.length > 0 ? mapToOptions(node.children) : undefined,
      }));
    };
  }, []);

  const handleChange = (value: string[]) => {
    onChange?.(name || '', value);
  };

  const options = useMemo(() => mapToOptions(areaTree || []), [areaTree, mapToOptions]);

  // 处理value类型转换：number -> string[]
  const cascaderValue = useMemo(() => {
    if (typeof value === 'number') {
      // 当value为number时，从areaTree中查找对应的路径
      return findAreaPathById(areaTree || [], value);
    }
    return value;
  }, [value, areaTree]);

  return <CustomizedCascader
    size="small"
    fullWidth
    label={label}
    value={cascaderValue}
    options={options}
    placeholder={t('common.placeholder.area')}
    onChange={handleChange}
    error={error}
    helperText={helperText}
  />;
};

export default AreaCascader;