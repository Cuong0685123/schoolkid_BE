# 📚 HƯỚNG DẪN TẠO API MỚI

Tài liệu này hướng dẫn chi tiết cách tạo một API mới trong project backend này.

---

## 📋 TỔNG QUAN VỀ CẤU TRÚC PROJECT

Project sử dụng kiến trúc **MVC (Model-View-Controller)** với pattern **3-layer**:

```
📁 Project Structure:
├── models/          → Định nghĩa database schema (Sequelize)
├── services/        → Business logic layer
├── controllers/     → Xử lý HTTP request/response
├── routes/          → Định nghĩa API endpoints
├── middlewares/     → Validation, authentication, etc.
└── app.js           → Đăng ký routes vào Express app
```

**Luồng xử lý:**
```
Request → Route → Middleware (Validation) → Controller → Service → Model → Database
                                                                    ↓
Response ← Route ← Controller ← Service ← Model ← Database
```

---

## 🚀 CÁC BƯỚC TẠO API MỚI

### **Bước 1: Tạo Model** (Nếu chưa có)

Tạo file trong thư mục `models/` với tên: `[tênModel].model.js`

**Ví dụ:** `models/product.model.js`

```javascript
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Product = sequelize.define(
    "Product",  // Tên model (số ít, PascalCase)
    {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      name: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      description: DataTypes.TEXT,
      created_at: DataTypes.DATE,
    },
    { 
      tableName: "products",  // Tên bảng trong database (số nhiều, snake_case)
      timestamps: false  // Tắt auto timestamps nếu không dùng
    }
  );

  // Định nghĩa relationships (nếu có)
  Product.associate = (models) => {
    // Ví dụ: Product belongsTo Category
    // Product.belongsTo(models.Category, { foreignKey: "category_id" });
    
    // Ví dụ: Product hasMany OrderItem
    // Product.hasMany(models.OrderItem, { foreignKey: "product_id" });
  };

  return Product;
};
```

**Sau đó đăng ký model trong `models/index.js`:**

```javascript
// Import
import ProductFactory from "./product.model.js";

// Load model
models.Product = ProductFactory(sequelize);
```

---

### **Bước 2: Tạo Service**

Tạo file trong thư mục `services/` với tên: `[tênModel].service.js`

**Ví dụ:** `services/product.service.js`

```javascript
import { models } from "../models/index.js";

export const productService = {
  // ======= CREATE =======
  create: async (data) => {
    return await models.Product.create(data);
  },

  // ======= GET ALL =======
  getAll: async () => {
    return await models.Product.findAll({
      // Include relationships nếu cần
      // include: [{ model: models.Category }]
    });
  },

  // ======= GET BY ID =======
  getById: async (id) => {
    return await models.Product.findByPk(id, {
      // include: [{ model: models.Category }]
    });
  },

  // ======= UPDATE =======
  update: async (id, data) => {
    const product = await models.Product.findByPk(id);
    if (!product) throw new Error("Product not found");

    await product.update(data);
    return product;
  },

  // ======= DELETE =======
  delete: async (id) => {
    const product = await models.Product.findByPk(id);
    if (!product) throw new Error("Product not found");

    await product.destroy();
    return true;
  },
};
```

**Lưu ý:**
- Service chứa **business logic**, không xử lý HTTP request/response
- Luôn kiểm tra record tồn tại trước khi update/delete
- Throw Error với message rõ ràng để controller xử lý

---

### **Bước 3: Tạo Controller**

Tạo file trong thư mục `controllers/` với tên: `[tênModel].controller.js`

**Ví dụ:** `controllers/product.controller.js`

```javascript
import { productService } from "../services/product.service.js";

export const productController = {
  // ===== CREATE =====
  create: async (req, res) => {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({ 
        message: "Tạo sản phẩm thành công", 
        data: product 
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // ===== GET ALL =====
  getAll: async (req, res) => {
    try {
      const products = await productService.getAll();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ===== GET BY ID =====
  getById: async (req, res) => {
    try {
      const product = await productService.getById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ===== UPDATE =====
  update: async (req, res) => {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json({ 
        message: "Cập nhật thành công", 
        data: product 
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // ===== DELETE =====
  delete: async (req, res) => {
    try {
      await productService.delete(req.params.id);
      res.json({ message: "Xóa sản phẩm thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
```

**Lưu ý:**
- Controller chỉ xử lý HTTP request/response
- Luôn dùng try-catch để bắt lỗi
- Trả về status code phù hợp:
  - `201` cho CREATE thành công
  - `200` cho GET, UPDATE, DELETE thành công
  - `400` cho lỗi validation/bad request
  - `404` cho không tìm thấy
  - `500` cho lỗi server

---

### **Bước 4: Tạo Validation Middleware** (Tùy chọn nhưng khuyến nghị)

Tạo file trong thư mục `middlewares/` với tên: `[tênModel].validation.js`

