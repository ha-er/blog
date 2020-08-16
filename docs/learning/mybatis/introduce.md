 # 简介
 
 ## 环境
 
 * JDK1.8
 * Mysql5.7
 * maven 3.6.1
 * IDEA
 
 ## 什么是mybatis
 
 从[mybatis官网](https://mybatis.org/mybatis-3/zh/index.html)介绍上和百度百科可以知道
 
 * MyBatis 是一款优秀的**持久层框架**。
 * 它支持自定义 SQL、存储过程以及高级映射。
 * MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。
 * MyBatis 可以通过简单的 XML 或注解来配置和映射原始类型、接口和 Java POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录。
 * MyBatis 本是apache的一个开源项目iBatis, 2010年这个项目由apache software foundation 迁移到了google code，并且改名为MyBatis 。
 * 2013年11月迁移到Github。 
 
 ## 如何获取mybatis
 
 * [maven仓库](https://mvnrepository.com/artifact/org.mybatis/mybatis)
 ```xml
  <!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
  <dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.5</version>
  </dependency>
  ```
 * [Github](https://github.com/mybatis/mybatis-3)
 * [中文文档](https://mybatis.org/mybatis-3/zh/index.html)
 
 ## 持久化
 
 数据持久化
 
 * 持久化就是将程序的数据在持久状态和瞬时状态转化过程
 * 内存：**断电即失**
 * 数据库（JDBC），IO文件持久化
 * 生活：冷藏，罐头
 
 为什么需要持久化
 
 * 有一些对象，不能让他丢掉（比如支付宝余额）
 * 内存太贵
 
 ## 持久层
 
 Dao层，Service层，Controller层
 
 * 完成持久化工作的代码块
 * 层界限十分明显
 
 ## 为什么需要Mybatis
 
 * 帮助程序员将数据存入到数据库
 * 方便
 * 传统的JDBC代码太复杂。简化、框架、自动化
 * 优点：
   * 简单易学
   * 灵活
   * sql和代码的分离，提高了可维护性
   * 提供映射标签，支持对象与数据库的orm字段关系映射
   * 提供对象关系映射标签，支持对象关系组建维护
   * 提供xml标签，支持编写动态sql
 * **使用的人多**
 