# LoginDemo
email login demo
## API Reference
### 1.getVerificationCode
* URL:
```
localhost:3000/getVerificationCode
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
     status:200,
     success:false,
     message:"邮箱格式错误"
}
```
* Sample Call:
```
curl -X POST -H "Content-Type: application/json" \
     -d '{"email":"example@qq.com","passwd":"123"}' \
     "localhost:3000/api/getVerificationCode"
```
### 2.sendVerificationCode
* URL:
```
localhost:3000/sendVerificationCode
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
     status:200,
     success:false,
     message:"验证码已过期"
}
```
* Sample Call:
```
curl -X POST -H "Content-Type: application/json" \
     -d '{"email":"example@qq.com","verificationCode":"htpb"}' \
     "localhost:3000/api/sendVerificationCode"
```
### 3.login
* URL:
```
localhost:3000/login
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
     status:200,
     success:false,
     message:"未验证用户"
}
```
* Sample Call:
```
curl -X POST -H "Content-Type: application/json" \
     -d '{"email":"example@qq.com","passwd":"123"}' \
     "localhost:3000/api/login"
```
