use chrono::{NaiveDateTime, DateTime, Utc};
use serde::{Deserialize, Serialize, Deserializer, Serializer};
use serde_with::{DeserializeAs, SerializeAs};

pub struct StringDateTime;

impl SerializeAs<NaiveDateTime> for StringDateTime {
    fn serialize_as<S>(value: &NaiveDateTime, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let s = value.format("%Y-%m-%d %H:%M:%S").to_string();
        serializer.serialize_str(&s)
    }
}

impl<'de> DeserializeAs<'de, NaiveDateTime> for StringDateTime {
    fn deserialize_as<D>(deserializer: D) -> Result<NaiveDateTime, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        NaiveDateTime::parse_from_str(&s, "%Y-%m-%d %H:%M:%S")
            .map_err(serde::de::Error::custom)
    }
}