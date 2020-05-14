import { uploadAvatar } from "@/api/system/file";
/*富文本编辑图片上传配置*/
const uploadConfig = {
    //action:  '/system/file/upload',  // 必填参数 图片上传地址
    //methods: 'POST',  // 必填参数 图片上传方式
    token: '',  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
    name: 'img',  // 必填参数 文件的参数名
    size: 500,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
    accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'  // 可选 可上传的图片格式
};

// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
    ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
           ['blockquote', 'code-block'],     //引用，代码块


           [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
           [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
           [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
           [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
           [{ 'direction': 'rtl' }],             // 文本方向


           [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
           [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题


           [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
           [{ 'font': [] }],     //字体
           [{ 'align': [] }],    //对齐方式


           ['clean'],    //清除字体样式
           ['image']    //上传图片、上传视频
            //['image','video']    //上传图片、上传视频
];



const handlers = {
	image: function image() {
		var self = this;

		var fileInput = this.container.querySelector('input.ql-image[type=file]');
		if(fileInput === null) {
			fileInput = document.createElement('input');
			fileInput.setAttribute('type', 'file');
			// 设置图片参数名
			if(uploadConfig.name) {
				fileInput.setAttribute('name', uploadConfig.name);
			}
			// 可设置上传图片的格式
			fileInput.setAttribute('accept', uploadConfig.accept);
			fileInput.classList.add('ql-image');
			// 监听选择文件
			fileInput.addEventListener('change', function() {
				// 创建formData
				let formData = new FormData();
				formData.append('file', fileInput.files[0]);
				fileInput.value = '';
                //这里 请求
                uploadAvatar(formData).then(response => {
                    
                    let length = self.quill.getSelection(true).index; 
                    self.quill.insertEmbed(length, 'image', process.env.VUE_APP_BASE_API + response.imgUrl);
                    self.quill.setSelection(length + 1)
                    fileInput.value = ''
                  }).catch(response => {
                    
                  })
			});
			this.container.appendChild(fileInput);
		}
		fileInput.click();
	}
};
export default {
    placeholder: '',
    theme: 'snow',  // 主题
    modules: {
        toolbar: {
            container: toolOptions,  // 工具栏选项
            handlers: handlers  // 事件重写
        }
    }
};