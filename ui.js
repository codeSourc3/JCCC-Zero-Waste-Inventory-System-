 'use strict';

 class InternCardElement extends HTMLElement {
    constructor() {
        super();
        this._internId = undefined;
        this._firstName = '';
        this._lastName = '';
    }

    

    connectedCallback() {
        const template = document.querySelector('#intern-template');
        const templateContent = template.content.cloneNode(true);
        this.attachShadow({mode: 'open'});
        templateContent.querySelector('slot[name=intern-id]').innerHTML = `${this._internId}`;
        templateContent.querySelector('slot[name=first-name]').innerHTML = `${this._firstName}`;
        templateContent.querySelector('slot[name=last-name]').innerHTML = `${this._lastName}`;
        this.shadowRoot.appendChild(templateContent);
    }

    set internId(value) {
        this._internId = value;
    }

    set firstName(value) {
        this._firstName = value;
    }

    set lastName(value) {
        this._lastName = value;
    }

    get internId() {
        return this._internId;
    }

    get firstName() {
        return this._firstName;
    }

    get lastName() {
        return this._lastName;
    }

    
}
customElements.define('intern-card', InternCardElement);

class TaskCardElement extends HTMLElement {
    constructor() {
        super();
        this._taskId = undefined;
        this._description = undefined;
        this._dateCreated = undefined;
        this._taskStatus = undefined;
        this._internId = undefined;
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        const template = document.querySelector('#task-template');
        const templateContent = template.content.cloneNode(true);
        templateContent.querySelector('slot[name=task-id]').innerHTML = this._taskId;
        templateContent.querySelector('slot[name=description]').innerHTML = this._description;
        templateContent.querySelector('slot[name=creation-date]').innerHTML = this._dateCreated;
        templateContent.querySelector('slot[name=task-status]').innerHTML = this._taskStatus;
        templateContent.querySelector('slot[name=intern-id]').innerHTML = this._internId;
        this.shadowRoot.appendChild(templateContent);
    }

    set taskId(value) {
        this._taskId = Number(value);
    }
    set description(value) {
        this._description = String(value);
    }
    set dateCreated(value) {
        this._dateCreated = Date.parse(value);
    }
    set taskStatus(value) {
        this._taskStatus = String(value);
    }
    set internId(value) {
        this._internId = Number(value);
    }
    get taskId() {
        return this._taskId;
    }
    get description() {
        return this._description;
    }
    get dateCreated() {
        return this._dateCreated;
    }
    get taskStatus() {
        return this._taskStatus;
    }
    get internId() {
        return this._internId;
    }
}
customElements.define('task-card', TaskCardElement);

class BinCardElement extends HTMLElement {
    constructor() {
        super();
        this._binId = undefined;
        this._weight = undefined;
        this._status = undefined;
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        const template = document.querySelector('#bin-template');
        const templateContent = template.content.cloneNode(true);
        templateContent.querySelector('slot[name=bin-id]').innerHTML = this._binId;
        templateContent.querySelector('slot[name=weight]').innerHTML = this._weight;
        templateContent.querySelector('slot[name=status]').innerHTML = this._status;
        this.shadowRoot.appendChild(templateContent);
    }

    set binId(value) {
        this._binId = Number(value);
    }

    set weight(value) {
        if (typeof(value) === 'number') {
            this._weight = value.toFixed(2);
        } else if (typeof(value) === 'string') {
            this._weight = Number.parseFloat(value).toFixed(2);
        }
    }

    set status(value) {
        this._status = value;
    }

    get binId() {
        return this._binId;
    }

    get weight() {
        return this._weight;
    }

    get status() {
        return this._status;
    }
}