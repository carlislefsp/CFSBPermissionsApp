openapi: 3.0.3
info:
version: "1.0"
title: Identity Service
description: |-
This is the identity and permissions microservice for use by CFS Brands. This microservice tracks user permissions for enterprise applications in conjunction with AzureB2C. Authorization logic is handled by the individual application rather than in this service to ensure application-specific business rules are maintained separately.

    This service is provided by a collection of Azure Functions and operates on an Enterprise Service Bus to provide loosely coupled updates and the ability to inform other services of changes.

    All data in the Identity domain is to be handled exclusively through this service. No other readers or writers access identity data directly. This application **does not** interact with credentials. All authentication is handled by AzureB2C directly.

servers:

- url: https://func-cfsbrandsauth-b2c.azurewebsites.net/api/v1

tags:

- name: user
  description: Access and modify users and their relationship mappings
- name: group
  description: Access and modify groups
- name: permission
  description: Access and modify permissions
- name: grouptype
  description: Access and modify group types
- name: b2c
  description: AzureB2C api connectors
  externalDocs:
  description: Microsoft Documenation
  url: https://learn.microsoft.com/en-us/azure/active-directory-b2c/add-api-connector?pivots=b2c-user-flow
- name: aad
  description: Internal AzureAD api connectors

paths:
/users:
get:
tags: - user
operationId: GetUsers
description: Returns a list of all users.
responses:
"200":
description: A list of users or an empty array
content:
application/json:
schema:
type: array
items:
\$ref: "#/components/schemas/User"
"400":
description: Invalid query parameters were provided
parameters: - name: limit
in: query
description: Maximum number of results to return
required: false
schema:
type: integer
style: form - name: offset
in: query
description: Number of items to skip
required: false
schema:
type: integer
style: form

/users/{useroid}:
get:
tags: - user
operationId: GetUserByID
description: Returns a single user with the provided OID.
responses:
"200":
description: The requested user.
content:
application/json:
schema:
$ref: "#/components/schemas/User"
        "400":
          description: An id value with an invalid format was provided or the request was otherwise malformed.
        "404":
          description: A resource with that id was not found.
    put:
      tags:
        - user
      operationId: UpdateUser
      description: Updates a single user with the provided OID to the requested state.
      requestBody:
        description: Non-updatable fields will be ignored. If an OID is provided in the request body, it must match the resource URI.
        content:
          "application/json":
            schema:
              $ref: "#/components/schemas/User"
example:
email: test.user@cfsbrands.dev
firstname: Test
lastname: User
country: United States
responses:
"200":
description: The resource was updated successfully.
content:
application/json:
schema:
\$ref: "#/components/schemas/User"
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: A resource that that id was not found.
"409":
description: The request could not be completed because of a database constraint.
delete:
tags: - user
operationId: DeleteUserByID
description: Removes a single user object. Will **CASCADE** deletion. Any _groupuserpermissions_ assigned to this user will be deleted during removal.
responses:
"204":
description: The resource was successfully deleted.
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: A resource with that id was not found.
"409":
description: The resource could not be deleted because of a database constraint or exception.
parameters: - name: useroid
in: path
description: User 'oid' uuid value
required: true
schema:
type: string
format: uuid
style: simple

/users/{useroid}/groups:
get:
tags: - user
operationId: GetGroupsByUser
description: Returns a list of all groups a user is a member of.
responses:
"200":
description: A list of groups or an empty array
content:
application/json:
schema:
type: array
items:
\$ref: "#/components/schemas/Group"
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: A resource with that id was not found.
parameters: - name: useroid
in: path
description: User 'oid' uuid value
required: true
schema:
type: string
format: uuid
style: simple

/users/{useroid}/groups/{groupid}/permissions:
get:
tags: - user
operationId: GetPermissionsByUserGroup
description: Returns a list of permissions a user holds for a given group.
responses:
"200":
description: A list of permissions or an empty array
content:
application/json:
schema:
type: array
items:
\$ref: "#/components/schemas/Permission"
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: One of the requested resources could not be found.
parameters: - name: useroid
in: path
description: User 'oid' uuid value
required: true
schema:
type: string
format: uuid
style: simple - name: groupid
in: path
description: Group 'id' uuid value
required: true
schema:
type: string
format: uuid
style: simple

