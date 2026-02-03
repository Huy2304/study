### 3.1 Trang Nông sản(Nông sản Page)
Hiển thị **bảng danh sách trái**

#### Bảng gồm các cột:
| STT | Tên trái | Nhiễm thể | Số lượng | Biến thể |
|-----|----------|-----------|----------|----------|

#### Yêu cầu chi tiết:
- STT: tự tăng theo index
- Tên trái: string
- Nhiễm thể: string (ví dụ: Paramecia, Zoan, Logia...)
- Số lượng: number
- Biến thể:
  - Một trái có thể có **nhiều biến thể**
  - Hiển thị dạng:
    - Danh sách gạch đầu dòng
    - Hoặc tag / badge

Ví dụ:
- Lửa
- Băng
- Sét

---

### 3.2 Trang Admin (Admin Page)

#### Chức năng:
- Thêm trái mới
- Sửa trái
- Xóa trái

#### Giao diện gồm:
1. **Bảng giống trang chủ**
2. **Nút hành động**
   - Thêm
   - Sửa
   - Xóa

---

## 4. Form Thêm / Sửa trái

### Các trường:
- Tên trái (input text)
- Nhiễm thể (select hoặc input)
- Số lượng (input number)
- Biến thể:
  - Nhập nhiều biến thể
  - Có thể:
    - Input + nút "Thêm biến thể"
    - Hiển thị danh sách biến thể đã thêm
    - Cho phép xóa từng biến thể

---

## 5. Dữ liệu
- Dùng dữ liệu giả ban đầu (mock data)
- Ví dụ:

```js
[
  {
    id: 1,
    name: "Trái Lửa",
    type: "Logia",
    quantity: 3,
    variants: ["Lửa thường", "Lửa xanh"]
  }
]
