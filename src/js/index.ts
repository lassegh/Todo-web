import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index";

interface ITodoItem {
    id: number;
    isDone: boolean;
    content: string;
}

let todoItemList: ITodoItem[];
let todoOrderList: number[];

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

    console.log(localStorage.getItem(storageKey));
})();



function filterAll(): void{
    contentOfAllTodos.innerHTML = "";

    todoItemList.forEach((todo: ITodoItem) => {
        appendTodoItem(todo);
    });
}

function filterTodos(): void{
    contentOfAllTodos.innerHTML = "";

    todoItemList.forEach((todo: ITodoItem) => {
        if(!todo.isDone) appendTodoItem(todo);
    });
}

function filterDone(): void{
    contentOfAllTodos.innerHTML = "";

    todoOrderList =[];

    todoItemList.forEach((todo: ITodoItem) => {
        if(todo.isDone){
            appendTodoItem(todo);
            todoOrderList.push(todo.id);
        } 
    });

    localStorage.setItem(storageKey, JSON.stringify(todoOrderList));
}

function appendTodoItem(todo: ITodoItem): void{
    var divElement = document.createElement("div");
    contentOfAllTodos.appendChild(divElement);
    
    var textArea = document.createElement("textarea");
    textArea.setAttribute("type","text");
    textArea.setAttribute("id","content"+todo.id);
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


function getTodos(): void{
    axios.get<ITodoItem[]>(baseUri)
        .then(function (response: AxiosResponse<ITodoItem[]>): void {
            todoItemList = response.data;
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
        if(response.data == true) todoItemList[todoItemList.findIndex(x => x.id == id)] = todo;
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
        todoItemList.push(response.data);
        filterAll();
    })
    .catch(function (error:AxiosError): void{

    })
}