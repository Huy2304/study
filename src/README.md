# StudyHay Sync Starter

Bộ starter dành cho dự án Next.js App Router hiện tại, gồm:

- Đăng ký và đăng nhập bằng `username + password`.
- Session dùng Better Auth.
- PostgreSQL/Supabase dùng Drizzle ORM.
- Đồng bộ dữ liệu giữa thiết bị và trình duyệt.
- Lưu từng lượt chơi, tổng điểm và điểm cao nhất.
- Bảng xếp hạng tổng điểm.
- API đồng bộ Note và Todo.
- Chống cộng trùng một lượt bằng `clientRunId`.

## 1. Cài package

```bash
npm install better-auth @better-auth/drizzle-adapter drizzle-orm postgres
npm install -D drizzle-kit
```

Nếu dự án chưa có icon:

```bash
npm install lucide-react
```

## 2. Sao chép file

Sao chép các thư mục trong ZIP vào thư mục gốc của dự án:

```text
app/
components/
lib/
drizzle.config.ts
.env.example
```

Không chép đè `app/layout.tsx` hiện tại. Xem thư mục `integration-examples/`.

## 3. Tạo Supabase database

1. Tạo project Supabase.
2. Vào **Connect**.
3. Lấy chuỗi kết nối **Transaction pooler** hoặc **Shared Pooler**.
4. Sao chép `.env.example` thành `.env.local`.
5. Điền `DATABASE_URL`.

Khi dùng Transaction Pooler, file `lib/db/index.ts` đã đặt:

```ts
postgres(connectionString, { prepare: false })
```

## 4. Tạo secret

```bash
openssl rand -base64 32
```

Hoặc tự tạo chuỗi ngẫu nhiên dài tối thiểu 32 ký tự.

Điền vào:

```env
BETTER_AUTH_SECRET=
```

## 5. Tạo bảng database

Schema Better Auth và schema ứng dụng đã được gom trong `lib/db/schema`.

Chạy:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Trong giai đoạn phát triển, có thể dùng:

```bash
npx drizzle-kit push
```

## 6. Chạy dự án

```bash
npm run dev
```

Mở:

```text
http://localhost:3000/register
```

Đăng ký một username, sau đó đăng nhập trên trình duyệt hoặc thiết bị khác bằng cùng username và mật khẩu.

## 7. Kết nối game hiện tại

Xem:

```text
integration-examples/QuickMathGame-integration.md
```

Điểm quan trọng:

- Tạo `clientRunId` mới ở đầu mỗi vòng.
- Chỉ gửi kết quả trong hàm kết thúc vòng.
- API dùng `clientRunId` để không cộng một lượt hai lần.
- Không gửi `userId` từ client; server tự lấy từ session.

## 8. Gắn giao diện tài khoản

Có thể đặt:

```tsx
import UserMenu from "@/components/auth/UserMenu";

<UserMenu />
```

vào `BottomBar.tsx` hoặc khu vực header.

Gắn bảng xếp hạng:

```tsx
import Leaderboard from "@/components/game/Leaderboard";

<Leaderboard />
```

## 9. Username không dùng email thật

Form đăng ký tạo một email kỹ thuật ngẫu nhiên để Better Auth lưu credential. Người dùng chỉ thấy:

- Username
- Tên hiển thị
- Mật khẩu

Phiên bản này chưa có khôi phục mật khẩu qua email. Không nên dùng cho dữ liệu quan trọng trước khi bổ sung recovery code hoặc email thật.

## 10. Nguồn dữ liệu

Sau khi tích hợp:

- Database là nguồn dữ liệu chính.
- `localStorage` chỉ nên dùng cache hoặc lưu dữ liệu chưa đồng bộ khi mất mạng.
- Bảng `game_runs` lưu lịch sử từng lượt.
- Bảng `player_stats` lưu tổng hợp để tải bảng xếp hạng nhanh.
