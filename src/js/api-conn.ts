import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index";
import {ITodoItem} from "./todoItem";

const baseUri: string = "http://localhost:57611/api/todo";

export class ApiConn{

    async getItemsAsync():Promise<ITodoItem[]> {
        try {
            const resp = await axios.get<ITodoItem[]>(baseUri);
            return resp.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async updateItemAsync(item:ITodoItem):Promise<boolean>{
        try {
            const resp = await axios.put<boolean>(baseUri+"/"+item.id, item);
            return resp.data;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async postItemAsync(item:ITodoItem):Promise<ITodoItem>{
        try {
            const resp = await axios.post<ITodoItem>(baseUri,item);
            return resp.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    
}