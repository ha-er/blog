# 整合Mybatis

## 回顾Mybatis

导入相关依赖及资源排除

```xml
<dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.47</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.5</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.2.8.RELEASE</version>
        </dependency>
<!--        Spring连接数据库需要一个Spring-jdbc包-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.2.3.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjweaver</artifactId>
            <version>1.9.6</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>2.0.2</version>
        </dependency>
<!--为了简化代码，可以不用        -->
        <!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
        <dependency>
             <groupId>org.projectlombok</groupId>
             <artifactId>lombok</artifactId>
             <version>1.18.12</version>
             <scope>provided</scope>
        </dependency>

    </dependencies>
    
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

User

```java
import lombok.Data;

@Data
public class User {
    private int id;
    private String name;
    private String pwd;
}
```

UserMapper接口

```java
public interface UserMapper {
    List<User> selectUser();
}
```

UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.haer.mapper.UserMapper">

    <select id="selectUser" resultType="User">
        select * from user
    </select>
</mapper>
```

mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <properties resource="db.properties">
        <property name="username" value="root"/>
        <property name="password" value="111111"/>
    </properties>

    <typeAliases>
        <package name="com.haer.pojo"/>
    </typeAliases>

    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url"
                          value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <mapper resource="com/haer/mapper/UserMapper.xml"/>
    </mappers>
</configuration>
```

db.properties

```properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/mybatis?useSSL=false&useUnicode=true&characterEncoding=utf-8
username=root
password=123456
```

MyTest测试

```java
public class MyTest {

    @Test
    public void test() throws IOException {
        String resources = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resources);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession sqlSession = sqlSessionFactory.openSession(true);

        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        List<User> users = mapper.selectUser();
        for (User user : users) {
            System.out.println(user);
        }
    }
}
```


## Mybatis-Spring

[mybatis-spirng官网](http://mybatis.org/spring/zh/index.html)

添加UserMapperImpl实现

```java
public class UserMapperImpl implements UserMapper {
    //我们的所有操作，在之前都是sqlSession来执行，现在都使用sqlSessionTemplate
    private SqlSessionTemplate sqlSessionTemplate;

    public void setSqlSessionTemplate(SqlSessionTemplate sqlSessionTemplate) {
        this.sqlSessionTemplate = sqlSessionTemplate;
    }

    public List<User> selectUser() {
        UserMapper mapper = sqlSessionTemplate.getMapper(UserMapper.class);
        return mapper.selectUser();
    }
}
```

spring-dao.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans">

<!--    DataSource:使用Spring的数据源替换Mybatis的配置-->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
        <property name="url"
                  value="jdbc:mysql://localhost:3306/mybatis?useSSL=false&amp;useUnicode=true&amp;characterEncoding=utf-8"/>
        <property name="username" value="root"/>
        <property name="password" value="123456"/>
    </bean>

<!--    sqlSessionFactory-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
<!--        绑定mybatis-->
        <property name="configLocation" value="mybatis-config.xml"/>
        <property name="mapperLocations" value="classpath:com/haer/mapper/*.xml"/>
<!--        <property name="typeAliases" value="com.haer.pojo.User"/>-->
    </bean>

    <bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
<!--        只能通过构造器注入，因为它没set方法-->
        <constructor-arg index="0" ref="sqlSessionFactory"/>
    </bean>

    <bean id="userMapper" class="com.haer.mapper.UserMapperImpl">
        <property name="sqlSessionTemplate" ref="sqlSession"/>
    </bean>
</beans>
```

mybatis-config.xml(可以完全被取代)

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <typeAliases>
        <package name="com.haer.pojo"/>
    </typeAliases>
</configuration>
```

测试类

```java
public class MyTest {
    @Test
    public void testSpring() {
        ApplicationContext context = new ClassPathXmlApplicationContext("spring-dao.xml");
        UserMapper userMapper = context.getBean("userMapper", UserMapper.class);
        List<User> users = userMapper.selectUser();
        for (User user : users) {
            System.out.println(user);
        }
    }
}
```

方式二：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans">

<!--    DataSource:使用Spring的数据源替换Mybatis的配置-->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
        <property name="url"
                  value="jdbc:mysql://localhost:3306/mybatis?useSSL=false&amp;useUnicode=true&amp;characterEncoding=utf-8"/>
        <property name="username" value="root"/>
        <property name="password" value="123456"/>
    </bean>

<!--    sqlSessionFactory-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
<!--        绑定mybatis-->
        <property name="configLocation" value="mybatis-config.xml"/>
        <property name="mapperLocations" value="classpath:com/haer/mapper/*.xml"/>
        <property name="typeAliases" value="com.haer.pojo.User"/>
    </bean>

    <bean id="userMapper2" class="com.haer.mapper.UserMapperImpl2">
        <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
    </bean>
</beans>
```

UserMapperImpl2

```java
public class UserMapperImpl2 extends SqlSessionDaoSupport implements UserMapper{
    public List<User> selectUser() {
        return getSqlSession().getMapper(UserMapper.class).selectUser();
    }
}
```

测试

```java
public class MyTest {
    @Test
    public void testSpring() {
        ApplicationContext context = new ClassPathXmlApplicationContext("spring-dao.xml");
        UserMapper userMapper = context.getBean("userMapper2", UserMapper.class);
        List<User> users = userMapper.selectUser();
        for (User user : users) {
            System.out.println(user);
        }
    }
}
```