export class Storage {
    getStorage() {
        const storeData = localStorage.getItem('cart');
        return storeData ? JSON.parse(storeData) : [];
    }
    saveToStorage(data) {
        localStorage.setItem('cart', JSON.stringify(data));
    }
}