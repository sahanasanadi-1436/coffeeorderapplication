let cart = JSON.parse(localStorage.getItem("cart")) || [];
function addToCart(name, price) {
  let user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    let confirmLogin = confirm("⚠️ Please login first to order!\nClick OK to go to login page.");

    if (confirmLogin) {
      window.location.href = "auth.html"; // 🔥 redirect to signup/login page
    }

    return; // stop further execution
  }


//if login 
  fetch("http://localhost:3000/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, price })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Saved:", data);
    alert("Item added to cart  ✅");
    updateCartCount();
  })
  .catch(err => console.error(err));

}

// function displayCart() {
//   fetch("http://localhost:3000/cart")
//     .then(res => res.json())
//     .then(cart => {

//       let cartItems = document.getElementById("cartTable");
//       if (!cartItems) return;

//       let total = 0;
//       cartItems.innerHTML = "";

//       cart.forEach((item) => {
//         total += item.price;

//         cartItems.innerHTML += `
//           <tr>
//             <td>${item.id}</td>
//             <td>${item.name}</td>
//             <td>₹${item.price}</td>
//             <td>
//               <button onclick="removeItem('${item.id}')">Remove</button>
//             </td>
//           </tr>
//         `;
//       });

//       document.getElementById("totalPrice").innerText = total;
//     });
// }

// function removeItem(id) {
//   fetch(`http://localhost:3000/cart/${id}`, {
//     method: "DELETE"
//   })
//   .then(() => {
//     displayCart();
//     updateCartCount();
//   })
//   .catch(err => console.log(err));
// }

// function clearCart() {
//   fetch("http://localhost:3000/cart")
//     .then(res => res.json())
//     .then(cart => {
//       // delete each item
//       let deletePromises = cart.map(item =>
//         fetch(`http://localhost:3000/cart/${item.id}`, {
//           method: "DELETE"
//         })
//       );

//       return Promise.all(deletePromises);
//     })
//     .then(() => {
//       updateCartCount(); // update UI
//       displayCart();     // refresh cart page
//     })
//     .catch(err => console.log(err));
// }

// function updateCartCount() {
//   fetch("http://localhost:3000/cart")
//     .then(res => res.json())
//     .then(cart => {
//       let el = document.getElementById("cartCount");
//       if (el) {
//         el.innerText = cart.length;
//       }
//     })
//     .catch(err => console.log(err));
// }

// window.onload = updateCartCount;
// window.onload = function () {
//   if (document.getElementById("cartTable")) {
//     displayCart();
//   }

//   updateCartCount();
// };

function displayCart() {
  fetch("http://localhost:3000/cart")
    .then(res => res.json())
    .then(cart => {

      let cartItems = document.getElementById("cartTable");
      if (!cartItems) return;

      let total = 0;
      cartItems.innerHTML = "";
      cart.forEach((item) => {

  let qty = item.quantity || 1;
  let itemTotal = item.price * qty;

  total += itemTotal;

  cartItems.innerHTML += `
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>₹${item.price}</td>

      <!-- 🔥 QUANTITY COLUMN -->
     <td>
  <button class="btn btn-sm btn-danger"
    onclick="decreaseQty('${item.id}', ${qty})">-</button>

  <span class="mx-2">${qty}</span>

  <button class="btn btn-sm btn-success"
    onclick="increaseQty('${item.id}', ${qty})">+</button>
</td>

      <td>₹${itemTotal}</td>

      <td>
        <button onclick="removeItem('${item.id}')">Remove</button>
      </td>
    </tr>
  `;
});

      document.getElementById("totalPrice").innerText = total;
    });
}
function increaseQty(id, qty) {
  fetch(`http://localhost:3000/cart/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity: qty + 1 })
  }).then(() => displayCart());
}

function decreaseQty(id, qty) {
  if (qty > 1) {
    fetch(`http://localhost:3000/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty - 1 })
    }).then(() => displayCart());
  }
}
function removeItem(id) {
  fetch(`http://localhost:3000/cart/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    displayCart();
    updateCartCount();
  })
  .catch(err => console.log(err));
}

function clearCart() {
  fetch("http://localhost:3000/cart")
    .then(res => res.json())
    .then(cart => {
      // delete each item
      let deletePromises = cart.map(item =>
        fetch(`http://localhost:3000/cart/${item.id}`, {
          method: "DELETE"
        })
      );

      return Promise.all(deletePromises);
    })
    .then(() => {
      updateCartCount(); // update UI
      displayCart();     // refresh cart page
    })
    .catch(err => console.log(err));
}

function updateCartCount() {
  fetch("http://localhost:3000/cart")
    .then(res => res.json())
    .then(cart => {
      let el = document.getElementById("cartCount");
      if (el) {
        el.innerText = cart.length;
      }
    })
    .catch(err => console.log(err));
}

window.onload = updateCartCount;
window.onload = function () {
  if (document.getElementById("cartTable")) {
    displayCart();
  }

  updateCartCount();
};
