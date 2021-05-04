import * as rest from '../api/fetch.js';

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

const hasElement = (elementId) => {
    const el = document.getElementById(elementId);
    return document.contains(el);
};

const bindToBinPanel = (panelId, offsetId, limitId, buttonId) => {
    if (hasElement(panelId) && hasElement(offsetId) && hasElement(limitId) && hasElement(buttonId)) {
        const panel = document.getElementById(panelId);
        const offsetInput = document.getElementById(offsetId);
        const limitInput = document.getElementById(limitId);
        const btn = document.getElementById(buttonId);
        btn.addEventListener('click', async (e) => {
            const offset = offsetInput.value;
            const limit = limitInput.value;
            console.log(`Offset: ${offset}, Limit: ${limit}`);
            const results = await rest.get('/interns');
            console.log(results);
        });
    }
};

bindToBinPanel('bin-panel', 'offset', 'limit', 'submit');
