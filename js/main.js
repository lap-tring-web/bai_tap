// ==========================================================
// MiniShop - main.js (Buổi 2)
// Nạp bằng <script src="js/main.js" defer></script> nên mã chạy
// sau khi trình duyệt đã đọc xong toàn bộ HTML.
// ==========================================================

// ===== 1. Hàm tiện ích =====

// Định dạng số thành tiền Việt: 250000 -> "250.000 đ"
function formatPrice(amount) {
  return amount.toLocaleString("vi-VN") + " đ";
}

// ===== 2. Giỏ hàng lưu tạm trong trình duyệt =====
// Giỏ hàng là một đối tượng: { "mã sản phẩm": số lượng }
// Ví dụ: { "1": 2, "4": 1 } nghĩa là 2 sản phẩm mã 1 và 1 sản phẩm mã 4.

const CART_KEY = "minishop_cart";

// Đọc giỏ hàng từ localStorage. Chưa có hoặc dữ liệu hỏng thì trả về giỏ rỗng.
function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY));
    return cart && typeof cart === "object" ? cart : {};
  } catch (error) {
    return {};
  }
}

// Ghi giỏ hàng xuống localStorage (localStorage chỉ lưu được chuỗi).
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Cập nhật con số trên thanh điều hướng = tổng số lượng mọi sản phẩm.
function updateCartCount() {
  const cart = getCart();
  let count = 0;
  for (const quantity of Object.values(cart)) {
    count += quantity;
  }

  const badge = document.querySelector("#cart-count");
  if (badge) {
    badge.textContent = count;
  }
}

function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  updateCartCount();
}

// Gắn sự kiện click cho mọi nút "Thêm vào giỏ"
document.querySelectorAll(".add-to-cart").forEach(function (button) {
  button.addEventListener("click", function () {
    addToCart(button.dataset.id);
  });
});

// Mỗi lần mở trang: hiện đúng số lượng đã lưu từ trước
updateCartCount();

// ===== 3. Trang giỏ hàng: tự tính thành tiền và tổng cộng =====
function updateCartTotals(table) {
  let total = 0;

  table.querySelectorAll("tbody tr").forEach(function (row) {
    const price = Number(row.dataset.price);
    const qty = Number(row.querySelector(".qty").value);
    const lineTotal = price * qty;

    row.querySelector(".line-total").textContent = formatPrice(lineTotal);
    total += lineTotal;
  });

  table.querySelector("#cart-total").textContent = formatPrice(total);
}

// Chỉ trang giỏ hàng mới có bảng này; các trang khác bỏ qua khối lệnh.
const cartTable = document.querySelector(".cart-table");
if (cartTable) {
  updateCartTotals(cartTable);

  // Sự kiện "input" lan lên phần tử cha, nên chỉ cần nghe một lần ở <table>.
  cartTable.addEventListener("input", function () {
    updateCartTotals(cartTable);
  });
}

// Bài tập về nhà 1 + 2: nút "Xóa giỏ hàng", có hỏi xác nhận trước khi xóa.
const clearButton = document.querySelector("#clear-cart");
if (clearButton) {
  clearButton.addEventListener("click", function () {
    if (confirm("Xóa toàn bộ giỏ hàng?")) {
      localStorage.removeItem(CART_KEY);
      updateCartCount();
    }
  });
}

// ===== 4. Form đăng ký: hai mật khẩu phải khớp nhau =====
const registerForm = document.querySelector("#register-form");
if (registerForm) {
  const password = document.querySelector("#password");
  const password2 = document.querySelector("#password2");
  const passwordError = document.querySelector("#password-error");

  registerForm.addEventListener("submit", function (event) {
    if (password.value !== password2.value) {
      event.preventDefault(); // hủy việc gửi form
      passwordError.textContent = "Hai mật khẩu không khớp nhau.";
      password2.focus();
    } else {
      passwordError.textContent = "";
    }
  });

  // Người dùng sửa lại ô nhập thì xóa thông báo lỗi cũ.
  password2.addEventListener("input", function () {
    passwordError.textContent = "";
  });
}

// ===== 5. Form liên hệ: nội dung tin nhắn tối thiểu 10 ký tự (bài tập về nhà 4) =====
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const message = document.querySelector("#message");
  const messageError = document.querySelector("#message-error");

  contactForm.addEventListener("submit", function (event) {
    // trim() bỏ khoảng trắng hai đầu để người dùng không "qua mặt" bằng dấu cách
    if (message.value.trim().length < 10) {
      event.preventDefault();
      messageError.textContent = "Nội dung cần có ít nhất 10 ký tự.";
      message.focus();
    } else {
      messageError.textContent = "";
    }
  });

  message.addEventListener("input", function () {
    messageError.textContent = "";
  });
}
