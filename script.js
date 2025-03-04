// Selecting elements
const btns = document.querySelectorAll(".cart-btn"); // "Add to Cart" buttons
const itemContainer = document.querySelector(".cart-items-list"); // Cart items list container
const new_itemContainer = document.querySelector(".item_new_container");
const initial = document.querySelector(".initial"); // Initial cart state
const itemsNo = document.querySelector(".cart-items-no"); // Number of items in cart
const totalMoney = document.querySelector(".Total_money"); // Total cost display
const quantityBtns = document.querySelectorAll(".sec"); // Quantity adjustment buttons
const decrementBtns = document.querySelectorAll(".sec img:first-of-type"); // "-" buttons
const incrementBtns = document.querySelectorAll(".sec img:last-of-type"); // "+" buttons
const confirm = document.querySelector(".confirmation");
const confirmation = confirm.addEventListener("click", place_order);
const start_new_order = document.querySelector(".new_btn");
let itemCount = 0; // Counter for the number of items in the cart
let initialCopy = initial; // Keep a copy of the initial empty state
let arr_index = 0;
let total_cost = 0;
//to store the initially added items in a list
let stored_items = [];

// Add event listeners for "Add to Cart" buttons
btns.forEach((button) => {
  button.addEventListener("click", addItemToCart);
});
// Add event listeners for increment and decrement buttons
decrementBtns.forEach((button) => {
  button.addEventListener("click", decrementItem);
});
incrementBtns.forEach((button) => {
  button.addEventListener("click", incrementItem);
});

start_new_order.addEventListener("click", disappear);
function disappear(e) {
  console.log("hi");
  e.target.parentElement.classList.add("disable");
}
// incrementBtns.forEach((button) => {
//   button.addEventListener("click", (e) => {
//     incrementItem(e);
//     (() => {
//       const quantityElement = document.getElementById("item@1");
//       quantityElement.textContent =
//         parseInt(quantityElement.textContent) + 1 + "x";
//     })();
//   });
// });

// Function to decrease item quantity
function decrementItem(e) {
  // Get the quantity element next to the clicked button
  let quantityElement = e.target.nextElementSibling;

  // Ensure the quantity doesn't go below 0
  if (parseInt(quantityElement.textContent) <= 0) {
    return; // Exit if quantity is already 0 or less
  }

  // Find the product details in the cart
  let product = e.target.closest(".cart").querySelector(".cart-about");
  let itemName = product.querySelector(".cart-head").textContent;
  let itemCost = parseFloat(
    product.querySelector(".card-cost span").textContent
  ); // Extract numeric value

  // Find the corresponding item in the cart list
  let cartItems = document.querySelectorAll(".item");
  cartItems.forEach((item) => {
    let cartItemName = item.querySelector(".item-names span").textContent;

    // Check if the current cart item matches the product being decremented
    if (cartItemName === itemName) {
      let quantitySpan = item.querySelector(".span-ele span:first-of-type");
      let totalPriceSpan = item.querySelector(".span-ele span:last-of-type");

      let quantity = parseInt(quantitySpan.textContent);

      // Ensure the quantity is greater than 0 before decrementing
      if (quantity > 0) {
        // Update the zIndex of parent elements if quantity is 1 (last item)
        if (quantity === 1) {
          let parent = e.target.parentElement;
          parent.style.zIndex = 0;
          let parentSibling = e.target.parentElement.previousElementSibling;
          parentSibling.style.zIndex = 1;
        }

        // Decrement the quantity in the product card
        quantityElement.textContent = parseInt(quantityElement.textContent) - 1;

        // Update the quantity and total price in the cart item
        quantitySpan.textContent = `${quantity - 1}x`;
        totalPriceSpan.textContent = `$${(itemCost * (quantity - 1)).toFixed(
          2
        )}`;

        // Update the total cart price
        updateTotalMoney(-itemCost);

        // If the quantity reaches 0, remove the item from the cart
        if (quantity - 1 === 0) {
          item.classList.add("blink-animation");
          item.remove();
          itemCount--;
          itemsNo.innerHTML = itemCount;

          // If no items are left in the cart, reset the cart UI
          if (itemCount === 0) {
            itemContainer.removeEventListener("click", removeItemFromCart);
            initial = initialCopy; // Reset the cart to its initial state
          }
        }
      }
    }
  });
}

