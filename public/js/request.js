const sendRequest = (req, cb) => {
  const xhr = new XMLHttpRequest();
  const url = req.url;
  const contentType = req.contentType || 'text/plain';
  const method = req.method || 'GET';
  const body = req.body || '';

  xhr.open(method, url);
  xhr.setRequestHeader('content-type', contentType);
  xhr.onload = () => cb(xhr.status, xhr.response);

  xhr.send(body);
};
