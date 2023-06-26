export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
  };
  
export const showAlert = (status, msg) => {
    const ele = `<div class ="alert alert--${status}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', ele);
    window.setTimeout(hideAlert, 1000);
  };