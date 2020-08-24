# 缓存

## 简介

* 存在内存中的临时数据

* 可以减少和数据库的交互次数，提升效率

* 经常查询且不经常改变的数据适合使用缓存

## Mybatis缓存

* Mybatis包含查询缓存特性，方便定制和配置

* Mybatis系统中默认定义俩级缓存：**一级缓存**和**二级缓存**

  * 默认只有一级缓存开启（SqlSession级别缓存，也称为本地缓存）
  * 二级缓存需手动开启，基于namespace级别的缓存
  * Mybatis定义了缓存接口Cache，可以实现Cache自定义二级缓存
  
## 一级缓存

* 与数据库同一次会话期间查询到的数据会放在本地缓存
* 以后获取相同数据，从缓存中拿
* 缓存失效的情况
  * 查询不同的数据
  * 增删改操作，会直接刷新缓存，哪怕不是改的你需要的数据
  * 查询不同Mapper
  * 手动清理缓存: `sqlSession.cache()`
  
::: tip 小结
一级缓存是默认开启，只在一次SqlSession中有效，也就是拿到连接到关闭连接的这个区间

一级缓存相当于一个Map
:::

## 二级缓存

* 二级缓存也叫全局缓存

* 基于namespace级别缓存

* 工作机制
  * 一个会话查询一条数据，这个数据就会放到当前一级缓存
  * 会话关闭，一级缓存消失，数据被保存到二级缓存
  * 新的会话查询，会先从二级缓存中获取数据
  * 不同的mapper查出的数据会放在自己对应的缓存（map）中

开启缓存

`mybatis-config.xml`中

```xml
<settings>
  <setting name="cacheEnabled" value="true"/>
</settings>
```

`UserMapper.xml`

```xml
<mapper>
  <cache
    eviction="FIFO"
    flushInterval="60000"
    size="512"
    readOnly="true"/>
</mapper>
```

这个更高级的配置创建了一个 FIFO 缓存，每隔 60 秒刷新，最多可以存储结果对象或列表的 512 个引用，而且返回的对象被认为是只读的，因此对它们进行修改可能会在不同线程中的调用者产生冲突。

* LRU – 最近最少使用：移除最长时间不被使用的对象。
* FIFO – 先进先出：按对象进入缓存的顺序来移除它们。
* SOFT – 软引用：基于垃圾回收器状态和软引用规则移除对象。
* WEAK – 弱引用：更积极地基于垃圾收集器状态和弱引用规则移除对象。

```xml
<select id="selectUserById" resultType="user" parameterType="int" useCache="false">
        select * from mybatis.user where id = #{id}
</select>
```

`useCache="false"`可以给每个方法单独设置缓存开启关闭

`flushCache="false"`可以设置让增删改方法不刷新缓存

## BUG

需要将实体类序列化，否则报错
```java
import java.io.Serializable;

public class User implements Serializable {
    //...
}
```

## 缓存原理

* 1.先查看二级缓存内是否有需要的数据
* 2.再查看一级缓存中是否有需要的数据
* 3.都没查到，才会查询数据库

## 自定义缓存Ehcache

导包

```xml
<!-- https://mvnrepository.com/artifact/org.mybatis.caches/mybatis-ehcache -->
<dependency>
    <groupId>org.mybatis.caches</groupId>
    <artifactId>mybatis-ehcache</artifactId>
    <version>1.1.0</version>
</dependency>
```

`UserMapper.xml`

```xml
<cache type="org.mybatis.caches.ehcache.EhcacheCache"/>
```

新建`ehcache.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="http://ehcache.org/ehcache.xsd"
         updateCheck="false">
    <!--
       diskStore：为缓存路径，ehcache分为内存和磁盘两级，此属性定义磁盘的缓存位置。参数解释如下：
       user.home – 用户主目录
       user.dir  – 用户当前工作目录
       java.io.tmpdir – 默认临时文件路径
     -->
    <diskStore path="java.io.tmpdir/Tmp_EhCache"/>
    <!--
       defaultCache：默认缓存策略，当ehcache找不到定义的缓存时，则使用这个缓存策略。只能定义一个。
     -->
    <!--
      name:缓存名称。
      maxElementsInMemory:缓存最大数目
      maxElementsOnDisk：硬盘最大缓存个数。
      eternal:对象是否永久有效，一但设置了，timeout将不起作用。
      overflowToDisk:是否保存到磁盘，当系统当机时
      timeToIdleSeconds:设置对象在失效前的允许闲置时间（单位：秒）。仅当eternal=false对象不是永久有效时使用，可选属性，默认值是0，也就是可闲置时间无穷大。
      timeToLiveSeconds:设置对象在失效前允许存活时间（单位：秒）。最大时间介于创建时间和失效时间之间。仅当eternal=false对象不是永久有效时使用，默认是0.，也就是对象存活时间无穷大。
      diskPersistent：是否缓存虚拟机重启期数据 Whether the disk store persists between restarts of the Virtual Machine. The default value is false.
      diskSpoolBufferSizeMB：这个参数设置DiskStore（磁盘缓存）的缓存区大小。默认是30MB。每个Cache都应该有自己的一个缓冲区。
      diskExpiryThreadIntervalSeconds：磁盘失效线程运行时间间隔，默认是120秒。
      memoryStoreEvictionPolicy：当达到maxElementsInMemory限制时，Ehcache将会根据指定的策略去清理内存。默认策略是LRU（最近最少使用）。你可以设置为FIFO（先进先出）或是LFU（较少使用）。
      clearOnFlush：内存数量最大时是否清除。
      memoryStoreEvictionPolicy:可选策略有：LRU（最近最少使用，默认策略）、FIFO（先进先出）、LFU（最少访问次数）。
      FIFO，first in first out，这个是大家最熟的，先进先出。
      LFU， Less Frequently Used，就是上面例子中使用的策略，直白一点就是讲一直以来最少被使用的。如上面所讲，缓存的元素有一个hit属性，hit值最小的将会被清出缓存。
      LRU，Least Recently Used，最近最少使用的，缓存的元素有一个时间戳，当缓存容量满了，而又需要腾出地方来缓存新的元素的时候，那么现有缓存元素中时间戳离当前时间最远的元素将被清出缓存。
   -->
    <defaultCache
            eternal="false"
            maxElementsInMemory="10000"
            overflowToDisk="false"
            diskPersistent="false"
            timeToIdleSeconds="1800"
            timeToLiveSeconds="259200"
            memoryStoreEvictionPolicy="LRU"/>
  
    <cache
            name="cloud_user"
            eternal="false"
            maxElementsInMemory="5000"
            overflowToDisk="false"
            diskPersistent="false"
            timeToIdleSeconds="1800"
            timeToLiveSeconds="1800"
            memoryStoreEvictionPolicy="LRU"/>
  
</ehcache>
```

