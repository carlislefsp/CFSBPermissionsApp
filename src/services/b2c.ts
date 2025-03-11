import { ApiService } from './api';
import {
  B2CCreateRequest,
  B2CTokenRequest,
  B2CContinuationResponse,
  B2CValidationErrorResponse,
  B2CUserDetails,
} from '@/types/b2c';

export class B2CService extends ApiService {
  static async register(
    request: B2CCreateRequest,
  ): Promise<B2CContinuationResponse | B2CValidationErrorResponse> {
    return this.fetch<B2CContinuationResponse | B2CValidationErrorResponse>(
      '/b2c/register',
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
    );
  }

  static async token(
    request: B2CTokenRequest,
  ): Promise<B2CContinuationResponse> {
    return this.fetch<B2CContinuationResponse>('/b2c/token', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async getUserDetails(userOid: string): Promise<B2CUserDetails> {
    return this.fetch<B2CUserDetails>(`/b2c/userdetails/${userOid}`);
  }
}
