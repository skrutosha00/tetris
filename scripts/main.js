if (!localStorage.getItem('best_t3')) {
    localStorage.setItem('best_t3', 0)
}

document.querySelector('.best').innerHTML = localStorage.getItem('best_t3')

window.onload = () => {
    document.querySelector('.wrapper').classList.remove('hidden')
}