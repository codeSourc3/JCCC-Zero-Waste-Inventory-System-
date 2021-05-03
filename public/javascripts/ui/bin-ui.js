
const form = document.forms[0];
const submitListener = (event) => {
    event.preventDefault();

    /**@type {HTMLInputElement} */
    const binIdInput = form.elements.namedItem('bin-id');
    let value = binIdInput.valueAsNumber;
    // Persists the bin id for the session, or until I tell it not to.
    window.sessionStorage.setItem('binId', String(value));
    location.href = form.action;
    return false;
};


form.addEventListener('submit', submitListener);