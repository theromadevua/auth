
declare global {
    interface User {
        email: string,
        password: string
    }

}
  
declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

  export {};
  
