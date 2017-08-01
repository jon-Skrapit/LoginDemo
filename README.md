# LoginDemo
email login demo
## API Reference
### 1.getVerificationCode
* URL:
```
localhost:3000/api/getVerificationCode
```
* Method:
```
POST
```
* Data Params:
```
email=[string] passwd=[string]
```
* Success Response:
```
{
     status:200,
     success:true,
     message:"发送验证码成功"
}
```
* Error Response:
```
{
     status:400,
     success:false,
     message:"邮箱格式错误"
}
```
* Sample Call:
```
curl -X POST -H "Content-Type: application/json" -d '{"email":"example@qq.com","passwd":"123"}' "localhost:3000/api/getVerificationCode"
```
### 2.sendVerificationCode
* URL:
```
localhost:3000/api/sendVerificationCode
```
* Method:
```
POST
```
* Data Params:
```
email=[string] verificationCode=[string]
```
* Success Response:
```
{
     status:200,
     success:true,
     message:"验证码正确"
}
```
* Error Response:
```
{
     status:206,
     success:false,
     message:"验证码已过期"
}
```
* Sample Call:
```
curl -X POST -H "Content-Type: application/json" -d '{"email":"example@qq.com","verificationCode":"htpb"}' "localhost:3000/api/sendVerificationCode"
```
### 3.login
* URL:
```
localhost:3000/api/login
```
* Method:
```
POST
```
* Data Params:
```
email=[string] passwd=[string]
```
* Success Response:
```
{
     status:200,
     success:true,
     message:"登陆成功"
}
```
* Error Response:
```
{
     status:401,
     success:false,
     message:"密码错误"
}
```
* Sample Call:
```
curl -X POST -H "Content-Type: application/json" -d '{"email":"example@qq.com","passwd":"123"}' "localhost:3000/api/login"
```
