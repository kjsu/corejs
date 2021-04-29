/*
    자바스크립트는 프로토타입 기반 언어

    생성자 함수를 new 연산자로 호출하면 생성자 함수의 정의된 내용을 바탕으로 새로운 인스턴스를 생성
    이때 인스턴스에는 __proto__라는 프로퍼티가 자동 부여되는데 해당 프로퍼티는 생성자 함수의 prototype 프로퍼티를 참조

    prototype, __proto__는 둘다 객체
    prototype 내부에는 인스턴스가 사용할 메서드를 저장, 인스턴스에선 __proto__를 통해 접근

    es5에서 instance.__proto__ 보다 Object.getPrototypeOf(instance) 사용을 권장
*/

let Person = function (name) {
    this._name = name;
}
Person.prototype.getName = function () {
    return this._name;
}
let tom = new Person('Tom');
tom.__proto__.getName(); // undefined, this가 instance.__proto__를 바라보기 때문
tom.getName(); // Tom, __proto__는 생략 가능

/*
    constructor 프로퍼티

    prototype 객체 내부에 constructor라는 프로퍼티 존재
    원래 생성자 함수(자기 자신)를 참조

    constructor는 값 변경 가능 (number, string, boolean 예외)
    예외의 경우 constructor.name은 바뀌지 않지만 instanceof는 false 반환
*/
Array.prototype.constructor === Array; // true

/*
    모두 동일한 대상을 가리킴
    [Constructor]
    [instance].__proto__.constructor
    [instance].constructor
    Object.getPrototypeOf([instance]).constructor
    [Constructor].prototype.constructor

    모두 동일한 객체(prototype)에 접근 가능
    [Constructor].prototype
    [instance].__proto__
    [instance]
    Object.getPrototypeOf([instance])
*/

/*
    메서드 오버라이드
    인스턴스가 정의된 prototype과 동일한 프로퍼티 혹은 메서드를 가지면 오버라이드됨
    원본 유지, instance -> instance.__proto__ 순으로 검색
*/
instance.__proto__.getName.call(tom); // 원본 메서드를 호출하기 위해 __proto__만 쓰면 참조 객체가 달라지므로 call로 객체 전달

/*
    프로토타입 체인
    __proto__ 내부에 다시 __proto__가 연쇄적으로 이어진 형태
    꼭대기엔 Object.prototype 존재
*/

/*
    스태틱 메서드
    객체만을 위해 동작하는 메서드
    Object.freeze 등
*/

let proto = Object.create(null) // __proto__가 없는 객체 생성 방법, 성능상 이점