/users/{useroid}/groups/{groupid}/permissions/{permissionid}:
get:
tags: - user
operationId: GetPermissionByUserGroup
description: Returns the permission relationship for the reqeust context, if it exists.
responses:
"200":
description: The permission relationship
content:
application/json:
schema:
$ref: "#/components/schemas/GroupUserPermission"
        "400":
          description: An id value with an invalid format was provided or the request was otherwise malformed.
        "404":
          description: One of the requested resources could not be found, or that permission is not assigned in this relationship.
    post:
      tags:
        - user
      operationId: CreatePermissionByUserGroup
      description: Assigns a permission to a user for a given group.
      responses:
        "200":
          description: The permission assignment already exists, nothing new has been created.
        "201":
          description: The permission has been assigned
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GroupUserPermission"
headers:
Location:
description: uri path to the created resource
schema:
type: string
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: One of the requested resources could not be found.
"409":
description: The request could not be completed because of a database constraint.
delete:
tags: - user
operationId: DeletePermissionByUserGroup
description: Removes a permission from a user for a given group.
responses:
"204":
description: The resource was successfully deleted.
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: One of the requested resources could not be found.
"409":
description: The resource could not be deleted because of a database constraint or exception.
parameters: - name: useroid
in: path
description: User 'oid' uuid value
required: true
schema:
type: string
format: uuid
style: simple - name: groupid
in: path
description: Group 'id' uuid value
required: true
schema:
type: string
format: uuid
style: simple - name: permissionid
in: path
description: Permission 'id' uuid value
required: true
schema:
type: string
format: uuid
style: simple

/groups:
get:
tags: - group
operationId: GetGroups
description: Returns a list of all groups.
responses:
"200":
description: A list of groups or an empty array
content:
application/json:
schema:
type: array
items:
$ref: "#/components/schemas/Group"
        "400":
          description: Invalid query parameters were provided.
      parameters:
        - name: limit
          in: query
          description: Maximum number of results to return
          required: false
          schema:
            type: integer
          style: form
        - name: offset
          in: query
          description: Number of items to skip
          required: false
          schema:
            type: integer
          style: form
    post:
      tags:
        - group
      operationId: CreateGroup
      description: Creates a new group.
      responses:
        "201":
          description: The resource was created.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Group"
headers:
Location:
description: uri path to the created resource
schema:
type: string
"400":
description: The new resource request was malformed.
"409":
description: The resource could not be deleted because of a database constraint or exception.
requestBody:
description: Any provided uuid or date/time fields will be ignored.
content:
"application/json":
schema:
\$ref: "#/components/schemas/Group"
example:
name: Customer Account 12
typeid: 2
localid: 123456789AB

/groups/{groupid}:
get:
tags: - group
operationId: GetGroupByID
description: Returns a single group with the provided ID.
responses:
"200":
description: A single group
content:
application/json:
schema:
$ref: "#/components/schemas/Group"
        "400":
          description: An id value with an invalid format was provided or the request was otherwise malformed.
        "404":
          description: A resource with that id was not found.
    put:
      tags:
        - group
      operationId: UpdateGroup
      description: Updates a single group with the provided ID to the requested state.
      requestBody:
        description: Non-updatable fields will be ignored. If an ID is provided in the request body, it must match the resource URI.
        content:
          "application/json":
            schema:
              $ref: "#/components/schemas/Group"
example:
name: Customer Account 12
localid: "987654321FF"
typeid: 2
responses:
"200":
description: The resource was updated successfully.
content:
application/json:
schema:
\$ref: "#/components/schemas/Group"
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: A resource with that id was not found.
"409":
description: The request could not be completed because of a database constraint.
delete:
tags: - group
operationId: DeleteGroupByID
description: Removes a single group object. Will **CASCADE** deletion. Any _groupuserpermissions_ assigned to this group will be deleted during removal.
responses:
"204":
description: The resource was successfully deleted.
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: A resource with that id was not found.
"409":
description: The resource could not be deleted because of a database constraint or exception.
parameters: - name: groupid
in: path
description: Groups 'id' uuid value
required: true
schema:
type: string
format: uuid
style: simple

/groups/{groupid}/users:
get:
tags: - group
operationId: GetGroupUsers
description: Returns a list of users assigned to a given group.
responses:
"200":
description: A list of users or an empty array
content:
application/json:
schema:
type: array
items:
\$ref: "#/components/schemas/User"
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: A resource with that id was not found.
parameters: - name: groupid
in: path
description: Groups 'id' uuid value
required: true
schema:
type: string
format: uuid
style: simple

