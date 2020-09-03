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

## UDP

**发送信息**

发送端

```java
package com.haer.demo03;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;

public class UDPClientDemo01 {
    public static void main(String[] args) throws Exception {
        //1、建立一个Socket
        DatagramSocket datagramSocket = new DatagramSocket();
        //2、建立包
        String msg = "发送信息";
        //发送给谁
        InetAddress localhost = InetAddress.getByName("localhost");
        int port = 8085;
        //参数：数据、数据起始长度、ip地址、端口号
        DatagramPacket datagramPacket = new DatagramPacket(msg.getBytes(), 0, msg.getBytes().length, localhost, port);
        //3发送包
        datagramSocket.send(datagramPacket);
        //4、关闭
        datagramSocket.close();
    }
}

```

接受端

```java
package com.haer.demo03;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.SocketException;

public class UDPServerDemo01 {
    public static void main(String[] args) throws Exception {
        //开放端口
        DatagramSocket datagramSocket = new DatagramSocket(8085);
        //接收数据包
        byte[] bytes = new byte[1024];
        DatagramPacket datagramPacket = new DatagramPacket(bytes, 0, bytes.length);
        //等待接收
        datagramSocket.receive(datagramPacket);
        //获取一些信息
        System.out.println(datagramPacket.getAddress().getHostAddress());
        System.out.println(new String(datagramPacket.getData(), 0, datagramPacket.getLength()));
        //关闭连接
        datagramSocket.close();
    }
}
```

**实现咨询**

发送端

```java
package com.haer.chat;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetSocketAddress;

public class UDPSenderDemo01 {
    public static void main(String[] args) throws Exception {
        DatagramSocket datagramSocket = new DatagramSocket(8888);
        //准备数据，从控制台读取System.in
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        while (true){
            //readLine读取输入的一行
            String data = reader.readLine();
            DatagramPacket packet = new DatagramPacket(data.getBytes(), 0, data.getBytes().length, new InetSocketAddress("localhost", 6666));

            datagramSocket.send(packet);
            //trim去首位空格
            if (data.trim().equals("bye")){
                break;
            }
        }
        datagramSocket.close();
    }
}
```

接收端

```java
package com.haer.chat;


import java.net.DatagramPacket;
import java.net.DatagramSocket;

public class UDPReceiveDemo01 {
    public static void main(String[] args) throws Exception {
        DatagramSocket socket = new DatagramSocket(6666);
        while (true){
            //准备接收数据
            byte[] bytes = new byte[1024];
            DatagramPacket packet = new DatagramPacket(bytes,0,bytes.length);
            socket.receive(packet);//等待接收
            //判断断开连接
            byte[] data = packet.getData();
            String dataString = new String(data, 0, data.length);

            System.out.println(dataString);

            if (dataString.trim().equals("bye")){
                break;
            }
        }
        socket.close();
    }
}
```

**实现聊天**

发送端工具类

```java
package com.haer.chat;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetSocketAddress;
import java.net.SocketException;

public class TalkSend implements Runnable {
    DatagramSocket socket = null;
    BufferedReader reader = null;

    private int fromPort;
    private String toIP;
    private int toPort;

    public TalkSend(int fromPort, String toIP, int toPort) throws Exception {
        this.fromPort = fromPort;
        this.toIP = toIP;
        this.toPort = toPort;

        socket = new DatagramSocket(fromPort);
        reader = new BufferedReader(new InputStreamReader(System.in));
    }

    public void run() {

        while (true){
            try {
                //readLine读取输入的一行
                String data = reader.readLine();
                DatagramPacket packet = new DatagramPacket(data.getBytes(), 0, data.getBytes().length, new InetSocketAddress(this.toIP, this.toPort));
                socket.send(packet);
                //trim去首位空格
                if (data.trim().equals("bye")){
                    break;
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        socket.close();
    }
}

```

接收端工具类

```java
package com.haer.chat;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.SocketException;

public class TalkReceive implements Runnable {
    DatagramSocket socket = null;
    private int port;
    private String msg;

    public TalkReceive(int port, String msg) throws SocketException {
        this.port = port;
        this.msg = msg;
        socket = new DatagramSocket(port);
    }

    public void run() {


        while (true){
            try {
                //准备接收数据
                byte[] bytes = new byte[1024];
                DatagramPacket packet = new DatagramPacket(bytes,0,bytes.length);
                socket.receive(packet);//等待接收

                //判断断开连接
                byte[] data = packet.getData();
                String dataString = new String(data, 0, data.length);

                System.out.println(msg+ ":" + dataString);

                if (dataString.trim().equals("bye")){
                    break;
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        socket.close();
    }
}

```

创建俩个用户老师和学生

```java
package com.haer.chat;

public class TalkTeacher {
    public static void main(String[] args) throws Exception {
        //开启俩个线程
        new Thread(new TalkSend(5555,"localhost",8888)).start();
        new Thread(new TalkReceive(9999,"学生")).start();
    }
}
```

```java
package com.haer.chat;

public class TalkStudent {
    public static void main(String[] args) throws Exception {
        //开启俩个线程
        new Thread(new TalkSend(7777,"localhost",9999)).start();
        new Thread(new TalkReceive(8888,"老师")).start();
    }
}
```

启动这俩个类，就可以再控制台实现聊天

## URL

如`https://www.baidu.com/`

URL就是统一资源定位符：定位资源，定位互联网上的某一个资源

```
协议://ip地址:端口/项目名/资源
```

```java
package com.haer;

import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

public class URLDemo01 {
    public static void main(String[] args) throws Exception{
        //1.下载地址
        URL url = new URL("http://local:8080/helloworld/index.html?id=1&name=haer");
        System.out.println(url.getProtocol());//协议
        System.out.println(url.getHost());//主机ip
        System.out.println(url.getPort());//端口
        System.out.println(url.getPath());//文件
        System.out.println(url.getFile());//全路径
        System.out.println(url.getQuery());//参数
        //测试下载网易云《隔岸》
        URL url2 = new URL("https://m10.music.126.net/20200903195415/ff9e429c9b9992ca65f0601eaec28751/yyaac/obj/wonDkMOGw6XDiTHCmMOi/2920524010/af6b/94d5/2bd7/9e5bb66828e846af99717d2976ef1e88.m4a");
        //2、连接到这个资源 HTTP
        HttpURLConnection urlConnection = (HttpURLConnection) url2.openConnection();
        InputStream inputStream = urlConnection.getInputStream();
        FileOutputStream fos = new FileOutputStream("隔岸.m4a");
        byte[] bytes = new byte[1024];
        int len;
        while ((len = inputStream.read(bytes))!= -1){
            fos.write(bytes,0,len);
        }
        fos.close();
        inputStream.close();
        urlConnection.disconnect();
    }
}
```

