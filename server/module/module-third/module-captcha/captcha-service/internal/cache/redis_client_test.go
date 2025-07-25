package cache

import (
	"context"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/stretchr/testify/assert"
)

func TestRedisClient(t *testing.T) {
	mr, err := miniredis.Run()
	assert.NoError(t, err)
	defer mr.Close()

	client, err := NewRedisClient(mr.Addr(), "TEST_KEY:", 60*time.Second, "", "0")
	assert.NoError(t, err)
	defer client.Close()

	t.Run("SetAndGet", func(t *testing.T) {
		err := client.SetCache(context.Background(), "key1", "value1")
		assert.NoError(t, err)

		value, err := client.GetCache(context.Background(), "key1")
		assert.NoError(t, err)
		assert.Equal(t, "value1", value)
	})

	t.Run("GetNonExistent", func(t *testing.T) {
		value, err := client.GetCache(context.Background(), "nonexistent")
		assert.NoError(t, err)
		assert.Equal(t, "", value)
	})
}
