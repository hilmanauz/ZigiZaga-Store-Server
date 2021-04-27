const request = require("supertest");
const app = require("../app");
const deleteProduct = require("../helpers/delete-product")
let token;

beforeAll(function(done){
    const body = {
        email: 'admin@mail.com',
        password: '1234'
    }
    request(app)
        .post("/login")
        .send(body)
        .end(function(err, res){
            if(err){
                done(err)
            } else {
                token = res.body.access_token;
                done();
            }
        })
})

// afterAll(function(done){
//     deleteProduct()
//         .then(() => done())
//         .catch(done)
// })

describe("testing POST /login", function(){
    describe(" success", function(){
        it("status code 201", function(done){
            const body = {
                email: 'admin@mail.com',
                password: '1234'
            }
            request(app)
                .post("/login")
                .send(body)
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(200);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("access_token");
                        expect(typeof res.body.access_token).toEqual("string");
                        done()
                    }
                })
        })
    })
    
    describe("failed", function(){
        it("status code 401 wrong password", function(done){
            const body = {
                email: 'admin@mail.com',
                password: '123'
            }
            request(app)
                .post("/login")
                .send(body)
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(401);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(res.body.errors).toEqual("Password is incorrect");
                        done();
                    }
                })
        })
    
        it("status code 401 email doesnt exist", function(done){
            const body = {
                email: 'user@mail.com',
                password: '123'
            }
            request(app)
                .post("/login")
                .send(body)
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(401);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(res.body.errors).toEqual("Email is not exist");
                        done()
                    }
                })
        })
    
        it("status code 400 email and password are required", function(done){
            const body = {
                email: '',
                password: ''
            }
            request(app)
                .post("/login")
                .send(body)
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(400);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(Array.isArray(res.body.errors)).toEqual(true);
                        expect(res.body.errors).toEqual(
                            expect.arrayContaining(["Email is required", "Password is required"])
                        )
                        done()
                    }
                })
        })
    })
})
    
describe("testing POST /products", function(){
    describe("success", function(){
        it("status code 201", function(done){
            const body = {
                name:'Sepatu Adidas',
                image_url:'abc',
                price:10000,
                stock:12
            }
            request(app)
                .post("/products")
                .send(body)
                .set('access_token', token)
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(201);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("id");
                        expect(typeof res.body.id).toEqual("number");
                        expect(res.body).toHaveProperty("name", body.name);
                        expect(res.body).toHaveProperty("image_url", body.image_url);
                        expect(res.body).toHaveProperty("price", body.price);
                        expect(res.body).toHaveProperty("stock", body.stock);
                        done();
                    }
                })
        })
    })

    describe("failed", function(){
        it("status code 401 access_token doesnt exist", function(done){
            const body = {
                name:'Sepatu Adidas',
                image_url:'abc',
                price:10000,
                stock:12
            }
            request(app)
                .post("/products")
                .send(body)
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(401);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(res.body.errors).toEqual("Unauthorized");
                        done()
                    }
                })
        })

        it("status code 401 access_token is not valid", function(done){
            const body = {
                name:'Sepatu Adidas',
                image_url:'abc',
                price:10000,
                stock:12
            }
            request(app)
                .post("/products")
                .send(body)
                .set("access_token", "asdnqwidjoasdkeonfoaiosdj")
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(401);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(res.body.errors).toEqual("Unauthorized");
                        done()
                    }
                })
        })

        it("status code 400 input value is required", function(done){
            const body = {
                name:'',
                image_url:'',
                price: '',
                stock: ''
            }

            request(app)
                .post("/products")
                .send(body)
                .set('access_token', token)
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(400);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(Array.isArray(res.body.errors)).toEqual(true);
                        expect(res.body.errors).toEqual(
                            expect.arrayContaining(["Name is required", "Url is required", "Price is required", "Price must be an integer", "Stock is required", "Stock must be an integer"])
                        )
                        done()
                    }
                })
        })
        
        it("status code 400 negative input on price", function(done){
            const body = {
                name:'Sepatu Adidas',
                image_url:'abc',
                price:-100,
                stock:12
            }

            request(app)
                .post("/products")
                .send(body)
                .set('access_token', token)
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(400);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(Array.isArray(res.body.errors)).toEqual(true);
                        expect(res.body.errors).toEqual(
                            expect.arrayContaining(["Negative value is not allowed"])
                        )
                        done()
                    }
                })
        })

        it("status code 400 negative input on stock", function(done){
            const body = {
                name:'Sepatu Adidas',
                image_url:'abc',
                price:10000,
                stock:-12
            }

            request(app)
                .post("/products")
                .send(body)
                .set('access_token', token)
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(400);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(Array.isArray(res.body.errors)).toEqual(true);
                        expect(res.body.errors).toEqual(
                            expect.arrayContaining(["Negative value is not allowed"])
                        )
                        done()
                    }
                })
        })

    })
})

