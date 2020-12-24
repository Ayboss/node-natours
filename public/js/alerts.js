export const hideAlert = ()=>{
    const el = document.querySelector('.alert');
    if(el) el.parentElement.removeChild(el);
}

export const showAlert = (type, msg, time = 5)=>{
    hideAlert();
    const markup =`<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    //hide after after 5 secs
    window.setTimeout(hideAlert,time * 1000);
}
