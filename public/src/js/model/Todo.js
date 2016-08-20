import Backbone from 'backbone'

export class Todo extends Backbone.Model {
    text = "";
    complete = false;

    constructor(props){
        super();
        this.text = props.text || "";
        this.complete = props.complete || false;
        //console.log(props, this.todoText, this.complete);
    }
}
