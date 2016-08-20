import Backbone from 'backbone'
import { Todo } from './Todo'

export class TodoCollection extends Backbone.Collection {
    constructor(){
        super({
            model:Todo
        });
    }

    get todos(){
        var data = [];
        this.models.map((ele)=>{
            data.push(ele);
        });
        return data;
    }
}
