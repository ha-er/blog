# IOC理论推导

## 编写代码

`UserDao`接口

```java
public interface UserDao {
    void getUser();
}
```

`UserDaoImpl`实现

```java
public class UserDaoImpl implements UserDao{
    public void getUser() {
        System.out.println("用户加载默认数据");
    }
}
```

`UserService`接口

```java
public interface UserService {
    void getUser();
}
```

`UserServiceImpl`

```java
public class UserServiceImpl implements UserService {

    //使用默认数据时，new UserDaoImpl
    private UserDao userDao =  new UserDaoImpl();

    public void getUser() {
        userDao.getUser();
    }
}
```

测试`MyTest`

```java
public class MyTest {
    public static void main(String[] args) {
        //用户实际调用业务层，dao层不接触
        UserService userService = new UserServiceImpl();
        userService.getUser();
    }
}
```

此时成功调用UserDao层方法，打印

```
用户加载默认数据
```

**需求增加**

用户需要调用Mysql数据，和Oracle数据

我们给Dao层添加实现类

```java
public class UserDaoMysqlImpl implements UserDao{
    public void getUser() {
        System.out.println("Mysql获取数据");
    }
}
```

```java
public class UserDaoOracleImpl implements UserDao{
    public void getUser() {
        System.out.println("Oracle获取数据");
    }
}
```

这时我们想使用这俩种数据，需要实现不同的接口

UserServiceImpl

```java
public class UserServiceImpl implements UserService {

    //使用默认数据时，new UserDaoImpl
    //使用Mysql数据时，new UserDaoMysqlImpl
    //使用Oracle数据时，new UserDaoOracleImpl
    //发现用户需求变更时，我们需要改变业务层代码，这不是一个优秀的程序
    private UserDao userDao =  new UserDaoOracleImpl();

    public void getUser() {
        userDao.getUser();
    }
}
```

用户需求影响原来的业务代码，代码量大和修改代码成本高时，显然不可取

**我们使用一个set接口实现，发生革命性变化！**

`UserServiceImpl`

```java
public class UserServiceImpl implements UserService {
    private UserDao userDao;

    //利用set进行动态实现值的注入
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    public void getUser() {
        userDao.getUser();
    }
}
```

测试`MyTest`

```java
public class MyTest {
    public static void main(String[] args) {
        //用户实际调用业务层，dao层不接触
        UserService userService = new UserServiceImpl();
        //需要调用哪个业务层就传入什么接口实现
        ((UserServiceImpl) userService).setUserDao(new UserDaoMysqlImpl());
        userService.getUser();
    }
}
```

* 之前，程序是主动创建对象！程序的主动性在程序员手上
* 使用set注入后，程序不再具有主动性，而是变成了被动的接收对象

这种思想，从本质上解决了问题，程序员不用再去管理对象的创建，系统和耦合性降低，可以专注在业务上的实现，**这是IOC的原型**

## IOC本质

**控制反转IOC（Inversion of Control），是一种设计思想，DI（依赖注入）是实现IOC的一种方法。**

对象的创建由程序自己控制->对象的创建转移到第三方

控制反转：获得依赖对象的方式反转了

采用XML方式配置Bean的时候，Bean的定义信息是和实现分离的，而采用注解的方式可以把俩者结合一体，
Bean的定义信息直接以注解的形式定义在实现类中，从而达到零配置的目的。

**控制反转是一种通过描述（XML或注解）并通过第三方去生产或获取特定对象的方式。
在Spring中实现控制反转的是IOC容器，其实现方法是依赖注入（Dependency Injection，DI）。**
