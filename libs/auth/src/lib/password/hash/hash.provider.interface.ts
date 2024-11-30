export interface IHashProvider {
  hash(data:string | Buffer ): Promise<string>;
  compare(data:string | Buffer, encryptedData:string): Promise<boolean>;
}
