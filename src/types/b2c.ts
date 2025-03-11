export interface B2CIdentity {
  signInType: string;
  issuer: string;
  issuerAssignedId: string;
}

export interface B2CCreateRequest {
  email: string;
  identities: B2CIdentity[];
  displayName?: string;
  givenName?: string;
  surname?: string;
  country?: string;
  step: string;
  client_id: string;
  ui_locales?: string;
}

export interface B2CTokenRequest {
  objectId: string;
  email: string;
  identities: B2CIdentity[];
  givenName?: string;
  surname?: string;
  country?: string;
  step: string;
  client_id: string;
  ui_locales?: string;
}

export interface B2CContinuationResponse {
  version: '1.0.0';
  action: 'Continue';
  displayname?: string;
  [key: string]: string | undefined;
}

export interface B2CBlockResponse {
  version: '1.0.0';
  action: 'ShowBlockPage';
  userMessage?: string;
}

export interface B2CValidationErrorResponse {
  version: '1.0.0';
  status: 400;
  action: 'ValidationError';
  userMessage?: string;
}

export interface B2CUserDetails {
  AccountEnabled: boolean;
  BusinessPhones: string[];
  City?: string;
  CompanyName?: string;
  Country?: string;
  CreatedDateTime: string;
  Department?: string;
  DisplayName: string;
  GivenName: string;
  JobTitle?: string;
  LastPasswordChangeDateTime: string;
  Mail: string;
  MobilePhone?: string;
  OfficeLocation?: string;
  PostalCode?: string;
  SignInActivity: {
    LastNonInteractiveSignInDateTime?: string;
    LastNonInteractiveSignInRequestId?: string;
    LastSignInDateTime?: string;
    LastSignInRequestId?: string;
  };
  State?: string;
  StreetAddress?: string;
  Surname: string;
  UsageLocation?: string;
  UserPrincipalName: string;
  UserType: string;
  Id: string;
}