// Function to increase item quantity
function incrementItem(e) {
  let quantityElement = e.target.previousElementSibling;
  if (quantityElement) {
    quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
  }

  // Find the product details
  let product = e.target.closest(".cart").querySelector(".cart-about");
  let itemName = product.querySelector(".cart-head").textContent;
  let itemCost = parseFloat(
    product.querySelector(".card-cost span").textContent
  );

  // Find the corresponding item in the cart and update its quantity and total cost
  let cartItems = document.querySelectorAll(".item");
  cartItems.forEach((item) => {
    let cartItemName = item.querySelector(".item-names span").textContent;
    if (cartItemName === itemName) {
      let quantitySpan = item.querySelector(".span-ele span:first-of-type");
      let totalPriceSpan = item.querySelector(".span-ele span:last-of-type");

      let quantity = parseInt(quantitySpan.textContent);
      quantitySpan.textContent = `${quantity + 1}x`;
      totalPriceSpan.textContent = `$${(itemCost * (quantity + 1)).toFixed(2)}`;

      // Update the total money in the cart
      updateTotalMoney(itemCost);
    }
  });
}
function place_order(e) {
  let order_ele = e.target.parentElement.nextElementSibling;
  console.log(order_ele.classList.remove("disable"));
  // order_ele.classList.remove("disable");
  order_ele.style.zIndex = 100;
  const cartItems = document.querySelectorAll(".item"); // Get all items in the cart
  const orderPlacedContainer = document.querySelector(".order_placed"); // Order confirmation container
  const itemNewContainer = document.querySelector(".item_new_container"); // Container for confirmed items
  const total_pay = document.querySelector(".Total_money").textContent;
  const section_total = document.querySelector(".Total_Money");
  console.log((section_total.textContent = total_pay));
  e.target.addEventListener("click", place_order);
  // Clear any existing confirmed items
  itemNewContainer.innerHTML = "";
  let total_cost = 0;
  // Loop through each item in the cart
  cartItems.forEach((item) => {
    // Extract item details
    const cartItemName = item.querySelector(".item-names span").textContent; // Item name
    const quantitySpan = item.querySelector(
      ".span-ele span:first-of-type"
    ).textContent; // Quantity
    const totalPriceSpan = item.querySelector(
      ".span-ele span:last-of-type"
    ).textContent; // Total price

    // Create the DOM structure for the confirmed item
    const itemSection = document.createElement("div");
    itemSection.classList.add("item_section");

    // Section 1: Image and item info
    const section1 = document.createElement("div");
    section1.classList.add("section_1");

    const itemImg = document.createElement("div");
    itemImg.classList.add("item-img");
    const img = document.createElement("img");
    img.src = "/Test/assets/images/image-baklava-desktop.jpg"; // Replace with dynamic image source if available
    img.alt = cartItemName;
    itemImg.appendChild(img);

    const itemInfo = document.createElement("div");
    itemInfo.classList.add("item_info");

    const itemName = document.createElement("div");
    itemName.classList.add("item-name");
    itemName.textContent = cartItemName;

    const spanSection = document.createElement("div");
    spanSection.classList.add("span-section");

    const span1 = document.createElement("span");
    span1.textContent = quantitySpan;

    const span2 = document.createElement("span");
    span2.textContent = `@${totalPriceSpan}`;

    spanSection.appendChild(span1);
    spanSection.appendChild(span2);
    itemInfo.appendChild(itemName);
    itemInfo.appendChild(spanSection);
    section1.appendChild(itemImg);
    section1.appendChild(itemInfo);

    // Section 2: Total price
    const section2 = document.createElement("div");
    section2.classList.add("section_2");

    const h3 = document.createElement("h3");
    h3.textContent = totalPriceSpan;

    section2.appendChild(h3);

    // Append sections to the item container
    itemSection.appendChild(section1);
    itemSection.appendChild(section2);

    // Append the item to the confirmed items container
    itemNewContainer.appendChild(itemSection);
  });
  // Show the order confirmation section
  // orderPlacedContainer.classList.remove("disabled");
  orderPlacedContainer.style.zIndex = 12;
}
// Function to add an item to the cart
function addItemToCart(e) {
  itemCount++;

  let img = e.target.parentElement.parentElement.querySelector(".cart-img");
  // Find the parent button and related product info
  let parent = e.target.closest("button"); // Get the closest button
  if (!parent) return; // If no button found, exit function

  parent.style.zIndex = 0;
  updateItemZIndex(parent);

  let product = parent.previousElementSibling; // Product details
  if (!product) return; // If product not found, exit function

  let itemName = product.querySelector(".cart-head")?.textContent;
  let itemCost = product.querySelector(".card-cost")?.textContent;
  console.log(itemName, itemCost);
  stored_items[arr_index++] = {
    name: itemName,
    cost: itemCost,
  };
  console.log(stored_items);
  addCartItem(itemName, itemCost, img);

  // Remove initial message if this is the first item added
  if (itemCount === 1) {
    initial.remove();
    itemContainer.addEventListener("click", removeItemFromCart);
  }

  // Update cart count and total money
  itemsNo.innerHTML = itemCount;
  updateTotalMoney(parseFloat(itemCost.slice(1)));
}