/groupsbylocal/{localid}:
get:
tags: - group
operationId: GetGroupsByLocalId
description: Returns a list of groups with a given local id
responses:
"200":
description: A list of groups or an empty list
content:
application/json:
schema:
type: array
items:
\$ref: "#/components/schemas/Group"
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
parameters: - name: limit
in: query
description: Maximum number of results to return
required: false
schema:
type: integer
style: form - name: offset
in: query
description: Number of items to skip
required: false
schema:
type: integer
style: form
parameters: - name: localid
in: path
description: Group LocalId string value
required: true
schema:
type: string
style: simple

/groups/name/{name}:
get:
tags: - group
operationId: GetGroupByName
description: Returns the UUID of a group given its name.
responses:
"200":
description: The UUID of the group
content:
text/plain:
example: "8ecb4bd7-47b4-424c-af07-c85aa0e42d8a"
"400":
description: A name with an invalid format was provided or the request was otherwise malformed.
"404":
description: A group with that name was not found.
parameters: - name: name
in: path
description: The name of the group
required: true
schema:
type: string
style: simple

/permissions:
get:
tags: - permission
operationId: GetPermissions
description: Returns a list of all permissions.
responses:
"200":
description: A list of permissions or an empty array
content:
application/json:
schema:
type: array
items:
$ref: "#/components/schemas/Permission"
        "400":
          description: Invalid query parameters were provided.
      parameters:
        - name: limit
          in: query
          description: Maximum number of results to return
          required: false
          schema:
            type: integer
          style: form
        - name: offset
          in: query
          description: Number of items to skip
          required: false
          schema:
            type: integer
          style: form
    post:
      tags:
        - permission
      operationId: CreatePermission
      description: Creates a new permission.
      responses:
        "201":
          description: The resource was created.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Permission"
headers:
Location:
description: uri path to the created resource
schema:
type: string
"400":
description: The new resource request was malformed.
"409":
description: The request could not be completed because of a database constraint.
requestBody:
description: Any provided uuid or date/time fields will be ignored.
content:
"application/json":
schema:
\$ref: "#/components/schemas/Permission"
example:
name: "Act on behalf of"

/permissions/{permissionid}:
get:
tags: - permission
operationId: GetPermissionByID
description: Returns a single permission with the provided ID.
responses:
"200":
description: A single permission
content:
application/json:
schema:
$ref: "#/components/schemas/Permission"
        "400":
          description: An id value with an invalid format was provided or the request was otherwise malformed.
        "404":
          description: A resource with that id was not found.
    parameters:
      - name: permissionid
        in: path
        description: Permissions 'id' uuid value
        required: true
        schema:
          type: string
          format: uuid
        style: simple
    put:
      tags:
        - permission
      operationId: UpdatePermission
      description: Updates a single permission with the provided ID to the requested state.
      requestBody:
        description: Non-updatable fields will be ignored. If an ID is provided in the request body, it must match the resource URI.
        content:
          "application/json":
            schema:
              $ref: "#/components/schemas/Permission"
example:
name: Act on behalf of
responses:
"200":
description: The resource was updated successfully.
content:
application/json:
schema:
\$ref: "#/components/schemas/Permission"
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: A resource with that id was not found.
"409":
description: The request could not be completed because of a database constraint.
delete:
tags: - permission
operationId: DeletePermissionByID
description: Removes a single permission object. **DOES NOT CASCADE** Deletion is _restricted_ if this permission is assigned in any relationships.
responses:
"204":
description: The resource was successfully deleted.
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: A resource with that id was not found.
"409":
description: The resource could not be deleted because of a database constraint or exception.

/grouptypes:
get:
tags: - grouptype
operationId: GetGroupTypes
description: Returns a list of all group types.
responses:
"200":
description: A list of group types or an empty array
content:
application/json:
schema:
type: array
items:
$ref: "#/components/schemas/GroupType"
        "400":
          description: Invalid query parameters were provided.
      parameters:
        - name: limit
          in: query
          description: Maximum number of results to return
          required: false
          schema:
            type: integer
          style: form
        - name: offset
          in: query
          description: Number of items to skip
          required: false
          schema:
            type: integer
          style: form
    post:
      tags:
        - grouptype
      operationId: CreateGroupType
      description: Creates a new group type.
      responses:
        "201":
          description: The resource was created.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GroupType"
