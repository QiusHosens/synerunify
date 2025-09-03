import React, { useEffect, useMemo } from "react";
import { useAreaStore } from "@/store";
import CustomizedCascader, { CascaderOption } from "./CustomizedCascader";
import { useTranslation } from "react-i18next";

interface AreaCascaderProps {
  label?: string;
  name?: string;
  value?: string[];
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
    fullWidth
    label={label}
    value={value}
    options={options}
    placeholder={t('common.placeholder.area')}
    onChange={handleChange}
    error={error}
    helperText={helperText}
  />;
};

export default AreaCascader;