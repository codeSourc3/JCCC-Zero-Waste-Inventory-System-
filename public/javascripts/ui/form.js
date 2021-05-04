export default async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = {};
    data.forEach((value, key) => {
        obj[key] = value;
    });
    console.log({obj});
}

export function formPresent(formId) {
    const form = document.getElementById(formId);
    if (document.contains(form)) {
        return true;
    } else {
        return false;
    }
}

export const formToObj = (form) => {
    const formData = new FormData(form);
    const obj = {};
    formData.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
};

export const bindToForm = (formId, handler) => {
    if (formPresent(formId)) {
        const form = document.getElementById(formId);
        form.addEventListener('submit', handler);
    }
};