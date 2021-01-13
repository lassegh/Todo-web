import {ApiConn} from "./api-conn";
import {ITodoItem} from "./todoItem";

const storageKey: string = "todoOrder";

export class Controller{
    apiConn = new ApiConn();

    todoOrderList: number[] = [];
    sortedListItems:ITodoItem[] = [];

    constructor() {
        this.todoOrderList = JSON.parse(localStorage.getItem(storageKey));
    }

    sortListAccordingToLocalStorage(todoItemList:ITodoItem[]): void{ 
        for (let i = 0; i < this.todoOrderList.length; i++) {
            const number = this.todoOrderList[i];
            this.sortedListItems.push(todoItemList.find(x => x.id == number));
            todoItemList.splice(todoItemList.findIndex(x => x.id == number),1);
        }
    
        for (let i = 0; i < todoItemList.length; i++) {
            this.sortedListItems.push(todoItemList[i]);
            this.todoOrderList.push(todoItemList[i].id);
        }
    }

    setOrderedList(){
        localStorage.setItem(storageKey, JSON.stringify(this.todoOrderList));
    }

    move(id:number, shouldMoveUp:boolean):void{
        console.log(id);
    
        // Find index på denne
        let thisIndex = this.todoOrderList.findIndex(x => x == id);
        console.log("denne index: "+thisIndex);
    
        // Find index på på næste plads
        let nextIndex: number;
        if (shouldMoveUp){
            nextIndex = thisIndex - 1;
            if (nextIndex < 0) return
        }
        else {
            nextIndex = thisIndex + 1;
            if (nextIndex >= this.todoOrderList.length) return
        }
        console.log("next index: "+nextIndex);
    
        // flyt på tal i todoOrderedList
        [this.todoOrderList[thisIndex], this.todoOrderList[nextIndex]] = [this.todoOrderList[nextIndex], this.todoOrderList[thisIndex]]; 
    
        // flyt på objekter i sortedListItems
        [this.sortedListItems[thisIndex], this.sortedListItems[nextIndex]] = [this.sortedListItems[nextIndex], this.sortedListItems[thisIndex]]; 
    
        this.setOrderedList();
    }

    getItems(): void{
        var response = this.apiConn.getItemsAsync();
        response.then((value) => {
            this.sortListAccordingToLocalStorage(value)
        });
    }

    updateTodo(todo:ITodoItem):void{
        var response = this.apiConn.updateItemAsync(todo);
        response.then((value)=>{
            if(value) this.sortedListItems[this.sortedListItems.findIndex(x => x.id == todo.id)] = todo;
        });
    }

    postTodo(todo: ITodoItem): void{
        var response = this.apiConn.postItemAsync(todo);
        response.then((value)=>{
            this.sortedListItems.push(value);
        });
    }
                
} 