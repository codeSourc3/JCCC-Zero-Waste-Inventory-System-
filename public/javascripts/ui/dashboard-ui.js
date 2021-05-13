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

function addSpan(value, slotName, parent) {
    const span = document.createElement('span');
    span.slot = slotName;
    span.textContent = value;
    parent.appendChild(span);
}

const bindToBinPanel = (panelId, offsetId, limitId, buttonId) => {
    if (hasElement(panelId) && hasElement(offsetId) && hasElement(limitId) && hasElement(buttonId)) {
        const panel = document.getElementById(panelId);
        const offsetInput = document.getElementById(offsetId);
        const limitInput = document.getElementById(limitId);
        const btn = document.getElementById(buttonId);
        btn.addEventListener('click', async (e) => {
            panel.childNodes.forEach(node => node.remove());
            const offset = offsetInput.value;
            const limit = limitInput.value;
            console.log(`Offset: ${offset}, Limit: ${limit}`);
            /**
             * @type {Object[]}
             */
            const {success, data, message} = await rest.get('/interns', {offset, limit});
            if (success) {
                data.forEach(obj => {
                    const internCard = document.createElement('intern-card');
                    addSpan(obj.firstName, 'first-name', internCard);
                    addSpan(obj.lastName, 'last-name', internCard);
                    addSpan(obj.username, 'username', internCard);
                    addSpan(obj.role, 'role', internCard);
                    panel.appendChild(internCard);
                });
            } else {
                console.error(message);
            }
        });
    }
};

bindToBinPanel('bin-panel', 'offset', 'limit', 'submit');
/**
 * Figures out if the user is an admin or not.
 * @returns {boolean} true if the dashboard is an admin, false otherwise.
 */
function isAdmin() {
    let intern = document.documentElement.dataset.intern;
    let isAdmin = intern === 'false';
    
    console.log('Is Admin?', isAdmin);
    return isAdmin;
}
sessionStorage.setItem('isAdmin', isAdmin());