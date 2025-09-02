import React, { useEffect, useMemo } from "react";
import { useAreaStore } from "@/store";
import CustomizedCascader, { CascaderOption } from "./CustomizedCascader";

interface AreaCascaderProps {
  name?: string;
  value?: string[];
  onChange?: (name: string, value: string[]) => void;
}

const AreaCascader: React.FC<AreaCascaderProps> = ({ name, value, onChange }) => {
  const { areaTree, fetchAndSetAreaTree } = useAreaStore();

  useEffect(() => {
    if (!areaTree || areaTree.length === 0) {
      fetchAndSetAreaTree();
    }
  }, [areaTree, fetchAndSetAreaTree]);

  const mapToOptions = (nodes: any[]): CascaderOption[] => {
    return (nodes || []).map((node) => ({
      label: node.name,
      value: String(node.id),
      children: node.children && node.children.length > 0 ? mapToOptions(node.children) : undefined,
    }));
  };

  const handleChange = (value: string[]) => {
    onChange?.(name || '', value);
  };

  const options = useMemo(() => mapToOptions(areaTree || []), [areaTree]);

  return <CustomizedCascader
    size="small"
    options={options}
    placeholder="请选择区域"
    onChange={handleChange}
  />;
};

export default AreaCascader;