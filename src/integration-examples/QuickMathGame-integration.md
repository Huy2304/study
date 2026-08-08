# Kết nối QuickMathGame với database

## 1. Import

Trong `QuickMathGame.tsx`:

```tsx
import { useRef } from "react";
import { submitGameRun } from "@/lib/api/game";
```

Nếu file đã import `useRef`, không import lần hai.

## 2. Tạo ID cho từng vòng

Trong component:

```tsx
const clientRunIdRef = useRef(
    crypto.randomUUID()
);
```

Trong `startGame()`:

```tsx
clientRunIdRef.current =
    crypto.randomUUID();
```

Mỗi lần bấm chơi lại phải có ID mới.

## 3. Gửi kết quả trong `finishGame`

Sau khi đã chặn kết thúc lặp bằng `roundEndedRef.current`, gọi:

```tsx
void submitGameRun({
    clientRunId:
        clientRunIdRef.current,

    gameType: "quick-math",
    gameMode,
    difficulty,

    score: finalScore,
    correctAnswers:
        correctThisRound.current,
    totalAnswers:
        totalThisRound.current,
    durationSeconds:
        gameMode === "unlimited"
            ? elapsedTime
            : DIFFICULTY_CONFIG[difficulty]
                  .timeLimit - timeLeft,
}).catch((error) => {
    console.error(
        "Không thể đồng bộ kết quả:",
        error
    );
});
```

Nên đặt trước hoặc sau `setGameState("gameOver")`, nhưng chỉ đặt bên trong `finishGame()`.

## 4. Không gửi nếu chưa đăng nhập

API sẽ trả `401`. Có hai lựa chọn:

### Bắt buộc đăng nhập trước khi chơi

Kiểm tra session ở Game Hub bằng:

```tsx
const { data: session } =
    authClient.useSession();
```

### Cho chơi khách

Nếu API trả `401`, giữ thống kê cục bộ. Sau khi người dùng đăng nhập, có thể bổ sung hàng đợi đồng bộ sau.

## 5. Chống cộng lặp

Có hai lớp bảo vệ:

```text
roundEndedRef
→ chặn component gọi kết thúc nhiều lần

clientRunId unique trong database
→ chặn request retry cộng lại điểm
```
