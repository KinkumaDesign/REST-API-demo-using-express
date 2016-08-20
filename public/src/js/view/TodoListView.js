import React from 'react';
import { Todo } from '../model/Todo'
import { TodoCollection } from '../model/TodoCollection'
import {  TodoAPI } from '../model/TodoAPI'

export class TodoListView extends React.Component {
    constructor(){
        super();
    }

    onListClick(todo, index, event){
        todo.complete = !todo.complete;
        var api = new TodoAPI(this.props.appData);
        api.putTodo(todo);

        //console.log('todo =', todo);
        //console.log('index =', index);
        //console.log('target = ', event);
    }

    onDeleteClick(todo, index, event){
        event.stopPropagation();
        var api = new TodoAPI(this.props.appData);
        api.deleteTodo(todo);
    }

    render(){
        var list = this.props.todos.map((todo, index)=>{

            return (
                <li key={ index }
                    className={ todo.complete ? "complete" : "" }
                    onClick={ this.onListClick.bind(this, todo, index) } >
                    { todo.complete ?
                        <p className="text"><del>{ todo.text }</del></p> :
                        <p className="text">{ todo.text }</p> }
                    <p className="delete-button"
                       onClick={ this.onDeleteClick.bind(this, todo, index )}>delete</p>
                </li>
            );
        });
        return (
            <ul className="todo-list">
                { list }
            </ul>
        );
    }
}