
interface MyInterface {
    static String staticVariable = "Interface Static Variable";
    static void staticMethod() {
        System.out.println("Interface Static Method");
    }
}

class MyClass implements MyInterface {
}

public class Main {
    public static void main(String[] args) {
        // ❌ Compilation error - MyClass has no static members
   // MyClass.staticMethod();        // Error!
         System.out.println(MyClass.staticVariable);  // Error!
        
        // ✅ Valid - accessing interface static members
       //yInterface.staticMethod();    // Output: "Interface Static Method"
       //ystem.out.println(MyInterface.staticVariable);  // Output: "Interface Static Variable"
    }
}