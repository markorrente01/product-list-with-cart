document.getElementById('confirmOrder').addEventListener('click', ()=>{
    document.querySelector('.modal').classList.add('is-open')
})
document.getElementById('startNewOrder').addEventListener('click', ()=>{
    document.querySelector('.modal').classList.remove('is-open')
})