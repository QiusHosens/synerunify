import { Box, Card, FormControl, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { getInfoMallProductSpu, listInfoMallProductPropertyValue, MallProductSpuResponse, PropertyValues } from '@/api';
import CustomizedDialog from '@/components/CustomizedDialog';
import CustomizedFileUpload, { DownloadProps, UploadFile } from '@/components/CustomizedFileUpload';
import CustomizedAnchor, { AnchorLinkProps } from '@/components/CustomizedAnchor';
import CustomizedDictCheckboxGroup from '@/components/CustomizedDictCheckboxGroup';
import CustomizedDictRadioGroup from '@/components/CustomizedDictRadioGroup';
import { downloadSystemFile } from '@/api/system_file';
import CustomizedTag from '@/components/CustomizedTag';

interface AttachmentValues {
    file_id?: number; // 文件ID

    file?: UploadFile | null;
}

const MallProductSpuInfo = forwardRef(({ }, ref) => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
    const [sliderFiles, setSliderFiles] = useState<AttachmentValues[]>([]);
    const [deliveryTypes, setDeliveryTypes] = useState<string[]>([]);
    const [propertyNames, setPropertyNames] = useState<string[]>([]);
    const [mallProductSpu, setMallProductSpu] = useState<MallProductSpuResponse>();
    const [fileWidth] = useState<number>(240);
    const [fileHeight] = useState<number>(160);
    const [downloadImages, setDownloadImages] = useState<Map<number, DownloadProps>>(new Map<number, DownloadProps>());

    const anchorContainerRef = useRef<HTMLDivElement | null>(null);
    const [isMounted, setIsMounted] = useState(false);

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
        const result = await getInfoMallProductSpu(mallProductSpu.id);
        setDeliveryTypes(result.delivery_types.split(','));
        // 获取属性
        const propertyValueId = [];
        for (const sku of result.skus) {
            sku.property_list = [];
            if (sku.properties) {
                const properties = JSON.parse(sku.properties)
                for (const property of properties) {
                    propertyValueId.push(property.valueId);
                    sku.property_list.push(property as PropertyValues)
                }
            }
        }
        // 查询属性值
        const values = await listInfoMallProductPropertyValue(propertyValueId);
        const valueMap = new Map(values.map(value => [value.id, value]))
        const propertyNames: string[] = [];
        for (const sku of result.skus) {
            for (const property of sku.property_list!) {
                const value = valueMap.get(property.valueId);
                if (value) {
                    property.propertyName = value.property_name;
                    property.valueName = value.name;
                    if (!propertyNames.includes(value.property_name)) {
                        propertyNames.push(value.property_name);
                    }
                }
            }
        }
        setPropertyNames(propertyNames);
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
                                    canUpload={false}
                                    canRemove={false}
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
                                                canUpload={false}
                                                canRemove={false}
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
                                    disabled
                                    id="commission-row-radio-buttons-group-label"
                                    name='sub_commission_type'
                                    dict_type='sub_commission_type'
                                    label={t('page.mall.product.title.sub.commission.type')}
                                    value={mallProductSpu.sub_commission_type}
                                    sx={{ mt: 2 }}
                                />}
                                {mallProductSpu && <CustomizedDictRadioGroup
                                    disabled
                                    id="spec-row-radio-buttons-group-label"
                                    name='spec_type'
                                    dict_type='spec_type'
                                    label={t('page.mall.product.title.spec.type')}
                                    value={mallProductSpu.spec_type}
                                    sx={{ mt: 2 }}
                                />}

                                {mallProductSpu && mallProductSpu.spec_type == 1 && <Typography variant="body1" sx={{ mt: 2, fontSize: '1rem', fontWeight: 500 }}>
                                    {t('page.mall.product.sku.list.title')}
                                </Typography>}
                                <Card variant="outlined" sx={{ mt: 2, width: '100%' }}>
                                    <Box sx={{ display: 'table', width: '100%', "& .table-row": { display: 'table-row', "& .table-cell": { display: 'table-cell', padding: 1, textAlign: 'center', verticalAlign: 'middle' } } }}>
                                        <Box className='table-row'>
                                            <Box className='table-cell' sx={{ width: 240 }}><Typography variant="body1">{t('page.mall.product.sku.title.file')}</Typography></Box>
                                            {propertyNames.map((item) => (
                                                <Box className='table-cell' sx={{ width: 80 }}><Typography variant="body1">{item}</Typography></Box>
                                            ))}
                                            <Box className='table-cell' sx={{ width: 240 }}><Typography variant="body1">{t('page.mall.product.sku.title.bar.code')}</Typography></Box>
                                            <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.price')}</Typography></Box>
                                            <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.market.price')}</Typography></Box>
                                            <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.cost.price')}</Typography></Box>
                                            <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.stock')}</Typography></Box>
                                            <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.weight')}</Typography></Box>
                                            <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.volume')}</Typography></Box>
                                            {mallProductSpu && mallProductSpu.sub_commission_type == 1 && <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.first.brokerage.price')}</Typography></Box>}
                                            {mallProductSpu && mallProductSpu.sub_commission_type == 1 && <Box className='table-cell' sx={{ width: 150 }}><Typography variant="body1">{t('page.mall.product.sku.title.second.brokerage.price')}</Typography></Box>}
                                        </Box>
                                        {mallProductSpu && mallProductSpu.skus.map((item, index) => {
                                            return (
                                                <Box className='table-row' key={index}>
                                                    <Box className='table-cell' sx={{ width: 240 }}>
                                                        <CustomizedFileUpload
                                                            canUpload={false}
                                                            canRemove={false}
                                                            showFilename={false}
                                                            id={'file-upload-sku-' + index}
                                                            accept=".jpg,jpeg,.png"
                                                            maxSize={100}
                                                            width={fileWidth}
                                                            height={fileHeight}
                                                            download={downloadImages?.get(item.file_id!)}
                                                        />
                                                    </Box>
                                                    {item.property_list && item.property_list.map((property) => (
                                                        <Box className='table-cell' sx={{ width: 80 }}>
                                                            <Typography variant="body1">{property.valueName}</Typography>
                                                        </Box>)
                                                    )}
                                                    <Box className='table-cell' sx={{ width: 240 }}>
                                                        <Typography variant="body1">{item.bar_code}</Typography>
                                                    </Box>
                                                    <Box className='table-cell' sx={{ width: 150 }}>
                                                        <Typography variant="body1">{item.price}</Typography>
                                                    </Box>
                                                    <Box className='table-cell' sx={{ width: 150 }}>
                                                        <Typography variant="body1">{item.market_price}</Typography>
                                                    </Box>
                                                    <Box className='table-cell' sx={{ width: 150 }}>
                                                        <Typography variant="body1">{item.cost_price}</Typography>
                                                    </Box>
                                                    <Box className='table-cell' sx={{ width: 150 }}>
                                                        <Typography variant="body1">{item.stock}</Typography>
                                                    </Box>
                                                    <Box className='table-cell' sx={{ width: 150 }}>
                                                        <Typography variant="body1">{item.weight}</Typography>
                                                    </Box>
                                                    <Box className='table-cell' sx={{ width: 150 }}>
                                                        <Typography variant="body1">{item.volume}</Typography>
                                                    </Box>
                                                    {mallProductSpu.sub_commission_type == 1 &&
                                                        <Box className='table-cell' sx={{ width: 150 }}>
                                                            <Typography variant="body1">{item.first_brokerage_price}</Typography>
                                                        </Box>
                                                    }
                                                    {mallProductSpu.sub_commission_type == 1 &&
                                                        <Box className='table-cell' sx={{ width: 150 }}>
                                                            <Typography variant="body1">{item.second_brokerage_price}</Typography>
                                                        </Box>
                                                    }
                                                </Box>
                                            )
                                        })}
                                    </Box>
                                </Card>
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
                                    disabled
                                    id="delivery-row-checkbox-buttons-group-label"
                                    label={t("page.mall.product.title.delivery.types")}
                                    name='delivery_types'
                                    value={deliveryTypes}
                                    dict_type='delivery_type'
                                />
                                {deliveryTypes.includes('0') && <FormControl sx={{ minWidth: 120, '& .MuiStack-root': { mt: 2 } }}>
                                    <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                                        <Box>{t("page.mall.product.title.delivery.template")}</Box>
                                        <Box>{mallProductSpu && <CustomizedTag label={mallProductSpu.delivery_template_name ?? ''} />}</Box>
                                    </Stack>
                                </FormControl>}
                            </Box>
                        </Box>
                        <Box id="product" sx={{ mb: 4 }}>
                            <Typography variant="h4" component="h2" gutterBottom>
                                {t('page.mall.product.tab.product.detail')}
                            </Typography>
                            <Box>
                                {mallProductSpu && <Typography component="div" dangerouslySetInnerHTML={{ __html: mallProductSpu.description }} />}
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
                                <FormControl sx={{ minWidth: 120, '& .MuiStack-root': { mt: 2 } }}>
                                    <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                                        <Box>{t('page.mall.product.title.sort')}</Box>
                                        <Box>{mallProductSpu && <CustomizedTag label={mallProductSpu.sort} />}</Box>
                                    </Stack>
                                    <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                                        <Box>{t('page.mall.product.title.give.integral')}</Box>
                                        <Box>{mallProductSpu && <CustomizedTag label={mallProductSpu.give_integral} />}</Box>
                                    </Stack>
                                    <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                                        <Box>{t('page.mall.product.title.virtual.sales.count')}</Box>
                                        <Box>{mallProductSpu && <CustomizedTag label={mallProductSpu.virtual_sales_count} />}</Box>
                                    </Stack>
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