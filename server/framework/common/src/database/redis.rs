use crate::config::config::Config;
use redis::{Client, Commands, FromRedisValue, RedisResult, ToRedisArgs};
use std::collections::HashMap;
use std::sync::OnceLock;

// 全局静态的 Redis Client
static REDIS_CLIENT: OnceLock<Client> = OnceLock::new();

pub struct RedisManager;

impl RedisManager {
    // 获取单例的 Client 实例
    fn client() -> &'static Client {
        REDIS_CLIENT.get_or_init(|| {
            let config = Config::load();
            Client::open(config.redis_url.as_str()).expect("Failed to initialize Redis Client")
        })
    }

    // String 操作（使用泛型）
    pub fn set<K, V>(key: K, value: V) -> RedisResult<()>
    where
        K: ToRedisArgs,
        V: ToRedisArgs,
    {
        let mut conn = Self::client().get_connection()?;
        conn.set(key, value)?;
        Ok(())
    }

    pub fn get<K, V>(key: K) -> RedisResult<Option<V>>
    where
        K: ToRedisArgs,
        V: FromRedisValue,
    {
        let mut conn = Self::client().get_connection()?;
        conn.get(key)
    }

    pub fn delete<K>(key: K) -> RedisResult<()>
    where
        K: ToRedisArgs,
    {
        let mut conn = Self::client().get_connection()?;
        conn.del(key)?;
        Ok(())
    }

    // Hash 操作（使用泛型）
    pub fn set_hash_field<K, F, V>(key: K, field: F, value: V) -> RedisResult<()>
    where
        K: ToRedisArgs,
        F: ToRedisArgs,
        V: ToRedisArgs,
    {
        let mut conn = Self::client().get_connection()?;
        conn.hset(key, field, value)?;
        Ok(())
    }

    pub fn get_hash_field<K, F, V>(key: K, field: F) -> RedisResult<Option<V>>
    where
        K: ToRedisArgs,
        F: ToRedisArgs,
        V: FromRedisValue,
    {
        let mut conn = Self::client().get_connection()?;
        conn.hget(key, field)
    }

    pub fn get_hash_all<K, V>(key: K) -> RedisResult<HashMap<String, V>>
    where
        K: ToRedisArgs,
        V: FromRedisValue,
    {
        let mut conn = Self::client().get_connection()?;
        conn.hgetall(key)
    }

    // List 操作（使用泛型）
    pub fn push_list<K, V>(key: K, value: V) -> RedisResult<()>
    where
        K: ToRedisArgs,
        V: ToRedisArgs,
    {
        let mut conn = Self::client().get_connection()?;
        conn.rpush(key, value)?;
        Ok(())
    }

    pub fn get_list_range<K, V>(key: K, start: isize, stop: isize) -> RedisResult<Vec<V>>
    where
        K: ToRedisArgs,
        V: FromRedisValue,
    {
        let mut conn = Self::client().get_connection()?;
        conn.lrange(key, start, stop)
    }

    pub fn pop_list<K, V>(key: K) -> RedisResult<Option<V>>
    where
        K: ToRedisArgs,
        V: FromRedisValue,
    {
        let mut conn = Self::client().get_connection()?;
        conn.lpop(key, None)
    }

    pub fn lpop_all<K, V>(key: K) -> RedisResult<Vec<V>>
    where
        K: ToRedisArgs,
        V: FromRedisValue,
    {
        let mut conn = Self::client().get_connection()?;
        let len: usize = conn.llen(&key)?;
        let count = std::num::NonZeroUsize::new(len);
        conn.lpop(key, count)
    }

    // Set 操作（使用泛型）
    pub fn add_to_set<K, V>(key: K, value: V) -> RedisResult<()>
    where
        K: ToRedisArgs,
        V: ToRedisArgs,
    {
        let mut conn = Self::client().get_connection()?;
        conn.sadd(key, value)?;
        Ok(())
    }

    pub fn get_set_members<K, V>(key: K) -> RedisResult<Vec<V>>
    where
        K: ToRedisArgs,
        V: FromRedisValue,
    {
        let mut conn = Self::client().get_connection()?;
        conn.smembers(key)
    }

    pub fn remove_from_set<K, V>(key: K, value: V) -> RedisResult<()>
    where
        K: ToRedisArgs,
        V: ToRedisArgs,
    {
        let mut conn = Self::client().get_connection()?;
        conn.srem(key, value)?;
        Ok(())
    }

    pub fn is_set_member<K, V>(key: K, value: V) -> RedisResult<bool>
    where
        K: ToRedisArgs,
        V: ToRedisArgs,
    {
        let mut conn = Self::client().get_connection()?;
        conn.sismember(key, value)
    }

    // 设置过期时间
    pub fn set_expiry<K>(key: K, seconds: usize) -> RedisResult<()>
    where
        K: ToRedisArgs,
    {
        let mut conn = Self::client().get_connection()?;
        conn.expire(key, seconds as i64)?;
        Ok(())
    }
}