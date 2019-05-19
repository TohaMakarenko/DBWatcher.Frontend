export interface Connection {
    id: number,
    name: string,
    server: string,
    login: string,
    password: string,
    isPasswordEncrypted: boolean,
}
