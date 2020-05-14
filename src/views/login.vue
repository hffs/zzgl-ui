<template>
  <div class="login">
    <div class="loginbox">
      <h3 class="title">CMMI认证实施及咨询服务管理系统</h3>
      <div class="loginboxc">
        <div class="half halfl">
          <div class="texiao">
            <div class="texiaobox">
              <div class="texiaoboxc">
                <div class="teimg">
                  <img src="../assets/image/loginx1.png" alt="">
                </div>
                <div class="teimg2">
                  <div class="teimg3">
                    <img src="../assets/image/loginx2.png" alt="">
                  </div>
                </div>
              </div>
            </div>
            <img class="bgimg" src="../assets/image/loginx.png" alt="">
          </div>
        </div>
        <div class="half halfr">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <el-form-item prop="authCode">
              <h2>用户登录</h2>
            <el-input v-model="loginForm.authCode" type="text" auto-complete="off" placeholder="企业编码">
              <svg-icon slot="prefix" icon-class="list" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
                @keyup.enter.native="handleLogin">
                <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%"
                @keyup.enter.native="handleLogin">
                <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
              </el-input>
              <div class="login-code">
                <img :src="codeUrl" @click="getCode">
              </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
              <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>

      </div>

    </div>
    <div class="el-login-footer">
      <span>Copyright © ZYSL All Rights Reserved.</span>
      <span><a href="http://www.beian.miit.gov.cn/" target="_blank">陕ICP备20002325号-5</a></span>
    </div>
    <!-- <div class="footbg">
      <img src="../assets/image/loginx3.png" alt="">
    </div> -->
  </div>
</template>

