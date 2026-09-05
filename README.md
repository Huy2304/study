This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Quản trị

Trang `/admin` chỉ cho phép đúng tài khoản có email trong biến môi trường
`ADMIN_EMAIL`. Phiên quản trị độc lập với tài khoản người dùng thường và dùng
`ADMIN_PASSWORD` để đăng nhập:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-the-admin-password
```

Khu vực quản lý bài viết nằm ở `/admin/tin-tuc`. Bài viết đã xuất bản được hiển
thị tại `/tin-tuc`; trường `affiliateUrl` sẽ tạo nút liên kết có thuộc tính
`sponsored nofollow` ở cuối bài.

Endpoint `/api/keep-alive` chạy truy vấn `SELECT 1` để giữ kết nối database hoạt
động. Khi deploy trên Vercel, khai báo biến môi trường `CRON_SECRET`; lịch trong
`vercel.json` sẽ gọi endpoint mỗi ngày. Nếu deploy ở nền tảng khác, dùng cron
bên ngoài gọi URL này với header `Authorization: Bearer <CRON_SECRET>`.

GitHub Pages chỉ phục vụ file tĩnh và không chạy được các API route hoặc truy
vấn PostgreSQL của ứng dụng này.
