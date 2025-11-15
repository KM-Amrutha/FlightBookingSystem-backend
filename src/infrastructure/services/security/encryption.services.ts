import bcrypt from "bcrypt";
import { IEncryptionService } from "@application/interfaces/service/security/IEncryption.service";
import { injectable } from "inversify";

@injectable()
export class EncryptionService implements IEncryptionService {
  private _saltRounds: number = 10;
  async hash(data: string): Promise<string> {
    return await bcrypt.hash(data, this._saltRounds);
  }

  async compare(inputData: string, hashedData: string): Promise<boolean> {
    return await bcrypt.compare(inputData, hashedData);
  }
}
