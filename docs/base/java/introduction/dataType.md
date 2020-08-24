# 基本数据类型

需要安装[环境变量](../../../tools/environment/javaEnvironment.md)

* java是强类型语言

要求变量的使用要严格符合规定，所有变量都必须先定义后使用，
像js就属于弱类型语言，不需要先定义数据类型

* java的数据类型分为
  * 基本数据类型
    * 整数类型：byte、short、int、long
    * 浮点类型：float、double
    * 字符类型：char
    * boolean类型
  * 引用数据类型
    * 类
    * 接口
    * 数组
  
* 自动类型转换：  
  
因为java是强类型语言，运算的时候，会发生类型转换,自动转换的规律：

byte,short,char-> int-> long ->float-> double

* 强制类型转换：

低向高转换可能会出现数据丢失，不准确

```java
int i = 200；
byte b = (byte)i;
```


  