## 安装

## Windows平台

#### 1. 安装[node](https://nodejs.org/en/)(需4.0以上版本)，选择LTS版本，一路next即可。

#### 2. 下载源码，https://github.com/geraldlrh/search-tool-for-luorenbu/archive/master.zip

#### 3. 将要处理的文件都复制到in文件夹下面

#### 4. 在node安装目录打开node bash, 安装依赖

	```bash
	cd search-tool-for-luorenbu
	npm i --registry=http://registry.npm.taobao.org
	```
![](http://ww1.sinaimg.cn/large/8ee1881agw1f02fw93jkvj20bp0ihac8.jpg)

安装完后执行index.js，依次输入参数即可：

	```bash
	node index.js
	```

![](http://ww3.sinaimg.cn/large/8ee1881agw1f02fx5tjgej20mp0670v1.jpg)

#### 5. 搜索结果保存在out.txt，每次执行都会覆盖