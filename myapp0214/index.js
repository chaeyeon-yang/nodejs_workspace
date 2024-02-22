import fs from 'fs';
import path from 'path';
import express from 'express';
import multer from 'multer';

//upload  객체를 생성한다 
const upload = multer({
    //업로드할  파일의 limit 는 반드시 지정해야 한다.
    storage: multer.diskStorage({ // 저장한공간 정보 : 하드디스크에 저장
       //done() 함수는 첫 번째 인수에는 에러가 있다면 에러를 넣고, 두 번째 인수에는 실제 경로나 파일 이름을 넣어주면 된다.
        //req나 file의 데이터를 가공해 done으로 넘기는 식이다.
        destination(req, file, done) { // 저장 위치
            done(null, 'uploads/'); // uploads라는 폴더 안에 저장
        },
        filename(req, file, done) { // 파일명을 어떤 이름으로 올릴지
            const ext = path.extname(file.originalname); // 파일의 확장자
            //작업이 완료되면 호출될 함수:done이다
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
            // 파일이름 + 날짜 + 확장자 이름으로 저장
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 } // 20메가로 용량 제한
    //용량제한은 반드시 필요하다. 
  });

  //출처: https://inpa.tistory.com/entry/EXPRESS-📚-multer-미들웨어 [Inpa Dev :남성_기술_전문가::티스토리]

  let app = express(); //함수를 통해 객체를 만든다. new가 없어도 된다. 
//app -> 자체가 서버임 

//환경변수값 설정하기 
//views에 ejs 파일 놓을 위치를 지정해야 한다. 
//path.join함수는 "c:/myapp", "dest"=> c:/myapp/dest이런식으로 단어와 단어사이에
//  /를 넣어서 경로로 만들어 준다. 
// __dirname : nodejs 내장변수, 현재 프로그램이 가동중인 폴더 경로를 가져온다 
//이 설정은 지금 index.js파일이 있는 위치에 views라는 폴더를 두고 
//그 폴더안에 ejs를 두겠다는 의미임 
//type:"module", __dirname 사용불가 
//__ 로 시작하는건 내장변수나 내장함수
let dirname = path.resolve();
app.set("views", path.join(dirname, 'views')); 
app.set("view engine", "ejs"); //view엔진은 ejs를 사용하겠다는 의미이다. 
//이 두개의 설정을 하고 나면 response에 render 함수를 사용할 수 있다 
//render 가 views 폴더에서 확장자가 ejs인 파일을 찾아서 읽어서 클라이언트로 보낸다

app.use(express.static(dirname + "/public"));
app.use(express.static(dirname + "/uploads"));

//미들웨어 - 다양한 미들웨어를 거치면서 데이터가 정제되서 온다 

//POST방식으로 전송했을때 request 객체에 body를 붙여준다
//post방식으로 오는 데이터만 별도 처리를 해서 body 속성을 만들어서 보내준다 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//get방식 기본 query, params로 있다 

//use => get 방식도 받고 post 방식도 받는다.
// / => get으로


app.get("/", (request, response)=>{
    //파일을 불러서 전송하기
    // fs.readFile(path.resolve()+"/html/index.html", "utf-8", (err, data)=>{
    //     if(err)
    //     {
    //         response.send("Error file not found");
    //         return; //callback 함수 종료
    //     }

    //     response.send( data );
    // });
    // //ejs엔진이랑 연결작업을 해서 보내야 한다
    //확장자는 ejs여야 한다.
    response.render('index', {title:"제목", 
                              contents:"내용", 
                              flowers:["작약", "천일홍", "백일홍", 
                                       "과꽃", "목련", "목단"]
                              });
    //매개변수가 json형태면 맘대로  
});  

app.get("/data", (request, response)=>{
    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    response.write("<h1>데이터를 많이 보내야할때</h1>");
    response.write("<h1>데이터를 많이 보내야할때 2222</h1>");
    response.end("<h1>Express 시작</h1>");

    //end함수뒤에 write 를 쓰면 이건 예외발생
    response.write("<h1>데이터를 많이 보내야할때 3333</h1>");
    //send 함수는 알아서 header부터 end까지 한번에 보내는거 
    //ERR_STREAM_WRITE_AFTER_END - 
});

app.get("/send", (request, response)=>{
    response.send("<h1>적당히 알아서 전송함</h1>");
    response.send("<h1>적당히 알아서 전송함  22222222</h1>");
    //ERR_STREAM_WRITE_AFTER_END
});


//단순파일이동 
app.get("/filesend1", (req, res)=>{
    res.render("filesend1");
});

//단순파일이동 
app.get("/filesend2", (req, res)=>{
    res.render("filesend2");
});

app.get("/filesend3", (req, res)=>{
    res.render("filesend3");
});

app.get("/filesend4", (req, res)=>{
    res.render("filesend4");
});


//파일저장하기
//multer 라이브러리를 사용할 예정임 
//1.npm install multer 
//2. import multer from 'multer';
//3. multer객체를 생성하면서 여러가지 기본설정을 해야 함 upload 객체만들기

//4. 두번째 인자로 3에서 만든 multer 객체를 전달해야 한다  
//파일을 하나만 전송받겠다 single함수 single(file태그의 name속성값)

app.post("/filesave1", upload.single('file'), (req, res)=>{
    console.log( req.file );  //내용추가됨, 업로드된 파일에 대한 모든 정보가 
                              //이 객체에 포함된다.
    //나머지 값들은 그냥 body에 따라온다
    //res.json(req.file);//json전송임   

    //json데이터를 일반변수들로 해체할때 
    const  {fieldname, filename, originalname, encoding, mimetype,
            destination, path,size}
    = req.file;
    //req.file => JSON객체임 , 
    //const filename = req.file.filename;
    console.log("filename", filename);
    console.log("fieldname", fieldname);
    console.log("originalname", originalname);
    console.log("encoding", encoding);
    console.log("mimetype", mimetype);
    console.log("destination", destination);
    console.log("path", path);
    //toFixed 소수점 반올림, 올림 Math.ceil함수, 버림 Math.floor 함수
    console.log("size", (size/1024/1024).toFixed(0) , "mb");
   
    //데이터베이스에 filename, originalname을 저장한다 
    res.json({result:"OK"});
});

//배열로 받아오려면 multer의 array함수를 사용한다. 
app.post("/filesave2", upload.array('file'), (req, res)=>{
    //console.log( req.files ); 
    
    req.files.forEach( (item)=>{
        const  {fieldname, filename, originalname, encoding, mimetype,
                destination, path,size} = item;
        console.log("filename", filename);
        console.log("fieldname", fieldname);
        console.log("originalname", originalname);
        console.log("encoding", encoding);
        console.log("mimetype", mimetype);
        console.log("destination", destination);
        console.log("path", path);
        console.log("size", (size/1024/1024).toFixed(0) , "mb");
    });
    //데이터베이스에 filename, originalname을 저장한다 
    res.json({result:"OK"});
});

app.post("/filesave3", upload.any('file'), (req, res)=>{
    //console.log( req.files ); 
    
    req.files.forEach( (item)=>{
        const  {fieldname, filename, originalname, encoding, mimetype,
                destination, path,size} = item;
        console.log("filename", filename);
        console.log("fieldname", fieldname);
        console.log("originalname", originalname);
        console.log("encoding", encoding);
        console.log("mimetype", mimetype);
        console.log("destination", destination);
        console.log("path", path);
        console.log("size", (size/1024/1024).toFixed(0) , "mb");
    });
    //데이터베이스에 filename, originalname을 저장한다 
    res.json({result:"OK"});
});
//http://127.0.0.1:4000/download?filename=샘플1707888847686.zip
// http://127.0.0.1:4000/download?filename=KakaoTalk_20221125_102609160_011707896093939.png

app.get("/download", (req, res)=>{
    //파일명이 한글일때 별도 처리가 필요하다
    //encodeURIComponent(파일명) ==> 한글에 특별한 인코딩을 거쳐서 보냄 
    const filename = req.query.filename;
    res.setHeader("Content-Disposition", 
            `attachment;filename=${encodeURIComponent(filename)}`);
    res.sendFile(path.resolve()+"/uploads/"+filename);
});



//캐스캐이딩 방식임 위의 url중 어떤것도 해당되지 않으면 이곳으로 온다 
//에러페이지 작성을 해주면 된다. 
//특정 url을 지정하지 않아서 모든 요청을 다 처리 
app.use((request, response)=>{
    console.log("******");
    response.send("<h1>권한이 없는 페이지입니다.<h1>");

    //*보낼 정보가 많으면 
    //writeHead 먼저 호출하고 write 여러번 호출, 마지막에 end 호출 
    //send 뒤에 send 또 부르면 안된다. send는 헤더도 지가 붙인다. 
    //send -> express모듈, 대충 보내면 알아서 처리  
});

app.listen(4000, ()=>{
    console.log("http://127.0.0.1:4000 start");
});



