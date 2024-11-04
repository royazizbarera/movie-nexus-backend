



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

## 📋 To Do
- [ ] Implement API untuk mendapatkan daftar film
- [ ] Integrasi dengan database PostgreSQL
- [ ] Buat halaman admin untuk menambah, mengedit, dan menghapus film
- [ ] Desain halaman login dengan autentikasi JWT
- [ ] Implementasi fitur pencarian real-time pada halaman daftar film
- [ ] Tambahkan dokumentasi API menggunakan Swagger
- [ ] dll

## Bug
- [ ] Filtering