# Skill: Docker Build & Run for Next.js WHA App

## Purpose

ใช้สำหรับ build และ run Docker container ของ Next.js application ชื่อ `nextjs-wha-app` อย่างปลอดภัย โดยต้องตรวจสอบก่อนเสมอว่า image version/tag ที่จะ build มีอยู่ในเครื่องแล้วหรือไม่

## Default Configuration

```bash
IMAGE_NAME="nextjs-wha-app"
IMAGE_VERSION="1.0.0"
CONTAINER_NAME="my-nextjs-wha-app"
ENV_FILE=".env.production"
HOST_PORT="4000"
CONTAINER_PORT="3000"
```

คำสั่งหลักที่ต้องการให้ใช้:

```bash
docker build -t nextjs-wha-app:1.0.0 .

docker run --restart=always -d --name my-nextjs-wha-app --env-file .env.production -p 4000:3000 nextjs-wha-app:1.0.0
```

---

## Mandatory Rules

### 1. Always check Docker availability first

ก่อนทำงานทุกครั้ง ต้องตรวจสอบว่า Docker ใช้งานได้

```bash
docker --version
docker info
```

ถ้า Docker ไม่พร้อมใช้งาน ให้หยุดและแจ้งปัญหาก่อน ห้าม build หรือ run ต่อ

---

### 2. Always check required files before build

ต้องตรวจสอบว่าอยู่ใน project directory ที่ถูกต้อง และมีไฟล์สำคัญครบ

```bash
ls
test -f Dockerfile && echo "Dockerfile found"
test -f package.json && echo "package.json found"
test -f .env.production && echo ".env.production found"
```

ถ้าไม่มี `Dockerfile` หรือ `.env.production` ให้หยุดก่อน เพราะคำสั่ง run ต้องใช้ env file นี้

---

### 3. Always check whether the image version already exists

ก่อน build image ด้วย tag ใด ๆ ต้องตรวจสอบก่อนว่า version นั้นมีอยู่ในเครื่องแล้วหรือไม่

```bash
docker image inspect nextjs-wha-app:1.0.0 >/dev/null 2>&1
```

ถ้า command สำเร็จ แปลว่า image version นี้มีอยู่แล้ว

ให้ตรวจสอบรายละเอียดเพิ่ม:

```bash
docker images nextjs-wha-app
```

หรือ

```bash
docker images nextjs-wha-app --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}\t{{.Size}}"
```

ข้อกำหนดสำคัญ:

* ถ้า `nextjs-wha-app:1.0.0` มีอยู่แล้ว ห้าม build ทับทันที
* ต้องแจ้งผู้ใช้ก่อนว่า version นี้มีอยู่แล้ว
* ให้เสนอทางเลือก:

  * ใช้ version ใหม่ เช่น `1.0.1`
  * หรือยืนยันว่าจะ build ทับ tag เดิม
* ห้ามสุ่มเปลี่ยนเลข version เองโดยไม่แจ้งผู้ใช้

---

### 4. Check existing containers before run

ก่อน run container ใหม่ ต้องเช็คก่อนว่ามี container ชื่อ `my-nextjs-wha-app` อยู่แล้วหรือไม่

```bash
docker ps -a --filter "name=^/my-nextjs-wha-app$"
```

ถ้ามี container เดิมอยู่แล้ว ห้าม run ซ้ำทันที เพราะจะเจอ error ว่า container name ถูกใช้แล้ว

ให้ตรวจสอบสถานะ:

```bash
docker ps -a --filter "name=^/my-nextjs-wha-app$" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
```

ถ้า container เดิมยังทำงานอยู่ ให้แจ้งผู้ใช้ก่อนว่าจะต้อง stop/remove หรือใช้ชื่อใหม่

---

### 5. Check whether host port is already used

ก่อน run ด้วย port `4000:3000` ต้องตรวจสอบว่า port 4000 ถูกใช้อยู่หรือไม่

