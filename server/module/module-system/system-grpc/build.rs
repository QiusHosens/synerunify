fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("cargo:info=Compiling system proto/api.proto...");
    prost_build::Config::new()
        .compile_protos(&["proto/api.proto"], &["proto"])?;
    tonic_build::configure()
        .build_client(true)
        .build_server(true)
        .compile_protos(&["proto/api.proto"], &["proto"])?;
    println!("cargo:info=Compilation system completed");
    Ok(())
}