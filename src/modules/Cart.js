export class CartManager {
    addToCart(addToCart, increment) {
        const addCartHandler = () => {
            /* for more understanding of this refer classes to the css */
            addToCart.classList.add('add-cart-inactive')
            increment.classList.add('increment-active')
        }
        addToCart.addEventListener('click', addCartHandler);
    }
    increment(countBtn, countElement) {
        let counter;
        // counter logic
        const setCounter = (count) => {
            counter = count;
            countElement.textContent = `${counter}`;
        }
        // event delegation to target both the increment and decrement btn
        countBtn.addEventListener('click', (e) => {
            if (e.target.classList.contains('decrement')) {
                // only decrease when the number is greater than 1
                if (counter > 1) {
                    setCounter(counter - 1)
                }
            }
            
            if (e.target.classList.contains('increment')) {
                setCounter(counter + 1);
            }
        })
        setCounter(parseFloat(countElement.textContent));
    }
}