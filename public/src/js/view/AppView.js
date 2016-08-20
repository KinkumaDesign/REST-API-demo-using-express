import React from 'react';
import { InputTodoView } from './InputTodoView'
import { TodoListView } from './TodoListView'
import { TodoAPI } from '../model/TodoAPI'

export class AppView extends React.Component {

    constructor(){
        super();
        this.state = {
            todos: []
        }
    }

    componentDidMount(){
        var collection = this.props.appData.todoCollection;
        collection.on('add', ()=>{
            this.setState({
                todos:collection.todos
            });
        });
        collection.on('reset', ()=>{
            this.setState({
                todos:collection.todos
            });
        });

        var api = new TodoAPI(this.props.appData);
        api.loadTodos();
    }

    render(){
        return (
            <div id="wrapper">
                <InputTodoView appData={ this.props.appData } />
                <TodoListView todos={ this.state.todos }
                              appData={ this.props.appData } />
            </div>
        )
    }
}