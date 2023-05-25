## Node.Js with Express

Javascript 런타임 `Node.Js`를 통해 웹 서버 API를 개발할 수 있습니다.

물론 내장되어 있는 `built-in (빌트인)` 모듈을 이용하여 웹 개발이 가능합니다.

하지만, Python 언어의 `Flask`나 `Django` 또는 `JAVA` 언어의 `Spring`과 같은 웹 프레임워크를 통한 웹개발도 가능합니다.

<br>

### 📌 Web Framework

```
Most websites share a very similar (not to sat identical) structure.
The aim of frameworks is to provide a common structure so that developers don't have to redi to from scratch and can reuse the code provided.
```

프레임워크를 사용하면서 얻을 수 있는 이점은 다음과 같습니다:

- 효율적인 코드 작성 가능
- 코드의 퀄리티 향상
- 유지 보수에 유리

반면, 장점을 크게 해치지 않는 단점도 있는데요.

- 학습시간이 필요함.
- 프레임워크 제작자의 의도에 따른 코드 구조 설계 필요

<br>

### 📌 Express

앞서 언급한 바와 같이 하나의 언어에서도 다양한 프레임워크가 사용될 수 있습니다.

Node에서도 다양한 프레임워크가 존재하는데요.

`Express`를 소개하는 영어 문구 중 하나는 다음과 같습니다:
```
Express is Fast, unopinionated, minimalist web framework for Node.js.
```

즉, API 웹 서버를 좀더 빠르고, 쉽게 개발하여 유지 보수를 효율적으로 관리할 수 있는 프레임워크입니다.

<br>
<br>

## ✅ Express 초기세팅

웹 API 서버를 개발하기 전에 우리는 필요한 모듈, 패키지를 설치하여 개발 단계에서 사용하거나, 배포 단계에서 사용해야 합니다.

`Node` 기반의 앱은 `npm`이나, `yarn` 명령어를 통해 패키지를 설치할 수 있습니다.

```
npm install
// 혹은
yarn add
```

### 📌 package.json 파일 파헤쳐보기

패키지나 모듈을 설치하게 되면, 아래 두가지 요소가 추가되는 것을 확인할 수 있는데요.

__`dependencies`__

해당 하위 리스트에는 애플리케이션 동작과 연관된 패키지, 모듈, 라이브러리의 항목과 버전이 나열됩니다.

실제 애플리케이션이 동작하기 위해 필요한 요소들을 알려주는 것이죠.

예시)
```
npm install express
```

__`devDependencies`__

반면, 후자의 경우에는 애플리케이션 동작과 직접적으로 연관이 없는 요소를 담고 있습니다.

개발할 때 필요한 패키지, 모듈, 라이브러리가 위치하게 되며,  
배포할 때는 포함되지 않는 요소들입니다.

예시)
```
npm install --save-dev nodemon
```
<br>

### 📌 Express

`Express`를 설치 방법은 다음과 같습니다:
```
npm install express
```

<br>

### 📌 Nodemon

`Nodemon`을 통해 서버의 수정 사항을 자동으로 반영할 수 있습니다.

코드를 수정하게 되면, 새로고침이나 서버를 껐다 켜야하는 소요를 줄일 수 있습니다.

- 설치 방법은 다음과 같습니다:
```
npm install --save-dev nodemon
// 혹은
npm install -g nodemon
```

- `nodemon`으로 서버를 실행하는 방법은 다음과 같습니다.
`packaga.json` 내부의 코드를 아래와 변경해줍니다.
```
// package.json
{
    ...
    "scripts": {
        "start: "nodemon app.js",
    }
    ...
}
```
이후에는 `npm start`로 서버를 실행할 수 있으며, 코드를 수정하는 경우 자동으로 반영됩니다.

만약 수동으로 서버를 새로고침 하고 싶다면, 터미널에 `rs` 명령어를 입력해주면 됩니다.

<br>

### 📌 Cors

`cors`는 서로 다른 도메인에서 서로 간의 통신을 가능하게 해줍니다.

설치 방법은 다음과 같습니다:
```
npm install cors
```

모든 request 혹은 하나의 request에 cors 요청을 설정할 수 있는데요,

`app.js` 파일의 주석을 확인해주세요!

cors에 대한 자세한 설명은 [CORS 설명 블로그](https://evan-moon.github.io/2020/05/21/about-cors/)를 확인해보세요!

<br>

### 📌 Dotenv

`.env` 파일을 통해 환경변수를 관리할 수 있습니다.

`dotenv` 라이브러리는 현재 디렉토리 경로에 위치한 `.env` 파일의 환경변수를 읽어냅니다.

설치 방법은 다음과 같습니다:
```
npm install dotenv
```

<br>

### 📌 Morgan

`morgan`은 로그 (log)를 관리하기 위한 미들웨어 중 하나입니다.

`log`란 무슨 일이 어디에서 발생했는지를 기록하는 것을 의미하는데요.

웹 서버에서는 `HTTP 통신`이 발생하면,  
`log`를 통해 요청 메서드, 상태코드, 반환 데이터 등 통신 과정과 결과를 확인할 수 있습니다.

설치 방법은 다음과 같습니다:
```
npm install morgan
```

__`Morgan Format`__

1. combined
    - 배포 환경에서 사용하는 것을 권장합니다.
    - 불특정 다수가 접속하기 때문에 IP를 로그에 기록합니다.

2. common

3. dev
    - 개발 환경에서 사용하는 것을 권장합니다.
    - `response(요청)`에 따라 색상이 입혀진 축약된 응답 코드를 로그에 기록합니다.
 
4. short
    - 기본 설정보다 짧은 로그를 출력합니다.
    - 응답 시간을 포함하고 있습니다.

5. tiny
    - 최소화된 로그를 출력합니다.
    - `dev` 포맷을 사용했을 때의 큰 차이점은 없습니다.