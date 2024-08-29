document.addEventListener('DOMContentLoaded', function () {
    getProducts();
});

function getProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            let productTableBody = document.querySelector('#product-list tbody');
            productTableBody.innerHTML = ''; // Limpiar la tabla antes de insertar los productos

            data.forEach(product => {
                let row = `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.price}</td>
                        <td>${product.quantity}</td>
                        <td>
                            <input type="number" min="1" value="0" id="order-quantity-${product.id}">
                        </td>
                        <td>
                            <button class="btn btn-primary" onclick="editProduct(${product.id})">Edit</button>
                            <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                        </td>
                    </tr>
                `;
                productTableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

function createProduct() {
    let name = document.getElementById('name').value;
    let price = document.getElementById('price').value;
    let quantity = document.getElementById('quantity').value;

    let product = {
        name: name,
        price: parseFloat(price),
        quantity: parseInt(quantity)
    };

    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Product created successfully') {
            getProducts(); // Recargar la lista de productos
        } else {
            console.error('Error creating product:', data.message);
        }
    })
    .catch(error => console.error('Error creating product:', error));
}

function editProduct(productId) {
    // Aquí puedes implementar la lógica para editar un producto.
    console.log(`Editing product with ID: ${productId}`);
}

function deleteProduct(productId) {
    fetch(`/api/products/${productId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Product deleted successfully') {
            getProducts(); // Recargar la lista de productos
        } else {
            console.error('Error deleting product:', data.message);
        }
    })
    .catch(error => console.error('Error deleting product:', error));
}

function orderProducts() {
    let productsToOrder = [];
    let rows = document.querySelectorAll('#product-list tbody tr');

    rows.forEach(row => {
        let productId = row.children[0].textContent;
        let orderQuantity = document.getElementById(`order-quantity-${productId}`).value;

        if (parseInt(orderQuantity) > 0) {
            productsToOrder.push({
                product_id: parseInt(productId),
                quantity: parseInt(orderQuantity)
            });
        }
    });

    if (productsToOrder.length > 0) {
        fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ products: productsToOrder }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Orden creada exitosamente') {
                getProducts(); // Recargar la lista de productos para reflejar las cantidades actualizadas
            } else {
                console.error('Error creating order:', data.message);
            }
        })
        .catch(error => console.error('Error creating order:', error));
    } else {
        console.log('No products selected for ordering.');
    }
}
