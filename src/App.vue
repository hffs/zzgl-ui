<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default  {
  name:  'App'
}
</script>

<style> 
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-dialog__header{
    background-color: #457ff4;
    box-shadow: 0px 0px 1px 0px #5857574a;
  }
  .el-dialog__header {
    padding: 15px;
    padding-bottom: 15px;
  }
  .el-dialog__title {
    line-height: 24px;
    font-size: 18px;
    color: #ffffff;
  }
  .el-dialog__headerbtn{
    top:18px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #ffffff;
  }
  .el-dialog__headerbtn:focus .el-dialog__close, .el-dialog__headerbtn:hover .el-dialog__close {
    color: #fefeff;
  }
</style>