headers:
Location:
description: uri path to the created resource
schema:
type: string
"400":
description: The new resource request was malformed.
"409":
description: The request could not be completed because of a database constraint.
requestBody:
description: Any provided uuid or date/time fields will be ignored.
content:
"application/json":
schema:
\$ref: "#/components/schemas/GroupType"
example:
name: "CUSTOMER"

/grouptypes/{grouptypeid}:
get:
tags: - grouptype
operationId: GetGroupTypeByID
description: Returns a single group type with the provided ID.
responses:
"200":
description: A single group type
content:
application/json:
schema:
$ref: "#/components/schemas/GroupType"
        "400":
          description: An id value with an invalid format was provided or the request was otherwise malformed.
        "404":
          description: A resource with that id was not found.
    put:
      tags:
        - grouptype
      operationId: UpdateGroupType
      description: Updates a single group type with the provided ID to the requested state.
      requestBody:
        description: Non-updatable fields will be ignored. If an ID is provided in the request body, it must match the resource URI.
        content:
          "application/json":
            schema:
              $ref: "#/components/schemas/GroupType"
example:
name: CUSTOMER
responses:
"200":
description: The resource was updated successfully.
content:
application/json:
schema:
\$ref: "#/components/schemas/GroupType"
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: A resource with that id was not found.
"409":
description: The request could not be completed because of a database constraint.
delete:
tags: - grouptype
operationId: DeleteGroupTypeByID
description: Removes a single group type. **DOES NOT CASCADE** Deletion is _restricted_ if this type is assigned to any group objects.
responses:
"204":
description: The resource was successfully deleted.
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: A resource with that id was not found.
"409":
description: The resource could not be deleted because of a database constraint or exception.
parameters: - name: grouptypeid
in: path
description: Group Type 'id' integer value
required: true
schema:
type: integer
format: int32
style: simple

/grouptypes/{grouptypeid}/groups:
get:
tags: - grouptype
operationId: GetGroupsByGroupType
description: Returns a list of groups with the given group type.
responses:
"200":
description: A list of groups or an empty list
content:
application/json:
schema:
type: array
items:
\$ref: "#/components/schemas/Group"
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: A resource with that id was not found. The group type does not exist.
parameters: - name: limit
in: query
description: Maximum number of results to return
required: false
schema:
type: integer
style: form - name: offset
in: query
description: Number of items to skip
required: false
schema:
type: integer
style: form
parameters: - name: grouptypeid
in: path
description: Group Type 'id' integer value
required: true
schema:
type: integer
format: int32
style: simple

/grouptypes/{grouptypeid}/groups/{localid}:
get:
tags: - grouptype
operationId: GetGroupsByGroupTypeLocalId
description: Returns a list of groups with the given group type and local id.
responses:
"200":
description: A list of groups or an empty list
content:
application/json:
schema:
type: array
items:
\$ref: "#/components/schemas/Group"
"400":
description: An id value with an invalid format was provided or the request was otherwise malformed.
"404":
description: A resource with that id was not found. The group type does not exist.
parameters: - name: limit
in: query
description: Maximum number of results to return
required: false
schema:
type: integer
style: form - name: offset
in: query
description: Number of items to skip
required: false
schema:
type: integer
style: form
parameters: - name: grouptypeid
in: path
description: Group Type 'id' integer value
required: true
schema:
type: integer
format: int32
style: simple - name: localid
in: path
description: Group LocalId string value
required: true
schema:
type: string
style: simple

/b2c/register:
post:
tags: - b2c
operationId: B2CRegister
description: Called by AzureB2C during user registration.
responses:
"200":
description:
content:
application/json:
schema:
$ref: "#/components/schemas/B2CContinuationResponse"
              examples:
                continue:
                  summary: Continue
                  description: The sign-up has succeeded and the user should continue with the login process. In this example an additional return claim updates the user's Display Name attribute.
                  value:
                    version: 1.0.0
                    action: Continue
                    displayname: Test User
                block:
                  summary: Block
                  description: The sign-up has failed or has been blocked. The user should not be allowed to continue registration or login.
                  value:
                    version: 1.0.0
                    action: ShowBlockPage
                    userMessage: This email address is already registered with an account, please login instead.
        "400":
          description: Input validation is required.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/B2CValidationErrorResponse"
