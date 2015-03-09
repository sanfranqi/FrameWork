#积分系统说明

## 使用

####1、安装 npm 及 spm 依赖

	npm install
	spm install

####2、运行前端开发环境

执行

	grunt server

**注：不支持livereload**, 用 fed server -w -p 8080 config.json 可支持

## 接口文档

[http://ued.local.17173.com/wiki/pages/viewpage.action?pageId=7078088](http://ued.local.17173.com/wiki/pages/viewpage.action?pageId=7078088)

## 原型地址

[http://10.5.27.145:1235/](http://10.5.27.145:1235/)

## 线上环境

http://jifen.local.17173.com/

## 打包

执行 grunt build 即可

##其他

1、css目录下的bootstrap.css和common2.css是用过“SVN文件链接”引用ermp的两个文件，ermp修改了，update会自动更新（需要有ermp的svn权限）