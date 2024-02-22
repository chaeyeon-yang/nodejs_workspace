import express, { request, response }  from "express";
import ejs from 'ejs';
//모듈 import 

let app = express(); //express객체를 생성한다 

//미들웨어 - 중간에 여기 거쳐서 온다. 함수들이 전부 실행해서 
//각자 자기 업무만 처리한다.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//모든 응답처리를 담당한다. 
//use 함수에 파라미터로 콜백함수를 준다
//(request, response, next); 세번째 매개변수인 next는 체인을 만들어서 
//이번함수 => 다음함수 => 그다음함수 식으려 여러번 거쳐서 처리될때 유용
//잘안씀, 의미가 중요 
app.use("/", (request, response, next)=>{
    // console.log("////////");
    // next();//밑에 url없는 함수한테 던짐 
});

app.use("/test", (request, response, next)=>{
    console.log("/test");
    next();//밑에 url없는 함수한테 던짐 
});

//어떤 경우에든 url은 중복되면 안된다.
//http://127.0.0.1:4000/get
app.get("/get", (request, response)=>{
    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    response.end("<h1>GET 방식 전달</h1>");
});

//json전송하기 
app.get("/data", (request, response)=>{
    let data = {product_name:"새우깡", product_price:4000};
    //response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    response.send(data); //node가 아니고 =>express가 제공한다 
    //send 함수를 새로 만들음 - express 프레임워크 만든 사람들이 
    //보내는 데이터의 형태에 따라 자동으로 지정한다 
});

//http://localhost:4000/add?x=5&y=7&msg=test
//request 객체를 타고 오는 정보 : get-url.parse, post-URLParamSearch객체 사용
app.get("/add", (request, response)=>{
    //get방식으로 파라미터 전달시 : request객체에 query에 json형태로 달려온다.
    console.log(typeof request.query,  request.query ); 
    let x = request.query.x;
    let y = request.query.y;
    response.send({"x":x, "y":y, "result":parseInt(x)+parseInt(y)}); 
});

//http://localhost:4000/add2/5/7/test 값만 넘긴다. 
app.get("/add2/:x/:y/:msg", (request, response)=>{
    let x = request.params.x; 
    let y = request.params.y; 
    let msg = request.params.msg;
    
    response.send({"x":x, "y":y, "result":parseInt(x)+parseInt(y), 
    "msg":msg}); 
});

/* post방식은 body  부분을 따로 받아서 처리작업을 해야 한다 
   bodyParser 를 제공해준다. 별도로 설치를 하고 
   모든 요청에 bodyParser를 통과했었어야 했는데 => 좀더 편하게 
   express 프레임워크에  bodyParser가 내장이 되었음 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
이 두 구문이 있어야 bodyParser가 동작을 한다 
*/





//html파일 만들어서 form태그를 통해서 POST로 전송하거나 
//curl이나 postman으로 접근해야 한다 
//브라우저 url은 무조건 get방식임 
app.post("/post", (request, response)=>{
    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    response.end("<h1>POST 방식 전달</h1>");
});

//postman으로 해야 한다 
//JSON으로 보내던 x-www-form-urlencoded방식을 사용해서 보내든 
//처리방식이 동일하다 
//스프링부트의 경우 @RequestBody => json을 처리하고자 할때 
//x-www-form-urlencoded 는 그냥 받음 
/*
    get : header에 모든 정보를
           /add?x=4&y=5  ==> query
           /add2/4/5     ==> params 
    post : header에 간단한 url말고는 안보낸다.
           body에 데이터를 전송한다.
           공공기관 구간 암호화 => 솔루션 
          1. multipart/form-data : 파일업로드시 form태그의 post+
                                   form태그의  enctype
                                   enctype="multipart/form-data"
                Ajax의 경우에는 form태그대신에 자바스크립트가 
                제공하는 객체 FormData 객체로 담아 보낸다.
            Ajax - 백앤드서버와 비동기통신을 총칭하는단어 기술명 
          2. x-www-form-urlencoded : form태그의 method속성을 post로 주고 
          3. json방식이 있다  : 데이터를 json형태로 전송한다 
          직접 json형태로 데이터를 만들어야 한다 (Ajax 통신시)
*/
app.post("/userinfo", (request, response)=>{
    //app.use(express.json());
    //app.use(express.urlencoded({ extended: false }));
    let name = request.body.name; 
    let age = request.body.age; 
     
    //response.writeHead(200, {"Content-Type":"application/json;charset=utf-8"});
    //send함수가 적절한 헤더를 알아서 보내준다. writeHead를 호출하지 않는다 
    response.send({name:name, age:age, result:"OK"});
});


//url 요청이 없을 경우에 사용한다. - 맨밑에 두어야 한다 
app.use((request, response)=>{
    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    response.end("<h1>Hi Express</h1>");
});

app.listen(4000, ()=>{
    console.log("sever start http://127.0.0.1:4000");
})
