# 算法

## 冒泡排序

1、比较数组中，俩相邻的元素，如果第一个比第二个大，就交换位置

2、每一次比较，都会产生一个最大，或最小数

3、下一轮可以减少一次排序

4、依次循环，知道结束

```java
public class ArrayDemo{
    public static void main(String[] args){
      int[] a = {4,2,54,2,1,43,8,65};
      int[] sort = sort(a);//返回一个排序后的数组
      System.out.println(Array.toString(sort));
    }
    
    //冒泡排序
    public static int[] sort(int[] array){
        int temp = 0;
        //外层循环，判断我们循环要走多少次
        for(int i = 0; i < array.length-1; i++) {
          //内层循环，判断俩个数，如果第一个比第二个大，就交换位置
          for(int j = 0; j < array.length-1-i; j++) {
          //if (array[j+1] > array[j]){//倒序
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

记录少量数据的坐标位置，数量，数组大小，值

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

