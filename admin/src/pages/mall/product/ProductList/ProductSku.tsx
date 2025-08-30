import { MallProductSkuRequest } from "@/api";
import CustomizedFileUpload, { UploadFile } from "@/components/CustomizedFileUpload";
import CustomizedLabeledBox from "@/components/CustomizedLabeledBox";
import { Grid, Stack, TextField } from "@mui/material";
import React from "react";

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
    sales_count?: string; // 商品销量
}

interface ProductBoxProps {
    sku: MallProductSkuRequest;
    index: number;
    title?: string;
    onSkuChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    onFileChange: (file: UploadFile | null, action: 'upload' | 'remove') => void;
    errors?: FormSkuErrors;
    fileWidth: number;
    fileHeight: number;
    size: { xs: number; md: number };
    subCommissionType: number;
    t: (key: string) => string;
}

const ProductSku = React.memo(({
    sku,
    index,
    title,
    onSkuChange,
    onFileChange,
    errors,
    fileWidth,
    fileHeight,
    size,
    subCommissionType,
    t
}: ProductBoxProps) => {
    return (
        <CustomizedLabeledBox label={title ?? undefined} sx={{ mt: 2, mr: 2 }}>
            <Stack direction='row' gap={2}>
                <CustomizedFileUpload
                    canRemove={false}
                    showFilename={false}
                    id={'file-upload'}
                    accept=".jpg,jpeg,.png"
                    maxSize={100}
                    onChange={(file, action) => onFileChange(file, action)}
                    file={sku.file}
                    width={fileWidth}
                    height={fileHeight}
                />
                <Grid container rowSpacing={2} columnSpacing={2} sx={{ '& .MuiGrid-root': { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
                    {sku.property_list && sku.property_list.map((property) => (
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                disabled
                                size="small"
                                label={property.propertyName}
                                value={property.valueName}
                                sx={{ width: '100%' }}
                            />
                        </Grid>)
                    )}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            required
                            size="small"
                            label={t("page.mall.product.sku.title.bar.code")}
                            name='bar_code'
                            value={sku.bar_code}
                            onChange={(e) => onSkuChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                            error={!!(errors?.bar_code)}
                            helperText={errors?.bar_code}
                            sx={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            required
                            size="small"
                            type="number"
                            label={t("page.mall.product.sku.title.price")}
                            name='price'
                            value={sku.price}
                            onChange={(e) => onSkuChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                            error={!!(errors?.price)}
                            helperText={errors?.price}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            required
                            size="small"
                            type="number"
                            label={t("page.mall.product.sku.title.market.price")}
                            name='market_price'
                            value={sku.market_price}
                            onChange={(e) => onSkuChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                            error={!!(errors?.market_price)}
                            helperText={errors?.market_price}
                        />
                    </Grid>
                    <Grid size={size}>
                        <TextField
                            required
                            size="small"
                            type="number"
                            label={t("page.mall.product.sku.title.cost.price")}
                            name='cost_price'
                            value={sku.cost_price}
                            onChange={(e) => onSkuChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                            error={!!(errors?.cost_price)}
                            helperText={errors?.cost_price}
                        />
                    </Grid>
                    <Grid size={size}>
                        <TextField
                            required
                            size="small"
                            type="number"
                            label={t("page.mall.product.sku.title.stock")}
                            name='stock'
                            value={sku.stock}
                            onChange={(e) => onSkuChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                            error={!!(errors?.stock)}
                            helperText={errors?.stock}
                        />
                    </Grid>
                    <Grid size={size}>
                        <TextField
                            required
                            size="small"
                            type="number"
                            label={t("page.mall.product.sku.title.weight")}
                            name='weight'
                            value={sku.weight}
                            onChange={(e) => onSkuChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                            error={!!(errors?.weight)}
                            helperText={errors?.weight}
                        />
                    </Grid>
                    <Grid size={size}>
                        <TextField
                            required
                            size="small"
                            type="number"
                            label={t("page.mall.product.sku.title.volume")}
                            name='volume'
                            value={sku.volume}
                            onChange={(e) => onSkuChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                            error={!!(errors?.volume)}
                            helperText={errors?.volume}
                        />
                    </Grid>
                    <Grid size={size}>
                        {subCommissionType == 1 && <TextField
                            required
                            size="small"
                            type="number"
                            label={t("page.mall.product.sku.title.first.brokerage.price")}
                            name='first_brokerage_price'
                            value={sku.first_brokerage_price}
                            onChange={(e) => onSkuChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                            error={!!(errors?.first_brokerage_price)}
                            helperText={errors?.first_brokerage_price}
                        />}
                    </Grid>
                    <Grid size={size}>
                        {subCommissionType == 1 && <TextField
                            required
                            size="small"
                            type="number"
                            label={t("page.mall.product.sku.title.second.brokerage.price")}
                            name='second_brokerage_price'
                            value={sku.second_brokerage_price}
                            onChange={(e) => onSkuChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                            error={!!(errors?.second_brokerage_price)}
                            helperText={errors?.second_brokerage_price}
                        />}
                    </Grid>
                </Grid>
            </Stack>
        </CustomizedLabeledBox>
    );
});

export default ProductSku;