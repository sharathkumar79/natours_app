import { showAlert } from './alert';
export const updateUser = (email, name, photo) => {
  var myHeaders = new Headers();
  var formdata = new FormData();
  formdata.append('name', name);
  formdata.append('photo', photo);
  formdata.append('email', email);

  var requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow',
  };

  fetch('http://127.0.0.1:3000/api/v1/users/updateMe', requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log('error', error));

  // var myHeaders = new Headers();
  // myHeaders.append('Content-Type', 'application/json');
  // var raw = JSON.stringify({
  //   name,
  //   email,
  // });

  // var requestOptions = {
  //   method: 'PATCH',
  //   headers: myHeaders,
  //   body: raw,
  //   redirect: 'follow',
  // };

  // fetch('http://127.0.0.1:3000/api/v1/users/updateMe', requestOptions)
  //   .then((response) => response.text())
  //   .then((result) => {
  //     console.log(result), showAlert('success', 'successfully updated');
  //   })
  //   .catch((error) => {
  //     console.log('error', error);
  //     showAlert('error', err.message);
  //   });
};

// try {
//     const response = await fetch(
//       'http://127.0.0.1:3000/api/v1/users/updateMe',
//       requestOptions
//     );
//     if (response.ok) {
//       showAlert('success', 'successfully updated');
//       window.setTimeout(() => location.reload(), 3000);
//     }
//   } catch (err) {
//     showAlert('error', err.message);
//     console.log(err);
//   }
