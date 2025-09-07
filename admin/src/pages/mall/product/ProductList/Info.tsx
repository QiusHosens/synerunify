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

interface TreeNode {
    id: string | number;
    parent_id: number; // 父菜单ID
    label: string;
    children: TreeNode[];
}

const MallProductSpuInfo = forwardRef(({ }, ref) => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
    const [sliderFiles, setSliderFiles] = useState<AttachmentValues[]>([]);
    const [deliveryTypes, setDeliveryTypes] = useState<string[]>([]);
    const [selectedProperties, setSelectedProperties] = useState<MallProductPropertyBaseResponse[]>([]);
    const [selectedPropertyValueIds, setSelectedPropertyValueIds] = useState<number[]>([]);
    const [selectedPropertyValues, setSelectedPropertyValues] = useState<MallProductPropertyValueResponse[]>([]);
    const [mallProductSpu, setMallProductSpu] = useState<MallProductSpuResponse>();
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

    const handleClose = () => {
        setOpen(false);
    };

    const initForm = async (mallProductSpu: MallProductSpuResponse) => {
        const result = await getBaseMallProductSpu(mallProductSpu.id);
        setMallProductSpu({
            ...result,
        })
        setDeliveryTypes(result.delivery_types.split(','));
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
    }

    return (
        <CustomizedDialog
            open={open}
            onClose={handleClose}
            title={t('global.operate.edit') + t('global.page.mall.product')}
            maxWidth={maxWidth}
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
                                <FormControl sx={{ minWidth: 120, '& .MuiStack-root': { mt: 2 } }}>
                                    <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                                        <Box>{t('page.mall.product.title.name')}</Box>
                                        <Box>{mallProductSpu && <CustomizedTag label={mallProductSpu.name} />}</Box>
                                    </Stack>
                                    <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                                        <Box>{t('page.mall.product.title.category')}</Box>
                                        <Box>{mallProductSpu && <CustomizedTag label={mallProductSpu.category_name ?? ''} />}</Box>
                                    </Stack>
                                    <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                                        <Box>{t('page.mall.product.title.brand')}</Box>
                                        <Box>{mallProductSpu && <CustomizedTag label={mallProductSpu.brand_name ?? ''} />}</Box>
                                    </Stack>
                                    <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                                        <Box>{t('page.mall.product.title.keyword')}</Box>
                                        <Box>{mallProductSpu && <CustomizedTag label={mallProductSpu.keyword} />}</Box>
                                    </Stack>
                                    <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                                        <Box>{t('page.mall.product.title.introduction')}</Box>
                                        <Box>{mallProductSpu && <CustomizedTag label={mallProductSpu.introduction} />}</Box>
                                    </Stack>
                                </FormControl>
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    {t('page.mall.product.title.file')}
                                </Typography>
                                {mallProductSpu && <CustomizedFileUpload
                                    showFilename={false}
                                    id={'file-upload'}
                                    accept=".jpg,jpeg,.png"
                                    maxSize={100}
                                    width={fileWidth}
                                    height={fileHeight}
                                    download={downloadImages?.get(mallProductSpu.file_id)}
                                />}
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
                                                width={fileWidth}
                                                height={fileHeight}
                                                download={downloadImages?.get(item.file_id!)}
                                            />
                                        </Box>
                                    ))}
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
                                {mallProductSpu && <CustomizedDictRadioGroup
                                    id="commission-row-radio-buttons-group-label"
                                    name='sub_commission_type'
                                    dict_type='sub_commission_type'
                                    label={t('page.mall.product.title.sub.commission.type')}
                                    value={mallProductSpu.sub_commission_type}
                                    sx={{ mt: 2 }}
                                />}
                                {mallProductSpu && <CustomizedDictRadioGroup
                                    id="spec-row-radio-buttons-group-label"
                                    name='spec_type'
                                    dict_type='spec_type'
                                    label={t('page.mall.product.title.spec.type')}
                                    value={mallProductSpu.spec_type}
                                    sx={{ mt: 2 }}
                                />}
                                {mallProductSpu && mallProductSpu.spec_type == 1 && <Button variant="customContained" onClick={handleOpenPropertySelect} sx={{ mt: 2, width: 240 }}>
                                    {t('page.mall.product.property.operate.add')}
                                </Button>}
                                {mallProductSpu && mallProductSpu.spec_type == 1 && selectedProperties.map((item) => (
                                    <Stack key={'property' + item.id} direction='row' gap={4} sx={{ mt: 2, pr: 4 }}>
                                        <CustomizedTag label={item.name} color='primary' onDelete={() => handlePropertyRemove(item)} />
                                        <Stack direction='row' gap={2}>
                                            {item.values && item.values.map((value) => (
                                                <CustomizedTag key={'value-' + value.id} clickable label={value.name} color={selectedPropertyValueIds.includes(value.id) ? 'primary' : 'default'} onClick={() => handleClickPropertyValue(value)} />
                                            ))}
                                        </Stack>
                                    </Stack>
                                ))}

                                {mallProductSpu && mallProductSpu.spec_type == 1 && <Typography variant="body1" sx={{ mt: 2, fontSize: '1rem', fontWeight: 500 }}>
                                    {t('page.mall.product.sku.list.title.batch')}
                                </Typography>}
                                <Card variant="outlined" sx={{ mt: 2, width: '100%' }}>
                                    <Box sx={{ display: 'table', width: '100%', "& .table-row": { display: 'table-row', "& .table-cell": { display: 'table-cell', padding: 1, textAlign: 'center', verticalAlign: 'middle' } } }}>
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
                                                return (<Box key={index}></Box>)
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
                                    <Typography variant="body1" sx={{ mt: 2, fontSize: '1rem', fontWeight: 500 }}>
                                        {t('page.mall.product.sku.list.title')}
                                    </Typography>
                                    <Card variant="outlined" sx={{ mt: 2, width: '100%' }}>
                                        <Box sx={{ display: 'table', width: '100%', "& .table-row": { display: 'table-row', "& .table-cell": { display: 'table-cell', padding: 1, textAlign: 'center', verticalAlign: 'middle' } } }}>
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
                                                    return (<Box key={index}></Box>);
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
                                    value={deliveryTypes}
                                    dict_type='delivery_type'
                                    onChange={handleCheckboxChange}
                                />
                                {deliveryTypes.includes('0') && <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '240px' } }}>
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
        </CustomizedDialog>
    )
});

export default MallProductSpuInfo;