const items = {
  0: "Уборка санузлов",
  1: "Уборка балкона с мытьем окон",
  2: "Мытьё окон",
  3: "Удаление прикипевшей плёнки с оконных рам",
  4: "Мойка люстры",
  5: "Мытьё кухонных ящиков",
  6: "Мытьё вытяжки",
  7: "Посудомоечная машина",
  8: "Мытьё холодильника внутри",
  9: "Мытье духового шкафа",
  10: "Мытьё микроволновой печи",
  11: "Мытьё посуды",
  12: "Удаление шерсти дом. животных",
  13: "Химчистка мягкой мебели, ковров",
  14: "Снять/повесить шторы, тюль",
  15: "Озонирование",
};

const types = {
  0: "Генеральная уборка",
  1: "Уборка после ремонта",
};

const prices = {
  0: 300,
  1: 250,
  2: 200,
};

$(document).ready(function () {
  const request = {
    type: 0,
    rooms: 1,
    area: 50.1,
  };

  let price;
  if (request.area >= 100) price = request.area * prices[2];
  else if (request.area >= 50) price = request.area * prices[1];
  else if (request.area >= 0) price = request.area * prices[0];
  else price = 0;
  let total = price;

  $("#total").text(total);
  $("#totalR").text(request.rooms);
  $("#totalM").text(request.area);
  $("#m").text(price);

  const buttons = $(".toggle");
  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener("click", function () {
      buttons.each((b) => {
        if (buttons[b].classList.contains("button--active")) {
          buttons[b].classList.remove("button--active");
        }
      });
      button.classList.add("button--active");
      addItemToRequest(button.innerText);
    });
  });

  $("#inc-r").click(() => {
    let num = parseInt($("#rooms").text());
    if (num < 10) $("#rooms").text(++num);
    request.rooms = num;
    $("#totalR").text(request.rooms);
  });

  $("#dec-r").click(() => {
    let num = parseInt($("#rooms").text());
    if (num > 1) $("#rooms").text(--num);
    request.rooms = num;
    $("#totalR").text(request.rooms);
  });

  $(".form__additional").click(({ target }) => {
    if (target.tagName === "BUTTON" && target.classList.contains("button")) {
      if (target.parentElement.dataset && !target.parentElement.dataset.count) {
        if (!target.parentElement.classList.contains("active")) {
          addItemToRequest(
            target.parentElement.dataset.item,
            target.parentElement.dataset.price
          );
          target.parentElement.classList.add("active");
          target.innerText = "Отменить";
        } else {
          removeFromRequest(target.parentElement.dataset.item);
          target.parentElement.classList.remove("active");
          target.innerText = "Добавить";
        }
      }
    } else if (target.tagName === "BUTTON" && target.innerText === "+") {
      let n = parseInt(target.nextElementSibling.innerText);
      target.nextElementSibling.innerText = ++n;
      addItemToRequest(
        target.parentElement.parentElement.dataset.item,
        target.parentElement.parentElement.dataset.price,
        n
      );
      total += +target.parentElement.parentElement.dataset.price;
      $("#total").text(total);
      target.parentElement.parentElement.classList.add("active");
    } else if (target.tagName === "BUTTON" && target.innerText === "-") {
      let n = parseInt(target.previousElementSibling.innerText);
      if (n > 0) {
        target.previousElementSibling.innerText = --n;
        addItemToRequest(
          target.parentElement.parentElement.dataset.item,
          target.parentElement.parentElement.dataset.price,
          n
        );
        if (n === 0) {
          target.parentElement.parentElement.classList.remove("active");
        }
        total -= +target.parentElement.parentElement.dataset.price;
        $("#total").text(total);
      }
    }
  });

  function addItemToRequest(item, price, count) {
    const name = items[item];
    if (name && price) {
      if (count && !$(`#${item}`).length) {
        price = price * count;
        $("#request").append(
          `<li id="${item}">${name} <span id="${item}-s">${count}</span> шт - <span id="${item}-p">${price}</span> ₽</li>`
        );
      } else if (count && $(`#${item}`)) {
        $(`#${item}-s`).text(count);
        $(`#${item}-p`).text(price * count);
      } else if (count === 0) {
        removeFromRequest(item);
      } else {
        if (price < 1) {
          price = total * price;
        }
        $("#request").append(`<li id="${item}">${name}  - ${price} ₽</li>`);
        total += +price;
        $("#total").text(total);
      }
    } else {
      $("#first").remove();
      $("#request").prepend(`<li id="first">${item}</li>`);
    }
  }

  function removeFromRequest(item) {
    $(`#${item}`).remove();
  }
});

// function update
