import React from 'react';
import { Todo } from '../model/Todo'
import { TodoAPI } from '../model/TodoAPI'

export class InputTodoView extends React.Component {
    constructor(){
        super();
    }

    onAddButtonClick(){
        this.postTodo();
        //console.log('onclick', this.inputText.value);
    }

    onInputKeyDown(e){
        //console.log(e.keyCode);
        if(e.keyCode == 13){
            this.postTodo();
        }
    }

    postTodo(){
        const inputText = this.inputText.value;
        if(!inputText || inputText.length == 0){
            return;
        }
        this.inputText.value = "";
        var api = new TodoAPI(this.props.appData);
        api.postTodo({
            text: inputText,
            complete: false
        });
    }

    render(){
        return (
            <div className="section">
                <input className="input-todo"
                       ref={(ref)=> this.inputText = ref }
                       onKeyDown={ this.onInputKeyDown.bind(this) }
                       />
                <button className="add-button"
                        onClick={ this.onAddButtonClick.bind(this) }>
                    add
                </button>
            </div>
        );
    }
}
