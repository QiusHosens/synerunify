# synerunify

## 🚀 Quick Start

1. **Build docker image**
   ```bash
   sh build.sh
   ```
2. **Install quickly via docker**
   ```bash
   docker run --name synerunify -p 80:80 \
      -e DATABASE_URL=<your-mysql-url> \
      -e MONGO_URL=<your-mongo-url> \
      -e REDIS_URL=<your-redis-url> \
      -d synerunify/synerunify
   ```