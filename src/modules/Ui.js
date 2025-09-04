import { getData } from "./Data.js";
import { CartManager } from "./Cart.js";
const data = await getData();
const cartHandler = new CartManager();
export class RenderUi {
    constructor(container) {
        this.productsContainer = container;
        this.cartManager = cartHandler;
    }
    createCard(product) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
            productCard.innerHTML = `
            <div class="product-card-img">
                    <picture>
                    <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
                    <source media="(min-width: 768px)" srcset="${product.image.tablet}">
                    <img src="${product.image.mobile}" alt="${product.category}">
                    </picture>

                    <div class="product-card-cart">
                    <div class="cart"><img src="/src/icons/icon-add-to-cart.svg" alt="cart-icon"></div>
                    <p class="cart-txt">Add to Cart</p>
                    </div>
                
                    <div class="product-increment">
                    <svg xmlns="http://www.w3.org/2000/svg" class="decrement" width="1.2rem" height="1.2rem" fill="hsl(20, 50%, 98%)" viewBox="0 0 10 2">
                        <path class="decrement" d="M0 .375h10v1.25H0V.375Z"/>
                    </svg>
                    <p class="increment-value">1</p>
                    <svg xmlns="http://www.w3.org/2000/svg" class="increment" width="1.2rem" height="1.2rem" fill="hsl(20, 50%, 98%)" viewBox="0 0 10 10">
                        <path class="increment" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
                    </svg>
                    </div>

                </div>
                <!-- -------------------------------------------------- -->
                <div class="product-info">
                    <p class="product-title">${product.category}</p>
                    <p class="product-subtitle">${product.name}</p>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    </div>
        `
        this.cartManager.addToCart
        (
        productCard.querySelector('.product-card-cart'), 
        productCard.querySelector('.product-increment')
        );
        this.cartManager.increment(
            productCard.querySelector('.product-increment'),
            productCard.querySelector('.increment-value')
        );
        return productCard;
    }
    render() {
        this.productsContainer.innerHTML = '';
        data.forEach(product => {
            this.productsContainer.appendChild(this.createCard(product))
        });
    }
    
}