requestBody:
content:
application/json:
schema:
\$ref: "#/components/schemas/B2CCreateRequest"

/b2c/token:
post:
tags: - b2c
operationId: B2CToken
description: Called by AzureB2C during token issuance. Performs token enrichment and user JIT provisioning.
responses:
"200":
description:
content:
application/json:
schema:
$ref: "#/components/schemas/B2CContinuationResponse"
              example:
                version: 1.0.0
                action: Continue
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/B2CTokenRequest"

/b2c/userdetails/{useroid}:
get:
tags: - b2c
operationId: B2CGetUserDetails
description: Retrieves extended details about a user from AzureB2C. Since the returned model is from Microsoft Graph directly, not all values are supported by AzureB2C and will be included as permanently null.
responses:
"200":
description: Extended details. Example value shows fields that will contain useful and valid data.
content:
application/json:
example:
AccountEnabled: true
BusinessPhones: - "+1 (555) 555-5555"
City: "Oklahoma City"
CompanyName: "CFS Brands"
Country: "US"
CreatedDateTime: "2023-07-17T14:20:26+00:00"
Department: ""
DisplayName: "Test User"
GivenName: "Test"
Identitites: - AdditionalData: {}
BackingStore:
InitializationCompleted: false
ReturnOnlyChangedValues: false
Issuer: cfsbrandsb2c.onmicrosoft.com
IssuerAssignedId: test.user@cfsbrandsb2c.onmicrosoft.com
OdataType: null
SignIntype: userPrincipalName - AdditionalData: {}
BackingStore:
InitializationCompleted: false
ReturnOnlyChangedValues: false
Issuer: ExternalAzureAD
IssuerAssignedId: ""
OdataType: null
SignIntype: federated
JobTitle: ""
LastPasswordChangeDateTime: "2023-07-17T14:20:24+00:00"
Mail: "test.user@cfsbrands.dev"
MobilePhone: "555-555-1234"
OfficeLocation: "Henfer"
PostalCode: "73131"
SignInActivity:
AdditionalData: {}
BackingStore:
InitializationCompleted: true
ReturnOnlyChangedValues: false
LastNonInteractiveSignInDateTime: "2023-08-18T01:15:23+00:00"
LastNonInteractiveSignInRequestId: "5465ea86-494b-4dda-a366-045dc7090100"
LastSignInDateTime: "2023-08-18T16:59:45+00:00"
LastSignInRequestId: "920f2c82-c56e-48d2-b19a-8f48057e0000"
OdataType: null
SignInSessionsValidFromDateTime: "2023-07-17T14:20:24+00:00"
State: "OK"
StreetAddress: "1234 Example St"
Surname: "User"
UsageLocation: "US"
UserPrincipalName: "test.user@cfsbrandsb2c.onmicrosoft.com"
UserType: "Member"
Id: "8ecb4bd7-47b4-424c-af07-c85aa0e42d8a"
OdataType: "#microsoft.graph.user"
"404":
description: A user with that OID was not found in B2C.
parameters: - name: useroid
in: path
description: User 'oid' uuid value
required: true
schema:
type: string
format: uuid
style: simple

/aad/getoidbyemail:
post:
tags: - aad
operationId: GetOrCreateUserByEmail
description: Returns a user OID given a valid email address. If the user does not exist in the local DB at the time of lookup, the user is retrieved from graph and registered.
responses:
"200":
description: Requested user already existed in the database.
content:
text/plain:
example: 8ecb4bd7-47b4-424c-af07-c85aa0e42d8a
"201":
description: Requested user did not yet exist in the database, but was found and created from AAD graph.
content:
text/plain:
example: 8ecb4bd7-47b4-424c-af07-c85aa0e42d8a
headers:
Location:
description: uri path to the created resource
schema:
type: string
"400":
description: An email with an invalid format was provided or the request was otherwise malformed.
"404":
description: User does not exist in the database and could not be found in AAD graph.
parameters: - name: email
in: query
description: User email address value
required: true
schema:
type: string
format: email
style: simple

