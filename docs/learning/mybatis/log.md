# 日志

在`mybatis-config.xm`l配置

## 使用标准日志

配置如下：[参考](./configuration.md#设置（settings）)

```xml
<configuration>
    <settings>
        <setting name="logImpl" value="STDOUT_LOGGING"/>
    </settings>
</configuration>
```

## 使用LOG4J

配置

```xml
<configuration>
    <settings>
        <setting name="logImpl" value="LOG4J"/>
    </settings>
</configuration>
```

导入包

```xml
<!-- https://mvnrepository.com/artifact/log4j/log4j -->
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>
```

在resources目录新建`log4j.properties`简单配置

```properties
### 将等级为DEBUG的日志信息输出到console和file这俩个目的地，console和file的定义在下面的代码 ###
log4j.rootLogger = DEBUG,console,file

### 输出到控制台 ###
log4j.appender.console = org.apache.log4j.ConsoleAppender
log4j.appender.console.Target = System.out
log4j.appender.console.Threshold = DEBUG
log4j.appender.console.layout = org.apache.log4j.PatternLayout
log4j.appender.console.layout.ConversionPattern =  [%c]-%m%n

### 输出到日志文件 ### ## 输出DEBUG级别以上的日志
log4j.appender.file = org.apache.log4j.DailyRollingFileAppender
log4j.appender.file.File = haerLogs/log.log
log4j.appender.file.MaxFileSize = 10mb
log4j.appender.file.Threshold = DEBUG
log4j.appender.file.layout = org.apache.log4j.PatternLayout
log4j.appender.file.layout.ConversionPattern = %-d{yyyy-MM-dd HH:mm:ss}  [ %t:%r ] - [ %p ]  %m%n


## 日志输出级别 ###
log4j.logger.org.mybatis = DEBUG
log4j.logger.java.sql = DEBUG
log4j.logger.java.sql.Statement = DEBUG
log4j.logger.java.sql.ResultSet = DEBUG
log4j.logger.java.PreparedStatement = DEBUG
```

* 简单使用

```java
public class UserDaoTest {

    static Logger logger = Logger.getLogger(UserDaoTest.class);

    @Test
    public void log4jTest(){
        logger.info("info:");
        logger.debug("debug:");
        logger.error("error:");
    }
}
```

::: tip
导包时导入`import org.apache.log4j.Logger;`
:::
