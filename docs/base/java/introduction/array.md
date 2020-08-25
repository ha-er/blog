# 数组

## 什么是数组

* 数组是相同类型数据的有序集合
* 数据描述的是相同类型的若干个数据，按照一定的先后次序排列组合
* 每一个数据称为一个数组元素，数组元素可以通过下标访问他们

## 数组的定义

* 声明

```
dataType[] arrayRefVar;   // 首选的方法
数据类型[] 数组变量名;

dataType arrayRefVar[];  // 效果相同，但不是首选方法
数据类型 数组变量名[];
```

* 创建

```
arrayRefVar = new dataType[arraySize];
变量名 = new 数据类型[数组大小]

dataType[] arrayRefVar = {value0, value1, ..., valuek};
数据类型[] 数组变量名 = {值1,值2,...}
```

```java
public class TestArray {
   public static void main(String[] args) {
      // 数组大小
      int size = 10;
      // 定义数组
      double[] myList = new double[size];
      myList[0] = 5.6;
      myList[1] = 4.5;
      myList[2] = 3.3;
      myList[3] = 13.2;
      myList[4] = 4.0;
      myList[5] = 34.33;
      myList[6] = 34.0;
      myList[7] = 45.45;
      myList[8] = 99.993;
      myList[9] = 11123;
      // 计算所有元素的总和
      double total = 0;
      for (int i = 0; i < size; i++) {
         total += myList[i];
      }
      System.out.println("总和为： " + total);
   }
}
```

## For-Each 循环

```
//element为定义的变量名，array数组变量名
//这样可以拿到数组的每一个元素
for(type element: array)
{
    System.out.println(element);
}
```

## 多维数组

```
type[][] typeName = new type[typeLength1][typeLength2];
String str[][] = new String[3][4];
```

## Arrays

java.util.Arrays 类能方便地操作数组，它提供的所有方法都是静态的。

具有以下功能：

* 给数组赋值：通过 fill 方法。
* 对数组排序：通过 sort 方法,按升序。
* 比较数组：通过 equals 方法比较数组中元素值是否相等。
* 查找数组元素：通过 binarySearch 方法能对排序好的数组进行二分查找法操作。

具体说明请查看下表：

|方法|说明|
|-|-|
|public static int binarySearch(Object[] a, Object key)|用二分查找算法在给定数组中搜索给定值的对象(Byte,Int,double等)。数组在调用前必须排序好的。如果查找值包含在数组中，则返回搜索键的索引；否则返回 (-(插入点) - 1)。|
|public static boolean equals(long[] a, long[] a2)|如果两个指定的 long 型数组彼此相等，则返回 true。如果两个数组包含相同数量的元素，并且两个数组中的所有相应元素对都是相等的，则认为这两个数组是相等的。换句话说，如果两个数组以相同顺序包含相同的元素，则两个数组是相等的。同样的方法适用于所有的其他基本数据类型（Byte，short，Int等）。|
|public static void fill(int[] a, int val)|将指定的 int 值分配给指定 int 型数组指定范围中的每个元素。同样的方法适用于所有的其他基本数据类型（Byte，short，Int等）。|
|public static void sort(Object[] a)|对指定对象数组根据其元素的自然顺序进行升序排列。同样的方法适用于所有的其他基本数据类型（Byte，short，Int等）。|

## 冒泡排序

```java
public class ArrayDemo{
    public static void main(String[] args){
      int[] a = {4,2,54,2,1,43,8,65};
      int[] sort = sort(a);//返回一个排序后的数组
      System.out.println(Array.toString(sort));
    }
    
    //冒泡排序
    //1、比较数组中，俩相邻的元素，如果第一个比第二个大，就交换位置
    //2、每一次比较，都会产生一个最大，或最小数
    //3、下一轮可以减少一次排序
    //4、依次循环，知道结束
    public static int[] sort(int[] array){
        int temp = 0;
        //外层循环，判断我们循环要走多少次
        for(int i = 0; i < array.length-1; i++) {
          //内层循环，判断俩个数，如果第一个比第二个大，就交换位置
          for(int j = 0; j < array.length-1-i; j++) {
//            if (array[j+1] > array[j]){//倒序
            if (array[j+1] < array[j]){//正序
                temp =array[j];
                array[j] = array[j+1];
                array[j+1] = temp;
            }
          }
        }
        
        return array;
    }
}
```

## 稀疏数组

对于数据比较少，或者很多相同数据的二维数组，可以使用稀疏数组，压缩

```java
public class ArrayDemo{
    public static void main(String[] args){
      //创建一个二维数组,数据很少，占用内存较大
      int[][] array = new int[11][11];
      array[1][2] = 1;
      array[2][3] = 2;
      
      //转换为稀疏数组
      //1、获取有效值的个数
      int sum = 0;
      for(int i = 0; i < 11; i++) {
        for(int j = 0; j < 11; j++) {
          if (array[i][j] != 0) {
               sum++;
          }
        }
      }
      //2、创建一个稀疏数组
      int[][] array2 = new int[sum+1][3];
      array2[0][0] = 11;
      array2[0][1] = 11;
      array2[0][2] = sum;
      //3、遍历二维数组，将有效值存放到稀疏数组中
      int count = 0;
      for(int i = 0; i < array.length; i++) {
        for(int j = 0; j < array[i].length; j++) {
          if (array[i][j] != 0){
              count++;
              array2[count][0] = i;
              array2[count][1] = j;
              array2[count][2] = array[i][j];
          }
        }
      }
      
      //4、输出稀疏数组
      
     for(int i = 0; i < array2; i++) {
       System.out.println(array2[i][0]+"\t"+
       array2[i][1]+"\t"+
       array2[i][2]+"\t");
     }
    }
}
```

打印结果

```
11 11 2
1  2  1
2  3  2
```

表示一个11*11大小的二维数组，有2个有效数据

在坐标1,2有效值为1，在坐标2,3有效值为2
