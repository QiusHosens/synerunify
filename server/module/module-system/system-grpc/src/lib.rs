pub mod system_client;

#[cfg(test)]
mod tests {
    use anyhow::Result;
    use super::system_client::SystemClient;

    #[tokio::test]
    async fn test_get_user() -> Result<()> {
        let mut client = SystemClient::new("http://localhost:9001").await?;
        let user_id_list = vec![1, 2];
        let authorization = "";
        let result = client.get_user(user_id_list, authorization).await?;
        println!("result: {:?}", result);
        Ok(())
    }

    #[tokio::test]
    async fn test_get_department() -> Result<()> {
        let mut client = SystemClient::new("http://localhost:9001").await?;
        let department_id_list = vec![1, 2];
        let authorization = "";
        let result = client.get_department(department_id_list, authorization).await?;
        println!("result: {:?}", result);
        Ok(())
    }
}