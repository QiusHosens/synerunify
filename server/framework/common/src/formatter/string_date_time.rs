use chrono::{NaiveDate, NaiveDateTime, NaiveTime};
use serde::{Deserialize, Deserializer, Serializer};
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

pub struct StringDate;

impl SerializeAs<NaiveDate> for StringDate {
    fn serialize_as<S>(value: &NaiveDate, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let s = value.format("%Y-%m-%d").to_string();
        serializer.serialize_str(&s)
    }
}

impl<'de> DeserializeAs<'de, NaiveDate> for StringDate {
    fn deserialize_as<D>(deserializer: D) -> Result<NaiveDate, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        NaiveDate::parse_from_str(&s, "%Y-%m-%d")
            .map_err(serde::de::Error::custom)
    }
}

pub struct StringTime;

impl SerializeAs<NaiveTime> for StringTime {
    fn serialize_as<S>(value: &NaiveTime, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let s = value.format("%H:%M:%S").to_string();
        serializer.serialize_str(&s)
    }
}

impl<'de> DeserializeAs<'de, NaiveTime> for StringTime {
    fn deserialize_as<D>(deserializer: D) -> Result<NaiveTime, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        NaiveTime::parse_from_str(&s, "%H:%M:%S")
            .map_err(serde::de::Error::custom)
    }
}