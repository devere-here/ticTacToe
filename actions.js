var aiValue;
var clickable = false;
var userValue;
var difficulty;
var animation;
var timeOut;
var count = 0;
var flashCounter = 0;
var aiArray = [];
var userArray = [];
var userTurn;
var letterChosen = false;
var gameOver = false;
var winningSets = [["a1", "a2", "a3"], ["b1", "b2", "b3"], ["c1", "c2", "c3"], ["a1", "b1", "c1"], ["a2", "b2", "c2"], ["a3", "b3", "c3"], ["a1", "b2", "c3"], ["c1", "b2", "a3"]];


//Dialog Box for level
function chooseLevelDialogBox(){
  userTurn = true;
  gameOver = false;
  flashCounter = 0;
   $("#choose-level").dialog({autoOpen: true, modal: true, show:{
        effect: "fade",
        duration: 1000
    },hide:{
         effect: "fade",
         duration: 1000
    } 
 });
  
}

//Dialog Box for whether you want to be x or o
function xOrODialogBox(){
  $("#xOrO").dialog({autoOpen: true,
                            modal: true,
                            show:{
                              effect: "fade",
                              duration: 1000
                            },
                            hide:{
                              effect: "fade",
                              duration: 1000
                            }
  });
  
}

//Dialog box based off game outcome
function outcomeDialog(string){
  clickable = false;
    $(".outcome").css("display", "none");
  if(string == "win"){
    $("#win").css("display", "block");
  }else if(string == "tie"){
    $("#tie").css("display", "block");
  }else if(string == "loss"){
    $("#loss").css("display", "block");
  }
    $("#play-again").dialog({
      autoOpen: true,
      modal: true,
      show:{
        effect: "fade",
        duration: 1000
      },hide:{
        effect: "fade",
        duration: 1000
      }
    })
}

//Functions that checks if a box has an "x", "o", or is empty
function filterA(element){
  return element.includes("a");
}
function filterB(element){
  return element.includes("b");
}
function filterC(element){
  return element.includes("c");
}
function filter1(element){
  return element.includes("1");
}
function filter2(element){
  return element.includes("2");
}
function filter3(element){
  return element.includes("3");
}
function filterFirstDiagonal(element){
  var diagonal = ["a1", "b2", "c3"];
  if(diagonal.indexOf(element) != -1){
    return element;
  }
}
function filterSecondDiagonal(element){
  var diagonal = ["c1", "b2", "a3"];
  if(diagonal.indexOf(element) != -1){
    return element;
  }
}

//Checks filter functions to see if any winning combinations have been met
function filterTest(arr, i){
  var length;
  switch(i){
    case 0:
        length = arr.filter(filterA).length;
      break;
    case 1:
        length = arr.filter(filterB).length;
      break;
    case 2:
        length = arr.filter(filterC).length;
      break;
    case 3:
        length = arr.filter(filter1).length;
      break;
    case 4:
        length = arr.filter(filter2).length;
      break;
    case 5:
        length = arr.filter(filter3).length;
      break;
    case 6:
        length = arr.filter(filterFirstDiagonal).length;
      break;
    case 7:
        length = arr.filter(filterSecondDiagonal).length;
      break;

   }
  return length;
}

//Ai picks an empty square randomly
function addRandomly(){  
  var random = Math.floor(Math.random()*$(".box:empty").length);
  var $aiBox = $('.box:empty:eq('+ random + ')');
  $aiBox.html(aiValue);
  aiArray.push($aiBox.attr("id")); 
  userTurn = true;
  isGameOver(aiArray);
}

//Ai chooses center square or picks random square
function chooseCenterOrDiagonal(){ 
  
  var random = Math.floor(Math.random()*$(".priority:empty").length);
  if($(".priority:empty").length > 0){
    
    var index1 = userArray.indexOf("b2");
    var index2 = aiArray.indexOf("b2");
    var $aiBox;

    if(index1 == -1 && index2 == -1){
      $aiBox = $('#b2');

    }else{
      $aiBox = $('.priority:empty:eq('+ random + ')');
    }
    
    $aiBox.html(aiValue);
    aiArray.push($aiBox.attr("id")); 
    userTurn = true;
    isGameOver(aiArray);

    
  }

  
}


//Ai chooses empty box if about to win
function findUnusedBoxInRow(arr, i){ 
  for(var j = 0; j < 3; j++){
    if(arr.indexOf(winningSets[i][j]) == -1){
      return winningSets[i][j];
    }
  }
}


function aiMove(id){
  var aiLength = aiArray.length;
  var userLength = userArray.length;
  if((aiValue == "X" && aiLength == userLength - 1) || (aiValue == "O" && aiLength == userLength)){
    var $aiBox = $('div[id=' + id + ']');
    
    $aiBox.html(aiValue);
    aiArray.push($aiBox.attr("id")); 
    isGameOver(aiArray);
    userTurn = true;
  }
  
}
  
//Adds uservalue to selected box
function userMove(id){
  var $userBox = $('div[id=' + id + ']');
  $userBox.html(userValue);
  userArray.push(id);
  isGameOver(userArray);

  
}

