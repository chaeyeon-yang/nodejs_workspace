import http from 'http';
import fs from 'fs';
import ejs from 'ejs'; //npm install ejs
import url, { URLSearchParams } from 'url';
import path from 'path'; 

//path:가상url http://localhost:3000/
//func:url 요청이 왔을때 처리를 담당할 함수 주소
//filename:"요청에 대해서 응답할 html 파일, 전체 경로는 상수나 다른값으로 가공해서 
const hostname="127.0.0.1"; //도메인으로 바뀐다. 
const port = 3000;          //
const hosturl = `${hostname}:${port}`;

const pathMap=[
    {"path":"/", "func":index, "filename": "index"},   
    {"path":"/member", "func":member, "filename": "member/member_join"},   
    {"path":"/member/join", "func":member_join, "filename": ""},
    {"path":"/member/list", "func":member_list, "filename": "member/member_list"},
];



let server = http.createServer((request, response)=>{

    let pathName = url.parse(request.url, true).pathname;
    if(request.method=="GET")
    {
        let idx = pathMap.findIndex((item)=> item.path == pathName);
        if( idx !=-1)
        {
            request["filename"] = pathMap[idx].filename;
            pathMap[idx].func(request, response);
        }
    }
    else if(request.method=="POST" )
    {
        let idx = pathMap.findIndex((item)=> item.path == pathName);
        if( idx !=-1)
        {
            request["filename"] = pathMap[idx].filename;
            pathMap[idx].func(request, response);
        }
    }
    else 
    {
       response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
       response.end("<h1>한글도가능</h1>");
    } 
});

server.listen(3000, "127.0.0.1", ()=>{
    console.log("http://127.0.0.1:3000 start");
    //listen 이 완료되면 호출된다. 
})


//해당파일을 폴더로부터 읽어서 전달해주는 함수 
async function readFile(filename)
{
    //파일의 크기가 작을 경우에는 동기로 읽어도 된다. 비동기로 읽은 경우에 
    //이 함수에서 바로 return 이 안된다.  그럴경우에 async 나 await를 활용해야 한다 
    //readFile -비동기
    let file = path.resolve() + "/html/" + filename + ".html";
    let filedata = "";
    //promise객체는 then 구문 => 동기 
    filedata = await fs.promises.readFile(file, "utf-8");
       
    return filedata;  //async가 붙은 함수는 Promise객체로 반환한다 .
}

//html 파일과 연동 
async function index(request, response){

    console.log( request["filename"] );
    let fileData = await readFile(request["filename"]); //반환값이 Promise타입 
    //then 구문을 써서 처리하던가 아니면 await를 이용해 작업이 완료할때까지 
    //대기를 해야 한다. await를 쓸 경우 주의사항은 함수에 async가 붙어야 한다.
    //반대로 말하면 async가 붙은 함수 안에서만 await 구문이 사용가능하다 

    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    response.end( fileData );
}

async function member(request, response){

    console.log( request["filename"] );
    let fileData = await readFile(request["filename"]);
    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    response.end( fileData );
}

let memberData = [
    {"id":0, username:"홍길동", userid:"test1", "password":"1234", 
              phone:"010-0000-0000", "email":"hong@daum.net"},
    {"id":1, username:"임꺽정", userid:"test2", "password":"1234", 
    phone:"010-0000-0001", "email":"jang@daum.net"},
    {"id":2, username:"장길산", userid:"test3", "password":"1234", 
    phone:"010-0000-0002", "email":"jang@daum.net"}
]; //

function member_join(request, response)
{
    //데이터를 post방식으로 처리해야 한다. 
    //post 방식은 header-url만 , body-나머지정보들 
    //get방식은 header에 모든 정보가 다 전송된다. 
    let body = "";
    request.on('data', (data)=>{
        body+=data;
    });
    request.on("end", ()=>{
        let params = new URLSearchParams(body);
        const obj = Object.fromEntries(params);  //URLSearchParams=> JSON객체 
        console.log( obj );
        memberData.push( obj );
        console.log( memberData );
        console.log(params.get("userid") );
        console.log(params.get("username") );
        //response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
        //response.end("등록성공" );
        
        //페이지를 index로 이동시킨다. 내부적으로 할일이 많아서 직접 index함수를 
        //호출하면 안된다. 
        //페이지 이동 => url 이 바뀌어야 한다. 
        response.writeHead(301, {
            'Location':"http://localhost:3000/"
        });
        response.end(); 

        //index페이지로 이동을 시켜야 한다 -- request에 있던 정보가 사라져야 한다 
    });

    //등록 과정을 거치고 나서, 페이지를 리다이렉트 시켜야 한다. 
    //등록을 하고나서 F5 를 누르면  request가 다시 나오면 안된다. 
}

async function member_list(request, response)
{
    //함수안에서 await가 있으면 반드시 async로 해줘야 한다  
    let fileData = await readFile(request["filename"]);
    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    let result = ejs.render( fileData, {"member_list":memberData});
    response.end( result );
}

