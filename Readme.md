# AdoptMe NodeJS API With Testing Deployed With Render

## _( -------------> PROJECT IN PROGRESS <------------- )_

### Testing isolated elements of the project

- Based on the Adoptme project we have, we are asked to carry out a testing process for the bcrypt utilities and the functionality of the DTO. The elements that we are asked to validate are:

1. The service must perform an effective hash of the password (it must be verified that the result is different from the original password)
2. The hash performed must be able to be effectively compared with the original password (the comparison must result in true)
3. If the hashed password is altered, it must fail in the comparison with the original password.
4. On the part of the user DTO: Verify that the DTO unifies the first and last name in a single property. (Remember that you can evaluate multiple expects)
5. On the part of the user DTO: The DTO must eliminate unnecessary properties such as password, first_name, last_name.

### Testing the Pets module

- Continue with the flow of the pets module to be able to perform the following tests.

1. When creating a pet with only the basic data. You must verify that the created pet has a property adopted : false
2. If you want to create a pet without the name field, the module must respond with a status 400.
3. When getting the pets with the GET method, the response must have the status and payload fields. In addition, payload must be of array type.
4. The PUT method must be able to correctly update a given pet (this can be tested by comparing the previous value with the new value in the database).
5. The DELETE method must be able to delete the last pet added, this can be achieved by adding the pet with a POST, taking the id, deleting the pet with the DELETE, and then verifying if the pet exists with a GET

### Session module tests

- Verify that the login returns a cookie

1. First we will perform a registration. 2. Later, with the same registered user, we will call our login
3. From the login, we will not necessarily evaluate the response, but also our point of interest will be to receive a cookie with the user.
4. We will use this cookie later to test that the current endpoint receives the cookie and gives us the information we need.

### Session module tests (Unprotected Routes)

- There are two endpoints: /unprotectedLogin and /unprotectedCurrent in the session router. Evaluate:

1. That the unprotectedLogin endpoint returns a cookie named unprotectedCookie.
2. That the unprotectedCurrent endpoint returns the complete user, evaluate that all the fields that were saved in the database are present.