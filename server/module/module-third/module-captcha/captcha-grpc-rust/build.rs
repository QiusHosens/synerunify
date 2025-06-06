fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("cargo:info=Compiling proto/api.proto...");
    prost_build::Config::new()
        .compile_protos(&["proto/api.proto"], &["proto"])?;
    tonic_build::configure()
        .build_client(true)
        .build_server(false)
        .compile_protos(&["proto/api.proto"], &["proto"])?;
    println!("cargo:info=Compilation completed");
    Ok(())
}