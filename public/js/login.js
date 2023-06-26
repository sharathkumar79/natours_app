import { showAlert } from './alert.js';

export const login = async (email, password) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    email,
    password,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      'http://127.0.0.1:3000/api/v1/users/login',
      requestOptions
    );
    if (!response.ok) throw Error('hlo');
    showAlert('success', 'succesfully logged in');
    window.setTimeout(() => {
      location.assign('/overview');
    }, 1500);
  } catch (err) {
    await showAlert('error', 'error logged in');
    location.reload();
  }
};

export const logout = async () => {
  let myHeaders = new Headers();
  // myHeaders.append(
  //   'Cookie',
  //   'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOGExZDViMDE5MGIyMTQzNjBkYzA1NyIsImlhdCI6MTY3OTE1Mzg3NSwiZXhwIjoxNjgwMTkwNjc1fQ.jZNWRzjRH7WjfcVSEo-XgGqufsf4ASOxwY87Gkq8jw8'
  // );

  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  try {
    const res = await fetch(
      'http://127.0.0.1:3000/api/v1/users/logout',
      requestOptions
    );
    console.log(res);
    location.assign('/overview');
  } catch (error) {
    console.log(error);
  }
};
