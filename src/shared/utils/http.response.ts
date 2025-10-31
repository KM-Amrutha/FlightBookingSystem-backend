import { Response} from "express";

export const sendResponse = (
  res:Response,
  message:string,
  data:any = null,
  statusCode:number
) =>{
    const success = statusCode >=200 && statusCode <300;
    const response = {
        success,
        status:statusCode,
        message:message,
        data
    };
    return res.status(statusCode).json(response);
}
  


