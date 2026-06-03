# Management App (React + Vite)

## Giới thiệu
**Management App** là ứng dụng web quản lý tài chính cá nhân theo hướng **budget (ngân sách)** và **thu/chi**.

Ứng dụng được xây dựng bằng **React + Vite**, có phân trang/routing rõ ràng, có cơ chế đăng nhập/đăng ký và bảo vệ các trang chính (Protected routes). Hiện tại hệ thống đang chạy theo hướng **demo/mock** (lưu dữ liệu người dùng bằng `localStorage`). Firebase hiện có sẵn nhưng cấu hình mẫu trong dự án đang ở trạng thái placeholder.

---

## Tính năng chính
- **Xác thực người dùng (Auth)**
  - Đăng nhập / Đăng ký
  - Đăng xuất
  - Lưu trạng thái người dùng bằng `localStorage` (demo)
- **Dashboard**
  - Tổng quan dữ liệu tài chính (tùy theo cách triển khai trong page)
- **Thu nhập (Income)**
  - Xem danh sách thu nhập
  - Thêm/xóa/sửa (tùy component/page tương ứng)
- **Chi tiêu (Expenses)**
  - Xem danh sách chi tiêu
  - Thêm/xóa/sửa (tùy component/page tương ứng)
- **Danh mục (Categories)**
  - Quản lý danh mục thu/chi
- **Thống kê (Statistics)**
  - Biểu đồ/phân tích dữ liệu (bar/line/pie tùy component)
- **Ngân sách (Budget)**
  - Quản lý kế hoạch ngân sách (budget)
- **Trang cá nhân (Profile)**
  - Hiển thị thông tin người dùng và các tùy chọn liên quan bảo mật/quyền riêng tư (theo giao diện trong `src/pages/Profile.jsx`)

---

## Công nghệ sử dụng
- React 19
- Vite
- React Router (routing)
- Mock data/auth (demo):
  - `src/data/mockAuth.js`
  - `src/data/mockData.js`
  - `src/utils/mockBudgetEngine.js`
- Firebase (chỉ có cấu hình mẫu):
  - `src/services/firebase.js`
- Các service lớp dữ liệu (tùy thực tế triển khai):
  - `src/services/authService.js`
  - `src/services/budgetService.js`
  - `src/services/expenseService.js`
  - `src/services/incomeService.js`
  - `src/services/categoryService.js`

---

## Cách chạy dự án
### 1) Cài đặt
```bash
npm install
```

### 2) Chạy dev server
```bash
npm run dev
```

### 3) Build
```bash
npm run build
```

### 4) Xem trước production build
```bash
npm run preview
```

### 5) Lint
```bash
npm run lint
```

---

## Routing (các trang và luồng truy cập)
Các route được khai báo trong `src/routes/AppRouter.jsx`.

### Public
- `/` : **Login**
  - Bị chặn nếu người dùng đã đăng nhập (`PublicOnly`)
- `/register` : **Register**
  - Bị chặn nếu người dùng đã đăng nhập (`PublicOnly`)

### Protected (cần đăng nhập)
- `/dashboard` : **Dashboard**
- `/expenses` : **Expenses**
- `/income` : **Income**
- `/categories` : **Categories**
- `/statistics` : **Statistics**
- `/budget` : **Budget**
- `/profile` : **Profile**

> Cơ chế Protected/Public được xây dựng trực tiếp trong `AppRouter.jsx` với `RequireAuth` và `PublicOnly` dựa vào `useAuth()` từ `src/context/AuthContext.jsx`.

---

## Cơ chế Auth (demo/mock)
### Nguồn dữ liệu người dùng
- `src/data/mockAuth.js` mô phỏng:
  - `signIn({ email, password })`
  - `signUp({ name, email, password })`
  - `signOut()`
  - `getCurrentUser()`

### AuthContext
- `src/context/AuthContext.jsx` cung cấp:
  - `user`
  - `signIn({ email })`
  - `signOut()`

Ứng dụng lấy `user` từ `mockAuth.getCurrentUser()` và cập nhật lại trạng thái khi gọi `signIn/signOut`.

---

## Cấu trúc thư mục (overview)
- `src/pages/`: các trang chính của ứng dụng
  - `Login.jsx`, `Register.jsx`, `Dashboard.jsx`, `Expenses.jsx`, `Income.jsx`, `Categories.jsx`, `Statistics.jsx`, `Budget.jsx`, `Profile.jsx`
- `src/components/layout/`: layout & điều hướng
  - `Layout.jsx`, `Navbar.jsx`, `Sidebar.jsx`, `AuthLayout.jsx`
- `src/components/`: các component nghiệp vụ
  - Budget: `components/budget/*`
  - Expense: `components/expense/*`
  - Category: `components/category/*`
  - Charts: `components/charts/*`
  - UI chung: `components/ui/*`
  - Common: `components/common/*`
- `src/routes/`: wrapper route
  - `AppRouter.jsx` (khai báo toàn bộ route)
- `src/services/`: layer tương tác dữ liệu
  - Firebase/auth/budget/expense/income/category
- `src/context/`: state toàn cục (Auth)
- `src/utils/`: hàm tiện ích
  - `calculate.js`, `formatMoney.js`, `date.js`, `groupExpenses.js`, `mockBudgetEngine.js`
- `src/data/`: mock dữ liệu
  - `mockData.js`, `mockAuth.js`

---

## Firebase (lưu ý quan trọng)
- `src/services/firebase.js` chứa cấu hình Firebase với các giá trị **placeholder**:
  - `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`

Hiện tại dự án chạy theo mock/auth + localStorage.

Nếu muốn tích hợp Firebase thật, cần:
1. Cập nhật `src/services/firebase.js` bằng thông tin từ Firebase Console.
2. Thay logic mock trong các service/auth/data bằng logic dùng Firebase Auth/Firestore theo đúng yêu cầu ứng dụng.
3. Đồng bộ lại luồng đọc/ghi dữ liệu giữa:
   - `AuthContext` / service auth
   - các service budget/expense/income/category

---

## Ghi chú triển khai
- Dự án có sử dụng một số component UI dùng chung (`src/components/ui/*`) và component nghiệp vụ theo từng mảng.
- Mock data phù hợp cho demo/validation UI.

---

## Liên quan đến chất lượng & tiêu chuẩn
- Scripts có sẵn:
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
- Khuyến nghị chạy `npm run lint` trước khi commit.

---

## Tóm tắt nhanh
- Chạy: `npm install` → `npm run dev`
- Route chính: `src/routes/AppRouter.jsx`
- Auth demo: `src/data/mockAuth.js` + `src/context/AuthContext.jsx`
- Firebase: có sẵn config mẫu (placeholder) trong `src/services/firebase.js`

