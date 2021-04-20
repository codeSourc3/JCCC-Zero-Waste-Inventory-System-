import {Intern, InternRepository} from '../api/intern-resource.js';


/**
 * 
 * @param {Intern} intern 
 * @returns {String}
 */
const listIntern = (intern) => {
    return `Intern Id: ${intern.internId}, First Name: ${intern.firstName}, Last Name: ${intern.lastName}`;
};


/**
 * 
 * @param {Intern[]} interns 
 */
export const listAllInterns = (interns) => {
    const ul = document.createElement('ul');
    for (const intern of interns) {
        const li = document.createElement('li');
        li.textContent = listIntern(intern);
        ul.append(li);
    }
    return ul;
};

/**
 * Adds an intern using an HTML form.
 * @param {HTMLFormElement} form 
 */
export const addInternFromForm = async (form) => {
    const inputs = form.elements;
    const internId = 1;
    const firstName = inputs.namedItem('first-name').value;
    const lastName = inputs.namedItem('last-name').value;
    // Send to database
    const internRepo = new InternRepository();
    const intern = {
        internId: internId,
        firstName: firstName,
        lastName: lastName
    };
    const result = await internRepo.add(intern);
    console.log(result);
};

/**
 * Removes an intern using an HTML form.
 * @param {HTMLFormElement} form 
 */
const removeInternFromForm = async (form) => {
    //
};

/**
 * Updates the intern using an HTML form.
 * @param {HTMLFormElement} form 
 */
const updateInternFromForm = async (form) => {
    //
};
