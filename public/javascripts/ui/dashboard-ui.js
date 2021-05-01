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
