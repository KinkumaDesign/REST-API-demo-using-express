import $ from 'jquery'
import { Todo } from './Todo'

export class TodoAPI {
    appData;
    url = 'http://localhost:3001/todos';

    constructor(appData){
        this.appData = appData;
    }

    loadTodos(){
        $.ajax({
            url:this.url,
            method:'get'
        }).done((data)=>{
            this.setTodoCollectionFromJSON(data);
            //this.appData.todoCollection.reset(data.todos);
        }).fail((err)=>{
            console.error(err);
        })
    }

    postTodo(todo){
        $.ajax({
            url:this.url,
            method:'post',
            dataType:'json',
            data:{
                text: todo.text,
                complete: todo.complete
            }
        }).done((data)=>{
            this.setTodoCollectionFromJSON(data);
            //console.log(data);
        }).fail((err)=>{
            console.error(err);
        })
    }

    putTodo(todo){
        $.ajax({
            url:this.url + '/' + todo.id,
            method:'put',
            dataType:'json',
            data:{
                text: todo.text,
                complete: todo.complete
            }
        }).done((data)=>{
            this.setTodoCollectionFromJSON(data);
            //console.log(data);
        }).fail((err)=>{
            console.error(err);
        })
    }

    deleteTodo(todo){
        $.ajax({
            url:this.url + '/' + todo.id,
            method:'delete',
            dataType:'json'
        }).done((data)=>{
            this.setTodoCollectionFromJSON(data);
            //console.log(data);
        }).fail((err)=>{
            console.error(err);
        })
    }

    setTodoCollectionFromJSON(json){
        var newTodos = json.todos;
        if(!newTodos){
            return;
        }
        var todoModelArray = [];
        for(var i = 0, len = newTodos.length; i < len; i++){
            var newTodo = newTodos[i];
            var todoModel = new Todo({
                text:newTodo.text,
                complete:newTodo.complete
            });
            todoModel.id = newTodo.id;
            todoModelArray.push(todoModel);
        }
        this.appData.todoCollection.reset(todoModelArray);
    }
}
