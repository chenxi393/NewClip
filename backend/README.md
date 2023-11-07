# NewClip后端介绍


源代码及如何运行程序的说明，建议放到README 中;
架构设计文档(含模块分工，包括谁负责哪些模块)，建议放到 docs 目录中;
录制的 DEMO 视频，需在 README 中可以找到该 DEMO 视频的查看地址
注: 代码仓库需要保留参赛期间内团队协同创作/个人持续更新的所有痕迹，只在最后一天一次性提交代码亦视为无效成绩

## 项目介绍
基于七牛云存储、七牛视频相关产品（如视频截帧等）开发一款Web端短视频应用NewClip

[在线接口文档](https://apifox.com/apidoc/shared-20684cbc-1443-4521-b7cf-10aa0d1b8b23)

[项目线上地址](http://newclip.cn.:3000/)：http://newclip.cn.:3000/

后端接口地址:  http://newclip.cn.:8000/newclip/

### 项目结构
* config                配置信息
* database              操作MySQl数据库
* handler               路由的函数
* main.go               程序的入口
* model                 数据库模型
* package               依赖的服务包括redis rabbitmq
* response              返回的数据类型
* router                路由
* service               具体的执行函数
* Dockerfile            web服务的镜像文件
* docker-compose.yaml   docker容器编排
* Makefile              一键部署服务

### 依赖项
* Redis ( single )
* MySQL (master and slave)
* RabbitMQ
* FFmpeg
* Go

## 项目实现
### 技术选型
1. 选用了Fiber框架而不是主流的Gin框架，原因是Fiber的CPU流量和内存占用均更小
2. 选用GORM作为ORM框架来操作数据库的数据
3. 采用MySQL持久化存储并配置主从复制实现读写
功能完成度、丰富度（50%）
完成题目中的基础功能，尽可能多的实现挑战性目标

架构设计（30%）
清晰表达架构设计意图，以及架构的合理性

代码风格（10%）
良好的编程风格，注重代码可复用性、可阅读性

团队协作（10%）
团队分工合理性，如单人参赛本项得分将以所有参赛团队平均分计算

提交方式：本次大赛全程线上举行，请将产品所有源代码、如何运行程序的说明、架构设计文档（包含模块规格、分工）、录制的demo视频上传至GitHub、Gitee或其他开源协作平台；


vframe, vsample（视频截图）		0.1 元/千次（不分帧率），其中雪碧图以截取小图和拼接大图的总张数计量

删除关闭的容器、无用的数据卷和网络
docker system prune



### mysql 主从不同步解决办法
先导出主库所有数据 写入到从库

show master status; #查看主库同步的状态

stop SLAVE;

RESET SLAVE;

change master to master_host = '192.168.1.100', master_user = 'syncuser', master_port=3306, master_password='sync123456', master_log_file = 'binlog.000002', master_log_pos=18203;

START SLAVE;

show slave status\G;