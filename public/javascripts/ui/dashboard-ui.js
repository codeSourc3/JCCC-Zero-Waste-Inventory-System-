const buttonLink = (location) => {
    return (event) => {
        window.location.href = location;
    };
};

const bindButton = (buttonId, link) => {
    const btnLink = buttonLink(link);
    const btn = document.getElementById(buttonId);
    if (document.contains(btn)) {
        btn.addEventListener('click', btnLink);
    }
};

bindButton('js-weigh-bin', './weighBin.html');
bindButton('js-new-location', './newLocation.html');
bindButton('js-scan-qrcode', './scanQRCode.html');
bindButton('js-bin-info', './getBinInfo.html');
bindButton('js-add-bin', './addBin.html');
bindButton('js-remove-bin', './removeBin.html');
bindButton('js-add-intern', './addIntern.html');
bindButton('js-remove-intern', './removeIntern.html');

const refreshToken = async () => {
    const url = '/api/v1/auth/refresh';
    const response = await fetch (url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const {id, error} = await response.json();
    if (!error) {
      console.log('Token ID:',id);
    } else {
      console.error('Error: ', error);
    }
  };

  refreshToken();