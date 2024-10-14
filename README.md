



## Setup Awal Project Ini
```bash
npm init -y
npm i -D typescript
npx tcs --init
```

## Setup Database
Menerapkan **tanpa** membuat migrasi
```bash
npx prisma generate
```
Menerapkan **dengan** membuat migrasi baru
```bash
npx prisma migrate dev --name init
```

## Run Project
Development Mode
```bash
npm run dev
```