// Function to remove an item from the cart
function removeItemFromCart(e) {
  if (e.target.tagName !== "BUTTON") return; // Ensure it's a remove button

  itemCount--;
  let priceElement = e.target.previousElementSibling.querySelector(".span-ele");
  let itemPrice = parseFloat(
    priceElement.querySelectorAll("span")[1].textContent.slice(1)
  );

  updateTotalMoney(-itemPrice); // Deduct from total
  e.target.parentElement.remove(); // Remove item from cart

  itemsNo.innerHTML = itemCount;

  // Restore initial message if cart is empty
  if (itemCount === 0) {
    itemContainer.appendChild(initialCopy);
    itemContainer.removeEventListener("click", removeItemFromCart);
    initial = initialCopy;
  }
}

// Function to update total money in cart
function updateTotalMoney(amount) {
  let currentTotal = parseFloat(totalMoney.innerHTML.slice(1));
  totalMoney.innerHTML = `$${(currentTotal + amount).toFixed(2)}`;
}

// Function to update z-index of an element (likely to control button layering)
function updateItemZIndex(parent) {
  let nextSibling = parent.nextElementSibling;
  let quantityText = nextSibling.querySelector(".btn-text");
  quantityText.textContent = 1; // Reset quantity to 1
}

// Function to add a new item to the cart display
function addCartItem(itemName, itemCost, img_src) {
  // Create main item container
  let item = document.createElement("div");
  item.classList.add("item");

  // Create item name and pricing section
  let itemHead = document.createElement("div");
  itemHead.classList.add("item-names");

  let nameSpan = document.createElement("span");
  nameSpan.textContent = itemName;
  let priceContainer = document.createElement("div");
  priceContainer.classList.add("span-ele");

  let quantitySpan = document.createElement("span");
  quantitySpan.setAttribute("id", "item@");
  quantitySpan.textContent = "1x";

  let unitPriceSpan = document.createElement("span");
  unitPriceSpan.textContent = itemCost;

  let totalPriceSpan = document.createElement("span");
  totalPriceSpan.textContent = itemCost;

  priceContainer.append(quantitySpan, unitPriceSpan, totalPriceSpan);
  itemHead.append(nameSpan, priceContainer);

  // Create remove button
  let removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-img");

  let removeImg = document.createElement("img");
  removeImg.src = "/Test/assets/images/icon-remove-item.svg";
  removeImg.alt = "Remove item";

  removeBtn.appendChild(removeImg);
  item.append(itemHead, removeBtn);
  // Append the new item to the cart
  itemContainer.appendChild(item);

  //dom elements for order_placed items
  // let item_section = document.createElement("div");
  // item_section.classList.add("item_section");
  // item_section.appendChild(section_1);
  // item_section.appendChild(section_2);
  // let section_1 = document.createElement("div");
  // section_1.classList.add("section_1");
  // section_1.appendChild(img);
  // section_1.appendChild(item_info);
  // let img = document.createElement("div");
  // img.classList.add("item-img");
  // img.src = img_src;
  // let item_info = document.createElement("div");
  // item_info.classList.add("item_info");
  // item_info.appendChild(item_name);
  // item_info.appendChild(span_section);
  // let item_name = document.createElement("div");
  // item_name.classList.add("item-name");
  // item_name.innerHTML = itemName;
  // let span_section = document.createElement("div");
  // span_section.classList.add("span-section");
  // span_section.appendChild(span);
  // let span = document.createElement("span");
  // let section_2 = document.createElement("div");
  // let h_3 = document.createElement("h3");
  // section_2.appendChild(h_3);
}