/aad/userdetails/{useroid}:
get:
tags: - aad
operationId: AADGetUserDetails
description: Retrieves extended details about a user from AzureAD.
responses:
"200":
description: Extended details. Example value shows fields that will contain useful and valid data.
content:
application/json:
example:
AccountEnabled: true
BusinessPhones: - "+1 (555) 555-5555"
City: "Oklahoma City"
CompanyName: "CFS Brands"
Country: "US"
CreatedDateTime: "2023-07-17T14:20:26+00:00"
Department: "Testing Department"
DisplayName: "Test User"
GivenName: "Test"
Identitites: - AdditionalData: {}
BackingStore:
InitializationCompleted: false
ReturnOnlyChangedValues: false
Issuer: carlislefsp.onmicrosoft.com
IssuerAssignedId: test.user@cfsbrands.com
OdataType: null
SignIntype: userPrincipalName
JobTitle: "QA Tester"
Mail: "test.user@cfsbrands.dev"
MobilePhone: "+1 (555) 555-1234"
OfficeLocation: "Henfer"
PostalCode: "73131"
SignInActivity:
AdditionalData: {}
BackingStore:
InitializationCompleted: true
ReturnOnlyChangedValues: false
LastNonInteractiveSignInDateTime: "2023-08-18T01:15:23+00:00"
LastNonInteractiveSignInRequestId: "5465ea86-494b-4dda-a366-045dc7090100"
LastSignInDateTime: "2023-08-18T16:59:45+00:00"
LastSignInRequestId: "920f2c82-c56e-48d2-b19a-8f48057e0000"
OdataType: null
SignInSessionsValidFromDateTime: "2023-07-17T14:20:24+00:00"
State: "OK"
StreetAddress: "1234 Example St"
Surname: "User"
UsageLocation: "US"
UserPrincipalName: "test.user@cfsbrands.com"
UserType: "Member"
Id: "8ecb4bd7-47b4-424c-af07-c85aa0e42d8a"
OdataType: "#microsoft.graph.user"
"404":
description: A user with that OID was not found in AAD.
parameters: - name: useroid
in: path
description: User 'oid' uuid value
required: true
schema:
type: string
format: uuid
style: simple

components:
schemas:
User:
type: object
properties:
oid:
type: string
format: uuid
email:
type: string
format: EmailAddress
firstname:
type: string
lastname:
type: string
country:
type: string
created:
type: string
format: date-time
description: Date/time that the object was created in UTC
updated:
type: string
format: date-time
description: Date/time that the object was last updated in UTC
required: - oid - email
example:
oid: 398d87be-0741-48ec-a8ab-dcffa48acc21
email: test.user@cfsbrands.dev
firstname: Test
lastname: User
country: United States
created: "2023-08-16T15:18:29.252753Z"
updated: "2023-08-16T15:18:29.252753Z"
Group:
type: object
description: A group which dictates access to a subset of the application, such as a customer account.
properties:
id:
type: string
format: uuid
name:
type: string
typeid:
type: integer
format: int32
description: Indirectly references a grouptype
localid:
type: string
description: Local identifier for the group, such as a customer number.
created:
type: string
format: date-time
description: Date/time that the object was created in UTC
updated:
type: string
format: date-time
description: Date/time that the object was last updated in UTC
required: - name - typeid
example:
id: "1c43cdc0-942a-42b3-8b59-6f35b69fb30a"
name: Customer Account 12
typeid: 2
localid: "123456789AB"
created: "2023-08-16T15:18:29.252753Z"
updated: "2023-08-16T15:18:29.252753Z"
GroupType:
type: object
description: A group category which describes its scope and use-case.
properties:
id:
type: integer
format: int32
name:
type: string
created:
type: string
format: date-time
updated:
type: string
format: date-time
description: Date/time that the object was last updated in UTC
example:
id: 2
name: CUSTOMER
created: "2023-08-16T15:18:29.252753Z"
updated: "2023-08-16T15:18:29.252753Z"
required: - name
Permission:
type: object
description: An individual permission that can be assinged to a user.
properties:
id:
type: string
format: uuid
name:
type: string
created:
type: string
format: date-time
description: Date/time that the object was created in UTC
updated:
type: string
format: date-time
description: Date/time that the object was last updated in UTC
required: - name
example:
id: 38e5562d-a036-4965-b274-3fccef196181
name: Act on behalf of
created: "2023-08-16T15:18:29.252753Z"
updated: "2023-08-16T15:18:29.252753Z"
GroupUserPermission:
type: object
description: A linking object which determines what permission is assigned to a user for a particular group.
properties:
userid:
type: string
format: uuid
groupid:
type: string
format: uuid
permissionid:
type: string
format: uuid
created:
type: string
format: date-time
description: Date/time that the object was created in UTC
updated:
type: string
format: date-time
description: Date/time that the object was last updated in UTC
required: - userid - groupid - permissionid
example:
userid: 398d87be-0741-48ec-a8ab-dcffa48acc21
groupid: 1c43cdc0-942a-42b3-8b59-6f35b69fb30a
permissionid: 38e5562d-a036-4965-b274-3fccef196181
created: "2023-08-16T15:18:29.252753Z"
updated: "2023-08-16T15:18:29.252753Z"
B2CCreateRequest:
type: object
description: A request from AzureB2C describing a registration event.
properties:
email:
type: string
format: EmailAddress
identities:
type: array
items:
$ref: "#/components/schemas/B2CIdentitiy"
        displayName:
          type: string
        givenName:
          type: string
        surname:
          type: string
        country:
          type: string
        step:
          type: string
          description: Describes the B2C flow step which resulted in this request.
        client_id:
          type: string
          format: uuid
          description: Corresponds to id of the referring client application.
        ui_locales:
          type: string
      required:
        - email
        - step
        - client_id
        - identities
      example:
        email: test.user@gmail.com
        identities:
          - signInType: federated
            issuer: google.com
            issuerAssignedId: "123456789"
        displayName: Test User (My Gmail Name)
        givenName: Test
        surname: User
        country: US
        step: PostAttributeCollection
        client_id: 3e945e86-81cb-4736-a81e-ee85cffdcdf6
        ui_locales: en-US
    B2CTokenRequest:
      type: object
      description: A request from AzureB2C describing a token creation event.
      properties:
        objectId:
          type: string
          format: uuid
        email:
          type: string
          format: EmailAddress
        identities:
          type: array
          items:
            $ref: "#/components/schemas/B2CIdentitiy"
