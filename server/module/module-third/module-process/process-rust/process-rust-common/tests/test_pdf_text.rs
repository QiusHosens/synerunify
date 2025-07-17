use anyhow::Ok;
use pdf::content::{self, Op};
use regex::Regex;
use lopdf::Document;

#[tokio::test]
async fn test_pdf_extract() -> anyhow::Result<()> {
    // let path = "invoice_personal_normal.pdf"; // 替换成你的 PDF 文件路径
    let bytes = std::fs::read("tests/invoice_personal_normal.pdf").unwrap();
    let text = pdf_extract::extract_text_from_mem(&bytes).unwrap();
    println!("{}", text);
    
    // 提取信息
    let invoice_info = extract_invoice_info(text.as_str())?;
    
    // 输出结果
    println!("发票信息概览：");
    println!("发票类型：{}", invoice_info.invoice_type);
    println!("开票日期：{}", invoice_info.date);
    println!("发票号码：{}", invoice_info.number);
    println!("开票人：{}", invoice_info.issuer);
    println!("订单号：{}", invoice_info.order);
    println!("合计金额：¥{}", invoice_info.total);
    println!("税额：¥{}", invoice_info.tax);
    println!("价税合计：¥{}", invoice_info.total_with_tax);
    Ok(())
}

#[tokio::test]
async fn test_lopdf() -> anyhow::Result<()> {
    let file = "tests/invoice_personal_normal.pdf";
    let doc = Document::load(file).expect("无法加载 PDF 文件");
    let pages = doc.get_pages();
    println!("总页数: {:?}", pages.len());
    let text = doc.extract_text(&[1]).expect("提取文本失败");
    println!("{:?}", text);
    Ok(())
}

// #[tokio::test]
// async fn test_pdf() -> anyhow::Result<()> {
//     use pdf::file::FileOptions;
//     use pdf::file::File as PdfFile;
//     use pdf::object::*;
//     // use pdf::content::{Content};
//     use pdf::content::Content as PdfContent;

//     // 打开 PDF 文件
//     // let file = PdfFile::<Vec<u8>>::open("tests/invoice_personal_normal.pdf")?;
//     let file = FileOptions::cached().open("tests/invoice_personal_normal.pdf")?;

//     // 打印文档元信息
//     // if let Some(info) = file.trailer.info_dict {
//     //     println!("📄 Title:   {:?}", info.title);
//     //     println!("🧑 Author:  {:?}", info.author);
//     //     println!("🗓️  Created: {:?}", info.creation_date);
//     // }

//     for (i, page_result) in file.pages().enumerate() {
//         let page = page_result?;
//         println!("\n--- Page {} ---", i + 1);

//         // ✅ 解码所有内容流
//         let decoded_bytes = match &page.contents {
//             Some(PdfContent::One(stream)) => stream.decode()?,
//             Some(PdfContent::Many(streams)) => {
//                 let mut all = Vec::new();
//                 for s in streams {
//                     all.extend(s.decode()?);
//                 }
//                 all
//             }
//             None => {
//                 println!("No content stream on page {}", i + 1);
//                 continue;
//             }
//         };

//         // ✅ 解析为 Content（带 parts）
//         let content = content::parse(&decoded_bytes)?;

//         for op in content.parts {
//             match op.operator.as_str() {
//                 "Tj" => {
//                     if let Some(Primitive::Str(s)) = op.operands.get(0) {
//                         println!("📝 Tj text: {}", s);
//                     }
//                 }
//                 "TJ" => {
//                     if let Some(Primitive::Array(arr)) = op.operands.get(0) {
//                         for item in arr {
//                             if let Primitive::Str(s) = item {
//                                 print!("{}", s);
//                             }
//                         }
//                         println!();
//                     }
//                 }
//                 _ => {}
//             }
//         }
//     }

//     Ok(())
// }

