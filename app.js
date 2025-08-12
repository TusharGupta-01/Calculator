let container = document.querySelector(".cal-screen");
let scrlScreen =document.querySelector(".scroll-screen");
let screen = scrlScreen.children[0]; //screen
let valOp = ["0"];
let value = "0";
let ans="";
let idx = 0;

//event listener on buttons
let btns = document.querySelectorAll(".btn");
for (let btn of btns) {
  btn.addEventListener("click", () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(200); // Vibrate for 200ms
    }
    
    let text = btn.innerText;
    //clear button click
    if (text === "clr") {
      clear();
    }
    //Delete button click
    else if (text === "DEL") {
      del();
    }
    //Equal button click
    else if (text === "=") {
      eql();
    }
    //Number button click
    else if (btn.classList.contains("num")) {
      num(text);
    }
    //Dot button click
    else if (text === ".") {
      dot(text);
    }
    //Percentage button click
    else if (text === "%") {
      per(text);
    }
    //operators button click
    else {
      oper(text);
    }
    if (text !== "=") {
      scrlScreen.scrollLeft = scrlScreen.scrollWidth;
      container.scrollLeft = container.scrollWidth;
    }
  });
}

function oper(text) {
  let op = screen.innerText.slice(screen.innerText.length - 1); //last value on screen
  //check if last value on screen is operator then change it
  if (op === "+" || op === "-" || op === "×" || op === "÷") {
    value = text;
    screen.innerText = `${
      screen.innerText.slice(0, screen.innerText.length - 1) + text
    }`;
  } else if (op === ".") {
    valOp[idx] = "0";
    idx++;
    value = text;
    screen.innerText = `${screen.innerText}0${text}`;
  } 
  else if(ans!==""){
    valOp[idx] = ans;
    idx++;
    value = text;
    screen.innerText = `${ans + text}`;
    ans="";
  }else {
    //saving no.
    valOp[idx] = value;
    idx++;
    value = text;
    screen.innerText = `${screen.innerText + text}`;
  }
}

function per(text) {
  let op = screen.innerText.slice(screen.innerText.length - 1); //last value on screen
  if(ans!==""){
    value=ans;
    ans="";
    value += "%";
    screen.innerText = `${value}`;
  }
  //check if last value on screen is operator then store it in array
  else if (op === "+" || op === "-" || op === "×" || op === "÷") {
    valOp[idx] = value;
    idx++;
    value = "0%";
    screen.innerText = `${screen.innerText}0${text}`;
  } else {
    value += "%";
    screen.innerText = `${screen.innerText + text}`;
  }
}

function dot(text) {
  if (value.indexOf(".") == -1) {
    let op = screen.innerText.slice(screen.innerText.length - 1); //last value on screen
    //check if last value on screen is operator then store it in array
    if (op === "+" || op === "-" || op === "×" || op === "÷") {
      valOp[idx] = value;
      idx++;
      value = "";
    } else if (op === "%") {
      return;
    }
    value += ".";
    console.dir(value);
    screen.innerText = `${screen.innerText + text}`;
  }
}

function num(text) {
  let op = screen.innerText.slice(screen.innerText.length - 1); //last value on screen
  if (op === "+" || op === "-" || op === "×" || op === "÷") {
    valOp[idx] = value;
    idx++;
    value = text;
    screen.innerText = `${screen.innerText + text}`;
  } else if (op === "%") {
    return;
  } else if (screen.innerText === "0") {
    value = text;
    console.dir(value);
    screen.innerText = `${text}`;
  } else {
    value += text;
    console.dir(value);
    screen.innerText = `${screen.innerText + text}`;
  }
}

function clear() {
  value = "0";
  valOp = ["0"];
  idx = 0;
  ans="";
  screen.innerText = "0";
}

function del() {
  let end = screen.innerText.length;
  let valLen = value.length;
  if (end === 1) {
    value = "0";
    valOp = ["0"];
    idx = 0;
    screen.innerText = "0";
  } else if (valLen > 0) {
    value = value.slice(0, valLen - 1);
    screen.innerText = screen.innerText.slice(0, end - 1);
    if (valLen - 1 == 0) {
      idx--;
      console.log(idx);
      value = valOp[idx];
      valOp.pop();
    }
  }
}
function eql() {
  if (value !== "") {
    let op = screen.innerText.slice(screen.innerText.length - 1);
    if(valOp.length===1){
      valOp.pop();
      valOp.push(value);
      value = "";
    }
    else if (op === "+" || op === "-" || op === "×" || op === "÷") {
      screen.innerText = screen.innerText.slice(0, screen.innerText.length - 1);
    } else {
      valOp.push(value);
      value = "";
    }
    idx=valOp.length-1;
    calculate();
    ans=`${valOp[0]}`;
    idx=0;
    screen.innerText = `Ans ${valOp[0]}`;
    // scrlScreen.scrollLeft = scrlScreen.scrollWidth - scrlScreen.clientWidth;
    scrlScreen.scrollLeft = 0;

  }
}

async function calculate() {
  let i = idx;
  //% function
  console.log( "out", valOp[i] );
  while (i >= 0) {
    let x = valOp[i].slice(valOp[i].length - 1, valOp[i].length);
    console.log( "1st", valOp[i] );
    if (x === "%") {
      let count = 1;
      console.log( "gg", valOp[i] );
      valOp[i] = valOp[i].slice(0,valOp[i].length - 1);
      console.log("a" , i);
      x = valOp[i].slice(valOp[i].length - 1, valOp[i].length);
      console.log("b", valOp[i]);
      while (x === "%") {
        count++;
        console.log( x );
        console.log(valOp[i]);
        valOp[i] = valOp[i].slice(0,valOp[i].length - 1);
        x = valOp[i].slice(valOp[i].length - 1, valOp[i].length);
      }
      console.log(valOp[i]);
      valOp[i]=(String)(valOp[i]/(100**count));
    }
    i = i - 2;
  }
  i=idx-1;

  // ÷ function
  while(i>=0){
    if(valOp[i] === "÷")
    {
        let x=valOp[i-1];
        let y=valOp[i+1];
        valOp.splice(i-1,3,(String)(x/y));
    }
    i = i - 2;
  }
  
  i=idx-1;
  // × function
  while(i>=0){
    if(valOp[i] === "×")
    {
        let x=valOp[i-1];
        let y=valOp[i+1];
        valOp.splice(i-1,3,(String)(x*y));
    }
    i = i - 2;
  }
  
  i=idx-1;
  //+ Function
  while(i>=0){
    if(valOp[i] === "+")
    {
        let x=Number(valOp[i-1]);
        let y=Number(valOp[i+1]);
        valOp.splice(i-1,3,(String)(x+y));
    }
    i = i - 2;
  }
  
  i=idx-1;
  //- Function
  while(i>=0){
    if(valOp[i] === "-")
    {
        let x=Number(valOp[i-1]);
        let y=Number(valOp[i+1]);
        valOp.splice(i-1,3,(String)(x-y));
    }
    i = i - 2;
  }


}
