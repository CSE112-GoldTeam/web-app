## Introduction
-----------------
About all the api calls require authentication. Meaning every call must include the `api token` in the `Authentication` header to successful access resources. See [Authentication](#api-Authentication) for more.

Also, ensure that the proper `Content-Type` header is always set, so the data sent is received properly.

For example, when trying to get authentcated:
```
curl -X POST -i http://localhost:3000/api/auth \
-H "Authorization: Basic bm9ydGh3b29kLmRlbnRhbEBnbWFpbC5jb206cGFzc3dvcmQ=" \
-H "Content-Type: application/json" \
-d '{"name":"Frodo"}'
```
In this case, `Content-Type` is set to `application/json`, so the JSON data `{"name":"Frodo"}` is received as a JSON.