describe('testing PUT /products/:id', function(){
    const id = 1;
    describe('success', function(){
        it("status code 200", function(done){
            const body = {
                name:'Sepatu kido',
                image_url:'abc',
                price:5000,
                stock:10
            }

            request(app)
                .put(`/products/${id}`)
                .send(body)
                .set('access_token', token)
                .end(function(err, res){
                    expect(res.statusCode).toEqual(200);
                    expect(res.body).toHaveProperty("id");
                    expect(typeof res.body.id).toEqual("number");
                    expect(res.body).toHaveProperty("name", body.name);
                    expect(res.body).toHaveProperty("image_url", body.image_url);
                    expect(res.body).toHaveProperty("price", body.price);
                    expect(res.body).toHaveProperty("stock", body.stock);
                    done();
                })
        })
    })    

    describe('failed', function(){
        it("status code 401 access_token doesnt exist", function(done){
            const body = {
                name:'Sepatu Adidas',
                image_url:'abc',
                price:5000,
                stock:10
            }
            request(app)
                .put(`/products/${id}`)
                .send(body)
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(401);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(res.body.errors).toEqual("Unauthorized");
                        done()
                    }
                })
        })

        it("status code 401 access_token is not valid", function(done){
            const body = {
                name:'Sepatu Adidas',
                image_url:'abc',
                price:10000,
                stock:10
            }

            request(app)
                .put(`/products/${id}`)
                .send(body)
                .set('access_token', "oqwdpqjfpowkdpoqkwpodjie")
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(401);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(res.body.errors).toEqual("Unauthorized");
                        done()
                    }
                })
        })

        it("status code 400 negative input on stock", function(done){
            const body = {
                name:'Sepatu Adidas',
                image_url:'abc',
                price:5000,
                stock:-10
            }

            request(app)
                .put(`/products/${id}`)
                .send(body)
                .set('access_token', token)
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(400);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(Array.isArray(res.body.errors)).toEqual(true);
                        expect(res.body.errors).toEqual(
                            expect.arrayContaining(["Negative value is not allowed"])
                        )
                        done()
                    }
                })
        })

        it("status code 400 string input in stock", function(done){
            const body = {
                name:'Sepatu Adidas',
                image_url:'abc',
                price: 5000,
                stock: 'abc'
            }

            request(app)
                .put(`/products/${id}`)
                .send(body)
                .set('access_token', token)
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(400);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(Array.isArray(res.body.errors)).toEqual(true);
                        expect(res.body.errors).toEqual(
                            expect.arrayContaining(["Stock must be an integer"])
                        )
                        done()
                    }
                })
        })

        it("status code 400 string input in stock", function(done){
            const body = {
                name:'Sepatu Adidas',
                image_url:'abc',
                price: -5000,
                stock: 10
            }

            request(app)
                .put(`/products/${id}`)
                .send(body)
                .set('access_token', token)
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(400);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(Array.isArray(res.body.errors)).toEqual(true);
                        expect(res.body.errors).toEqual(
                            expect.arrayContaining(["Negative value is not allowed"])
                        )
                        done()
                    }
                })
        })
    })
})

describe('testing DELETE /products/:id', function(){
    const id_success = 1;
    const id_fail = 1;
    describe('success', function(){
        it("status code 200", function(done){
            request(app)
                .delete(`/products/${id_success}`)
                .set('access_token', token)
                .end(function(err, res){
                    expect(res.statusCode).toEqual(200);
                    expect(typeof res.body).toEqual("object");
                    expect(res.body).toHaveProperty("message");
                    expect(res.body.message).toEqual("Success Delete")
                    done();
                })
        })
    })    

    describe('failed', function(){
        it("status code 401 access_token doesnt exist", function(done){
            request(app)
                .delete(`/products/${id_fail}`)
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(401);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(res.body.errors).toEqual("Unauthorized");
                        done()
                    }
                })
        })

        it("status code 401 access_token is not valid", function(done){
            request(app)
                .delete(`/products/${id_fail}`)
                .set('access_token', "asdqwfnpiqwdjoqkwedasdipqoke")
                .end(function(err, res){
                    if(err){
                        done(err)
                    } else {
                        expect(res.statusCode).toEqual(401);
                        expect(typeof res.body).toEqual("object");
                        expect(res.body).toHaveProperty("errors");
                        expect(res.body.errors).toEqual("Unauthorized");
                        done()
                    }
                })
        })
    })
})