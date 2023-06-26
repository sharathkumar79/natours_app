import { login } from './login.js';
import { logout } from './login';

import { updateUser } from './updateUser';

const form = document.querySelector('.form');
const logotBtn = document.querySelector('.nav__el--logout');
const settingBtn = document.querySelector('.setting');
const passwordBtn = document.querySelector('.password');

if (form)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    console.log(email, password);
    login(email, password);
  });

if (logotBtn)
  logotBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });

if (settingBtn)
  settingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const photo = document.getElementById('photo').files[0];
    console.log(email, name, photo,  document.getElementById('photo').value);
    updateUser(email, name, photo);
  });
