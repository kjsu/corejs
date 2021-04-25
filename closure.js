/*
    closure
    함수의 변수를 참조한 내부 함수를 외부로 전달했을 때,
    해당 함수의 실행 컨텍스트가 종료된 후에도 LE가 GC되지 않는 현상
*/

/// 클로저의 원리 ///
let outer = function () {
    let a = 1;
    let inner = function () {
        console.log(++a);
    };
    inner();
};
outer();
/*
    inner 내부에서 a 미선언, environmentRecord에서 값 찾기 실패
    outerEnvironmentReference에 지정된 상위 컨텍스트인 outer의 LE에 접근한 뒤 a를 참조해서 오류 없이 2 출력
    outer의 실행 컨텍스트가 종료되면 LE에 저장된 식별자들의 참조를 삭제하고 이후 GC
    따라서 outer를 반복 호출해도 2만 리턴됨
*/

let outer = function () {
    let a = 1;
    let inner = function () {
        return ++a;
    };
    return inner();
};
let result = outer();
console.log(result);
/*
    위와 동일
    둘의 공통점은 outer의 실행 컨텍스트가 종료되기 전 inner의 실행 컨텍스트가 종료되며, 이후 inner 함수 호출 불가
*/

let outer = function () {
    let a = 1;
    let inner = function () {
        return ++a;
    };
    return inner; // 내부 함수 자체를 반환
};
let result = outer(); // 참조 유지. outer()() 형태로 호출 시 2가 반복됨
console.log(result()); // 2
console.log(result()); // 3
/*
    outer가 실행 종료된 후 inner가 outer의 LE에 접근 가능한 이유?
    outer 함수가 종료될 때 변수에 inner를 할당해서 GC 동작 안 함
    result 호출 후 inner의 실행 컨텍스트가 활성화되면 outer의 LE가 필요하므로 GC 수집대상에서 제외됨

    함수의 실행 컨텍스트가 종료된 후 LE가 GC의 수집 대상에서 제외되는건
    지역변수를 참조하는 내부함수가 외부로 전달된 경우가 유일

    '외부로 전달'이 곧 return만을 의미하는 것은 아님
    콜백 혹은 handler 함수 내부에서 지역변수를 참조 시 동일
*/

/// 클로저 메모리 회수 ///
let result = outer();
console.log(result());
console.log(result());
result = null; // 참조 카운트가 0이 되면 GC에 수집되면서 소모된 메모리 회수

/// 클로저 활용 사례 ///
/*
    콜백 함수
    예시) forEach 내부에서 addEventListener로 li를 생성
    addEventListener의 콜백 함수에서 forEach의 변수를 참조하면 클로저가 됨
*/
let alertFruitBuilder = function (fruit) {
    return function () {
        alert(`name is ${fruit}`);
    }
};

Fruits.forEach(function (fruit) {
    $li.addEventListener('click', function () { alert(`name is ${fruit}`); });
    $li.addEventListener('click', alertFruitBuilder(fruit));
})

/*
    접근 권한 제어(정보 은닉)
    자바스크립트는 기본적으로 접근 권한 기능 없음
    하지만 클로저를 이용하여 함수 차원에서 public, private한 값을 구분 가능

    일반적인 객체는 함수 및 내부변수가 모두 접근 가능하므로
    1) 함수에서 지역변수 및 내부함수 등 생성
    2) 외부 접근 권한 대상을 참조형으로 리턴 (2개 이상 객체 또는 배열, 1개일 때 함수)
*/
let increase = function () {
    let num = 1;

    return function () {
        return ++num;
    }
}
let result = increase();
console.log(result());

/*
    부분 적용 함수 (partially applied function)
    함수에 미리 인자를 넘기고 이후 추가로 인자를 넘긴 뒤 조합하여 실행 완료하는 함수
*/
let add = function () {
    let result = 0;
    for (let i = 0; i < arguments.length; i++) {
        result += arguments[i];
    }
    return result;
}
let addPartial = add.bind(null, 1, 2, 3, 4, 5); // null을 this로 가지는 새로운 함수를 생성하면서 클로저
console.log(addPartial(6, 7, 8, 9, 10)); // 따라서 result 값이 유지됨

/*
    debounce
    부분 적용 함수를 활용한 예
    짧은 시간 동일한 이벤트가 많이 발생했을 때 처음 또는 마지막에 발생한 이벤트에 대해 한 번만 처리
    FE 성능 최적화에 도움
*/
let debounce = function (callback, wait) {
    let timeoutId = null;
    return function (event) {
        let self = this;
        console.log(`event 발생`);
        clearTimeout(timeoutId);
        timeoutId = setTimeout(callback.bind(self, event), wait);
    }
}

let moveHandler = function (e) {
    console.log(`event 처리`);
}

document.body.addEventListener('mousemove', debounce(moveHandler, 500));

/*
    커링 함수 (currying function)
    한 번에 하나의 인자만 전달
    중간 실행 결과는 그다음 인자를 받기 위해 대기만 할 뿐, 마지막 인자가 전달되기 전 원본 함수는 실행 안 됨.

    각 단계에서 받은 인자들은 GC되지 않다가 마지막 호출 후 실행 컨텍스트 종료 시 한번에 회수
    지연 실행(lazy execution)
*/
let curry = function (func) {
    return function (a) {
        return function (b) {
            return func(a, b);
        }
    }
}
let curryArrowFunc = func => a => b => func(a, b);

let getMaxWith10 = curry(math.max)(10);
console.log(getMaxWith10(8)); // 10