**Ví dụ:** `middlewares/product.validation.js`

```javascript
// Validation cho CREATE
export const validateProductCreate = (req, res, next) => {
  const { name, price } = req.body;

  // Kiểm tra required fields
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ 
      message: "Tên sản phẩm không được để trống" 
    });
  }

  if (!price || isNaN(price) || price <= 0) {
    return res.status(400).json({ 
      message: "Giá sản phẩm không hợp lệ" 
    });
  }

  next(); // Pass validation, tiếp tục đến controller
};

// Validation cho UPDATE (thường lỏng hơn, các field đều optional)
export const validateProductUpdate = (req, res, next) => {
  const { name, price } = req.body;

  // Nếu có name thì phải không rỗng
  if (name !== undefined && name.trim().length === 0) {
    return res.status(400).json({ 
      message: "Tên sản phẩm không hợp lệ" 
    });
  }

  // Nếu có price thì phải hợp lệ
  if (price !== undefined && (isNaN(price) || price <= 0)) {
    return res.status(400).json({ 
      message: "Giá sản phẩm không hợp lệ" 
    });
  }

  next();
};
```

**Lưu ý:**
- Validation cho CREATE: kiểm tra **required fields**
- Validation cho UPDATE: các field đều **optional**, nhưng nếu có thì phải hợp lệ
- Luôn return response và không gọi `next()` nếu validation fail

---

### **Bước 5: Tạo Routes**

Tạo file trong thư mục `routes/` với tên: `[tênModel].routes.js`

**Ví dụ:** `routes/product.routes.js`

```javascript
import express from "express";
import { productController } from "../controllers/product.controller.js";
import {
  validateProductCreate,
  validateProductUpdate
} from "../middlewares/product.validation.js";

const router = express.Router();

// CREATE
router.post(
  "/", 
  validateProductCreate,  // Middleware validation
  productController.create
);

// GET ALL
router.get("/", productController.getAll);

// GET BY ID
router.get("/:id", productController.getById);

// UPDATE
router.put(
  "/:id", 
  validateProductUpdate,  // Middleware validation
  productController.update
);

// DELETE
router.delete("/:id", productController.delete);

export default router;
```

**Lưu ý về thứ tự routes:**
- Đặt routes cụ thể (như `/search`, `/filter`) **TRƯỚC** routes có parameter (`/:id`)
- Ví dụ:
  ```javascript
  router.get("/search", productController.search);  // ✅ Đúng
  router.get("/:id", productController.getById);
  
  // ❌ SAI: Nếu đặt /:id trước, "/search" sẽ bị match như /:id
  ```

---

### **Bước 6: Đăng ký Routes trong app.js**

Mở file `app.js` và thêm:

```javascript
// Import route
import productRoutes from "./routes/product.routes.js";

// Đăng ký route với prefix
app.use("/api/products", productRoutes);
```

**Lưu ý:**
- Prefix thường là `/api/[tên-model-số-nhiều]`
- Ví dụ: `/api/products`, `/api/users`, `/api/orders`

---

## ✅ CHECKLIST TẠO API MỚI

Sau khi hoàn thành, kiểm tra:

- [ ] ✅ Model đã được tạo và đăng ký trong `models/index.js`
- [ ] ✅ Service đã có đầy đủ các method: create, getAll, getById, update, delete
- [ ] ✅ Controller đã xử lý try-catch và trả về status code đúng
- [ ] ✅ Validation middleware đã được tạo (nếu cần)
- [ ] ✅ Routes đã được định nghĩa với đúng HTTP methods
- [ ] ✅ Routes đã được đăng ký trong `app.js`
- [ ] ✅ Đã test API bằng Postman/Thunder Client

---

## 📝 VÍ DỤ HOÀN CHỈNH: TẠO API "Product"

### 1. Model: `models/product.model.js`
```javascript
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      description: DataTypes.TEXT,
    },
    { tableName: "products", timestamps: false }
  );

  return Product;
};
```

### 2. Service: `services/product.service.js`
```javascript
import { models } from "../models/index.js";

export const productService = {
  create: async (data) => {
    return await models.Product.create(data);
  },
  getAll: async () => {
    return await models.Product.findAll();
  },
  getById: async (id) => {
    return await models.Product.findByPk(id);
  },
  update: async (id, data) => {
    const product = await models.Product.findByPk(id);
    if (!product) throw new Error("Product not found");
    await product.update(data);
    return product;
  },
  delete: async (id) => {
    const product = await models.Product.findByPk(id);
    if (!product) throw new Error("Product not found");
    await product.destroy();
    return true;
  },
};
```

