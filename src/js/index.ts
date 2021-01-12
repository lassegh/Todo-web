import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index";

interface ITodoItem {
    id: number;
    isDone: boolean;
    content: string;
}

let todoOrderList: number[] = [];
let sortedListItems:ITodoItem[] = [];

const baseUri: string = "http://localhost:57611/api/todo";
const storageKey: string = "todoOrder";

let contentOfAllTodos : HTMLDivElement = <HTMLDivElement>document.getElementById("todoList");

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

    getTodos();

    todoOrderList = JSON.parse(localStorage.getItem(storageKey));
    if (todoOrderList.length != 0) filterAll();
})();


function sortListAccordingToLocalStorage(todoItemList:ITodoItem[]): void{ 
    for (let i = 0; i < todoOrderList.length; i++) {
        const number = todoOrderList[i];
        sortedListItems.push(todoItemList.find(x => x.id == number));
        todoItemList.splice(todoItemList.findIndex(x => x.id == number),1);
    }

    for (let i = 0; i < todoItemList.length; i++) {
        sortedListItems.push(todoItemList[i]);
        todoOrderList.push(todoItemList[i].id);
    }
    console.log(todoOrderList);
}


function filterAll(): void{
    contentOfAllTodos.innerHTML = "";

    sortedListItems.forEach((todo: ITodoItem) => {
        appendTodoItem(todo);
    });
}

function filterTodos(): void{
    contentOfAllTodos.innerHTML = "";

    sortedListItems.forEach((todo: ITodoItem) => {
        if(!todo.isDone) appendTodoItem(todo);
    });
}

function filterDone(): void{
    
    contentOfAllTodos.innerHTML = "";

    sortedListItems.forEach((todo: ITodoItem) => {
        if(todo.isDone){
            appendTodoItem(todo);
            todoOrderList.push(todo.id);
        } 
    });
}

function move(id:number, shouldMoveUp:boolean):void{
    console.log(id);

    // Find index på denne
    let thisIndex = todoOrderList.findIndex(x => x == id);
    console.log("denne index: "+thisIndex);

    // Find index på på næste plads
    let nextIndex: number;
    if (shouldMoveUp){
        nextIndex = thisIndex - 1;
        if (nextIndex < 0) return
    }
    else {
        nextIndex = thisIndex + 1;
        if (nextIndex >= todoOrderList.length) return
    }
    console.log("next index: "+nextIndex);

    // flyt på tal i todoOrderedList
    [todoOrderList[thisIndex], todoOrderList[nextIndex]] = [todoOrderList[nextIndex], todoOrderList[thisIndex]]; 

    // flyt på objekter i sortedListItems
    [sortedListItems[thisIndex], sortedListItems[nextIndex]] = [sortedListItems[nextIndex], sortedListItems[thisIndex]]; 

    console.log(todoOrderList);
    filterAll();

    setOrderedList();
}


function appendTodoItem(todo: ITodoItem): void{
    var divElement = document.createElement("div");
    contentOfAllTodos.appendChild(divElement);

    var moveUpBtn = document.createElement("button");
    moveUpBtn.setAttribute("class","btn btn-info");
    moveUpBtn.setAttribute("style","margin-bottom: 20px;");
    moveUpBtn.innerHTML = "Move up";
    moveUpBtn.addEventListener("click",(()=>{
        move(todo.id, true)
    }));
    divElement.appendChild(moveUpBtn);

    var moveDownBtn = document.createElement("button");
    moveDownBtn.setAttribute("class","btn btn-info");
    moveDownBtn.setAttribute("style","margin-left: 6px; margin-bottom: 20px;");
    moveDownBtn.innerHTML = "Move down";
    moveDownBtn.addEventListener("click",(()=>{
        move(todo.id, false)
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
        updateTodo(todo.id)
    }));
    divElement.appendChild(updateBtn);
}


function setOrderedList(){
    localStorage.setItem(storageKey, JSON.stringify(todoOrderList));
}


function getTodos(): void{
    axios.get<ITodoItem[]>(baseUri)
        .then(function (response: AxiosResponse<ITodoItem[]>): void {
            sortListAccordingToLocalStorage(response.data);
            filterAll(); 
        })
        .catch(function (error: AxiosError): void {

        });
}

function updateTodo(id: number): void{
    let checkbox = <HTMLInputElement>document.getElementById("isdone"+id);
    let textArea = <HTMLTextAreaElement>document.getElementById("content"+id);
    
    const todo:ITodoItem ={
        id : id,
        content : textArea.value,
        isDone : checkbox.checked
    };

    axios.put<boolean>(baseUri+"/"+id, todo)
    .then(function (response: AxiosResponse<boolean>): void{
        if(response.data == true) sortedListItems[sortedListItems.findIndex(x => x.id == id)] = todo;
        filterAll();
    })
    .catch(function (error: AxiosError): void {

    });
}

function postTodo(): void{
    let contentField = <HTMLTextAreaElement>document.getElementById("contentNewTodo");

    const todo:ITodoItem ={
        id : 0,
        content : contentField.value,
        isDone : false
    };

    axios.post<ITodoItem>(baseUri, todo)
    .then(function (response: AxiosResponse<ITodoItem>): void{
        sortedListItems.push(response.data);
        filterAll();
    })
    .catch(function (error:AxiosError): void{

    })
}