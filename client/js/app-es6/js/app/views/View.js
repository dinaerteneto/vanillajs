export class View {

    constructor(elemento) {
        this._elemento = elemento;
    } 

    template(model) {
        return model.texto ? `<p class="alert alert-info">${model.texto}</p>` : '<p></p>';
    }

    update(model) {
        return this._elemento.innerHTML = this.template(model);
    }

}