//Ai first move if ai is o
function firstMove(aiValue){
  if(difficulty == 'easy'){

    addRandomly();
  }else{
    aiMove("b2");
  }

}


function checkBoard(string){
  
  for(var i = 0; i < 8; i++){
    if(userTurn == false){
        var aiLength = filterTest(aiArray, i);
        var userLength = filterTest(userArray, i);
      if(string == "offense"){
        checkForMove(aiLength, userLength, aiArray, i);   
      }else{
        checkForMove(userLength, aiLength, userArray, i);   
      } 
    }
  }  
}

function checkForMove(firstLength, secondLength, arr, i){
  
  if(firstLength == 2 && secondLength == 0){
     
        var boxId = findUnusedBoxInRow(arr, i);
        aiMove(boxId);  
      } 
}


function isGameOver(arr){
  var over = checkIfWon(arr);
  if(over[0] == true){
    gameOver = true;
    startFlash(over[1]);
  }else{
    var full = isBoardFull();
    if(full == true){
      outcomeDialog("tie");
    }
  }
}

function checkIfWon(arr, i){
  var count = 0;
  var index = -1;
  var bool = false;
  var array = []
    
  for(var i = 0; i < 8; i++){
    var length = filterTest(arr, i);
    if(length == 3){
      bool = true;
      index = i;
    }
  }
  array = [bool, index];
  
  return array;
}


//make animation a global variable
function startFlash(i){
  var set = winningSets[i];
  animation = setInterval(function(){flash(i);}, 300);

  timeOut = setTimeout(function(){endFlash(i);}, 2000)

}

//starts winning/losing animation
function flash(set){
  
  if(flashCounter == 0){
    if(userTurn == false){
      $('.set' + set + '').css("color", "green");
      $('.set' + set + '').css("background-color", "gold"); 
    }else{
      $('.set' + set + '').css("color", "red");
      $('.set' + set + '').css("background-color", "white"); 
    }
  }
  
  flashCounter = 1;
  
  var textColor = $('.set' + set + '').css("color");
  var backgroundColor = $('.set' + set + '').css("background-color");
  
  $('.set' + set + '').css("color", backgroundColor);
  $('.set' + set + '').css("background-color", textColor);
}

//ends winning/losing animation
function endFlash(set){
  
  clearInterval(animation);  
  if(userTurn == false){
    $('.set' + set + '').css("color", "green");
    $('.set' + set + '').css("background-color", "gold");
    outcomeDialog("win");
  }else{
    $('.set' + set + '').css("color", "white");
    $('.set' + set + '').css("background-color", "red");
    outcomeDialog("loss");
  }
  
}

//Checks for tie
function isBoardFull(){
  var bool = false;
  if($(".box:empty").length == 0){
    bool = true;
  }
  return bool;
}

//clears board
function clearBoard(){
  aiArray = [];
  userArray = [];
  $(".box").text("");
  $(".box").css("color", "white");
  $(".box").css("background-color", "green");

}

function sleep(milliseconds) {
   var currentTime = new Date().getTime();

   while(currentTime + milliseconds >= new Date().getTime()){
   }
}

//checks if box is availiable
function isBoxEmpty(id){
  var bool = false;
  if(userArray.indexOf(id) == -1 && aiArray.indexOf(id) == -1){
    bool = true;
  }
  return bool;
}

 $(".box").on("click", function(){
    
   var id = $(this).attr("id");
   var empty = isBoxEmpty(id);

    if(userTurn == true && clickable == true && empty == true){
      
      userMove(id);
      userTurn = false;
      if(gameOver == false){
        
        if(difficulty == "easy"){

          addRandomly();

        }else{

          checkBoard("offense");
          if(userTurn == false){
            checkBoard("defense");
          }if(userTurn == false){
            
            if(difficulty == "normal"){
              addRandomly();
            }else if(difficulty =="hard"){
              chooseCenterOrDiagonal();
              if(userTurn == false){
                addRandomly();
              }
            }
            
          }
        }
    }
    }
 
    
})

//level event handler
$(".level").on("click", function(){
  var id = $(this).attr("id");
  if(id=="easy"){
    difficulty = "easy";
  }else if(id=="normal"){
    difficulty = "normal";
  }else if(id=="hard"){
    difficulty = "hard";
  }
  $("#choose-level").dialog("close"); 

  xOrODialogBox();
})

//X or O event handler
$(".letter").on("click", function(){
  var id = $(this).attr("id");
  if(id=="O"){
    userValue = "O";
    aiValue = "X";
  }else if(id=="X"){
    userValue = "X";
    aiValue = "O";
    firstMove(aiValue);
  }
  clickable = true;
  $("#xOrO").dialog("close");
})

//Do you want to play again event handler
$(".continue").on("click", function(){
  var id = $(this).attr("id");
  if(id=="yes"){
    clearBoard();
    chooseLevelDialogBox();
  }else if(id=="no"){
    
  }
  $("#play-again").hide();
  $("#play-again").dialog("close"); 


})
chooseLevelDialogBox();