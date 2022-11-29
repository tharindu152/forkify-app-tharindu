import { TIMEOUT_SEC } from './config';

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    //Loading the recipe
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST', // Specify that you are going to send data
          headers: { 'Content-Type': 'application/json' }, //Specify that the data will be in json format. Then only API will be able to identify it.
          body: JSON.stringify(uploadData), //
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