givenName:
type: string
surname:
type: string
country:
type: string
step:
type: string
description: Describes the B2C flow step which resulted in this request.
client*id:
type: string
format: uuid
ui_locales:
type: string
required: - objectId - email - step - client_id - identities
example:
email: test.user@gmail.com
identities: - signInType: federated
issuer: google.com
issuerAssignedId: "123456789"
givenName: Test
surname: User
country: US
step: PreTokenIssuance
client_id: 3e945e86-81cb-4736-a81e-ee85cffdcdf6
objectId: 398d87be-0741-48ec-a8ab-dcffa48acc21
ui_locales: en-US
B2CIdentitiy:
type: object
description: Contains a B2C users IDP reference information.
properties:
signInType:
type: string
issuer:
type: string
issuerAssignedId:
type: string
required: - signInType - issuer - issuerAssignedId
example:
signInType: federated
issuer: google.com
issuerAssignedId: "0123456789"
B2CContinuationResponse:
type: object
description: Prompts AzureB2C to allow the user to continue. MUST be returned with a 200 status code. MAY include additional return claims.
properties:
version:
type: string
description: MUST always be '1.0.0'
action:
type: string
description: MUST always be 'Continue'
required: - version - action
example:
version: 1.0.0
action: Continue
displayname: New Display Name
extension*<extensions-app-id>\_CustomAttribute: custom attribute value
B2CBlockResponse:
type: object
description: Prompts AzureB2C to initiate a block page, preventing the user from continuing. MUST be returned with a 200 status code.
properties:
version:
type: string
description: MUST always be '1.0.0'
action:
type: string
description: MUST always be 'ShowBlockPage'
userMessage:
type: string
description: Message presented to the user when directed to the block page.
required: - version - action
example:
version: 1.0.0
action: ShowBlockPage
userMessage: There was an error during sign-up please contact support
B2CValidationErrorResponse:
type: object
description: Prompts AzureB2C to initiate an input validation request. MUST be returned with a 400 status code.
properties:
version:
type: string
description: MUST always be '1.0.0'
status:
type: integer
description: MUST always be 400
action:
type: string
description: MUST always be 'ValidationError'
userMessage:
type: string
description: Message presented to the user when directed to the error page.
required: - version - status - action
example:
version: 1.0.0
status: 400
action: Continue
userMessage: Invalid value for 'XYZ' was entered, please correct it to continue.
securitySchemes:
FunctionKey:
type: apiKey
in: query
name: code

security:

- FunctionKey: []
