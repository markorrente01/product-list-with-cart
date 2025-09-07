import { Storage } from "./Storage";
import { UseDebounce } from "./Debounce";
export class CartManager {
    constructor(productCard, addToCart, increment) {
        this.cartStorage = new Storage;
        this.cart = this.cartStorage.getStorage();
        this.productCardClass = productCard;
    }
    addToCart(addToCart, increment) {
        const addCartHandler = (event) => {
            /* for more understanding of this refer classes to the css */
            addToCart.classList.add('add-cart-inactive');
            increment.classList.add('increment-active');
            const infoSource = event.target.closest(this.productCardClass);
            const productId = infoSource.dataset.id;
            const productName = infoSource.dataset.name;
            const productPrice = parseFloat(infoSource.dataset.price).toFixed(2);
            const quantity = parseFloat(infoSource.dataset.increment);
            const obj = {
                id: productId,
                name: productName,
                price: productPrice,
                quantity
            }
            this.cart.push(obj);
            this.cartStorage.saveToStorage(this.cart)
        }
        addToCart.addEventListener('click', (e) => {
            addCartHandler(e);
        });
    }
    increment(countBtn, countElement) {
        const debounceSave = UseDebounce((id, count) => this.saveQuantity(id, count), 500);
        let counter;
        // counter logic
        const setCounter = (count) => {
            counter = count;
            countElement.textContent = `${counter}`;
        }
        // event delegation to target both the increment and decrement btn
        countBtn.addEventListener('click', (e) => {
            const productId = e.target.closest(this.productCardClass).dataset.id;
            if (e.target.classList.contains('decrement')) {
                // only decrease when the number is greater than 1
                if (counter > 1) {
                    setCounter(counter - 1);
                    debounceSave(productId, counter);
                }
            }
            
            if (e.target.classList.contains('increment')) {
                setCounter(counter + 1);
                debounceSave(productId, counter);
            }
        })
        setCounter(parseFloat(countElement.textContent));
    }
    saveQuantity(productId, counter) {
        const allCart = this.cart;
        const targetedClick = allCart.find(product => product.id === productId)
        if(targetedClick) {
            targetedClick.quantity = counter;
            this.cartStorage.saveToStorage(allCart);
        }

    }
    // updateElementStateFromCart(txt, productCard) {
    //     const allCart = this.cart;
    //     const text = `${txt}`;
    //     const hasMatch = allCart.find(item => item.name === text);
    //     if (hasMatch) {
    //         productCard.querySelector('.product-card-cart').classList.add('add-cart-inactive');
    //         productCard.querySelector('.product-increment').classList.add('increment-active');
    //         // productCard.querySelector('.product-increment').textContent = `${hasMatch.quantity}`;
    //     }
    //     console.log(`${hasMatch.quantity}`)
    //     return;
    // }
    updateElementStateFromCart(txt, cartEl, qtyEl, value) {
        const allCart = this.cart;
        const text = txt;
        const hasMatch = allCart.find(item => item.name === text);
        if (hasMatch) {
            cartEl.classList.add('add-cart-inactive');
            qtyEl.classList.add('increment-active');
            value.textContent = `${hasMatch.quantity}`;
        }
    }
}