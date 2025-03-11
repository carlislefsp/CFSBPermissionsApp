import { ApiService } from './api';
import { AADUserDetails } from '@/types/aad';

export class AADService extends ApiService {
  static async getOrCreateUserByEmail(email: string): Promise<string> {
    const response = await this.fetch<string>(
      `/aad/getoidbyemail?email=${encodeURIComponent(email)}`,
      {
        method: 'POST',
      },
    );
    return response;
  }

  static async getUserDetails(userOid: string): Promise<AADUserDetails> {
    return this.fetch<AADUserDetails>(`/aad/userdetails/${userOid}`);
  }
}