#[tokio::test]
async fn test_pdf() -> anyhow::Result<()> {
    use std::fs;
    use pdf::file::{File, FileOptions};
    use pdf::content::Op;

    // 替换为你的 PDF 文件路径
    let pdf_path = "tests/invoice_personal_normal.pdf"; 

    // Read PDF file into a byte array
    let file_bytes = fs::read(pdf_path)?;

    // Use FileOptions to load the PDF from the byte slice
    let file = FileOptions::cached().load(&*file_bytes)?; // Load from &[u8]

    println!("PDF 加载成功！");
    println!("文档页面数量: {}", file.num_pages());

    // You can further iterate through pages and extract content
    for page_num in 0..file.num_pages() {
        let page = file.get_page(page_num)?;
        println!("--- 页面 {} ---", page_num + 1);

        // Get page content stream
        if let Some(contents) = &page.contents {
            for operation in contents.operations(&file.resolver())? {
                // Print operations, you can parse them as needed
                // For example, look for TextShow operations to extract text
                println!("{:?}", operation); 
                match operation {
                    // --- 标记内容操作 ---
                    Op::BeginMarkedContent { tag, properties } => {
                        println!("  - 开始标记内容: Tag={:?}, Properties={:?}", tag, properties);
                    },
                    Op::EndMarkedContent => {
                        println!("  - 结束标记内容");
                    },
                    Op::MarkedContentPoint { tag, properties } => {
                        println!("  - 标记内容点: Tag={:?}, Properties={:?}", tag, properties);
                    },

                    // --- 路径构建操作 ---
                    Op::MoveTo { p } => {
                        println!("  - 路径: 移动到 ({:.2}, {:.2})", p.x, p.y);
                    },
                    Op::LineTo { p } => {
                        println!("  - 路径: 画线到 ({:.2}, {:.2})", p.x, p.y);
                    },
                    Op::CurveTo { c1, c2, p } => {
                        println!("  - 路径: 绘制曲线到 ({:.2}, {:.2}) 控制点1: ({:.2}, {:.2}) 控制点2: ({:.2}, {:.2})", p.x, p.y, c1.x, c1.y, c2.x, c2.y);
                    },
                    Op::Rect { rect } => {
                        println!("  - 路径: 绘制矩形: x={:.2}, y={:.2}, w={:.2}, h={:.2}", rect.x, rect.y, rect.width, rect.height);
                    },
                    Op::Close => {
                        println!("  - 路径: 关闭当前子路径");
                    },
                    Op::EndPath => {
                        println!("  - 路径: 结束当前路径 (不描边不填充)");
                    },

                    // --- 路径绘制操作 ---
                    Op::Stroke => {
                        println!("  - 绘制: 描边当前路径");
                    },
                    Op::FillAndStroke { winding } => {
                        println!("  - 绘制: 填充并描边 (Winding: {:?})", winding);
                    },
                    Op::Fill { winding } => {
                        println!("  - 绘制: 填充 (Winding: {:?})", winding);
                    },
                    Op::Shade { name } => {
                        println!("  - 绘制: 使用阴影模式 {:?} 填充", name);
                    },
                    Op::Clip { winding } => {
                        println!("  - 剪裁: 设置剪裁路径 (Winding: {:?})", winding);
                    },

                    // --- 状态管理操作 ---
                    Op::Save => {
                        println!("  - 状态: 保存图形状态");
                    },
                    Op::Restore => {
                        println!("  - 状态: 恢复图形状态");
                    },
                    Op::Transform { matrix } => {
                        // Matrix is a 3x2 transformation matrix
                        println!("  - 状态: 应用转换矩阵: {:?}", matrix);
                    },
                    Op::GraphicsState { name } => {
                        println!("  - 状态: 设置图形状态字典: {:?}", name);
                    },

                    // --- 描边/填充属性操作 ---
                    Op::LineWidth { width } => {
                        println!("  - 描边: 设置线宽: {:.2}", width);
                    },
                    Op::Dash { pattern, phase } => {
                        println!("  - 描边: 设置虚线模式: {:?}", pattern);
                        println!("    虚线相位: {:.2}", phase);
                    },
                    Op::LineJoin { join } => {
                        println!("  - 描边: 设置线连接样式: {:?}", join);
                    },
                    Op::LineCap { cap } => {
                        println!("  - 描边: 设置线帽样式: {:?}", cap);
                    },
                    Op::MiterLimit { limit } => {
                        println!("  - 描边: 设置斜接限制: {:.2}", limit);
                    },
                    Op::Flatness { tolerance } => {
                        println!("  - 描边: 设置平面度容差: {:.2}", tolerance);
                    },

                    // --- 颜色操作 ---
                    Op::StrokeColor { color } => {
                        println!("  - 颜色: 设置描边颜色: {:?}", color);
                    },
                    Op::FillColor { color } => {
                        println!("  - 颜色: 设置填充颜色: {:?}", color);
                    },
                    Op::FillColorSpace { name } => {
                        println!("  - 颜色: 设置填充颜色空间: {:?}", name);
                    },
                    Op::StrokeColorSpace { name } => {
                        println!("  - 颜色: 设置描边颜色空间: {:?}", name);
                    },
                    Op::RenderingIntent { intent } => {
                        println!("  - 颜色: 设置渲染意图: {:?}", intent);
                    },

                    // --- 文本操作 ---
                    Op::BeginText => {
                        println!("  - 文本: 开始文本对象");
                    },
                    Op::EndText => {
                        println!("  - 文本: 结束文本对象");
                    },
                    Op::CharSpacing { char_space } => {
                        println!("  - 文本: 设置字符间距: {:.2}", char_space);
                    },
                    Op::WordSpacing { word_space } => {
                        println!("  - 文本: 设置单词间距: {:.2}", word_space);
                    },
                    Op::TextScaling { horiz_scale } => {
                        println!("  - 文本: 设置水平缩放: {:.2}%", horiz_scale);
                    },
                    Op::Leading { leading } => {
                        println!("  - 文本: 设置文本行距: {:.2}", leading);
                    },
                    Op::TextFont { name, size } => {
                        println!("  - 文本: 设置字体: {:?} (大小: {:.2})", name, size);
                    },
                    Op::TextRenderMode { mode } => {
                        println!("  - 文本: 设置文本渲染模式: {:?}", mode);
                    },
                    Op::TextRise { rise } => {
                        println!("  - 文本: 设置文本上升: {:.2}", rise);
                    },
                    Op::MoveTextPosition { translation } => {
                        println!("  - 文本: 移动文本位置: ({:.2}, {:.2})", translation.x, translation.y);
                    },
                    Op::SetTextMatrix { matrix } => {
                        println!("  - 文本: 设置文本矩阵: {:?}", matrix);
                    },
                    Op::TextNewline => {
                        println!("  - 文本: 文本换行");
                    },
                    Op::TextDraw { text } => {
                        // text 是 PdfString 类型，它包含原始字节和可能的 UTF-8 缓存
                        // 打印原始字节对于调试很有用
                        println!("  - 文本: 绘制文本: 原始字节={:?}", text.as_bytes());
                        // 警告: 直接打印 text.to_string() 或 text.to_str() 
                        // 不一定能得到正确的可读文本，因为它依赖于当前的字体编码。
                        // println!("    尝试解码: {:?}", text.to_string()); 
                    },
                    Op::TextDrawAdjusted { array } => {
                        println!("  - 文本: 绘制调整后的文本 (数组包含文本和间距调整): {:?}", array);
                    },

                    // --- 外部对象/图像操作 ---
                    Op::XObject { name } => {
                        println!("  - 外部对象: 引用外部对象: {:?}", name);
                        // 要解析 XObject (如图像、表单), 你需要从文件资源中查找这个 `name`
                        // 并根据其类型进一步处理。
                    },
                    Op::InlineImage { image } => {
                        println!("  - 图像: 发现内联图像 (尺寸: {}x{})", image.width, image.height);
                        // `image` 是 Arc<ImageXObject>，你可以访问其像素数据等
                    },
                    
                    // --- 其他未列出的操作 ---
                    // 如果 Op 枚举有更多变体，或者你只想打印所有操作
                    // _ => {
                    //    println!("  - 未知/其他操作: {:?}", operation);
                    // }
                }
            }
        }
    }

    Ok(())
}


