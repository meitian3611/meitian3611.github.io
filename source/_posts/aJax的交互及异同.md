---
title: AJax的交互和异同
date: 2019-10-23 10:09:13
tags: 
	- 笔记
	- 知识点
	- Ajax
categories: web前端
---

> Ajax是什么？
>
> Ajax是一种在无需加载整个网页的情况下，能够更新部分网页的技术（局部刷新）
>
> 通俗的来说，Ajax就是JS通过一个网址去加载数据，这个过程用户是不可见的，传统的网页（不使用Ajax）如果需要更新内容，必须重新加载整个网页

## Ajax怎么使用

**ajax请求分4个步骤**

```javascript
// 1.创建XMLHttpRequest对象(数据交互对象)
if (window.XMLHttpRequest) {
    var xhr = new XMLHttpRequest();
} else {
    var xhr = ActiveXObject('Microsoft.XMLHTTP');//ie 5 6
}

// 2.打开与服务器的链接
xhr.open('post','xxx.php',true);//解决缓存 

// 3.发送请求
// xhr.send(null);//get请求
xhr.send('can='+ele.value);//post请求

// 4.等待服务的响应
xhr.onreadystatechange = function (){
    // console.log(xhr.readyState);//2 3 4
    if (xhr.readyState == 4) {//请求完成
        if (xhr.status == 200) {//请求成功
            var json = JSON.parse(xhr.responseText);//转成json对象
            con.innerHTML = '';
        }else {
            alert('请求失败，' + xhr.status);
        }
    }
}
```

---



## GET和POST之间的区别

>1. get参数通过url传递，post放在请求体（request  body）中；
>2. get请求在url传递的参数有长度限制，而post没有；
>3. get没有post安全，因为参数直接显示在url地址中，不能传递敏感数据
>4. get请求浏览器会主动缓存，而post不会；
>5. get请求参数会保存在浏览历史纪录，而post请求不会；

----



## Ajax的函数封装

```javascript
function ajax(option){
    // 1.创建XMLHttpRequest对象(数据交互对象)
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else {
        var xhr = ActiveXObject('Microsoft.XMLHTTP');//ie 5 6
    }
    // data -> 'a=123&b=456'
    if (option.type == 'get' || option.type == 'GET') {
        // 2.打开与服务器的链接
        xhr.open(option.type,option.url + '?'+ option.data + '&_='+new Date().getTime(),true);//解决缓存
        // 3.发送请求
        xhr.send(null);//get请求
    } else if (option.type == 'post' || option.type == 'POST'){
        // 2.打开与服务器的链接
        xhr.open(option.type,option.url,true);//解决缓存
        // 模拟表单form的post方式提交数据，在send之前设置
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        // 3.发送请求
        xhr.send(option.data);//post请求
    } else {
        alert('目前只支持get和post请求方式!');
    }

    // 4.等待服务的响应
    xhr.onreadystatechange = function (){
        // console.log(xhr.readyState);//2 3 4
        if (xhr.readyState == 4) {//请求完成
            if (xhr.status == 200) {//请求成功
                option.success(xhr.responseText);
            }else {//请求失败
                option.failed(xhr.status);
            }
        }
    }
}

//调用Ajax
    ajax({
        url: './data/post.php',
        type: 'post',
        data: 'age='+ ipt.value,
        success: function (data){
            var json = JSON.parse(data);
            con.innerHTML = '姓名：'+json.name;
        },
        failed: function (status){
            alert('请求失败');
        }
    });

}

```

****



## jQuery的Ajax调用

```javascript
        $.ajax({
            url: "study/data/get.php",
            type: 'get',
            data: 'age=28',
            cache: false,       //是否使用缓存
            dataType: 'json',   //转换成json或者text格式
            success: function (data) {
                $('.con').text(data.name);
            }
        })
```

**简写方式**：

```javascript
        $.get('study/data/get.php', 'age=18', function (json) {
            $('.con').text(json.name)
        }, 'json')
    })
```

