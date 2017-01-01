/// <reference path="Order.html" />
/// <reference path="Order.html" />
/// <reference path="Shop/Order.html" />
window.onload = function () {

    var purchases = $("purchases"),
         product = [$("apple"), $("leave"), $("chrysanthemum"), $("nut"), $("mustache"), $("geranium"), $("vine"), $("thread"), $("feather"), $("fizalis")],
         i,
         count,
         basket = $("basket"),
         units = $("units"),
         sum = 0,
         cost,
         copy,
         arrCopy = [],
         arrSaved = [],
         arrSavedCounts = [],
         empty = $("empty"),
         arrButtons = purchases.getElementsByTagName("button"),
         makeOrder = $("makeOrder"),
         form = document.orderFrm;

    //проверяем, есть ли cookies и, если есть, отрисовываем сохраненную корзину
    checkCookies();

    function checkCookies() {
        var savedProducts = findCookieValue("saved-products");
        var savedCounts = findCookieValue("saved-counts");
        if (savedProducts) {

            //массивы id продуктов и количества их в корзине
            if (arrSaved && arrSavedCounts)
            arrSaved = savedProducts.split(","),
            arrSavedCounts = savedCounts.split(",");

            //для каждого сохраненного в корзине продукта
            for (var j = 0, len = arrSaved.length; j < len; j++) {
                var item = $(arrSaved[j]);

                //скрыть надпись о пустой корзине
                empty.style.display = "none";

                //скопировать выбранный товар в корзину
                drawCopy(arrSaved[j], item, arrSavedCounts[j], "cookie");
            }
        }
    }

    function findCookieValue(cookieName) {
        var allcookies = document.cookie;
        var pos = allcookies.indexOf(cookieName + "=");

        // Если cookie с указанным именем найден, извлечь его значения.
        if (pos != -1) {
            var start = pos + cookieName.length + 1;
            var end = allcookies.indexOf(";", start);

            if (end == -1) end = allcookies.length;

            var value = allcookies.substring(start, end);
            value = decodeURIComponent(value);
            return value;
        }
    }

    function $(name) {
        return document.getElementById(name);
    }

    for (i in product) {
        product[i].addEventListener("dragstart", function (evnt) {
            this.style.border = "2px solid grey";
            //this.style.cursor = 'grabbing';
            evnt.dataTransfer.effectAllowed = "move";
            evnt.dataTransfer.setData("item", this.id);
            evnt.dataTransfer.setData("count", this.dataset.count);
        }, false);

        product[i].addEventListener("dragend", function (evnt) {
            this.style.border = "";
        }, false);
    }

    purchases.addEventListener("dragover", function (evnt) {
        if (evnt.preventDefault) evnt.preventDefault();
        return false;
    }, false);

    purchases.addEventListener("dragenter", function (evnt) {
        this.style.border = "2px solid grey";
    }, false);

    purchases.addEventListener("dragleave", function (evnt) {
        this.style.border = "";
    }, false);

    document.getElementsByClassName("right")[0].addEventListener("dragover", function (evnt) {
        //разрешить зону приема
        if (evnt.preventDefault) evnt.preventDefault();
        return false;
    }, false);

    purchases.addEventListener("drop", function (evnt) {

        this.style.border = "";
        empty.style.display = "none";
        var id = evnt.dataTransfer.getData("item");
        count = evnt.dataTransfer.getData("count");
        var elem = $(id);        

        if (count == 0) {
            //разрешить зону приема
            if (evnt.preventDefault) evnt.preventDefault();
            if (evnt.stopPropagation) evnt.stopPropagation();

            //копируем нужные товары в зону корзины, отображаем кнопки "+", "-" и сумму
            drawCopy(id, elem, count, "plus");

            //добавляем cookie
            arrSaved.push(id);
            arrSavedCounts.push($(id).dataset.count);
            document.cookie = "saved-products=" + encodeURIComponent(arrSaved) + ";max-age=" + 60;
            document.cookie = "saved-counts=" + encodeURIComponent(arrSavedCounts) + ";max-age=" + 60;

            //разрешить зону приема
            return false;
        }

        else {
            //увеличить количество единиц выбранного товара         
            if (count > 6) {
                alert("Не надо жадничать!");
            }
            else {
                draw(id, elem, count, "plus");
            }   
        }

    }, false);

    //при клике по области корзины
    purchases.onclick = function (event) {
        //определяем узел документа, в котором произошло событие
        var e = event || window.event;     
        var target = e.target;

        //если это одна из кнопок "+", то запускаем обработчик нажатия по кнопке "+", передавая с параметром узел документа, где клик произошел
        if (target.classList.contains("plus")) plusHandler(target);

        //если же это одна из кнопок "-", то запускаем обработчик нажатия по кнопке "-", передавая с параметром узел документа, где клик произошел
        if (target.classList.contains("minus")) minusHandler(target);
    }

    function draw(id, elem, count, sign) {
        //определяем, происходит добавление или уменьшение единиц товара
        if (sign == "plus") count++;
        else if (sign == "minus") count--;

        //подсчитываем изменившееся количество кдиниц товара
        elem.dataset.count = count;
        countPrint = count + " ед.";
        document.getElementsByClassName(id)[5].innerHTML = countPrint;

        //подсчет и отображение стоимости нескольких единиц товара
        cost = +elem.dataset.price * 10 * count / 10;
        document.getElementsByClassName(id)[7].innerHTML = "$" + cost;

        //подсчет суммы покупок и вывод её на экран
        if (sign == "plus") sum = (sum * 10 + +elem.dataset.price * 10) / 10;
        else if (sign == "minus") sum = (sum * 10 - +elem.dataset.price * 10) / 10;
        $("sum").style.visibility = "visible";
        $("print").innerHTML = sum;

        //добавляем cookie

        //определяем индекс элемента массива arrSaved, где находится id товара, который мы сейчас изменяем
        var index = arrSaved.indexOf(id);
        if (index != -1) {
            //для массива arrSavedCounts по соответствующему индексу меняем количество единиц товара
            if (sign == "plus") arrSavedCounts[index]++;
            else if (sign == "minus") arrSavedCounts[index]--;
        }
        else {
            arrSaved.push(id);
            arrSavedCounts.push($(id).dataset.count);
        }

        //перезаписываем cookie
        document.cookie = "saved-products=" + encodeURIComponent(arrSaved) + ";max-age=" + 60;
        document.cookie = "saved-counts=" + encodeURIComponent(arrSavedCounts) + ";max-age=" + 60;
    }

    function drawCopy(id, elem, count, sign) {
        //увеличить количество единиц выбранного товара
        if (sign == "plus") count++;
        countPrint = count + " ед.";
        elem.dataset.count = count;

        if (count != 0) {
            //сделать копию товара в корзину
            copy = elem.cloneNode(true);
            copy.className = id + "Remove";
            arrCopy.push(id);

            //arrCopy.id;
            makeOrder.insertBefore(copy, basket);

            //вставить число единиц товара
            document.getElementsByClassName(id)[5].innerHTML = countPrint;

            //убрать рамку и отобразить кнопки "-" и "+"
            copy.style.border = "";
            document.getElementsByClassName(id)[4].style.visibility = "visible";
            document.getElementsByClassName(id)[6].style.visibility = "visible";

            //подсчет и отображение стоимости нескольких единиц товара
            cost = +elem.dataset.price * 10 * count / 10;
            document.getElementsByClassName(id)[7].innerHTML = "$" + cost;

            //подсчет суммы покупок и вывод её на экран
            if (sign != "cookie") sum = (sum * 10 + +elem.dataset.price * 10) / 10;
            else sum = (sum * 10 + cost * 10) / 10;
            $("sum").style.visibility = "visible";
            $("print").innerHTML = sum;
        }
    }

    function plusHandler(target) {
        while (target != purchases) {
            var name = target.id + "Remove";
            if (target.classList.contains(name)) {
                var id = target.id;
                var count = $(id).dataset.count,
                    el = $(id);

                if (count < 7) {
                    draw(id, el, count, "plus");
                }
                else if (count > 6) {
                    alert("Не надо жадничать!");
                }
                return;
            }
            target = target.parentNode;
        }
    }

    function minusHandler(target) {

        //проверяем, где был клик, проходя черех иерархию DOM-элементов от узла, в котором был клик, до самого верхнего, которым выбираем purchases
        while (target != purchases) {

                    //определяем имена классов скопированных товаров и проверяем, приходится ли клик на область одного из них - тогда это то, что нужно
                    var name = target.id + "Remove";
                    if (target.classList.contains(name)) {

                    //определяем, на какой именно области был клик, что это за товар и сколько его в корзине
                    var id = target.id;
                    var count = $(id).dataset.count,
                        el = $(id),
                        elRemove = document.getElementsByClassName(id+"Remove")[0];

                    if (count > 1) {
                        //уменьшаем количество товара на 1 и переписываем счетчик
                        draw(id, el, count, "minus");
                        return;
                    }
                    else {

                        //обнуляем счетчик товара и удаляем его из корзины
                        el.dataset.count = 0;
                        makeOrder.removeChild(elRemove);

                        //удаляем запись о товаре из массива скопированных в корзину элементов
                        arrCopy.splice(0, 1);

                        //проверяем длину массива товаров в корзине
                        //если товаров в корзине больше нет, то пересчитываем сумму, прячем её отображение и показываем запись о пустой корзине
                        if (arrCopy.length == 0) {
                            sum = (sum * 10 - +el.dataset.price * 10) / 10;
                            $("sum").style.visibility = "hidden";
                            empty.style.display = "block";
                        }

                            //если товары ещё остались - пересчитываем сумму и отображаем новую
                        else {
                            sum = (sum * 10 - +el.dataset.price * 10) / 10;
                            $("print").innerHTML = sum;
                        }

                        //меняем cookie

                        //определяем индекс элемента массива arrSaved, где находится id товара, который мы сейчас удалили
                        var index = arrSaved.indexOf(id);
                        if (index != -1) {
                            //для массивов arrSaved и arrSavedCounts по соответствующему индексу меняем количество единиц товара
                            arrSavedCounts.splice(index, 1);
                            arrSaved.splice(index, 1);
                        }

                        //перезаписываем cookie
                        document.cookie = "saved-products=" + encodeURIComponent(arrSaved) + ";max-age=" + 60;
                        document.cookie = "saved-counts=" + encodeURIComponent(arrSavedCounts) + ";max-age=" + 60;
                    }
                    return;
                }

            //переходим на уровень выше,  вверх по иерархии родителей от event.target 
                target = target.parentNode;
            }
    }

    $("orderButton").addEventListener("click", function () {
        //показать форму и скрыть кнопку "Оформить заказ"
        $("orderForm").style.visibility = "visible";
        $("sum").removeChild($("orderButton"));
        document.getElementsByName("products"[0]).value = arrSaved.join();
        document.getElementsByName("amount"[0]).value = arrSavedCounts.join();
    }, false);

    //выборочная печать в поле с номером телефона (только цифры)
    form.userTel.addEventListener("keypress", function (e) {
        var e = e || window.event,
            symbol = String.fromCharCode(e.charCode),
            allowedText = e.target.dataset.charsAllowed;

        if (e.charCode == 0 || e.charCode < 32) return true;

        if (allowedText.search(symbol) == -1) {
            e.preventDefault();
            return false;
        }
        else return true;
    }, false);

    //установка обработчиков для элементов формы
    for (var k = 0; k < form.elements.length; k++) {
        var e = form.elements[k];

        // пропускаем все, что не поле ввода
        if (e.type != "text" && e.type != "email") continue;

        var pattern = e.dataset.pattern;

        if (pattern) e.onchange = validateInput;
        
        form.onsubmit = validateForm;
    }

    function validateInput() {
        var value = this.value,
            pattern = this.dataset.pattern;

        var res = value.search(pattern);
        if (res == -1) this.className = "invalid";
        else this.className = "valid";
    }

    function validateForm() {
        var invalid = false;

        for (var i = 0; i < this.elements.length; ++i) {
            var e = this.elements[i];
            if (e.onchange != null) {
                e.onchange();
                if (e.classList.contains("invalid")) invalid = true;
            }
            if (invalid) {
                return false;
            }
        }
    }

    form.addEventListener("submit", function () {
        //$("makeOrder").style.display = "none";
        //$("done").style.display = "block";
        document.cookie = "saved-products=" + encodeURIComponent(arrSaved) +"; max-age=0";
        document.cookie = "saved-counts = " + encodeURIComponent(arrSavedCounts) + "; max-age=0";
        $("prods").value = arrSaved.join();
        $("amnts").value = arrSavedCounts.join();
    }, false);
}
