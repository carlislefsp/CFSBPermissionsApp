export interface AADUserDetails {
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
  Mail: string;
  MobilePhone?: string;
  OfficeLocation?: string;
  PostalCode?: string;
  SignInActivity: {
    LastNonInteractiveSignInDateTime?: string;
    LastNonInteractiveSignInRequestId?: string;
    LastSignInDateTime?: string;
    LastSignInRequestId?: string;
    SignInSessionsValidFromDateTime?: string;
  };
  State?: string;
  StreetAddress?: string;
  Surname: string;
  UsageLocation?: string;
  UserPrincipalName: string;
  UserType: string;
  Id: string;
}
