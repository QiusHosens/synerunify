import { Box, Button, Card, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { getBaseMallProductProperty, getBaseMallProductSpu, listMallProductBrand, listMallProductCategory, listMallTradeDeliveryExpressTemplate, MallProductBrandResponse, MallProductCategoryResponse, MallProductPropertyBaseResponse, MallProductPropertyValueResponse, MallProductSkuRequest, MallProductSpuRequest, MallProductSpuResponse, MallTradeDeliveryExpressTemplateResponse, PropertyValues, updateMallProductSpu } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedFileUpload, { DownloadProps, UploadFile } from '@/components/CustomizedFileUpload';
import CustomizedAnchor, { AnchorLinkProps } from '@/components/CustomizedAnchor';
import PropertySelect from './PropertySelect';
import CustomizedNumberInput from '@/components/CustomizedNumberInput';
import { Editor } from '@tinymce/tinymce-react';
import CustomizedDictCheckboxGroup from '@/components/CustomizedDictCheckboxGroup';
import CustomizedDictRadioGroup from '@/components/CustomizedDictRadioGroup';
import SelectTree from '@/components/SelectTree';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { downloadSystemFile, uploadSystemFile } from '@/api/system_file';
import CustomizedTag from '@/components/CustomizedTag';

interface AttachmentValues {
  file_id?: number; // 文件ID

  file?: UploadFile | null;
}

interface FormSkuErrors {
  properties?: string; // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
  price?: string; // 商品价格，单位：分
  market_price?: string; // 市场价，单位：分
  cost_price?: string; // 成本价，单位： 分
  bar_code?: string; // SKU 的条形码
  file_id?: string; // 图片
  stock?: string; // 库存
  weight?: string; // 商品重量，单位：kg 千克
  volume?: string; // 商品体积，单位：m^3 平米
  first_brokerage_price?: string; // 一级分销的佣金，单位：分
  second_brokerage_price?: string; // 二级分销的佣金，单位：分
}

interface FormErrors {
  name?: string; // 商品名称
  category_id?: string; // 商品分类编号
  brand_id?: string; // 商品品牌编号
  file_id?: string; // 商品封面图
  sort?: string; // 排序字段
  status?: string; // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收
  price?: string; // 商品价格，单位使用：分
  cost_price?: string; // 成本价，单位： 分
  stock?: string; // 库存
  delivery_types?: string; // 配送方式数组
  give_integral?: string; // 赠送积分
  delivery_template_id?: string; // 运费模板

  skus: FormSkuErrors[];
}

interface TreeNode {
  id: string | number;
  parent_id: number; // 父菜单ID
  label: string;
  children: TreeNode[];
}

interface MallProductSpuEditProps {
  onSubmit: () => void;
}

const MallProductSpuEdit = forwardRef(({ onSubmit }: MallProductSpuEditProps, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
  const [brands, setBrands] = useState<MallProductBrandResponse[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>(0);
  const [sliderFiles, setSliderFiles] = useState<AttachmentValues[]>([]);
  const [templates, setTemplates] = useState<MallTradeDeliveryExpressTemplateResponse[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<MallProductPropertyBaseResponse[]>([]);
  const [selectedPropertyValueIds, setSelectedPropertyValueIds] = useState<number[]>([]);
  const [selectedPropertyValues, setSelectedPropertyValues] = useState<MallProductPropertyValueResponse[]>([]);
  const [mallProductSpu, setMallProductSpu] = useState<MallProductSpuRequest>({
    id: 0,
    name: '',
    keyword: '',
    introduction: '',
    description: '',
    category_id: 0,
    brand_id: 0,
    file_id: 0,
    slider_file_ids: '',
    sort: 0,
    status: 0,
    spec_type: 0,
    price: 0,
    market_price: 0,
    cost_price: 0,
    stock: 0,
    delivery_types: '',
    delivery_template_id: 0,
    give_integral: 0,
    sub_commission_type: 0,
    virtual_sales_count: 0,
    skus: [{
      properties: '',
      price: 0,
      market_price: 0,
      cost_price: 0,
      bar_code: '',
      stock: 0,
      weight: 0,
      volume: 0,
      first_brokerage_price: 0,
      second_brokerage_price: 0,
    }],
  });
  const [errors, setErrors] = useState<FormErrors>({
    skus: [],
  });
  const [fileWidth] = useState<number>(240);
  const [fileHeight] = useState<number>(160);
  const [downloadImages, setDownloadImages] = useState<Map<number, DownloadProps>>(new Map<number, DownloadProps>());

  const anchorContainerRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const editorRef = useRef<any>(null);
  const selectProperty = useRef(null);

  const anchorItems: AnchorLinkProps[] = [
    {
      href: '#basic',
      title: t('page.mall.product.tab.basic.settings'),
    },
    {
      href: '#price',
      title: t('page.mall.product.tab.price.inventory'),
    },
    {
      href: '#logistics',
      title: t('page.mall.product.tab.logistics.settings'),
    },
    {
      href: '#product',
      title: t('page.mall.product.tab.product.detail'),
    },
    {
      href: '#other',
      title: t('page.mall.product.tab.other.settings'),
    },
  ];

  useImperativeHandle(ref, () => ({
    show(mallProductSpu: MallProductSpuResponse) {
      initForm(mallProductSpu);
      listBrands();
      initCategorys();
      initTemplates();
      setOpen(true);

      setTimeout(() => {
        if (anchorContainerRef.current) {
          setIsMounted(true);
        }
      });
    },
    hide() {
      setOpen(false);
    },
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      skus: mallProductSpu.skus.map(() => ({
        properties: undefined,
        price: undefined,
        market_price: undefined,
        cost_price: undefined,
        bar_code: undefined,
        file_id: undefined,
        stock: undefined,
        weight: undefined,
        volume: undefined,
        first_brokerage_price: undefined,
        second_brokerage_price: undefined,
        sales_count: undefined,
      }))
    };

    if (!mallProductSpu.name.trim()) {
      newErrors.name = t('global.error.input.please') + t('page.mall.product.title.name');
    }

    if (!mallProductSpu.category_id && mallProductSpu.category_id != 0) {
      newErrors.category_id = t('global.error.select.please') + t('page.mall.product.title.category');
    }

    if (!mallProductSpu.file_id && mallProductSpu.file_id != 0) {
      newErrors.file_id = t('global.error.select.please') + t('page.mall.product.title.file');
    }

    if (!mallProductSpu.sort && mallProductSpu.sort != 0) {
      newErrors.sort = t('global.error.input.please') + t('page.mall.product.title.sort');
    }

    if (!mallProductSpu.price && mallProductSpu.price != 0) {
      newErrors.price = t('global.error.input.please') + t('page.mall.product.title.price');
    }

    if (!mallProductSpu.cost_price && mallProductSpu.cost_price != 0) {
      newErrors.cost_price = t('global.error.input.please') + t('page.mall.product.title.cost.price');
    }

    if (!mallProductSpu.stock && mallProductSpu.stock != 0) {
      newErrors.stock = t('global.error.input.please') + t('page.mall.product.title.stock');
    }

    if (!mallProductSpu.delivery_types.trim()) {
      newErrors.delivery_types = t('global.error.input.please') + t('page.mall.product.title.delivery.types');
    }

    if (!mallProductSpu.give_integral && mallProductSpu.give_integral != 0) {
      newErrors.give_integral = t('global.error.input.please') + t('page.mall.product.title.give.integral');
    }

    mallProductSpu.skus.forEach((sku, index) => {
      if (!sku.file_id && sku.file_id != 0) {
        newErrors.skus[index].file_id = t('global.error.select.please') + t('page.mall.product.sku.title.file');
      }

      if (!sku.bar_code || sku.bar_code.length == 0) {
        newErrors.skus[index].bar_code = t('global.error.input.please') + t('page.mall.product.sku.title.bar.code');
      }

      if (!sku.price && sku.price != 0) {
        newErrors.skus[index].price = t('global.error.input.please') + t('page.mall.product.sku.title.price');
      }

      if (!sku.market_price && sku.market_price != 0) {
        newErrors.skus[index].market_price = t('global.error.input.please') + t('page.mall.product.sku.title.market.price');
      }

      if (!sku.cost_price && sku.cost_price != 0) {
        newErrors.skus[index].cost_price = t('global.error.input.please') + t('page.mall.product.sku.title.cost.price');
      }

      if (!sku.stock && sku.stock != 0) {
        newErrors.skus[index].stock = t('global.error.input.please') + t('page.mall.product.sku.title.stock');
      }

      if (!sku.weight && sku.weight != 0) {
        newErrors.skus[index].weight = t('global.error.input.please') + t('page.mall.product.sku.title.weight');
      }

      if (!sku.volume && sku.volume != 0) {
        newErrors.skus[index].volume = t('global.error.input.please') + t('page.mall.product.sku.title.volume');
      }

      if (mallProductSpu.sub_commission_type == 1) {
        if (!sku.first_brokerage_price && sku.first_brokerage_price != 0) {
          newErrors.skus[index].first_brokerage_price = t('global.error.input.please') + t('page.mall.product.sku.title.first.brokerage.price');
        }

        if (!sku.second_brokerage_price && sku.second_brokerage_price != 0) {
          newErrors.skus[index].second_brokerage_price = t('global.error.input.please') + t('page.mall.product.sku.title.second.brokerage.price');
        }
      }
    });

    setErrors(newErrors);
    return !Object.keys(newErrors).some((key) => {
      if (key === 'skus') {
        return newErrors.skus.some((err) =>
          Object.values(err).some((value) => value !== undefined)
        );
      }
      return newErrors[key as keyof FormErrors];
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initForm = async (mallProductSpu: MallProductSpuResponse) => {
    const result = await getBaseMallProductSpu(mallProductSpu.id);
    setMallProductSpu({
      ...result,
    })
    // 设置封面图片
    downloadSystemFile(result.file_id, (progress) => {
      setDownloadImages(prev => {
        const data: DownloadProps = {
          status: 'downloading',
          progress
        };
        const newMap = new Map(prev);
        newMap.set(result.file_id, data);
        return newMap;
      })
    }).then((blob) => {
      setDownloadImages(prev => {
        const data: DownloadProps = {
          status: 'done',
          previewUrl: window.URL.createObjectURL(blob),
        };
        const newMap = new Map(prev);
        newMap.set(result.file_id, data);
        return newMap;
      })
    });
    // 设置轮播图片
    const slider_file_ids = result.slider_file_ids.split(',');
    setSliderFiles(slider_file_ids.map(item => ({ file_id: Number(item) })));
    for (const slider_file_id of slider_file_ids) {
      const file_id = Number(slider_file_id);
      downloadSystemFile(file_id, (progress) => {
        setDownloadImages(prev => {
          const data: DownloadProps = {
            status: 'downloading',
            progress
          };
          const newMap = new Map(prev);
          newMap.set(file_id, data);
          return newMap;
        })
      }).then((blob) => {
        setDownloadImages(prev => {
          const data: DownloadProps = {
            status: 'done',
            previewUrl: window.URL.createObjectURL(blob),
          };
          const newMap = new Map(prev);
          newMap.set(file_id, data);
          return newMap;
        })
      });
    }
    // 设置sku图片
    for (const sku of result.skus) {
      const file_id = sku.file_id;
      downloadSystemFile(file_id, (progress) => {
        setDownloadImages(prev => {
          const data: DownloadProps = {
            status: 'downloading',
            progress
          };
          const newMap = new Map(prev);
          newMap.set(file_id, data);
          return newMap;
        })
      }).then((blob) => {
        setDownloadImages(prev => {
          const data: DownloadProps = {
            status: 'done',
            previewUrl: window.URL.createObjectURL(blob),
          };
          const newMap = new Map(prev);
          newMap.set(file_id, data);
          return newMap;
        })
      });
    }
    setErrors({
      skus: result.skus.map(() => ({
        properties: undefined,
        price: undefined,
        market_price: undefined,
        cost_price: undefined,
        bar_code: undefined,
        stock: undefined,
        weight: undefined,
        volume: undefined,
        first_brokerage_price: undefined,
        second_brokerage_price: undefined,
      }))
    });
  }

  const listBrands = async () => {
    const result = await listMallProductBrand();
    if (result.length > 0) {
      setMallProductSpu(prev => ({
        ...prev,
        brand_id: result[0].id
      }));
    }
    setBrands(result);
  }

  const initTemplates = async () => {
    const result = await listMallTradeDeliveryExpressTemplate();
    setTemplates(result);
  }

  const initCategorys = async () => {
    const result = await listMallProductCategory();
    const root = findRoot(result);
    if (root) {
      setSelectedCategoryId(root.id);
      setMallProductSpu(prev => ({
        ...prev,
        category_id: root.id
      }))
    }
    const tree = buildTree(result, root?.parent_id);
    setTreeData(tree);
  }

  const findRoot = (list: MallProductCategoryResponse[]): MallProductCategoryResponse | undefined => {
    const ids = list.map(item => item.id);
    const parentIds = list.map(item => item.parent_id);
    const rootIds = parentIds.filter(id => ids.indexOf(id) < 0);
    if (rootIds.length > 0) {
      const rootId = rootIds[0];
      return list.filter(item => rootId === item.parent_id)[0];
    }
    return undefined;
  }

  const buildTree = (list: MallProductCategoryResponse[], rootParentId: number | undefined): TreeNode[] => {
    const map: { [key: string]: TreeNode } = {};
    const tree: TreeNode[] = [];

    for (const item of list) {
      map[item.id] = {
        id: item.id,
        parent_id: item.parent_id,
        label: item.name,
        children: [],
      };
    }

    for (const item of list) {
      if (item.parent_id === rootParentId) {
        tree.push(map[item.id]);
      } else if (map[item.parent_id]) {
        map[item.parent_id].children.push(map[item.id]);
      }
    }

    return tree;
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const skus: MallProductSkuRequest[] = [];
      const sources = mallProductSpu.spec_type == 0 ? mallProductSpu.skus.slice(0, 1) : mallProductSpu.skus.slice(1);
      for (const sku of sources) {
        skus.push({
          properties: sku.properties,
          price: sku.price,
          market_price: sku.market_price,
          cost_price: sku.cost_price,
          bar_code: sku.bar_code,
          file_id: sku.file_id,
          stock: sku.stock,
          weight: sku.weight,
          volume: sku.volume,
          first_brokerage_price: sku.first_brokerage_price,
          second_brokerage_price: sku.second_brokerage_price,
        });
      }
      const request: MallProductSpuRequest = {
        id: mallProductSpu.id,
        name: mallProductSpu.name,
        keyword: mallProductSpu.keyword,
        introduction: mallProductSpu.introduction,
        description: editorRef.current.getContent(),
        category_id: mallProductSpu.category_id,
        brand_id: mallProductSpu.brand_id,
        file_id: mallProductSpu.file_id!,
        slider_file_ids: sliderFiles.map(item => item.file_id).join(','),
        sort: mallProductSpu.sort,
        status: mallProductSpu.status,
        spec_type: Number(mallProductSpu.spec_type),
        price: mallProductSpu.skus[0].price,
        market_price: mallProductSpu.skus[0].market_price,
        cost_price: mallProductSpu.skus[0].cost_price,
        stock: mallProductSpu.skus[0].stock,
        delivery_types: mallProductSpu.delivery_types,
        delivery_template_id: mallProductSpu.delivery_template_id,
        give_integral: mallProductSpu.give_integral,
        sub_commission_type: Number(mallProductSpu.sub_commission_type),
        virtual_sales_count: mallProductSpu.virtual_sales_count,
        skus,
      }
      await updateMallProductSpu(request);
      handleClose();
      onSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setMallProductSpu((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleCheckboxChange = useCallback((name: string | undefined, checkedValues: any[]) => {
    if (!name) {
      return;
    }
    const value = checkedValues.join(',');
    setMallProductSpu(prev => ({
      ...prev,
      [name]: value
    }));

    // 默认选中运费模板
    if (value.indexOf('0') >= 0 && templates.length > 0) {
      setMallProductSpu(prev => ({
        ...prev,
        delivery_template_id: templates[0].id
      }));
    }

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors, templates]);

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setMallProductSpu(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleChange = (name: string, node: TreeNode) => {
    setSelectedCategoryId(node.id);
    setMallProductSpu(prev => ({
      ...prev,
      [name]: node.id
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = useCallback(async (file: UploadFile | null, action: 'upload' | 'remove') => {
    if (action === 'upload' && file) {
      // 更新文件列表,增加一个附件,等待上传完成后在写入信息
      setMallProductSpu((prev) => {
        return { ...prev, file };
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setMallProductSpu((prev) => {
            return { ...prev, file: { ...prev.file!, progress } };
          });
        });

        // 上传完成
        setMallProductSpu((prev) => {
          return { ...prev, file_id: result, file: { ...prev.file!, status: 'done' as const } };
        });
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        setMallProductSpu((prev) => {
          return { ...prev, file: { ...prev.file!, status: 'error' as const } };
        });
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setMallProductSpu((prev) => {
        return { ...prev, file: undefined };
      });
    }
  }, []);

  const handleSliderFileChange = useCallback(async (file: UploadFile | null, action: 'upload' | 'remove', index: number) => {
    if (action === 'upload' && file) {
      // 更新文件列表,增加一个附件,等待上传完成后在写入信息
      setSliderFiles((prev) => {
        return [...prev, { file }];
      })

      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          setSliderFiles((prev) =>
            prev.map((item, idx) => {
              if (idx !== index) return item;
              const updatedItem = { ...item, file: { ...item.file!, progress } };
              return updatedItem;
            })
          );
        });

        // 上传完成
        setSliderFiles((prev) =>
          prev.map((item, idx) => {
            if (idx !== index) return item;
            const updatedItem = { ...item, file_id: result, file: { ...item.file!, status: 'done' as const } };
            return updatedItem;
          })
        );
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        setSliderFiles((prev) =>
          prev.map((item, idx) => {
            if (idx !== index) return item;
            const updatedItem = { ...item, file: { ...item.file!, status: 'error' as const } };
            return updatedItem;
          })
        );
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setSliderFiles((prev) =>
        prev.filter((_, idx) => idx !== index)
      );
    }
  }, []);

  const handleClickSkuDelete = useCallback((index: number) => {
    setMallProductSpu((prev) => ({
      ...prev,
      skus: prev.skus.filter((_, idx) => idx !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      skus: prev.skus.filter((_, idx) => idx !== index),
    }));
  }, []);

  const handleSkuInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, type } = e.target;

    if (mallProductSpu.spec_type == 1 && index == 0) {
      // 多规格 批量设置
      setMallProductSpu((prev) => ({
        ...prev,
        skus: prev.skus.map((item) => ({ ...item, [name]: type === 'number' ? Number(value) : value }))
      }));
    } else {
      // 多规格 单独设置
      setMallProductSpu((prev) => ({
        ...prev,
        skus: prev.skus.map((item, idx) => {
          if (idx !== index) return item;
          return { ...item, [name]: type === 'number' ? Number(value) : value }
        })
      }));
    }

    if (mallProductSpu.spec_type == 1 && index == 0) {
      // 多规格 批量设置
      setErrors(prev => ({
        ...prev,
        skus: prev.skus.map(item =>
          ({ ...item, [name]: undefined })
        ),
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        skus: prev.skus.map((item, idx) =>
          idx === index ? { ...item, [name]: undefined } : item
        ),
      }));
    }
  }, [mallProductSpu.spec_type]);

  const handleSkuFileChange = useCallback(async (file: UploadFile | null, action: 'upload' | 'remove', index: number) => {
    if (action === 'upload' && file) {
      // 更新文件列表,增加一个附件,等待上传完成后在写入信息
      if (mallProductSpu.spec_type == 1 && index == 0) {
        // 多规格 批量设置
        setMallProductSpu((prev) => ({
          ...prev,
          skus: mallProductSpu.skus.map(item => {
            return { ...item, file }
          })
        }))
      } else {
        setMallProductSpu((prev) => ({
          ...prev,
          skus: mallProductSpu.skus.map((item, idx) => {
            if (idx !== index) return item;
            return { ...item, file }
          })
        }))
      }


      // 上传文件
      try {
        const result = await uploadSystemFile(file.file, (progress) => {
          if (mallProductSpu.spec_type == 1 && index == 0) {
            // 多规格 批量设置
            setMallProductSpu((prev) => ({
              ...prev,
              skus: mallProductSpu.skus.map(item => {
                return { ...item, file: { ...item.file!, progress } }
              })
            }))
          } else {
            setMallProductSpu((prev) => ({
              ...prev,
              skus: mallProductSpu.skus.map((item, idx) => {
                if (idx !== index) return item;
                return { ...item, file: { ...item.file!, progress } }
              })
            }))
          }
        });

        // 上传完成
        if (mallProductSpu.spec_type == 1 && index == 0) {
          // 多规格 批量设置
          setMallProductSpu((prev) => ({
            ...prev,
            skus: mallProductSpu.skus.map(item => {
              return { ...item, file_id: result, file: { ...item.file!, status: 'done' as const } }
            })
          }))
        } else {
          setMallProductSpu((prev) => ({
            ...prev,
            skus: mallProductSpu.skus.map((item, idx) => {
              if (idx !== index) return item;
              return { ...item, file_id: result, file: { ...item.file!, status: 'done' as const } }
            })
          }))
        }

        if (mallProductSpu.spec_type == 1 && index == 0) {
          // 多规格 批量设置
          setErrors(prev => ({
            ...prev,
            skus: prev.skus.map(item =>
              ({ ...item, file_id: undefined })
            ),
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            skus: prev.skus.map((item, idx) =>
              idx === index ? { ...item, file_id: undefined } : item
            ),
          }));
        }
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        if (mallProductSpu.spec_type == 1 && index == 0) {
          // 多规格 批量设置
          setMallProductSpu((prev) => ({
            ...prev,
            skus: mallProductSpu.skus.map(item => {
              return { ...item, file: { ...item.file!, status: 'error' as const } }
            })
          }))
        } else {
          setMallProductSpu((prev) => ({
            ...prev,
            skus: mallProductSpu.skus.map((item, idx) => {
              if (idx !== index) return item;
              return { ...item, file: { ...item.file!, status: 'error' as const } }
            })
          }))
        }
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      if (mallProductSpu.spec_type == 1 && index == 0) {
        // 多规格 批量设置
        setMallProductSpu((prev) => ({
          ...prev,
          skus: mallProductSpu.skus.map(item => {
            return { ...item, file: undefined }
          })
        }))
      } else {
        setMallProductSpu((prev) => ({
          ...prev,
          skus: mallProductSpu.skus.map((item, idx) => {
            if (idx !== index) return item;
            return { ...item, file: undefined }
          })
        }))
      }
    }
  }, [mallProductSpu.skus, mallProductSpu.spec_type]);

  const handleOpenPropertySelect = () => {
    (selectProperty.current as any).show(selectedProperties.map(item => item.id));
  }

  const handlePropertySelectedCallback = async (id: number) => {
    const result = await getBaseMallProductProperty(id);
    setSelectedProperties(prev => [...prev, result])
  };

  const handlePropertyRemove = (property: MallProductPropertyBaseResponse) => {
    setSelectedProperties(prev => prev.filter(item => item.id != property.id));
    // 移除选中属性值
    const valueIds = property.values.map(item => item.id);
    setSelectedPropertyValueIds(prev => prev.filter(item => !valueIds.includes(item)));
    setSelectedPropertyValues(prev => prev.filter(item => item.property_id != property.id));
  }

  const handleClickPropertyValue = (value: MallProductPropertyValueResponse) => {
    if (selectedPropertyValueIds.includes(value.id)) {
      setSelectedPropertyValueIds(prev => prev.filter(item => item != value.id));
      setSelectedPropertyValues(prev => prev.filter(item => item.id != value.id));
    } else {
      setSelectedPropertyValueIds(prev => [...prev, value.id]);
      setSelectedPropertyValues(prev => [...prev, value]);
    }
  }

  const useSkuGenerator = (properties: MallProductPropertyBaseResponse[], values: MallProductPropertyValueResponse[]) => {
    return useMemo(() => {
      // 按property分组value
      const groupedValues = properties.map((property) => {
        return values
          .filter((v) => v.property_id === property.id)
          .map((v) => ({
            propertyId: property.id,
            propertyName: property.name,
            valueId: v.id,
            valueName: v.name,
          } as PropertyValues));
      });

      // 生成组合
      const cartesian = (arr: PropertyValues[][]): PropertyValues[][] => {
        const filtered = arr.filter(a => a.length > 0);
        if (filtered.length === 0) return [];
        return filtered.reduce<PropertyValues[][]>(
          (acc, curr) =>
            acc.flatMap((a) => curr.map((c) => [...a, c])),
          [[]]
        );
      };

      const combinations = cartesian(groupedValues);

      // 生成sku
      const skus: MallProductSkuRequest[] = combinations.map((combo) => {
        const properties = [];
        for (const property of combo) {
          properties.push({
            propertyId: property.propertyId,
            valueId: property.valueId,
          })
        }
        return {
          ...mallProductSpu.skus[0],
          property_list: combo,
          properties: JSON.stringify(properties),
          property_title: combo.map(c => c.valueName).join(' * '),
        }
      });
      setMallProductSpu(prev => ({
        ...prev,
        skus: [mallProductSpu.skus[0], ...skus]
      }));

      const skuErrors = skus.map(() => ({
        properties: undefined,
        price: undefined,
        market_price: undefined,
        cost_price: undefined,
        bar_code: undefined,
        stock: undefined,
        weight: undefined,
        volume: undefined,
        first_brokerage_price: undefined,
        second_brokerage_price: undefined,
        sales_count: undefined,
      }))

      setErrors((prev) => ({
        ...prev,
        skus: [errors.skus[0], ...skuErrors],
      }));
    }, [properties, values]);
  }
  useSkuGenerator(selectedProperties, selectedPropertyValues);

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('global.operate.edit') + t('global.page.mall.product')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.update')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
      <Box
        // noValidate
        // component="form"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          height: '70vh'
          // alignItems: 'start',
          // flexDirection: 'column',
          // m: 'auto',
          // width: 'fit-content',
        }}
      >
        <Stack direction='row'>
          <Box
            sx={{
              width: 120,
              flexShrink: 0,
              // borderRight: 1,
              // borderColor: 'divider',
              pr: 2,
              mr: 2,
            }}
          >
            {isMounted && anchorContainerRef.current && <CustomizedAnchor
              showInkInFixed
              items={anchorItems}
              offsetTop={0}
              getContainer={() => {
                // 使用ref获取滚动容器，更加准确
                // console.debug('container ref:', anchorContainerRef.current);
                return anchorContainerRef.current || window;
              }}
              onChange={(activeLink) => {
                // console.debug('active link:', activeLink);
              }}
              onClick={(e, link) => {
                // console.debug('click link:', link);
              }}
            />}
          </Box>
          <Box ref={anchorContainerRef} sx={{ overflow: 'auto' }}>
            <Box id="basic" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {t('page.mall.product.tab.basic.settings')}
              </Typography>
              <Box
                noValidate
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // m: 'auto',
                  width: 'fit-content',
                }}
              >
                <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
                  <TextField
                    required
                    multiline
                    minRows={2}
                    size="small"
                    label={t("page.mall.product.title.name")}
                    name='name'
                    value={mallProductSpu.name}
                    onChange={handleInputChange}
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </FormControl>
                <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '240px' } }}>
                  <SelectTree
                    expandToSelected
                    name='parent_id'
                    size="small"
                    label={t('page.mall.product.title.category')}
                    treeData={treeData}
                    value={selectedCategoryId}
                    onChange={(name, node) => handleChange(name, node as TreeNode)}
                  />
                </FormControl>
                <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '240px' } }}>
                  <InputLabel required size="small" id="brand-select-label">{t("page.mall.product.title.brand")}</InputLabel>
                  <Select
                    required
                    size="small"
                    labelId="brand-select-label"
                    label={t("page.mall.product.title.brand")}
                    name='brand_id'
                    value={mallProductSpu.brand_id}
                    onChange={(e) => handleSelectChange(e)}
                    error={!!errors.brand_id}
                  >
                    {brands.map(item => (<MenuItem key={`'brand-'${item.id}`} value={item.id}>{item.name}</MenuItem>))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.brand_id}</FormHelperText>
                </FormControl>
                <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
                  <TextField
                    size="small"
                    label={t("page.mall.product.title.keyword")}
                    name='keyword'
                    value={mallProductSpu.keyword}
                    onChange={handleInputChange}
                  />
                  <TextField
                    multiline
                    minRows={2}
                    size="small"
                    label={t("page.mall.product.title.introduction")}
                    name='introduction'
                    value={mallProductSpu.introduction}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  {t('page.mall.product.title.file')}
                </Typography>
                <CustomizedFileUpload
                  canRemove={false}
                  showFilename={false}
                  id={'file-upload'}
                  accept=".jpg,jpeg,.png"
                  maxSize={100}
                  onChange={(file, action) => handleFileChange(file, action)}
                  file={mallProductSpu.file}
                  width={fileWidth}
                  height={fileHeight}
                  download={downloadImages?.get(mallProductSpu.file_id)}
                  error={!!(errors.file_id)}
                  helperText={errors.file_id}
                />
                <Typography sx={{ mt: 2, mb: 1 }}>
                  {t('page.mall.product.title.slider.files')}
                </Typography>
                <Box
                  gap={2}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                >
                  {sliderFiles.map((item, index) => (
                    <Box key={index}>
                      <CustomizedFileUpload
                        showFilename={false}
                        id={'file-upload-slider-' + index}
                        accept=".jpg,jpeg,.png"
                        maxSize={100}
                        onChange={(files, action) => handleSliderFileChange(files, action, index)}
                        file={item.file}
                        width={fileWidth}
                        height={fileHeight}
                        download={downloadImages?.get(item.file_id!)}
                      />
                    </Box>
                  ))}
                  <Box>
                    <CustomizedFileUpload
                      showFilename={false}
                      id={'file-upload-slider-' + sliderFiles.length}
                      accept=".jpg,jpeg,.png"
                      maxSize={100}
                      onChange={(file, action) => handleSliderFileChange(file, action, sliderFiles.length)}
                      width={fileWidth}
                      height={fileHeight}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box id="price" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {t('page.mall.product.tab.price.inventory')}
              </Typography>
              <Box
                noValidate
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // m: 'auto',
                  width: 'fit-content',
                }}
              >
                <CustomizedDictRadioGroup
                  id="commission-row-radio-buttons-group-label"
                  name='sub_commission_type'
                  dict_type='sub_commission_type'
                  label={t('page.mall.product.title.sub.commission.type')}
                  value={mallProductSpu.sub_commission_type}
                  onChange={handleInputChange}
                  sx={{ mt: 2 }}
                />
                <CustomizedDictRadioGroup
                  id="spec-row-radio-buttons-group-label"
                  name='spec_type'
                  dict_type='spec_type'
                  label={t('page.mall.product.title.spec.type')}
                  value={mallProductSpu.spec_type}
                  onChange={handleInputChange}
                  sx={{ mt: 2 }}
                />
                {mallProductSpu.spec_type == 1 && <Button variant="customContained" onClick={handleOpenPropertySelect} sx={{ width: 240 }}>
                  {t('page.mall.product.property.operate.add')}
                </Button>}
                {mallProductSpu.spec_type == 1 && selectedProperties.map((item) => (
                  <Stack key={'property' + item.id} direction='row' gap={4} sx={{ mt: 2, pr: 4 }}>
                    <CustomizedTag label={item.name} color='primary' onDelete={() => handlePropertyRemove(item)} />
                    <Stack direction='row' gap={2}>
                      {item.values && item.values.map((value) => (
                        <CustomizedTag key={'value-' + value.id} clickable label={value.name} color={selectedPropertyValueIds.includes(value.id) ? 'primary' : 'default'} onClick={() => handleClickPropertyValue(value)} />
                      ))}
                    </Stack>
                  </Stack>
                ))}

                {mallProductSpu.spec_type == 1 && <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
                  {t('page.mall.product.sku.list.title.batch')}
                </Typography>}
                <Card variant="outlined" sx={{ mt: 2, width: '100%' }}>
                  <Box sx={{ display: 'table', width: '100%', "& .table-row": { display: 'table-row', "& .table-cell": { display: 'table-cell', padding: 1, textAlign: 'center', } } }}>
                    <Box className='table-row'>
                      <Box className='table-cell' sx={{ width: 240 }}><Typography variant="body1">{t('page.mall.product.sku.title.file')}</Typography></Box>
                      <Box className='table-cell' sx={{ width: 240 }}><Typography variant="body1">{t('page.mall.product.sku.title.bar.code')}</Typography></Box>
                      <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.price')}</Typography></Box>
                      <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.market.price')}</Typography></Box>
                      <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.cost.price')}</Typography></Box>
                      <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.stock')}</Typography></Box>
                      <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.weight')}</Typography></Box>
                      <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.volume')}</Typography></Box>
                      {mallProductSpu.sub_commission_type == 1 && <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.first.brokerage.price')}</Typography></Box>}
                      {mallProductSpu.sub_commission_type == 1 && <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.second.brokerage.price')}</Typography></Box>}
                    </Box>
                    {mallProductSpu.skus.map((item, index) => {
                      if (index > 0) {
                        return (<></>)
                      }
                      return (
                        <Box className='table-row' key={index}>
                          <Box className='table-cell' sx={{ width: 240 }}>
                            <CustomizedFileUpload
                              canRemove={false}
                              showFilename={false}
                              id={'file-upload-sku-' + index}
                              accept=".jpg,jpeg,.png"
                              maxSize={100}
                              onChange={(file, action) => handleSkuFileChange(file, action, index)}
                              file={item.file}
                              width={fileWidth}
                              height={fileHeight}
                              download={downloadImages?.get(item.file_id!)}
                              error={!!(errors.skus[index]?.file_id)}
                              helperText={errors.skus[index]?.file_id}
                            />
                          </Box>
                          {item.property_list && item.property_list.map((property) => (
                            <Box className='table-cell' sx={{ width: 80 }}>
                              <Typography variant="body1">{property.valueName}</Typography>
                            </Box>)
                          )}
                          <Box className='table-cell' sx={{ width: 240 }}>
                            <TextField
                              required
                              size="small"
                              name='bar_code'
                              value={item.bar_code}
                              onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                              error={!!(errors.skus[index]?.bar_code)}
                              helperText={errors.skus[index]?.bar_code}
                              sx={{ width: '100%' }}
                            />
                          </Box>
                          <Box className='table-cell' sx={{ width: 150 }}>
                            <TextField
                              required
                              size="small"
                              type="number"
                              name='price'
                              value={item.price}
                              onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                              error={!!(errors.skus[index]?.price)}
                              helperText={errors.skus[index]?.price}
                            />
                          </Box>
                          <Box className='table-cell' sx={{ width: 150 }}>
                            <TextField
                              required
                              size="small"
                              type="number"
                              name='market_price'
                              value={item.market_price}
                              onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                              error={!!(errors.skus[index]?.market_price)}
                              helperText={errors.skus[index]?.market_price}
                            />
                          </Box>
                          <Box className='table-cell' sx={{ width: 150 }}>
                            <TextField
                              required
                              size="small"
                              type="number"
                              name='cost_price'
                              value={item.cost_price}
                              onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                              error={!!(errors.skus[index]?.cost_price)}
                              helperText={errors.skus[index]?.cost_price}
                            />
                          </Box>
                          <Box className='table-cell' sx={{ width: 150 }}>
                            <TextField
                              required
                              size="small"
                              type="number"
                              name='stock'
                              value={item.stock}
                              onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                              error={!!(errors.skus[index]?.stock)}
                              helperText={errors.skus[index]?.stock}
                            />
                          </Box>
                          <Box className='table-cell' sx={{ width: 150 }}>
                            <TextField
                              required
                              size="small"
                              type="number"
                              name='weight'
                              value={item.weight}
                              onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                              error={!!(errors.skus[index]?.weight)}
                              helperText={errors.skus[index]?.weight}
                            />
                          </Box>
                          <Box className='table-cell' sx={{ width: 150 }}>
                            <TextField
                              required
                              size="small"
                              type="number"
                              name='volume'
                              value={item.volume}
                              onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                              error={!!(errors.skus[index]?.volume)}
                              helperText={errors.skus[index]?.volume}
                            />
                          </Box>
                          {mallProductSpu.sub_commission_type == 1 &&
                            <Box className='table-cell' sx={{ width: 150 }}>
                              <TextField
                                required
                                size="small"
                                type="number"
                                name='first_brokerage_price'
                                value={item.first_brokerage_price}
                                onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                                error={!!(errors.skus[index]?.first_brokerage_price)}
                                helperText={errors.skus[index]?.first_brokerage_price}
                              />
                            </Box>
                          }
                          {mallProductSpu.sub_commission_type == 1 &&
                            <Box className='table-cell' sx={{ width: 150 }}>
                              <TextField
                                required
                                size="small"
                                type="number"
                                name='second_brokerage_price'
                                value={item.second_brokerage_price}
                                onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                                error={!!(errors.skus[index]?.second_brokerage_price)}
                                helperText={errors.skus[index]?.second_brokerage_price}
                              />
                            </Box>
                          }
                        </Box>
                      )
                    })}
                  </Box>
                </Card>

                {mallProductSpu.spec_type == 1 && selectedProperties.length > 0 && <>
                  <Typography variant="body1" sx={{ mt: 3, fontSize: '1rem', fontWeight: 500 }}>
                    {t('page.mall.product.sku.list.title')}
                  </Typography>
                  <Card variant="outlined" sx={{ mt: 2, width: '100%' }}>
                    <Box sx={{ display: 'table', width: '100%', "& .table-row": { display: 'table-row', "& .table-cell": { display: 'table-cell', padding: 1, textAlign: 'center', } } }}>
                      <Box className='table-row'>
                        <Box className='table-cell' sx={{ width: 240 }}><Typography variant="body1">{t('page.mall.product.sku.title.file')}</Typography></Box>
                        {selectedProperties.map((item) => (
                          <Box className='table-cell' sx={{ width: 80 }}><Typography variant="body1">{item.name}</Typography></Box>
                        ))}
                        <Box className='table-cell' sx={{ width: 240 }}><Typography variant="body1">{t('page.mall.product.sku.title.bar.code')}</Typography></Box>
                        <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.price')}</Typography></Box>
                        <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.market.price')}</Typography></Box>
                        <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.cost.price')}</Typography></Box>
                        <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.stock')}</Typography></Box>
                        <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.weight')}</Typography></Box>
                        <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.volume')}</Typography></Box>
                        {mallProductSpu.sub_commission_type == 1 && <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.first.brokerage.price')}</Typography></Box>}
                        {mallProductSpu.sub_commission_type == 1 && <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.second.brokerage.price')}</Typography></Box>}
                        <Box className='table-cell' sx={{ width: 50 }}><Typography variant="body1">{t('global.operate.actions')}</Typography></Box>
                      </Box>
                      {mallProductSpu.skus.map((item, index) => {
                        if (index == 0) {
                          return (<></>);
                        }
                        return (
                          <Box className='table-row' key={index}>
                            <Box className='table-cell' sx={{ width: 240 }}>
                              <CustomizedFileUpload
                                canRemove={false}
                                showFilename={false}
                                id={'file-upload-sku-' + index}
                                accept=".jpg,jpeg,.png"
                                maxSize={100}
                                onChange={(file, action) => handleSkuFileChange(file, action, index)}
                                file={item.file}
                                width={fileWidth}
                                height={fileHeight}
                                download={downloadImages?.get(item.file_id!)}
                                error={!!(errors.skus[index]?.file_id)}
                                helperText={errors.skus[index]?.file_id}
                              />
                            </Box>
                            {item.property_list && item.property_list.map((property) => (
                              <Box className='table-cell' sx={{ width: 80 }}>
                                <Typography variant="body1">{property.valueName}</Typography>
                              </Box>)
                            )}
                            <Box className='table-cell' sx={{ width: 240 }}>
                              <TextField
                                required
                                size="small"
                                name='bar_code'
                                value={item.bar_code}
                                onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                                error={!!(errors.skus[index]?.bar_code)}
                                helperText={errors.skus[index]?.bar_code}
                                sx={{ width: '100%' }}
                              />
                            </Box>
                            <Box className='table-cell' sx={{ width: 150 }}>
                              <TextField
                                required
                                size="small"
                                type="number"
                                name='price'
                                value={item.price}
                                onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                                error={!!(errors.skus[index]?.price)}
                                helperText={errors.skus[index]?.price}
                              />
                            </Box>
                            <Box className='table-cell' sx={{ width: 150 }}>
                              <TextField
                                required
                                size="small"
                                type="number"
                                name='market_price'
                                value={item.market_price}
                                onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                                error={!!(errors.skus[index]?.market_price)}
                                helperText={errors.skus[index]?.market_price}
                              />
                            </Box>
                            <Box className='table-cell' sx={{ width: 150 }}>
                              <TextField
                                required
                                size="small"
                                type="number"
                                name='cost_price'
                                value={item.cost_price}
                                onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                                error={!!(errors.skus[index]?.cost_price)}
                                helperText={errors.skus[index]?.cost_price}
                              />
                            </Box>
                            <Box className='table-cell' sx={{ width: 150 }}>
                              <TextField
                                required
                                size="small"
                                type="number"
                                name='stock'
                                value={item.stock}
                                onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                                error={!!(errors.skus[index]?.stock)}
                                helperText={errors.skus[index]?.stock}
                              />
                            </Box>
                            <Box className='table-cell' sx={{ width: 150 }}>
                              <TextField
                                required
                                size="small"
                                type="number"
                                name='weight'
                                value={item.weight}
                                onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                                error={!!(errors.skus[index]?.weight)}
                                helperText={errors.skus[index]?.weight}
                              />
                            </Box>
                            <Box className='table-cell' sx={{ width: 150 }}>
                              <TextField
                                required
                                size="small"
                                type="number"
                                name='volume'
                                value={item.volume}
                                onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                                error={!!(errors.skus[index]?.volume)}
                                helperText={errors.skus[index]?.volume}
                              />
                            </Box>
                            {mallProductSpu.sub_commission_type == 1 &&
                              <Box className='table-cell' sx={{ width: 150 }}>
                                <TextField
                                  required
                                  size="small"
                                  type="number"
                                  name='first_brokerage_price'
                                  value={item.first_brokerage_price}
                                  onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                                  error={!!(errors.skus[index]?.first_brokerage_price)}
                                  helperText={errors.skus[index]?.first_brokerage_price}
                                />
                              </Box>
                            }
                            {mallProductSpu.sub_commission_type == 1 &&
                              <Box className='table-cell' sx={{ width: 150 }}>
                                <TextField
                                  required
                                  size="small"
                                  type="number"
                                  name='second_brokerage_price'
                                  value={item.second_brokerage_price}
                                  onChange={(e) => handleSkuInputChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                                  error={!!(errors.skus[index]?.second_brokerage_price)}
                                  helperText={errors.skus[index]?.second_brokerage_price}
                                />
                              </Box>
                            }
                            <Box className='table-cell' sx={{ width: 50, verticalAlign: 'middle' }}>
                              <Button
                                sx={{ color: 'error.main' }}
                                size="small"
                                variant="customOperate"
                                title={t('global.operate.delete') + t('global.page.erp.purchase.order')}
                                startIcon={<DeleteIcon />}
                                onClick={() => handleClickSkuDelete(index)}
                              />
                            </Box>
                          </Box>
                        )
                      })}
                    </Box>
                  </Card>
                </>}
              </Box>
            </Box>
            <Box id="logistics" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {t('page.mall.product.tab.logistics.settings')}
              </Typography>
              <Box
                noValidate
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // m: 'auto',
                  width: 'fit-content',
                }}
              >
                <CustomizedDictCheckboxGroup
                  id="delivery-row-checkbox-buttons-group-label"
                  label={t("page.mall.product.title.delivery.types")}
                  name='delivery_types'
                  value={mallProductSpu.delivery_types}
                  dict_type='delivery_type'
                  onChange={handleCheckboxChange}
                />
                {mallProductSpu.delivery_types.indexOf('0') >= 0 && <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '240px' } }}>
                  <InputLabel required size="small" id="template-select-label">{t("page.mall.product.title.delivery.template")}</InputLabel>
                  <Select
                    required
                    size="small"
                    labelId="template-select-label"
                    label={t("page.mall.product.title.delivery.template")}
                    name='delivery_template_id'
                    value={mallProductSpu.delivery_template_id}
                    onChange={(e) => handleSelectChange(e)}
                    error={!!errors.delivery_template_id}
                  >
                    {templates.map(item => (<MenuItem key={`"template-"${item.id}`} value={item.id}>{item.name}</MenuItem>))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.delivery_template_id}</FormHelperText>
                </FormControl>}
              </Box>
            </Box>
            <Box id="product" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {t('page.mall.product.tab.product.detail')}
              </Typography>
              <Box sx={{
                // width: 760,
                '& .tox-promotion-button': { display: 'none !important' },
                '& .tox-statusbar__branding': { display: 'none' }
              }}>
                <Editor
                  apiKey='f88rshir3x1vuar3lr0tj1vaq6muvonldxm25o6wxr23vy96'
                  onInit={(_evt, editor) => (editorRef.current = editor)}
                  initialValue={mallProductSpu.description}
                  init={{
                    height: 600,
                    language: "zh_CN",
                    language_url: "/tinymce/langs/zh_CN.js",
                    plugins: [
                      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
              </Box>
            </Box>
            <Box id="other" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {t('page.mall.product.tab.other.settings')}
              </Typography>
              <Box
                noValidate
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // m: 'auto',
                  width: 'fit-content',
                }}
              >
                <FormControl sx={{ minWidth: 120, '& .MuiTextField-root': { mt: 2, width: '240px' } }}>
                  <CustomizedNumberInput
                    required
                    size="small"
                    step={1}
                    min={0}
                    label={t("page.mall.product.title.sort")}
                    name='sort'
                    value={mallProductSpu.sort}
                    onChange={handleInputChange}
                    error={!!errors.sort}
                    helperText={errors.sort}
                  />
                  <CustomizedNumberInput
                    required
                    size="small"
                    step={1}
                    min={0}
                    label={t("page.mall.product.title.give.integral")}
                    name='give_integral'
                    value={mallProductSpu.give_integral}
                    onChange={handleInputChange}
                    error={!!errors.give_integral}
                    helperText={errors.give_integral}
                  />
                  <CustomizedNumberInput
                    size="small"
                    step={1}
                    min={0}
                    label={t("page.mall.product.title.virtual.sales.count")}
                    name='virtual_sales_count'
                    value={mallProductSpu.virtual_sales_count}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Box>
      <PropertySelect ref={selectProperty} onSubmit={handlePropertySelectedCallback} />
    </CustomizedDialog>
  )
});

export default MallProductSpuEdit;