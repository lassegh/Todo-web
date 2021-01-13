import {Controller} from "./controller";
import {ITodoItem} from "./todoItem";



let contentOfAllTodos : HTMLDivElement = <HTMLDivElement>document.getElementById("todoList");
let controller = new Controller();

//Filter buttons
//See all
let seeAllButton : HTMLButtonElement = <HTMLButtonElement>document.getElementById("seeAllBtn");
seeAllButton.addEventListener("click", filterAll);

//See todos
let seeTodosButton : HTMLButtonElement = <HTMLButtonElement>document.getElementById("seeTodosBtn");
seeTodosButton.addEventListener("click", filterTodos);

//See done
let seeDoneButton : HTMLButtonElement = <HTMLButtonElement>document.getElementById("seeDoneBtn");
seeDoneButton.addEventListener("click", filterDone);

//Add new todo button
let addTodoBtn = <HTMLButtonElement>document.getElementById("addBtn");
addTodoBtn.addEventListener("click", postTodo);

(()=> {
    controller.getItems();
    filterAll();
})();

function postTodo():void{
    let contentField = <HTMLTextAreaElement>document.getElementById("contentNewTodo");
    
    const todo:ITodoItem ={
        id : 0,
        content : contentField.value,
        isDone : false
    };

    controller.postTodo(todo);

    filterAll();
}

function filterAll(): void{
    contentOfAllTodos.innerHTML = "";

    controller.sortedListItems.forEach((todo: ITodoItem) => {
        appendTodoItem(todo);
    });
}

function filterTodos(): void{
    contentOfAllTodos.innerHTML = "";

    controller.sortedListItems.forEach((todo: ITodoItem) => {
        if(!todo.isDone) appendTodoItem(todo);
    });
}

function filterDone(): void{
    
    contentOfAllTodos.innerHTML = "";

    controller.sortedListItems.forEach((todo: ITodoItem) => {
        if(todo.isDone){
            appendTodoItem(todo);
        } 
    });
}

function appendTodoItem(todo: ITodoItem): void{
    var divElement = document.createElement("div");
    contentOfAllTodos.appendChild(divElement);

    var moveUpBtn = document.createElement("button");
    moveUpBtn.setAttribute("class","btn btn-info");
    moveUpBtn.setAttribute("style","margin-bottom: 20px;");
    moveUpBtn.innerHTML = "Move up";
    moveUpBtn.addEventListener("click",(()=>{
        controller.move(todo.id, true);
        filterAll();
    }));
    divElement.appendChild(moveUpBtn);

    var moveDownBtn = document.createElement("button");
    moveDownBtn.setAttribute("class","btn btn-info");
    moveDownBtn.setAttribute("style","margin-left: 6px; margin-bottom: 20px;");
    moveDownBtn.innerHTML = "Move down";
    moveDownBtn.addEventListener("click",(()=>{
        controller.move(todo.id, false);
        filterAll();
    }));
    divElement.appendChild(moveDownBtn);
    
    var textArea = document.createElement("textarea");
    textArea.setAttribute("type","text");
    textArea.setAttribute("id","content"+todo.id);
    textArea.setAttribute("style","margin-left: 6px;");
    textArea.innerHTML = todo.content;
    divElement.appendChild(textArea);
    
    var labelElement = document.createElement("label");
    labelElement.setAttribute("style","margin-left: 10px;");
    labelElement.innerHTML = "Is Done";
    divElement.appendChild(labelElement);
    
    var inputElement = document.createElement("input");
    if(todo.isDone) inputElement.checked = true;
    inputElement.setAttribute("style","margin-left: 3px;");
    inputElement.setAttribute("type","checkbox");
    inputElement.setAttribute("id","isdone"+todo.id);
    divElement.appendChild(inputElement);

    var updateBtn = document.createElement("button");
    updateBtn.setAttribute("class","btn btn-info");
    updateBtn.setAttribute("style","margin-left: 6px; margin-bottom: 20px;");
    updateBtn.innerHTML = "Update";
    updateBtn.addEventListener("click",(()=>{
        let checkbox = <HTMLInputElement>document.getElementById("isdone"+todo.id);
        let textArea = <HTMLTextAreaElement>document.getElementById("content"+todo.id);
        
        const newTodo:ITodoItem ={
            id : todo.id,
            content : textArea.value,
            isDone : checkbox.checked
        };

        controller.updateTodo(newTodo)

        filterAll();
    }));
    divElement.appendChild(updateBtn);
}