function loadBill() {

  // 👤 GET USER FROM LOCAL STORAGE
  let user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    document.getElementById("custName").innerText = user.name;
    document.getElementById("custEmail").innerText = user.email;
  }

  fetch("http://localhost:3000/cart")
    .then(res => res.json())
    .then(cart => {

      let billTable = document.getElementById("billTable");
      billTable.innerHTML = "";

      let grandTotal = 0;

      cart.forEach(item => {

        let qty = item.quantity || 1;
        let total = item.price * qty;

        grandTotal += total;

        billTable.innerHTML += `
          <tr>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>${qty}</td>
            <td>₹${total}</td>
          </tr>
        `;
      });

      document.getElementById("grandTotal").innerText = grandTotal;
    });
}

function placeOrder() {
  fetch("http://localhost:3000/cart")
    .then(res => res.json())
    .then(cart => {

      return Promise.all(
        cart.map(item =>
          fetch(`http://localhost:3000/cart/${item.id}`, {
            method: "DELETE"
          })
        )
      );
    })
    .then(() => {
      alert("🎉 Order Placed Successfully!");
      window.location.href = "menu.html";
    });
}

// 📄 DOWNLOAD PDF FUNCTION
function downloadPDF() {
  let element = document.getElementById("billContent");

  let opt = {
    margin: 0.5,
    filename: 'Coffee_Bill.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}

window.onload = loadBill;