### 3. Controller: `controllers/product.controller.js`
```javascript
import { productService } from "../services/product.service.js";

export const productController = {
  create: async (req, res) => {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({ message: "Tạo thành công", data: product });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getAll: async (req, res) => {
    res.json(await productService.getAll());
  },
  getById: async (req, res) => {
    const product = await productService.getById(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(product);
  },
  update: async (req, res) => {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json({ message: "Cập nhật thành công", data: product });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  delete: async (req, res) => {
    try {
      await productService.delete(req.params.id);
      res.json({ message: "Xóa thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
```

### 4. Validation: `middlewares/product.validation.js`
```javascript
export const validateProductCreate = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: "Tên sản phẩm không được để trống" });
  }
  if (!price || isNaN(price) || price <= 0) {
    return res.status(400).json({ message: "Giá sản phẩm không hợp lệ" });
  }
  next();
};

export const validateProductUpdate = (req, res, next) => {
  const { name, price } = req.body;
  if (name !== undefined && name.trim().length === 0) {
    return res.status(400).json({ message: "Tên sản phẩm không hợp lệ" });
  }
  if (price !== undefined && (isNaN(price) || price <= 0)) {
    return res.status(400).json({ message: "Giá sản phẩm không hợp lệ" });
  }
  next();
};
```

### 5. Routes: `routes/product.routes.js`
```javascript
import express from "express";
import { productController } from "../controllers/product.controller.js";
import {
  validateProductCreate,
  validateProductUpdate
} from "../middlewares/product.validation.js";

const router = express.Router();

router.post("/", validateProductCreate, productController.create);
router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.put("/:id", validateProductUpdate, productController.update);
router.delete("/:id", productController.delete);

export default router;
```

### 6. Đăng ký trong `app.js`
```javascript
import productRoutes from "./routes/product.routes.js";
// ...
app.use("/api/products", productRoutes);
```

### 7. Đăng ký Model trong `models/index.js`
```javascript
import ProductFactory from "./product.model.js";
// ...
models.Product = ProductFactory(sequelize);
```

---

## 🎯 CÁC API ENDPOINTS SẼ CÓ

Sau khi hoàn thành, bạn sẽ có các endpoints:

- `POST /api/products` - Tạo sản phẩm mới
- `GET /api/products` - Lấy tất cả sản phẩm
- `GET /api/products/:id` - Lấy sản phẩm theo ID
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. **File Upload (Multer)**
Nếu API cần upload file, sử dụng multer:

```javascript
import multer from "multer";
const upload = multer({ dest: "uploads/" });

// Trong routes
router.post(
  "/", 
  upload.single("image"),  // Tên field trong form-data
  validateProductCreate,
  productController.create
);

// Trong controller, file sẽ có trong req.file
console.log(req.file); // { fieldname, originalname, filename, path, ... }
```

### 2. **Relationships (Associations)**
Khi có relationships giữa các models:

```javascript
// Trong model
Product.associate = (models) => {
  Product.belongsTo(models.Category, { foreignKey: "category_id" });
};

// Trong service, include khi query
getAll: async () => {
  return await models.Product.findAll({
    include: [{ model: models.Category }]
  });
}
```

### 3. **Custom Endpoints**
Để tạo endpoint tùy chỉnh (không phải CRUD chuẩn):

```javascript
// Trong service
search: async (keyword) => {
  return await models.Product.findAll({
    where: {
      name: { [Op.like]: `%${keyword}%` }
    }
  });
}

// Trong controller
search: async (req, res) => {
  const products = await productService.search(req.query.keyword);
  res.json(products);
}

// Trong routes (đặt TRƯỚC /:id)
router.get("/search", productController.search);
router.get("/:id", productController.getById);
```

### 4. **Error Handling**
Luôn xử lý lỗi đúng cách:

```javascript
// Service: Throw error với message rõ ràng
if (!product) throw new Error("Product not found");

// Controller: Bắt và trả về status code phù hợp
catch (err) {
  res.status(400).json({ message: err.message });
}
```

### 5. **Cập nhật API Documentation**
Sau khi tạo API mới, nhớ cập nhật file `API_DOCUMENTATION.md` với thông tin về API mới.

---

## 🔍 DEBUGGING

Nếu gặp lỗi, kiểm tra:

1. **Model chưa được đăng ký?** → Kiểm tra `models/index.js`
2. **Route không hoạt động?** → Kiểm tra `app.js` đã import và đăng ký chưa
3. **Validation fail?** → Kiểm tra middleware validation
4. **Database error?** → Kiểm tra model schema và database connection
5. **404 Not Found?** → Kiểm tra URL và HTTP method

---

## 📚 TÀI LIỆU THAM KHẢO

- Xem các API hiện có để học pattern:
  - `controllers/newsArticle.controller.js`
  - `services/newsArticle.service.js`
  - `routes/newsArticle.routes.js`
  - `models/newsArticle.model.js`

- Sequelize Documentation: https://sequelize.org/docs/v6/

---

**Chúc bạn code vui vẻ! 🚀**