<script>
  import {
    getCodeImg
  } from '@/api/login'
  import Cookies from 'js-cookie'
  import {
    encrypt,
    decrypt
  } from '@/utils/jsencrypt'

  export default {
    name: 'Login',
    data() {
      var checkAuthCode = (rule, value, callback) => {
        var t=/^[0-9a-zA-Z]*$/g;
        var p=t.test(value)
        if (!value) {
          return callback(new Error('租户编码不能为空'))
        } else if (!p) {
          callback(new Error('租户编码只能输入字母数字'))
        } else {
          callback()
        }
      }
      return {
        codeUrl: '',
        cookiePassword: '',
        loginForm: {
          authCode: '',
          username: '',
          password: '',
          rememberMe: false,
          code: '',
          uuid: ''
        },
        loginRules: {
          authCode: [{
            validator: checkAuthCode,
            trigger: ['blur', 'change']
          }],
          username: [{
            required: true,
            trigger: 'blur',
            message: '用户名不能为空'
          }],
          password: [{
            required: true,
            trigger: 'blur',
            message: '密码不能为空'
          }],
          code: [{
            required: true,
            trigger: 'change',
            message: '验证码不能为空'
          }]
        },
        loading: false,
        redirect: undefined
      }
    },
    // watch: {
    //   $route: {
    //     handler: function(route) {
    //       this.redirect = route.query && route.query.redirect
    //     },
    //     immediate: true
    //   }
    // },
    created() {
      this.getCode()
      this.getCookie()
    },
    methods: {
      getCode() {
        getCodeImg().then(res => {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        })
      },
      getCookie() {
        const authCode = Cookies.get('authCode')
        const username = Cookies.get('username')
        const password = Cookies.get('password')
        const rememberMe = Cookies.get('rememberMe')
        this.loginForm = {
          authCode: authCode === undefined ? this.loginForm.authCode : authCode,
          username: username === undefined ? this.loginForm.username : username,
          password: password === undefined ? this.loginForm.password : decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            if (this.loginForm.rememberMe) {
              Cookies.set('authCode', this.loginForm.authCode, {
                expires: 30
              })
              Cookies.set('username', this.loginForm.username, {
                expires: 30
              })
              Cookies.set('password', encrypt(this.loginForm.password), {
                expires: 30
              })
              Cookies.set('rememberMe', this.loginForm.rememberMe, {
                expires: 30
              })
            } else {
              Cookies.remove('authCode')
              Cookies.remove('username')
              Cookies.remove('password')
              Cookies.remove('rememberMe')
            }
            this.$store
              .dispatch('Login', this.loginForm)
              .then(() => {
                this.loading = false
                this.$router.push({
                  path: this.redirect || '/'
                })
              })
              .catch(() => {
                this.loading = false
                this.getCode()
              })
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background: linear-gradient(#2086FE, #A6D3FF);
    background: url(../assets/image/login-background2.jpg);
    background-size: 100% 100%;
  }

  .loginbox {
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    width: 80%;
  }

  .loginboxc {
    display: flex;
    flex-direction: row;
  }

  .loginboxc .half {
    position: relative;
    width: 50%;
  }

  .loginbox .title {
    margin: 0;
    font-size: 65px;
    font-weight: normal;
    color: #fff;
    text-align: center;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    margin-bottom: 155px;
  }

  .texiao {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .texiao img{max-width: 100%;width: 100%;}
  .texiao img.bgimg{position: absolute;bottom: -7%;left: 0;}
  .texiaobox {
    position: absolute;
    bottom: -22%;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .texiaoboxc {
    position: relative;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .teimg {
    width: 74%;
    position: absolute;
    bottom: 40%;
    left: 50%;
    transform: translateX(-50%);

  }
   .teimg img{ animation: mymove 3s ease-in-out infinite;}
  .teimg2{
    width: 43%;
    position: absolute;
    bottom: 30%;
    left: 50%;
    transform: translateX(-50%);
  }
  .teimg2 img{ animation: mymove2 6s ease-in-out infinite;}
  .teimg3{animation: mymove3 3s ease-in-out infinite;}
  .clear{clear: both;}
  @keyframes mymove {
    0% {
      transform: translateY(0px);
    }

    50% {
       transform: translateY(-45px);
    }

    100% {
       transform: translateY(0px);
    }
  }
@keyframes mymove3 {
    0% {
      transform: translateY(0px);
    }

    50% {
       transform: translateY(-25px);
    }

    100% {
       transform: translateY(0px);
    }
  }
  @keyframes mymove2 {
    0% {
      transform: rotateY(0deg);
    }

    50% {
      transform: rotateY(35deg);
    }

    100% {
      transform: rotateY(0deg);
    }
  }
  .login-form {
    border-radius: 20px;
    background: #ffffff;
    margin-left: 20%;
    width:80%;
    max-width: 400px;
    padding: 40px 8%;

    .el-input {
      height: 38px;

      input {
        height: 38px;
      }
    }

    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }

    h2 {
      margin: 0;
      margin-bottom: 25px;
      font-size: 24px;
      color: #3370ea;
      font-weight: normal;
      text-align: center;
    }

    .el-button--primary {
      background: #3370EA;
      outline: none;
    }

    .el-button--primary:hover {
      background: #5B90FA;
    }

    .el-input__inner {
      border-top: none;
      border-left: none;
      border-right: none;
      border-radius: 0;
    }
  }

  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }

  .login-code {
    cursor: pointer;
    border: 1px solid #DCDFE6;
    border-radius: 5px;
    width: 33%;
    height: 38px;
    float: right;

    img {
      float: left;
      max-width: 100%;
      height: 100%;
      cursor: pointer;
      vertical-align: middle;
    }
  }

  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    text-shadow: 0px 1px 2px rgba(0,0,0,0.7);
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }
  .footbg{width: 100%;position: fixed;bottom: 0;left: 0;}
  .footbg img{width: 100%;}
  @media only screen and (max-width:1200px){
    .loginbox .title{
      font-size: 48px;
      margin-bottom: 100px;
    }
  }
  @media only screen and (max-width:750px){
    .loginbox .title{
      font-size: 28px;
      margin-bottom: 40px;
    }
    .loginboxc .half{width: 100%;}
    .halfl{display: none;}
    .login-form{margin-left: 0;width: 100%;max-width: 100%;}
    .login{background-size: cover;}
  }
</style>
