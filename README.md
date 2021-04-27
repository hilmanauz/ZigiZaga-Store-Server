# ecommerce-server
API server untuk e-commerce website
link server: https://amazing-ecommerce.herokuapp.com/

secret key: ecommercecihuy

List of available endpoints:
​
- `POST /register`
- `POST /login`
- `GET /products`
- `GET /products/:id`
- `POST /products/:id`
- `PUT /products/:id`
- `DELETE /products/:id`
- `GET /banners`
- `POST /banners/:id`
- `PATCH /banners/:id`
- `DELETE /banners/:id`
- `GET /carts`
- `POST /carts/:id`
- `PUT /carts/:id`
- `DELETE /carts/:id`
- `GET /transactions/:id`
- `POST /transactions/:id`


&nbsp;

Tech Stack used to build this app :
* Vue JS
* Express JS framework
* PostgreSQL
* Bcryptjs
* Cors
* Axios
* Jsonwebtoken
* Sequelize

&nbsp;

## Global Responses
> These responses are applied globally on all endpoints

_Response (500 - Internal server error)_
```
{
  "message": "failed reach server to create data"
}
```

_Response (400 - Bad request)_
```
{
  "message": "[email has an @, Email is required, Password is required, Name is required, Url is required, Price is required, Price must be an integer, Negative value is not allowed, Stock is required, Stock must be an integer]" (validation)
}
```

_Response (401 - Unauthorized)_
```
{
  "message": "invalid username or password"
}
```

_Response (404 - Unauthorized)_
```
{
  "message": "Request object not Found"
}
```

&nbsp;

## RESTful endpoints

### POST /login

> Login user

_Request Body_
```
{
    'email': 'string',
    'password': 'string'
}
```

_Response (201)_
```
 {
    'message': 'Success create user'
 }
```
---
### POST /login

> Login user

_Request Body_
```
{
    'email': 'string',
    'password': 'string'
}
```

_Response (201)_
```
 {
    'access_token': 'string',
    'email': 'string',
    'username': 'string',
 }
```
---
### GET /products

> Get all product data in in category table with has many relation

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
    'id': 'integer',
    'name': 'string',
    'image_url': 'string',
    'price': 'integer',
    'stock': 'integer'
} 

```

---
### POST /products/:id

> Create product data from spesific category

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    'name': 'string',
    'image_url': 'string',
    'price': 'integer',
    'stock': 'integer'
}
```

_Response (201)_
```
 {
    'id': 'integer',
    'name': 'string',
    'image_url': 'string',
    'price': 'integer',
    'stock': 'integer'
 }
 ```

 ---
### GET /products/:id

> GET product data from spesific id product
_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
no need

```

_Response (200)_
```
 {
    'id': 'integer',
    'name': 'string',
    'image_url': 'string',
    'price': 'integer',
    'stock': 'integer'
 }
 ```

 ---
### PUT /products/:id

> Update product title in product data from params id

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    'status': 'string',
}
```

_Response (200)_
```
 {
    'id': 'integer',
    'name': 'string',
    'image_url': 'string',
    'price': 'integer',
    'stock': 'integer'
 }
 ```

  ---
### DELETE /products/:id

> DELETE product data from params id

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    no need
}
```

_Response (200)_
```
 {
    'message': 'Product success to delete'
 }
 ```

 ---
### GET /banners

> Get all banner data in in category table with has many relation

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
    'title': 'string',
    'image_url': 'string',
    'status': 'string'
} 

```

---
### POST /banners/

> Create banner data from spesific category

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    'title': 'string',
    'image_url': 'string',
    'status': 'string',
}
```

_Response (200)_
```
 {
    'id': 'integer',
    'title': 'string',
    'image_url': 'string',
    'status': 'string',
 }
 ```

 ---
### PATCH /banners/:id

> Update banner status in banner data from params id

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    'status': 'string',
}
```

_Response (200)_
```
 {
    'status': 'string',
 }
 ```

  ---
### DELETE /banners/:id

> DELETE banner data from params id

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    no need
}
```

_Response (200)_
```
 {
    'message': 'Banner success to delete'
 }
 ```

 ---
### POST /carts/:id

> Create carts data 

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    'UserId': 'integer',
    'ProductId': 'integer',
    'quantity': 'integer'
}
```

_Response (201)_
```
 {
    'id': 'integer',
    'UserId': 'integer',
    'ProductId': 'integer',
    'quantity': 'integer'
 }
 ```

 ---
### GET /carts

> GET product data from spesific id product
_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
no need

```

_Response (200)_
```
 {
    'id': 'integer',
    'UserId': 'integer',
    'ProductId': 'integer',
    'quantity': 'integer',
    'Product': [
      {
        'id': 'integer',
        'name': 'string',
        'image_url': 'string',
        'price': 'integer',
        'stock': 'integer'
      }
    ]
 }
 ```

 ---
### PUT /products/:id

> Update product title in product data from params id

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    'quantity': 'integer',
}
```

_Response (200)_
```
 {
    'message': 'Success updated cart'
 }
 ```

  ---
### DELETE /products/:id

> DELETE product data from params id

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    no need
}
```

_Response (200)_
```
 {
    'message': 'Success delete cart'
 }
 ```

  ---
### POST /transactions/:id

> Create transactions data 

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    'totalPrice': 'integer',
    'carts': [
      {
        'id': 'integer',
        'UserId': 'integer',
        'ProductId': 'integer',
        'quantity': 'integer',
        'Product': [
          {
            'id': 'integer',
            'name': 'string',
            'image_url': 'string',
            'price': 'integer',
            'stock': 'integer'
          }
        ]
      } ...
    ]
}
```

_Response (201)_
```
 {
    'message' : 'Transaction successfull'
 }
 ```

 ---
### GET /transactions

> GET Transaction data

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
no need

```

_Response (200)_
```
 {
    'id': 'integer'
    'totalPrice': 'integer',
    'carts': [
      {
        'UserId': 'integer',
        'ProductId': 'integer',
        'quantity': 'integer',
        'Product': [
          {
            'id': 'integer',
            'name': 'string',
            'image_url': 'string',
            'price': 'integer',
            'stock': 'integer'
          }
        ]
      } ...
    ]
 }
 ```

 ### GET /photos

> GET Photos data from API

_Response (200)_
```
 {
    "photos": [
        {
            "id": 3056059,
            "width": 4912,
            "height": 7360,
            "url": "https://www.pexels.com/photo/person-standing-infront-of-a-display-window-3056059/",
            "photographer": "Collis",
            "photographer_url": "https://www.pexels.com/@photosbycollis",
            "photographer_id": 1571791,
            "avg_color": "#898168",
            "src": {
                "original": "https://images.pexels.com/photos/3056059/pexels-photo-3056059.jpeg",
                "large2x": "https://images.pexels.com/photos/3056059/pexels-photo-3056059.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", ...
            },
            "liked": false
        }...
 }
 ```