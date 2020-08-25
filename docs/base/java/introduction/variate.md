# 变量

## 变量的定义

```
type varName [=value] [{,varName[=value]}];
//数据类型 变量名 = 值； 可以使用逗号隔开来声明多个同类型变量
```

* 变量声明必须声明其类型，基本类型或引用类型

* 变量名必须为合法标识符

* 末尾以分号结束

## 常量

初始化后不能再改变，常量名一般使用全大写。

final 类型 常量名 = 值;
`final double PI = 3.14;`

## 命名规范

* 见名知意
* 类名是首字母大写，其他变量名一般为首字母小写的驼峰原则

## 作用域

* 类变量
* 实例变量
* 局部变量

```java
public class Variable{
    static int allClicks = 0;//类变量
    String str = "hello world";//实例变量
    
    public void method(){
        int i = 0;//局部变量
    }
}
```