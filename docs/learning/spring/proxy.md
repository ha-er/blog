# 代理模式

为什么要学习代理模式？

因为这就是SpringAOP的底层

分为**静态代理**和**动态代理**

![](../../.vuepress/public/img/learning/spring/3.png)

## 静态代理

角色分析：

* 抽象角色：一般使用接口会抽象类解决：**租房**
* 真实角色：被代理的角色：**房东**
* 代理角色：代理真实对象，会在在这做一些附属操作：**中介**
* 客户：访问代理对象的人

代码步骤：

接口：

```java
//租房
public interface Rent {
    void rent();
}
```

真实角色

```java
//房东
public class Host implements Rent {
    public void rent() {
        System.out.println("房东要出租房子");
    }
}
```

代理角色

```java
//中介
public class Proxy implements Rent{
    private Host host;

    public Proxy() {
    }

    public Proxy(Host host) {
        this.host = host;
    }

    public void rent() {
        seeHouse();
        host.rent();
        contract();
        fare();
    }

    //看房 
    public void seeHouse(){
        System.out.println("中介带你看房");
    }

    //签合同
    public void contract(){
        System.out.println("中介和你签合同");
    }

    //收中介费
    public void fare(){
        System.out.println("收中介费");
    }

}
```

客户端访问代理角色

```java
//客户
public class Client {
    //不使用代理
    @Test
    public void test1(){
        Host host = new Host();
        host.rent();
    }

    //使用代理
    @Test
    public void test2(){
        //房东要出租房子
        Host host = new Host();
        //代理，中介帮房东租房，还会有些附属操作
        Proxy proxy = new Proxy(host);
        //你不用面对房东，直接找中介
        proxy.rent();
    }
}
```


代理模式的好处：

* 可以使真实角色操作更加纯粹，不用去关注一些公共业务
* 公共也就交给了代理角色,实现业务分工
* 公共业务发生扩展时，方便集中管理，比如扩展日志，就相当于这里代理角色中介的看房子，签合同，收中介费等附属操作

缺点：

* 一个真实角色就会产生一个代理角色，代码量翻倍

## 动态代理

* 动态代理和静态代理角色一样
* 动态代理的代理类时动态生成的，不是我们直接写好的
* 动态代理分为俩大类：基于接口的动态代理、基于类的动态代理
  * 基于接口--JDK动态代理【我们在这里使用这个】
  * 基于类：cglib
  * java字节码：JAVAssist
  
了解俩个类：`Proxy` :代理`InvocationHandler`：调用代理处理程序

`UserService`

```java
//抽象对象
public interface UserService {
    void add();
    void delete();
    void update();
    void query();
}
```

`UserServiceImpl`

```java
//真实对象
public class UserServiceImpl implements UserService {
    public void add() {
        System.out.println("add");
    }

    public void delete() {
        System.out.println("delete");
    }

    public void update() {
        System.out.println("update");
    }

    public void query() {
        System.out.println("query");
    }
}
```

`ProxyInvocationHandler`

```java
//会用这个类自动生成代理类
public class ProxyInvocationHandler implements InvocationHandler {

    //被代理的接口
    private Object target;

    public void setTarget(Object target) {
        this.target = target;
    }

    public Object getProxy(){
        return Proxy.newProxyInstance(this.getClass().getClassLoader(), target.getClass().getInterfaces(), this);

    }

    //处理代理实例，并返回结果
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        //动态代理的本质，就是使用反射机制实现的
        log(method.getName());
        Object result = method.invoke(target, args);
        return result;
    }

    public void log(String msg){
        System.out.println("执行"+msg+"方法");
    }
}
```

测试

```java
public class Client {

    @Test
    public void test01(){
        //真实角色
        UserServiceImpl userService = new UserServiceImpl();

        //代理角色不存在
        ProxyInvacationHandler pih = new ProxyInvacationHandler();

        //设置要代理的对象
        pih.setTarget(userService);

        //动态生成代理类
        UserService proxy = (UserService) pih.getProxy();

        proxy.add();
    }
}
```


动态代理的其他好处：

* 一个动态代理类代理的是一个接口，一般角色对应的一类业务
* 一个动态代理类可以代理多个类，只要是实现了同一个接口即可
  
  

