"use strict";

let board = null; 
//board нужна для хранения элемента 
let def_state = {
    c: false,
    false: 0b000000000,
    true: 0b000000000
};
//def_state с дефолтным состоянием игры, содержит:
//Игрока (false - X, true - O)
//Битовое представление пустого поля для игрока X
//Битовое представление пустого поля для игрока O
let state = {};
//Переменная state нужна для хранения текущего состояния игры

function reset_gameboard() {
    //Сбрасывает игровое поле к начальному состоянию
    state = {};
    //Очистка текущего состояния игры
    Object.assign(state, def_state);
    //Копирование свойств из def_state в state

    if (board === null) {
        board = document.getElementById('board');
        //Получение элемента board из HTML
        for (let step = 0; step < 9; step++) { //Цикл для создания 9 ячеек
            let cell = document.createElement('div');// Создание нового элемента div для ячейки
            cell.className = "cell";// Установка класса cell для ячейки
            cell.textContent = ''; //Очистка содержимого ячейки
            cell.setAttribute("data-num", step); // Установка атрибута data-num с номером шага
            cell.addEventListener('click', cellClick);//Добавление обработчика события click для ячейки

            board.append(cell); //Добавление ячейки на игровое поле
        }
    }

    board.querySelectorAll('.cell').forEach((cell) => {
        cell.textContent = '';
    });
    //Очистка содержимого всех ячеек
}

function cellClick(event) { //Обрабатывание события нажатия на ячейки
    const cell = event.target; //Получение элемента ячейки, на которую нажали

    if (cell.textContent !== "") { //Проверка, занята ли ячейка
        return;//Если занята, выход из функции
    }
    cell.textContent = {false: "X", true: "0"}[state.c]; 
    //Установка символа X или O в ячейку в зависимости от текущего игрока

    state[state.c] |= (1 << cell.dataset.num);
    // Обновление битового представления поля текущего игрока
    let p = state[state.c];
    //Сохранение битового представления поля для удобства.

    //Проверка победы
    let m_diagonal = 0b100010001;
    //Битовое представление главной диагонали
    let s_diagonal = 0b001010100;
    //Битовое представление побочной диагонали
    let is_winner =
        (p & m_diagonal) == m_diagonal // Проверка главной диагонали
        || (p & s_diagonal) == s_diagonal; //Проверка побочной диагонали.

        //Проверка строк и столбцов
    let row = 0b000000111;// Битовое представление строки
    let column = 0b001001001;//Битовое представление столбца
    for (let i = 0; i < 3; i++) { //Цикл для проверки 3 строк и столбцов
        is_winner = is_winner || (p & row) == row || (p & column) == column; //Проверка текущей строки и столбца

        row = row << 3; //Сдвиг битов строки влево на 3 для следующей строки
        column = column << 1; //Сдвиг битов столб
    }

    //Проверка победы и ничьей
    if (is_winner) { //Если есть победитель, то
        alert(cell.textContent);//Вывести сообщение о победителе
        reset_gameboard();//Сбросить игровое поле

        return;
    }

    if ((state.true | state.false) == 0b111111111) { //Если все битовые ячейких игроков заполнены
        alert("Ничья"); // Сообщение об ничье
        reset_gameboard(); //Сбрасывание игрового поля

        return;
    }

    state.c = !state.c;//Переключение игрока
}

reset_gameboard();//Сброс игрового поля при начале игры

document.getElementById('reset').addEventListener('click', reset_gameboard);
//Присваивание значение кнопке сброса игры
//Добавление кнопки сброса
