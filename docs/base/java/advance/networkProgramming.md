# 网络编程

网络通信的俩个要素：ip地址和端口号port

## IP地址

`ping www.baidu.com`查看百度的ip

`ipconfig`cmd命令用来查看自己的ip

```java
package com.haer.demo01;

import java.net.InetAddress;
import java.net.UnknownHostException;

public class TestInetAddress {
    public static void main(String[] args) throws UnknownHostException {
        //三种查询本机IP地址方法
        InetAddress inetAddress1 = InetAddress.getByName("127.0.0.1");
        InetAddress inetAddress2 = InetAddress.getByName("localhost");
        InetAddress inetAddress3 = InetAddress.getLocalHost();
        System.out.println(inetAddress1);
        System.out.println(inetAddress2);
        System.out.println(inetAddress3);

        //查询网站的IP地址
        InetAddress inetAddress4 = InetAddress.getByName("www.baidu.com");
        System.out.println(inetAddress4);

        //常用方法
        System.out.println(inetAddress4.getAddress());
        System.out.println(inetAddress4.getCanonicalHostName());//规范的名字
        System.out.println(inetAddress4.getHostAddress());//ip
        System.out.println(inetAddress4.getHostName());//域名或本机名

    }
}

```

打印结果

```
/127.0.0.1
localhost/127.0.0.1
KOTIN/192.168.0.107
www.baidu.com/14.215.177.39
[B@7f31245a
14.215.177.39
14.215.177.39
www.baidu.com
```

## 端口号port

端口表示计算机上一个程序的进程，用来区分软件

`netstat -ano`查看所有端口

`netstat -ano|findstr "5900"`查看指定的端口

`tasklist|findstr "8696`查看指定端口的进程

```java
package com.haer.demo01;

import java.net.InetSocketAddress;

public class TestInetSocketAddress {
    public static void main(String[] args) {
        //构造一个端口
        InetSocketAddress inetSocketAddress1 = new InetSocketAddress("127.0.0.1", 8080);
        InetSocketAddress inetSocketAddress2 = new InetSocketAddress("localhost", 8080);
        System.out.println(inetSocketAddress1);
        System.out.println(inetSocketAddress1);
        //常用方法
        System.out.println(inetSocketAddress1.getAddress());
        System.out.println(inetSocketAddress1.getHostName());//地址
        System.out.println(inetSocketAddress1.getPort());//端口
    }
}
```

控制台打印

```
/127.0.0.1:8080
/127.0.0.1:8080
/127.0.0.1
127.0.0.1
8080
```

## 通信协议

TCP/IP协议：一组协议

主要包含：

* TCP：用户传输协议（如打电话）
  * 连接、稳定
  * 三次握手，四次挥手
  * 客户端、服务端
  * 传输完成、释放连接、效率低
* UDP：用户数据报协议（如发短信）
  * 不连接、不稳定
  * 没有明确的客户端、服务端界限
  * 不管你有没有准备好，都可以发给你

## TCP

* **实现聊天**

服务端

```java
package com.haer.demo02;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;

//服务端
public class TcpServerDemo01 {
    public static void main(String[] args) throws IOException {
        //1、创建一个服务器地址
        ServerSocket serverSocket = new ServerSocket(9999);
        //5、等待客户端连接
        Socket socket = serverSocket.accept();
        //6、读取客户端的消息
        InputStream is = socket.getInputStream();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();//管道流
        byte[] bytes = new byte[1024];
        int len;
        while ((len = is.read(bytes)) != -1) {//判断bytes中有值
            baos.write(bytes, 0, len);
        }
        System.out.println(baos.toString());

        baos.close();
        is.close();
        socket.close();
        serverSocket.close();

    }
}
```

客户端

```java
package com.haer.demo02;

import java.io.OutputStream;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

//客户端
public class TcpClientDemo01 {
    public static void main(String[] args) throws Exception {
        //2、需要知道服务器地址，并去连接他、获得端口
        InetAddress serverIP = InetAddress.getByName("127.0.0.1");
        int prot = 9999;
        //3、创建一个socket连接
        Socket socket = new Socket(serverIP,prot);
        //4、发送消息 IO流
        OutputStream os = socket.getOutputStream();
        os.write("你好，哈儿".getBytes());//写

        os.close();
        socket.close();
    }
}
```

先运行服务端，再运行客户端发送信息

* **实现文件上传**

服务端

```java
package com.haer.demo02;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

//服务端
public class TcpServerDemo02 {
    public static void main(String[] args) throws IOException {
        //1、创建一个服务器地址
        ServerSocket serverSocket = new ServerSocket(9000);
        //5、等待客户端连接
        Socket socket = serverSocket.accept();
        //6、获取输入流
        InputStream is = socket.getInputStream();
        //文件输出
        FileOutputStream fos = new FileOutputStream(new File("logo.jpg"));
        byte[] bytes = new byte[1024];
        int len;
        while ((len = is.read(bytes)) != -1) {//判断bytes中有值
            fos.write(bytes, 0, len);
        }

        //通知客户端我接收完毕了
        OutputStream os = socket.getOutputStream();
        os.write("我接收完毕了".getBytes());

        fos.close();
        is.close();
        socket.close();
        serverSocket.close();

    }
}
```

客户端

```java
package com.haer.demo02;

import java.io.*;
import java.net.InetAddress;
import java.net.Socket;

//客户端
public class TcpClientDemo02 {
    public static void main(String[] args) throws Exception {
        //1、创建一个socket连接
        Socket socket = new Socket(InetAddress.getByName("127.0.0.1"),9000);
        //2、创建一个输出流
        OutputStream os = socket.getOutputStream();
        //3、读取文件
        FileInputStream fis = new FileInputStream(new File("1.png"));
        //4、写出文件
        byte[] bytes = new byte[1024];
        int len;
        while ((len = fis.read(bytes)) != -1) {//判断bytes中有值
            os.write(bytes, 0, len);
        }

        //确定服务端接收完毕
        InputStream is = socket.getInputStream();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] bytes2 = new byte[1024];
        int len2;
        while ((len2 = fis.read(bytes2)) != -1) {//判断bytes中有值
            baos.write(bytes2, 0, len2);
        }
        System.out.println(baos.toString());

        baos.close();
        is.close();
        fis.close();
        os.close();
        socket.close();
    }
}
```

先运行服务端，再运行客户端发送文件

