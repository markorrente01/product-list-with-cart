import { CartManager } from "./modules/Cart.js";
import { RenderUi } from "./modules/Ui.js";
import { getData } from "./modules/Data.js";
const data = await getData();
const ui = new RenderUi(document.querySelector('.products-container'))
ui.render();
ui.renderFullCartState();