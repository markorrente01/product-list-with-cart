import { Storage } from "./Storage";
import { UseDebounce } from "./Debounce";
export class CartManager {
    constructor() {
        this.cartStorage = new Storage;
    }
    updateElementStateFromCart(txt, cartEl, qtyEl, value) {
        const allCart = this.cartStorage.getStorage();
        const text = txt;
        const hasMatch = allCart.find(item => item.name === text);
        if (hasMatch) {
            cartEl.classList.add('add-cart-inactive');
            qtyEl.classList.add('increment-active');
            value.textContent = `${hasMatch.quantity}`;
        }
    };
    resetElementState(productName, cartEl, qtyEl, value) {
        const allCart = this.cartStorage.getStorage();
        const hasMatch = allCart.find(item => item.name === productName);
        if (!hasMatch) {
            cartEl.classList.remove('add-cart-inactive');
            qtyEl.classList.remove('increment-active');
            value.textContent = '1';
        }
    }
    handleRemoveFromCart(productId) {
        let allCart = this.cartStorage.getStorage().filter(product=>product.id !== productId);
        this.cartStorage.saveToStorage(allCart);
    };
    handleConfirmOrder(el, modalEl) {
        if (el) {
            el.addEventListener('click', (e)=>{
                e.preventDefault();
                modalEl.classList.add('is-open');
            })
        } else{
            modalEl.classList.remove('is-open');
        }
    };
    handleCloseModal(el) {
        el.addEventListener('click', ()=>{
            el.classList.remove('is-open');
            localStorage.clear();
        });
    };
}