บน Linux/macOS:

```bash
lsof -i :4000
```

หรือ

```bash
netstat -tulpn | grep :4000
```

บน Windows PowerShell:

```powershell
netstat -ano | findstr :4000
```

ถ้า port 4000 ถูกใช้อยู่ ให้หยุดและแจ้งผู้ใช้ก่อน ห้าม run ทับ

---

## Standard Build Procedure

### Step 1: Set variables

```bash
IMAGE_NAME="nextjs-wha-app"
IMAGE_VERSION="1.0.0"
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_VERSION}"
```

### Step 2: Check whether image tag already exists

```bash
docker image inspect "${FULL_IMAGE_NAME}" >/dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "Image ${FULL_IMAGE_NAME} already exists."
  docker images "${IMAGE_NAME}"
  exit 1
else
  echo "Image ${FULL_IMAGE_NAME} does not exist. Safe to build."
fi
```

### Step 3: Build image

```bash
docker build -t "${FULL_IMAGE_NAME}" .
```

### Step 4: Verify image after build

```bash
docker images "${IMAGE_NAME}"
docker image inspect "${FULL_IMAGE_NAME}" >/dev/null 2>&1 && echo "Build completed successfully"
```

---

## Standard Run Procedure

### Step 1: Set variables

```bash
CONTAINER_NAME="my-nextjs-wha-app"
ENV_FILE=".env.production"
HOST_PORT="4000"
CONTAINER_PORT="3000"
IMAGE_NAME="nextjs-wha-app"
IMAGE_VERSION="1.0.0"
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_VERSION}"
```

### Step 2: Check existing container

```bash
docker ps -a --filter "name=^/${CONTAINER_NAME}$"
```

ถ้ามี container เดิมอยู่ ให้หยุดก่อน และแจ้งผู้ใช้ก่อนลบ

สำหรับ redeploy ที่ผู้ใช้ยืนยันแล้วเท่านั้น:

```bash
docker stop "${CONTAINER_NAME}"
docker rm "${CONTAINER_NAME}"
```

### Step 3: Run container

```bash
docker run \
  --restart=always \
  -d \
  --name "${CONTAINER_NAME}" \
  --env-file "${ENV_FILE}" \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  "${FULL_IMAGE_NAME}"
```

หรือแบบตรงตามคำสั่งหลัก:

```bash
docker run --restart=always -d --name my-nextjs-wha-app --env-file .env.production -p 4000:3000 nextjs-wha-app:1.0.0
```

---

## Post-run Verification

หลัง run container ต้องตรวจสอบสถานะทันที

```bash
docker ps --filter "name=^/my-nextjs-wha-app$"
```

ตรวจ logs เบื้องต้น:

```bash
docker logs --tail=100 my-nextjs-wha-app
```

ตรวจว่า restart policy ถูกต้อง:

```bash
docker inspect my-nextjs-wha-app --format='{{.HostConfig.RestartPolicy.Name}}'
```

ผลลัพธ์ควรเป็น:

```bash
always
```

---

## Safe Redeploy Procedure

ใช้เมื่อมี container เดิมอยู่แล้ว และต้องการ deploy image version ใหม่

### 1. Check current container

```bash
docker ps -a --filter "name=^/my-nextjs-wha-app$" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
```

### 2. Check existing image versions

```bash
docker images nextjs-wha-app --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}\t{{.Size}}"
```

### 3. Build new version only if tag does not already exist

ตัวอย่าง version ใหม่:

```bash
docker build -t nextjs-wha-app:1.0.1 .
```

### 4. Stop and remove old container

```bash
docker stop my-nextjs-wha-app
docker rm my-nextjs-wha-app
```

### 5. Run new version

```bash
docker run --restart=always -d --name my-nextjs-wha-app --env-file .env.production -p 4000:3000 nextjs-wha-app:1.0.1
```

### 6. Verify

