# Gắn UserMenu vào ứng dụng hiện tại

Không cần thêm AuthProvider riêng. Better Auth đọc session bằng cookie.

## BottomBar.tsx

```tsx
import UserMenu from "@/components/auth/UserMenu";
```

Đặt ở vị trí phù hợp:

```tsx
<UserMenu />
```

## GameHub.tsx

```tsx
import Leaderboard from "@/components/game/Leaderboard";
```

Có thể thêm game/tab thứ ba:

```tsx
<Leaderboard />
```

## Điều hướng

Các trang đã có:

```text
/login
/register
```

Không cần sửa `layout.tsx` để hệ thống auth hoạt động.
