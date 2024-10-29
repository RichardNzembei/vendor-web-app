<script setup>
import { ref, computed, onMounted } from "vue";

const fetchProductData = async () => {
  try {
    const response = await fetch("/products.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Error fetching product data:", error);
    message.value = "Error fetching product data. Please try again later.";
    return [];
  }
};

const products = ref([]);
const searchTerm = ref("");
const filteredProducts = computed(() => {
  const search = searchTerm.value.trim().toLowerCase();
  if (!search) return products.value;
  return products.value.filter((product) =>
    product.category.toLowerCase().includes(search)
  );
});
onMounted(async () => {
  products.value = await fetchProductData();
});
const addToCart = async (product) => {
  let existingCart;

  try {
    existingCart = JSON.parse(localStorage.getItem("productData"));
  } catch (error) {
    console.error("Error parsing product data:", error);
    existingCart = [];
  }

  if (!Array.isArray(existingCart)) {
    existingCart = [];
  }

  const existingProductIndex = existingCart.findIndex(
    (p) => p.id === product.id
  );

  if (existingProductIndex > -1) {
    existingCart[existingProductIndex].quantity += product.quantity;
  } else {
    existingCart.push({ ...product, quantity: product.quantity });
  }

  localStorage.setItem("productData", JSON.stringify(existingCart));

  console.log(`${product.name} added to cart`);
  product.quantity = 0;
};
</script>
<template>
  <div class="search">
    <input type="text" placeholder="search by category" v-model="searchTerm" />
  </div>

  <div class="card-container">
    <div class="card" v-for="product in filteredProducts" :key="product.id">
      <span :class="product.icon" class="icon"></span>
      <h3>{{ product.name }}</h3>
      <h4>Price: Ksh {{ product.price }}</h4>
      <div class="row">
        <div class="cell">
          <label><b>Quantity:</b></label>
        </div>
        <div class="cell">
          <input type="number" v-model.number="product.quantity" />
        </div>
      </div>
      <button @click="addToCart(product)" class="addToCart">Add to Cart</button>
    </div>
  </div>
</template>
<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.icon {
  width: 32px;
  height: 32px;
  background-size: cover;
  display: inline-block;
}

.card {
  border: 1px solid #1d3347;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(131, 104, 104, 0.1);
  padding: 16px;
  margin: 16px;
  max-width: 300px;
  text-align: center;
  background-color: antiquewhite;
}

.card h3 {
  margin: 16px 0;
  font-size: 1.25em;
  color: rgb(72, 21, 95);
}

.card .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}

.card .cell {
  flex: 1;
  display: flex;
  align-items: center;
}

.card input[type="number"] {
  width: 60px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.card .addToCart {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #39d1b8;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.card .addToCart:hover {
  background-color: #0056b3;
}

.search {
  text-align: center;
  margin-bottom: 20px;
}

.search input[type="text"] {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 200px;
  margin-right: 10px;
  margin: 5px;
}

.search button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background-color: #1f78bb;
  color: #080404;
  cursor: pointer;
}

.search button:hover {
  background-color: #646c74;
}
</style>