```bash
docker ps --filter "name=^/my-nextjs-wha-app$"
docker logs --tail=100 my-nextjs-wha-app
```

---

## Recommended Versioning Rule

ใช้ semantic versioning แบบง่าย:

```text
MAJOR.MINOR.PATCH
```

ตัวอย่าง:

```text
1.0.0
1.0.1
1.0.2
1.1.0
2.0.0
```

แนวทาง:

* แก้ bug เล็กน้อย → เพิ่ม PATCH เช่น `1.0.0` เป็น `1.0.1`
* เพิ่ม feature ใหม่ → เพิ่ม MINOR เช่น `1.0.1` เป็น `1.1.0`
* เปลี่ยนระบบใหญ่หรือ breaking change → เพิ่ม MAJOR เช่น `1.1.0` เป็น `2.0.0`

ก่อนเลือก version ใหม่ ให้ดู version ที่มีอยู่ก่อนเสมอ:

```bash
docker images nextjs-wha-app --format "{{.Tag}}" | sort -V
```

---

## Error Handling

### Case 1: Image version already exists

ห้าม build ทับทันที

ให้ตอบผู้ใช้ประมาณนี้:

```text
พบว่า image nextjs-wha-app:1.0.0 มีอยู่ในเครื่องแล้ว
แนะนำให้ใช้ version ใหม่ เช่น 1.0.1 หรือยืนยันว่าต้องการ build ทับ tag เดิม
```

---

### Case 2: Container name already exists

ให้ตรวจสอบก่อนว่า container เดิมใช้ image version อะไร

```bash
docker ps -a --filter "name=^/my-nextjs-wha-app$" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
```

ถ้าผู้ใช้ต้องการ redeploy ให้ใช้:

```bash
docker stop my-nextjs-wha-app
docker rm my-nextjs-wha-app
```

แล้วค่อย run ใหม่

---

### Case 3: Port 4000 already used

ห้าม run ต่อ

ให้แจ้งผู้ใช้ว่า port 4000 ถูกใช้งานอยู่ และเสนอให้:

* ปิด process/container เดิม
* หรือเปลี่ยน host port เช่น `4001:3000`

ตัวอย่าง:

```bash
docker run --restart=always -d --name my-nextjs-wha-app --env-file .env.production -p 4001:3000 nextjs-wha-app:1.0.0
```

---

## Commands Summary

### Check Docker

```bash
docker --version
docker info
```

### Check image version

```bash
docker image inspect nextjs-wha-app:1.0.0 >/dev/null 2>&1
docker images nextjs-wha-app
```

### Build

```bash
docker build -t nextjs-wha-app:1.0.0 .
```

### Check container

```bash
docker ps -a --filter "name=^/my-nextjs-wha-app$"
```

### Run

```bash
docker run --restart=always -d --name my-nextjs-wha-app --env-file .env.production -p 4000:3000 nextjs-wha-app:1.0.0
```

### Check logs

```bash
docker logs --tail=100 my-nextjs-wha-app
```

### Stop and remove container

```bash
docker stop my-nextjs-wha-app
docker rm my-nextjs-wha-app
```

---

## Agent Behavior Requirements

The agent must:

1. ตรวจสอบ Docker ก่อนเสมอ
2. ตรวจสอบ `Dockerfile`, `package.json`, และ `.env.production` ก่อน build/run
3. ตรวจสอบ image tag/version ก่อน build ทุกครั้ง
4. ห้าม build ทับ version เดิมโดยไม่แจ้งผู้ใช้
5. ตรวจสอบ container name ก่อน run
6. ตรวจสอบ port ก่อน run
7. หลัง run ต้องตรวจ container status และ logs
8. ถ้ามี error ต้องอธิบายสาเหตุและเสนอคำสั่งแก้ไข
9. ห้ามลบ image หรือ container โดยไม่จำเป็น
10. ห้ามเดาเลข version ใหม่โดยไม่ตรวจจากเครื่องก่อน
