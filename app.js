const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});

const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

const productsList = document.querySelector('.container-items');

let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');

const countProducts = document.querySelector('#contador-productos');

const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

productsList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-add-cart')) {
        const product = e.target.parentElement;

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h2').textContent,
            price: product.querySelector('p').textContent,
        };

        const exists = allProducts.findIndex((prod) => prod.title === infoProduct.title);

        if (exists !== -1) {
            allProducts[exists].quantity++;
            Toastify({
                text: `¡Se agregó un ${infoProduct.title} más al carrito!`,
                duration: 5000,
                close: true,
                gravity: 'bottom',
                backgroundColor: 'linear-gradient(to right, #263143)',
            }).showToast();
        } else {
            allProducts.push(infoProduct);
            Toastify({
                text: `¡Se agregó ${infoProduct.title} al carrito!`,
                duration: 5000,
                close: true,
                gravity: 'bottom',
                backgroundColor: 'linear-gradient(to right, #263143)',
            }).showToast();
        }

        showHTML();

        try {
            await saveProductsLocally();
        } catch (error) {
            console.error('Error saving products locally:', error);
        }
    }
});

rowProduct.addEventListener('click', async (e) => {
    if (e.target.classList.contains('icon-close')) {
        const product = e.target.parentElement;
        const title = product.querySelector('p').textContent;

        allProducts = allProducts.filter((prod) => prod.title !== title);

        showHTML();

        try {
            await saveProductsLocally();
        } catch (error) {
            console.error('Error saving products locally:', error);
        }
    }
});

const showHTML = () => {
    if (!allProducts.length) {
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }

    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach((product) => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;

        rowProduct.append(containerProduct);

        total += parseInt(product.quantity * product.price.slice(1));
        totalOfProducts += product.quantity;
    });

    valorTotal.innerText = `$${total}`;
    countProducts.innerText = totalOfProducts;
};

const saveProductsLocally = async () => {
    try {
        localStorage.setItem('products', JSON.stringify(allProducts));
    } catch (error) {
        throw new Error('Error saving products to local storage');
    }
};

window.addEventListener('load', async () => {
    try {
        const storedProducts = JSON.parse(localStorage.getItem('products'));
        if (storedProducts) {
            allProducts = storedProducts;
            showHTML();
        }
    } catch (error) {
        console.error('Error during initial setup:', error);
    }
});