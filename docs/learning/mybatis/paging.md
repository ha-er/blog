# 分页

为什么需要分页？

* 减少数据的处理量

## **使用`limit`分页**

语法：
```sql
SELECT * FROM user limit startIndex,pageSize;
SELECT * FROM user limit pageSize;#相当于[0,pageSize]
```

接口`UserMapper`

```java
public interface UserMapper {
    //查询全部
    List<User> selectUserList(Map<String,Integer> map);
}
```

`UserMapper.xml`

```xml
<mapper namespace="com.haer.dao.UserMapper">
    <select id="selectUserList" parameterType="map" resultType="user">
       select * from mybatis.user limit #{startIndex},#{pageSize}
    </select>
</mapper>
```

测试`UserDaoTest`

```java
public class UserDaoTest {

    @Test
    public void test() {
        //获取sqlSession对象
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        try {
            //方式一：getMapper
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);

            HashMap<String, Integer> map = new HashMap<String, Integer>();

            map.put("startIndex",1);
            map.put("pageSize",2);

            List<User> userList = userMapper.selectUserList(map);

            //方式二：
            //List<User> userList = sqlSession.selectList("com.haer.dao.UserMapper.selectUserList");

            for (User user : userList) {
                System.out.println(user);
            }
        } finally {
            //关闭sqlSession(必须要关闭)
            sqlSession.close();
        }
    }
}
```

## **使用RowBounds分页**

`UserMapper`

```java
public interface UserMapper {
    //查询全部
    List<User> selectUserList();
}
```

`UserMapper.xml`

```xml
<mapper namespace="com.haer.dao.UserMapper">
    <select id="selectUserList" resultType="user">
       select * from mybatis.user
    </select>
</mapper>
```

测试`UserDaoTest`

```java
public class UserDaoTest {

        @Test
        public void getUserByRowBounds() {
            //获取sqlSession对象
            SqlSession sqlSession = MybatisUtils.getSqlSession();
            try {
    
                //RowBounds实现
                RowBounds rowBounds = new RowBounds(1, 2);
    
                //使用sqlSession.selectList()
                List<User> userList = sqlSession.selectList("com.haer.dao.UserMapper.selectUserByRowBounds", null, rowBounds);
    
                for (User user : userList) {
                    System.out.println(user);
                }
            } finally {
                //关闭sqlSession(必须要关闭)
                sqlSession.close();
            }
        }
}
```

## 插件实现分页

[Mybatis PageHelper](https://pagehelper.github.io)