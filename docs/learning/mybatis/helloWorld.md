# HelloWorld

## 搭建环境

搭建数据库

```sql
CREATE DATABASE `mybatis`;

USE `mybatis`;

CREATE TABLE `user`(
  `id` INT(20) NOT NULL PRIMARY KEY,
  `name` VARCHAR(30) DEFAULT NULL,
  `pwd` VARCHAR (30) DEFAULT NULL
)ENGINE=INNODB DEFAULT CHARSET=utf8;

INSERT INTO `user`(`id`,`name`,`pwd`) VALUES
(1,'哈儿','123456'),
(2,'张三','123456'),
(3,'李四','123456')
```

## 创建模块

* 新建maven项目导入maven的pom文件
```xml
      <dependencys>
<!--        mysql驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.47</version>
        </dependency>
<!--        mybatis-->
        <!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.5</version>
        </dependency>
<!--        junit-->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
        </dependency>
      </dependencys>
```

* 编写mybatis核心配置文件

**xml文件的注释最好删除，这里为了解释就没有删除，可能会出现报错**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<!--核心配置文件-->
<configuration>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
<!--             useSSL=false   -->
                <property name="url"
                          value="jdbc:mysql://localhost:3306/mybatis?useSSL=false&amp;useUnicode=true&amp;characterEncoding=utf-8"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
<!--    每一个Mapper.xml文件都需要在Mybatis核心配置文件中注册-->
    <mappers>
        <mapper resource="com/haer/dao/UserMapper.xml"/>
    </mappers>
</configuration>
```

* 编写mybatis工具类

```java
package com.haer.utils;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

//工具类SqlSessionFactory 中获取 SqlSession
public class MybatisUtils {

    private static SqlSessionFactory sqlSessionFactory;

