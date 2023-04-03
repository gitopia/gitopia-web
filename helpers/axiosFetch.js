// let token = document.head.querySelector('meta[name="csrf-token"]');

class HTTPError extends Error {
  constructor(response, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    this.response = response;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HTTPError);
    }

    this.name = "HTTPError";
  }
}
let axios = {};
["get", "post", "put", "delete"].forEach((val) => {
  axios[val] = function (url, data, options = {}) {
    return fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        //"X-Requested-With": "XMLHttpRequest",
        // "X-CSRF-Token": token.content
      },
      method: val,
      credentials: "same-origin",
      body: JSON.stringify(data),
      ...options,
    })
      .then(async (response) => {
        if (!response.ok) {
          let data = await response.json();
          response.data = data;
          console.log(response);
          throw new HTTPError(response, response.statusText);
        }
        return response;
      })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        return { data: jsonResponse };
      });
  };
});

export default axios;
