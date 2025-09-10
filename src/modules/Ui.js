import { getData } from "./Data.js";
import { CartManager } from "./Cart.js";
import { Storage } from "./Storage.js";
import { UseDebounce } from "./Debounce.js";
const data = await getData();
const cartHandler = new CartManager('.product-card');
export class RenderUi {
    constructor(container) {
        this.productsContainer = container;
        this.cartManager = cartHandler;
        this.cartStorage = new Storage();
    };
    addToCart(addToCart, increment) {
        const addCartHandler = (event) => {
            /* for more understanding of this refer classes to the css */
            addToCart.classList.add('add-cart-inactive');
            increment.classList.add('increment-active');
            const infoSource = event.target.closest('.product-card');
            const productId = infoSource.dataset.id;
            const productName = infoSource.dataset.name;
            const productPrice = parseFloat(infoSource.dataset.price).toFixed(2);
            const quantity = parseFloat(infoSource.dataset.increment);
            const subtotal = parseFloat(productPrice).toFixed(2);
            const thumbnail = infoSource.dataset.thumbnail;
            const obj = {
                id: productId,
                name: productName,
                price: productPrice,
                quantity,
                subtotal,
                thumbnail
            }
            const LsData = this.cartStorage.getStorage();
            LsData.push(obj);
            this.cartStorage.saveToStorage(LsData)
        }
        addToCart.addEventListener('click', (e) => {
            addCartHandler(e);
            this.renderFullCartState();
        });
    }
    increment(countBtn, countElement) {
        const debounceSave = UseDebounce((id, count) => this.saveQuantity(id, count), 400);
        const debounceRender = UseDebounce(()=> this.renderFullCartState(), 450);
        let counter;
        // counter logic
        const setCounter = (count) => {
            counter = count;
            countElement.textContent = `${counter}`;
        }
        // event delegation to target both the increment and decrement btn
        countBtn.addEventListener('click', (e) => {
            const productId = e.target.closest('.product-card').dataset.id;
            if (e.target.classList.contains('decrement')) {
                // only decrease when the number is greater than 1
                if (counter > 1) {
                    setCounter(counter - 1);
                    debounceSave(productId, counter);
                    debounceRender();
                }
            }
            
            if (e.target.classList.contains('increment')) {
                setCounter(counter + 1);
                debounceSave(productId, counter);
                debounceRender();
            }
        })
        setCounter(parseFloat(countElement.textContent));
    }
    saveQuantity(productId, counter) {
        const allCart = this.cartStorage.getStorage();
        const targetedClick = allCart.find(product => product.id === productId);
        if(targetedClick) {
            targetedClick.quantity = counter;
            targetedClick.subtotal = parseFloat(targetedClick.quantity * targetedClick.price).toFixed(2)
            this.cartStorage.saveToStorage(allCart);
        };
        /* this functions simply handles updating the quantity and subtotal on every change */
    };
    createCard(product, id) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.name = product.name;
        productCard.dataset.price = product.price;
        productCard.dataset.id = id;
        productCard.dataset.thumbnail = product.image.thumbnail
            productCard.innerHTML = `
            <div class="product-card-img">
                    <picture>
                    <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
                    <source media="(min-width: 768px)" srcset="${product.image.tablet}">
                    <img src="${product.image.mobile}" alt="${product.category}">
                    </picture>

                    <div class="product-card-cart">
                    <div class="cart"><img src="/icons/icon-add-to-cart.svg" alt="cart-icon"></div>
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
        productCard.dataset.increment = productCard.querySelector('.increment-value').textContent;
        const addCartBtn = productCard.querySelector('.product-card-cart');
        const qtyBtn = productCard.querySelector('.product-increment');
        this.addToCart(addCartBtn, qtyBtn);
        cartHandler.updateElementStateFromCart(
            product.name,
            addCartBtn,
            qtyBtn,
            productCard.querySelector('.increment-value')
        );
        this.increment(
            productCard.querySelector('.product-increment'),
            productCard.querySelector('.increment-value')
        )
        return productCard;
    };
    createCartItems(cartProduct) {
        const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                 <!-- starting div of each item on the cart-content -->
                    <div class="cart-item-info">
                    <p class="cart-item-title">${cartProduct.name}</p>
                    <div class="price-container">
                        <p class="price-times">${cartProduct.quantity}x</p>
                        <p class="item-price">@ $${cartProduct.price}</p>
                        <p class="total-price">$${cartProduct.subtotal}</p>
                    </div>
                    </div>
                    <svg class="remove" xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" fill="#CAAFA7" viewBox="0 0 10 10">
                    <path class="remove" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
                    </svg>
                <!----------------------------------->
                `
                cartItem.querySelector('.remove').addEventListener('click', (e)=>{
                    cartHandler.handleRemoveFromCart(cartProduct.id);
                    const productCard = document.querySelector(`.product-card[data-name="${cartProduct.name}"]`);
                    if (productCard) {
                        this.cartManager.resetElementState(
                            cartProduct.name,
                            productCard.querySelector('.product-card-cart'),
                            productCard.querySelector('.product-increment'),
                            productCard.querySelector('.increment-value')
                        )
                    }
                    this.renderFullCartState();
                })
                return cartItem;
    };
    renderFullCartState() {
        const cartContainer = document.querySelector('.cart-container');
        const cartData = this.cartStorage.getStorage();

        // logic to get the total quantity and total amount of the cart items
        //total quantity
        const totalQtyArr = cartData.map(item => item.quantity);
        const totalQty = totalQtyArr.reduce((acc, qty)=> acc + qty, 0);
        //total amount
         const totalArr = cartData.map(item => item.subtotal);
        const total = totalArr.reduce((acc, subtotal)=> acc + parseFloat(subtotal), 0);
        //
        cartContainer.innerHTML = `
            <h2 class="cart-header">Your Cart (${totalQty})</h2>
            <div class="cart-content"></div>
            <div class="cart-total">
                <p>Order Total</p>
                <span>$${parseFloat(total).toFixed(2)}</span>
            </div>
            <div class="delivery-message">
                <img src="/icons/icon-carbon-neutral.svg" alt="green plant">
                <span>This is a <b>carbon-neutral</b> delivery</span>
            </div>
          <button class="confirm-cart-order" id="confirmOrder">Confirm Order</button>
        `
        cartData.reverse().forEach((cartItem) => {
            const container = cartContainer.querySelector('.cart-content');
            container.appendChild(this.createCartItems(cartItem));
        });
        return cartContainer;
    }
    render() {
        this.productsContainer.innerHTML = '';
        data.forEach((product, index) => {
            this.productsContainer.appendChild(this.createCard(product, index))
        });
    };
}