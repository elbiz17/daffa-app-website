export function success(message: string, data?: any) {
  const response: any = {
    status : true,
    message,
  }
  if(data !== null ){
    response.data = data;
  }
  return response;
}

// export function error(message: string | object) {
//   return {
//     status: false,
//     message,
//     data:null
//   };
// }

export const error = (message: string | object, data: any = null) => {
  return {
    status: false,
    message,
    data,
  };
};


export function unauthorized(message:string){
  return{
    status:false,
    message,
  }
}
