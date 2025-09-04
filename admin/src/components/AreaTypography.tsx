import { useAreaStore } from "@/store";
import { Typography } from "@mui/material";
import { useEffect, useMemo } from "react";

interface AreaTypographyProps {
  value?: string[];
}

const AreaTypography: React.FC<AreaTypographyProps> = ({
  value,
}) => {
  const { areaTree, fetchAndSetAreaTree } = useAreaStore();

  useEffect(() => {
    if (!areaTree || areaTree.length === 0) {
      fetchAndSetAreaTree();
    }
  }, [areaTree, fetchAndSetAreaTree]);

  // 根据 value 路径在 areaTree 中查找对应的各级名称
  const labelText = useMemo(() => {
    if (!value || value.length === 0) return '';
    if (!areaTree || areaTree.length === 0) return '';

    const names: string[] = [];
    let currentLevel = areaTree as Array<any>;

    for (const v of value) {
      if (!currentLevel || currentLevel.length === 0) break;
      const matched = currentLevel.find((n) => String(n.id) === String(v));
      if (!matched) break;
      names.push(matched.name);
      currentLevel = matched.children || [];
    }

    return names.join(' / ');
  }, [value, areaTree]);

  return (
    <Typography variant="body1">{labelText}</Typography>
  )
};

export default AreaTypography;