fn extract_invoice_info(input: &str) -> anyhow::Result<InvoiceInfo> {
    // 定义正则表达式来匹配所需字段
    let type_re = Regex::new(r"电子发票\(([^\)]+)\)")?;
    let date_re = Regex::new(r"\s*(\d{4}年\d{2}月\d{2}日)")?;
    let number_re = Regex::new(r"\s*(\d{8}|\d{20})")?;
    let issuer_re = Regex::new(r"开票人:\s*(\S+)")?;
    let order_re = Regex::new(r"订单号:\s*(\d+)")?;
    let total_re = Regex::new(r"合\s*计：¥(\d+\.\d{2})")?;
    let tax_re = Regex::new(r"¥(\d+\.\d{2})\s*¥(\d+\.\d{2})\s*税")?;
    let total_with_tax_re = Regex::new(r"价税合计.*¥(\d+\.\d{2})")?;

    // 提取字段
    let invoice_type = type_re
        .captures(input)
        .and_then(|cap| cap.get(0))
        .map(|m| m.as_str().to_string())
        .unwrap_or_default();

    let date = date_re
        .captures(input)
        .and_then(|cap| cap.get(1))
        .map(|m| m.as_str().to_string())
        .unwrap_or_default();

    let number = number_re
        .captures(input)
        .and_then(|cap| cap.get(1))
        .map(|m| m.as_str().to_string())
        .unwrap_or_default();

    let issuer = issuer_re
        .captures(input)
        .and_then(|cap| cap.get(1))
        .map(|m| m.as_str().to_string())
        .unwrap_or_default();

    let order = order_re
        .captures(input)
        .and_then(|cap| cap.get(1))
        .map(|m| m.as_str().to_string())
        .unwrap_or_default();

    let total = total_re
        .captures(input)
        .and_then(|cap| cap.get(1))
        .map(|m| m.as_str().to_string())
        .unwrap_or_default();

    let tax = tax_re
        .captures(input)
        .and_then(|cap| cap.get(2))
        .map(|m| m.as_str().to_string())
        .unwrap_or_default();

    let total_with_tax = total_with_tax_re
        .captures(input)
        .and_then(|cap| cap.get(1))
        .map(|m| m.as_str().to_string())
        .unwrap_or_default();

    Ok(InvoiceInfo {
        invoice_type,
        date,
        number,
        issuer,
        order,
        total,
        tax,
        total_with_tax,
    })
}

// 定义结构体存储发票信息
#[derive(Debug)]
struct InvoiceInfo {
    invoice_type: String,
    date: String,
    number: String,
    issuer: String,
    order: String,
    total: String,
    tax: String,
    total_with_tax: String,
}