import { useDictStore } from "@/store";
import CustomizedTag from "./CustomizedTag";
import { useEffect, useState } from "react";
import { SystemDictDataResponse } from "@/api/dict";

interface CustomizedDictTagProps {
    type: string;
    value: string;
}

const CustomizedDictTag: React.FC<CustomizedDictTagProps> = ({ type, value }) => {
    const { dictOfType } = useDictStore();
    const [dict, setDict] = useState<SystemDictDataResponse>();

    useEffect(() => {
        const datas = dictOfType.get(type);
        if (datas) {
            for (const data of datas) {
                if (data.value == value) {
                    setDict(data);
                }
            }
        }
    }, [dictOfType]);

    return (
        dict && <CustomizedTag
            label={dict.label}
            // color={dict.color_type}
        />
    )
};

export default CustomizedDictTag;