    static {
        try {
            //使用mybatis获取SqlSessionFactory对象
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //既然有了 SqlSessionFactory，顾名思义，我们可以从中获得 SqlSession 的实例。
    // SqlSession 提供了在数据库执行 SQL 命令所需的所有方法。
    // 你可以通过 SqlSession 实例来直接执行已映射的 SQL 语句

    public static SqlSession getSqlSession() {
        //默认为false，设为true表示自动提交事务，后面学习时再开启
        return sqlSessionFactory.openSession(false);
    }
}

```

## 编写代码

* 实体类

```java
package com.haer.pojo;

public class User {
    private int id;
    private String name;
    private String pwd;

    public User() {
    }

    public User(int id, String name, String pwd) {
        this.id = id;
        this.name = name;
        this.pwd = pwd;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", pwd='" + pwd + '\'' +
                '}';
    }
}

```

* Dao接口

```java
package com.haer.dao;

import com.haer.pojo.User;

import java.util.List;

public interface UserDao {
    List<User> selectUserList();
}

```

* 接口实现类由原来的UserDaoImpl转为一个Mapper配置文件

**自己编写代码时将注释删除**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--namespace="绑定一个对应的Dao/Mapper接口"-->
<mapper namespace="com.haer.dao.UserDao">
    <!--    查询语句-->
    <select id="selectUserList" resultType="com.haer.pojo.User">
       select * from mybatis.user
    </select>
</mapper>
```

* UserDaoTest测试

```java
package com.haer.dao;

import com.haer.pojo.User;
import com.haer.utils.MybatisUtils;
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;

import java.util.List;

public class UserDaoTest {

    @Test
    public void test() {
        //获取sqlSession对象
        SqlSession sqlSession = null;

        try {
            sqlSession = MybatisUtils.getSqlSession();
            //方式一：getMapper
            UserDao userDao = sqlSession.getMapper(UserDao.class);
            List<User> userList = userDao.selectUserList();

            //方式二：
            //List<User> userList = sqlSession.selectList("com.haer.dao.UserDao.selectUserList");

            for (User user : userList) {
                System.out.println(user);
            }
        }finally {
            //关闭sqlSession(必须要关闭)
            sqlSession.close();
        }

    }
}

```

* 在pom文件中添加

```xml
<!--    在build中配置resources，来防止资源导出失败的问题-->
<build>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*.properties</include>
                    <include>**/*.xml</include>
                </includes>
                <filtering>true</filtering>
            </resource>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.properties</include>
                    <include>**/*.xml</include>
                </includes>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
```

## BUG

* 一开始，在mybatis-config.xml文件中设置url时，`useSSL=true`，报异常**org.apache.ibatis.exceptions.PersistenceException**，该成`useSSL=false`

但是我是看视频学习的，看见老师的却是设置的`useSSL=true`，且没有报错！此处暂时留这（思思），若有知道的朋友可以联系我！

```
org.apache.ibatis.exceptions.PersistenceException: 
### Error querying database.  Cause: com.mysql.jdbc.exceptions.jdbc4.CommunicationsException: Communications link failure

The last packet successfully received from the server was 615 milliseconds ago.  The last packet sent successfully to the server was 611 milliseconds ago.
### The error may exist in com/haer/dao/UserMapper.xml
### The error may involve com.haer.dao.UserDao.selectUserList
### The error occurred while executing a query
### Cause: com.mysql.jdbc.exceptions.jdbc4.CommunicationsException: Communications link failure

The last packet successfully received from the server was 615 milliseconds ago.  The last packet sent successfully to the server was 611 milliseconds ago.

	at org.apache.ibatis.exceptions.ExceptionFactory.wrapException(ExceptionFactory.java:30)
	at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList(DefaultSqlSession.java:149)
	at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList(DefaultSqlSession.java:140)
	at org.apache.ibatis.binding.MapperMethod.executeForMany(MapperMethod.java:147)
	at org.apache.ibatis.binding.MapperMethod.execute(MapperMethod.java:80)
	at org.apache.ibatis.binding.MapperProxy$PlainMethodInvoker.invoke(MapperProxy.java:152)
	at org.apache.ibatis.binding.MapperProxy.invoke(MapperProxy.java:85)
	at com.sun.proxy.$Proxy6.selectUserList(Unknown Source)
	at com.haer.dao.UserDaoTest.test(UserDaoTest.java:21)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:50)
	at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
	at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:47)
	at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
	at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:325)
	at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:78)
	at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:57)
	at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
	at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
	at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
	at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
	at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
	at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
	at org.junit.runner.JUnitCore.run(JUnitCore.java:137)
	at com.intellij.junit4.JUnit4IdeaTestRunner.startRunnerWithArgs(JUnit4IdeaTestRunner.java:68)
	at com.intellij.rt.execution.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:47)
	at com.intellij.rt.execution.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:242)
	at com.intellij.rt.execution.junit.JUnitStarter.main(JUnitStarter.java:70)
Caused by: com.mysql.jdbc.exceptions.jdbc4.CommunicationsException: Communications link failure

The last packet successfully received from the server was 615 milliseconds ago.  The last packet sent successfully to the server was 611 milliseconds ago.
	at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
	at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
	at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
	at java.lang.reflect.Constructor.newInstance(Constructor.java:423)
	at com.mysql.jdbc.Util.handleNewInstance(Util.java:425)
	at com.mysql.jdbc.SQLError.createCommunicationsException(SQLError.java:990)
	at com.mysql.jdbc.ExportControlled.transformSocketToSSLSocket(ExportControlled.java:201)
	at com.mysql.jdbc.MysqlIO.negotiateSSLConnection(MysqlIO.java:4914)
	at com.mysql.jdbc.MysqlIO.proceedHandshakeWithPluggableAuthentication(MysqlIO.java:1663)
	at com.mysql.jdbc.MysqlIO.doHandshake(MysqlIO.java:1224)
	at com.mysql.jdbc.ConnectionImpl.coreConnect(ConnectionImpl.java:2199)
	at com.mysql.jdbc.ConnectionImpl.connectOneTryOnly(ConnectionImpl.java:2230)
	at com.mysql.jdbc.ConnectionImpl.createNewIO(ConnectionImpl.java:2025)
	at com.mysql.jdbc.ConnectionImpl.<init>(ConnectionImpl.java:778)
	at com.mysql.jdbc.JDBC4Connection.<init>(JDBC4Connection.java:47)
	at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
	at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
	at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
	at java.lang.reflect.Constructor.newInstance(Constructor.java:423)
	at com.mysql.jdbc.Util.handleNewInstance(Util.java:425)
	at com.mysql.jdbc.ConnectionImpl.getInstance(ConnectionImpl.java:386)
	at com.mysql.jdbc.NonRegisteringDriver.connect(NonRegisteringDriver.java:330)
	at java.sql.DriverManager.getConnection(DriverManager.java:664)
	at java.sql.DriverManager.getConnection(DriverManager.java:208)
	at org.apache.ibatis.datasource.unpooled.UnpooledDataSource.doGetConnection(UnpooledDataSource.java:224)
	at org.apache.ibatis.datasource.unpooled.UnpooledDataSource.doGetConnection(UnpooledDataSource.java:219)
	at org.apache.ibatis.datasource.unpooled.UnpooledDataSource.getConnection(UnpooledDataSource.java:95)
	at org.apache.ibatis.datasource.pooled.PooledDataSource.popConnection(PooledDataSource.java:432)
	at org.apache.ibatis.datasource.pooled.PooledDataSource.getConnection(PooledDataSource.java:89)
	at org.apache.ibatis.transaction.jdbc.JdbcTransaction.openConnection(JdbcTransaction.java:139)
	at org.apache.ibatis.transaction.jdbc.JdbcTransaction.getConnection(JdbcTransaction.java:61)
	at org.apache.ibatis.executor.BaseExecutor.getConnection(BaseExecutor.java:337)
	at org.apache.ibatis.executor.SimpleExecutor.prepareStatement(SimpleExecutor.java:86)
	at org.apache.ibatis.executor.SimpleExecutor.doQuery(SimpleExecutor.java:62)
	at org.apache.ibatis.executor.BaseExecutor.queryFromDatabase(BaseExecutor.java:325)
	at org.apache.ibatis.executor.BaseExecutor.query(BaseExecutor.java:156)
	at org.apache.ibatis.executor.CachingExecutor.query(CachingExecutor.java:109)
	at org.apache.ibatis.executor.CachingExecutor.query(CachingExecutor.java:89)
	at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList(DefaultSqlSession.java:147)
	... 29 more
Caused by: javax.net.ssl.SSLHandshakeException: java.security.cert.CertificateException: java.security.cert.CertPathValidatorException: Path does not chain with any of the trust anchors
	at sun.security.ssl.Alerts.getSSLException(Alerts.java:192)
	at sun.security.ssl.SSLSocketImpl.fatal(SSLSocketImpl.java:1959)
	at sun.security.ssl.Handshaker.fatalSE(Handshaker.java:302)
	at sun.security.ssl.Handshaker.fatalSE(Handshaker.java:296)
	at sun.security.ssl.ClientHandshaker.serverCertificate(ClientHandshaker.java:1514)
	at sun.security.ssl.ClientHandshaker.processMessage(ClientHandshaker.java:216)
	at sun.security.ssl.Handshaker.processLoop(Handshaker.java:1026)
	at sun.security.ssl.Handshaker.process_record(Handshaker.java:961)
	at sun.security.ssl.SSLSocketImpl.readRecord(SSLSocketImpl.java:1072)
	at sun.security.ssl.SSLSocketImpl.performInitialHandshake(SSLSocketImpl.java:1385)
	at sun.security.ssl.SSLSocketImpl.startHandshake(SSLSocketImpl.java:1413)
	at sun.security.ssl.SSLSocketImpl.startHandshake(SSLSocketImpl.java:1397)
	at com.mysql.jdbc.ExportControlled.transformSocketToSSLSocket(ExportControlled.java:186)
	... 61 more
Caused by: java.security.cert.CertificateException: java.security.cert.CertPathValidatorException: Path does not chain with any of the trust anchors
	at com.mysql.jdbc.ExportControlled$X509TrustManagerWrapper.checkServerTrusted(ExportControlled.java:302)
	at sun.security.ssl.AbstractTrustManagerWrapper.checkServerTrusted(SSLContextImpl.java:985)
	at sun.security.ssl.ClientHandshaker.serverCertificate(ClientHandshaker.java:1496)
	... 69 more
Caused by: java.security.cert.CertPathValidatorException: Path does not chain with any of the trust anchors
	at sun.security.provider.certpath.PKIXCertPathValidator.validate(PKIXCertPathValidator.java:153)
	at sun.security.provider.certpath.PKIXCertPathValidator.engineValidate(PKIXCertPathValidator.java:79)
	at java.security.cert.CertPathValidator.validate(CertPathValidator.java:292)
	at com.mysql.jdbc.ExportControlled$X509TrustManagerWrapper.checkServerTrusted(ExportControlled.java:295)
	... 71 more
```

* 昨天是在家里开发的，以上就成功运行了，今天回到公司，拉取代码，发现一样的的代码，居然报错了，具体错误如下：

试了各种方法，发现是mybatis-config.xml，UserMapper.xml文件中包含注释，导致乱码，删除注释成功运行

环境良好的电脑不会出现此错误

```
org.apache.ibatis.exceptions.PersistenceException: 
### Error building SqlSession.
### Cause: org.apache.ibatis.builder.BuilderException: Error creating document instance.  Cause: com.sun.org.apache.xerces.internal.impl.io.MalformedByteSequenceException: 3 字节的 UTF-8 序列的字节 3 无效。
	at org.apache.ibatis.exceptions.ExceptionFactory.wrapException(ExceptionFactory.java:30)
	at org.apache.ibatis.session.SqlSessionFactoryBuilder.build(SqlSessionFactoryBuilder.java:80)
	at org.apache.ibatis.session.SqlSessionFactoryBuilder.build(SqlSessionFactoryBuilder.java:64)
	at com.haer.utils.MybatisUtils.<clinit>(MybatisUtils.java:21)
	at com.haer.dao.UserDaoTest.test(UserDaoTest.java:18)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:50)
	at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
	at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:47)
	at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
	at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:325)
	at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:78)
	at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:57)
	at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
	at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
	at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
	at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
	at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
	at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
	at org.junit.runner.JUnitCore.run(JUnitCore.java:137)
	at com.intellij.junit4.JUnit4IdeaTestRunner.startRunnerWithArgs(JUnit4IdeaTestRunner.java:68)
	at com.intellij.rt.execution.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:47)
	at com.intellij.rt.execution.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:242)
	at com.intellij.rt.execution.junit.JUnitStarter.main(JUnitStarter.java:70)
Caused by: org.apache.ibatis.builder.BuilderException: Error creating document instance.  Cause: com.sun.org.apache.xerces.internal.impl.io.MalformedByteSequenceException: 3 字节的 UTF-8 序列的字节 3 无效。
	at org.apache.ibatis.parsing.XPathParser.createDocument(XPathParser.java:263)
	at org.apache.ibatis.parsing.XPathParser.<init>(XPathParser.java:127)
	at org.apache.ibatis.builder.xml.XMLConfigBuilder.<init>(XMLConfigBuilder.java:82)
	at org.apache.ibatis.session.SqlSessionFactoryBuilder.build(SqlSessionFactoryBuilder.java:77)
	... 25 more
Caused by: com.sun.org.apache.xerces.internal.impl.io.MalformedByteSequenceException: 3 字节的 UTF-8 序列的字节 3 无效。
	at com.sun.org.apache.xerces.internal.impl.io.UTF8Reader.invalidByte(UTF8Reader.java:701)
	at com.sun.org.apache.xerces.internal.impl.io.UTF8Reader.read(UTF8Reader.java:435)
	at com.sun.org.apache.xerces.internal.impl.XMLEntityScanner.load(XMLEntityScanner.java:1895)
	at com.sun.org.apache.xerces.internal.impl.XMLEntityScanner.scanData(XMLEntityScanner.java:1375)
	at com.sun.org.apache.xerces.internal.impl.XMLScanner.scanComment(XMLScanner.java:801)
	at com.sun.org.apache.xerces.internal.impl.XMLDocumentFragmentScannerImpl.scanComment(XMLDocumentFragmentScannerImpl.java:1034)
	at com.sun.org.apache.xerces.internal.impl.XMLDocumentFragmentScannerImpl$FragmentContentDriver.next(XMLDocumentFragmentScannerImpl.java:2982)
	at com.sun.org.apache.xerces.internal.impl.XMLDocumentScannerImpl.next(XMLDocumentScannerImpl.java:602)
	at com.sun.org.apache.xerces.internal.impl.XMLDocumentFragmentScannerImpl.scanDocument(XMLDocumentFragmentScannerImpl.java:505)
	at com.sun.org.apache.xerces.internal.parsers.XML11Configuration.parse(XML11Configuration.java:841)
	at com.sun.org.apache.xerces.internal.parsers.XML11Configuration.parse(XML11Configuration.java:770)
	at com.sun.org.apache.xerces.internal.parsers.XMLParser.parse(XMLParser.java:141)
	at com.sun.org.apache.xerces.internal.parsers.DOMParser.parse(DOMParser.java:243)
	at com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderImpl.parse(DocumentBuilderImpl.java:339)
	at org.apache.ibatis.parsing.XPathParser.createDocument(XPathParser.java:261)
	... 28 more

java.lang.NullPointerException
	at com.haer.dao.UserDaoTest.test(UserDaoTest.java:31)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:50)
	at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
	at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:47)
	at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
	at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:325)
	at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:78)
	at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:57)
	at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
	at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
	at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
	at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
	at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
	at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
	at org.junit.runner.JUnitCore.run(JUnitCore.java:137)
	at com.intellij.junit4.JUnit4IdeaTestRunner.startRunnerWithArgs(JUnit4IdeaTestRunner.java:68)
	at com.intellij.rt.execution.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:47)
	at com.intellij.rt.execution.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:242)
	at com.intellij.rt.execution.junit.JUnitStarter.main(JUnitStarter.java:70)
```

## CRUD

Dao层

```java
package com.haer.dao;

import com.haer.pojo.User;

import java.util.List;

public interface UserDao {
    List<User> selectUserList();

    User selectUserById(int id);

    int insertUser(User user);

    int updateUser(User user);

    int deleteUser(int id);
}

```

UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.haer.dao.UserDao">
    <select id="selectUserList" resultType="com.haer.pojo.User">
       select * from mybatis.user
    </select>
    <select id="selectUserById" resultType="com.haer.pojo.User" parameterType="int">
        select * from mybatis.user where id = #{id}
    </select>
    <insert id="insertUser" parameterType="com.haer.pojo.User">
        insert into mybatis.user (id, name, pwd) values (#{id}, #{name}, #{pwd})
    </insert>
    <update id="updateUser" parameterType="com.haer.pojo.User">
        update user set name = #{name}, pwd = #{pwd} where id = #{id}
    </update>
    <delete id="deleteUser" parameterType="int">
        delete from user where id = #{id}
    </delete>
</mapper>
```

测试

```java
package com.haer.dao;

import com.haer.pojo.User;
import com.haer.utils.MybatisUtils;
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;

import java.util.List;

public class UserDaoTest {

    @Test
    public void test() {
        //获取sqlSession对象
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        try {
            //方式一：getMapper
            UserDao userDao = sqlSession.getMapper(UserDao.class);
            List<User> userList = userDao.selectUserList();

            //方式二：
            //List<User> userList = sqlSession.selectList("com.haer.dao.UserDao.selectUserList");

            for (User user : userList) {
                System.out.println(user);
            }
        } finally {
            //关闭sqlSession(必须要关闭)
            sqlSession.close();
        }
    }

    @Test
    public void selectUserById() {
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        try {
            UserDao userDao = sqlSession.getMapper(UserDao.class);
            User user = userDao.selectUserById(1);
            System.out.println(user);
        } finally {
            sqlSession.close();
        }
    }

    @Test
    public void insertUser() {
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        try {
            UserDao userDao = sqlSession.getMapper(UserDao.class);
            User user = new User(4,"思思", "040404");
            userDao.insertUser(user);
            //开启事务,否则新增、修改、删除不会生效
            sqlSession.commit();
        } finally {
            sqlSession.close();
        }
    }

    @Test
    public void updateUser() {
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        try {
            UserDao userDao = sqlSession.getMapper(UserDao.class);
            User user = new User(4,"哈儿", "000320");
            userDao.updateUser(user);
            //开启事务
            sqlSession.commit();
        } finally {
            sqlSession.close();
        }
    }

    @Test
    public void deleteUser() {
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        try {
            UserDao userDao = sqlSession.getMapper(UserDao.class);
            userDao.deleteUser(4);
            //开启事务
            sqlSession.commit();
        } finally {
            sqlSession.close();
        }
    }
}

```

## 拓展

* 使用Map灵活新增

Dao层

```java
public interface UserDao {
     int insertMap(Map<String, Object> map);
}
```

UserMapper.xml

```xml
<insert id="insertMap" parameterType="map">
     insert into mybatis.user (id, name) values (#{userId}, #{favorite})
</insert>
```

测试类

```java
public class UserDaoTest {
    @Test
    public void insertMap() {
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        try {
            UserDao userDao = sqlSession.getMapper(UserDao.class);
            HashMap<String, Object> map = new HashMap<String, Object>();
            map.put("userId",520);
            map.put("favorite","思思");
            userDao.insertMap(map);
            //开启事务,否则新增、修改、删除不会生效
            sqlSession.commit();
        } finally {
            sqlSession.close();
        }
    }
}
```

::: tip
Map中传递参数，直接在sql中取出key即可

对象传递参数，直接在sql中取出对象的属性即可

只有一个基本参数类型，可以在sql中直接取到

多个参数用Map，或者注解
:::

* 模糊查询

  * java代码执行时，传递通配符%%
  
  `List<User> user = userDao.selectUserLikeName("%哈%");`
  
  * 在sql拼接时使用通配符
  
  `select * from mybatis.user where name like concat("%", #{name}, "%")`
  
* 批量删除

Dao层

```java
public interface UserDao {
    //批量删除
    int deleteUsers(int[] ids);
}
```

UserMapper.xml

```xml
<delete id="deleteUsers" parameterType="String">
        delete from user where id in
        <foreach item="id" collection="array" open="(" separator="," close=")">
            #{id}
        </foreach>
</delete>
```

测试

```java
public class UserDaoTest {
    @Test
    public void deleteUsers() {
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        try {
            UserDao userDao = sqlSession.getMapper(UserDao.class);
            int[] ids = new int[2];
            ids[0] = 31;
            ids[1] = 32;
            userDao.deleteUsers(ids);
            //开启事务
            sqlSession.commit();
        } finally {
            sqlSession.close();
        }
    }
}
```

  