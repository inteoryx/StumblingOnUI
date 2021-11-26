function hash(inp) {
  let h = 0, i, chr;
  if (inp.length === 0) return h;
  for (i = 0; i < inp.length; i++) {
    chr = inp.charCodeAt(i);
    h = ((h << 5) - h) + chr;
    h |= 0;
  }
  return h;
}

function id() {
  const curId = window.localStorage.getItem("userId");
  if (curId) {
    return curId;
  }
  const newId = hash(navigator.userAgent + Date.now());
  window.localStorage.setItem("userId", parseInt(newId));
  return newId;
}

function StumbleClient() {
  const result = {
    url: 'https://service.stumblingon.com/',
    id: id(),
    defaultHistoryPageSize: 1000
  };

  result.getSite = function (prevId, onSuccess, onError) {
    fetch(this.url + 'getSite', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        'userId': this.id,
        'prevId': prevId,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((s) => s.json()
          .then(function (s) {
            if (s.ok) {
              onSuccess(s);
            } else {
              onError(s);
            }
          }, (e) => onError(e)),
        (e) => onError(e)
      );

  };

  result.submitSite = function (site, onSuccess, onError) {
    fetch(this.url + 'submitSite', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        'userId': this.id,
        'url': site
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((s) => s.json()
          .then(function (s) {
            onSuccess(s);
          }, (e) => onError(e)),
        (e) => onError(e)
      );
  };

  result.getUser = function (userId, onSuccess, onError) {
    fetch(this.url + 'getUser', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        'userId': this.id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((s) => s.json()
          .then(function (s) {
            if (s.ok) {
              onSuccess(s);
            } else {
              console.log("Trouble getting user.", s.errorMessage);
              onError(s);
            }
          }, (e) => onError(e)),
        (e) => onError(e)
      );
  };

  result.getHistory = function (start, onSuccess, onError) {
    fetch(this.url + 'getHistory', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        'userId': this.id,
        'start': start,
        'pageSize': this.defaultHistoryPageSize
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((s) => s.json()
          .then(function (s) {
            if (s.ok) {
              onSuccess(s);
            } else {
              console.log("Trouble getting history.", s.errorMessage);
              onError(s);
            }
          }, (e) => onError(e)),
        (e) => onError(e)
      );
  };

  result.like = function (siteId, onSuccess, onError) {
    fetch(this.url + 'like', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        'userId': this.id,
        'siteId': siteId
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((s) => s.json()
          .then(function (s) {
            if (s.ok) {
              onSuccess(s);
            } else {
              console.log("Trouble liking.", s.errorMessage);
              onError(s);
            }
          }, (e) => onError(e)),
        (e) => onError(e)
      );
  };

  return result;
}


const sc = new StumbleClient();
export default sc;
