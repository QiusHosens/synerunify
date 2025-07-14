// use pdf_extract::extract_text_from_path;

#[tokio::test]
async fn test_pdf_text() {
    // let path = "invoice_personal_normal.pdf"; // 替换成你的 PDF 文件路径
    let bytes = std::fs::read("tests/invoice_personal_normal.pdf").unwrap();
    let out = pdf_extract::extract_text_from_mem(&bytes).unwrap();
    println!("{}", out);
}
