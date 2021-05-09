customElements.define('intern-card', class extends HTMLElement {
    constructor() {
        super();
        let template = document.getElementById('intern-card-tmpl');
        let content = template.content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(content.cloneNode(true));
    }
});