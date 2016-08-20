import Backbone from 'backbone'
import { TodoCollection } from './TodoCollection'

export class AppData extends Backbone.Model {
    todoCollection = new TodoCollection();

    constructor(){
        super();
    }

    //シングルトンにしようかと思ったけどやめた
    //static _instance;
    //static get sharedData(){
    //    if(AppData._instance == null){
    //        AppData._instance = new AppData();
    //    }
    //    return AppData._instance;
    //}
}