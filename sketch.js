var dog,sadDog,happyDog;
var foodS,foodStock;
var addFood;
var foodObj;
var db;
var food, lastFed;


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  db=firebase.database();
  createCanvas(1000,400);

  //object of food.js class
  foodObj = new Food();

  //refering to the section in the db and storing the val in foodstock
  foodStock=db.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //creating the feed button
  food=createButton("Feed");
  food.position(750,95);
  food.mousePressed(feedDog);


  //Adding food
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  
  var fedtime = db.ref('FeedTime');
  fedtime.on("value",function(data){
    lastFed = data.val();
  })
 
  //write code to display text lastFed time here
  if (lastFed >= 12){
    text("Last Fed: " + lastFed%12 + "PM", 350,30)
  }
  else if(lastFed === 0){
    text("Last Fed: 12 AM", 350,30)
  }
  else{
    text("Last Fed: " + lastFed + "AM", 350,30);
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();

  foodObj.updateFoodStock(foodS);
}

//function to change all the values once we feed the dog
function feedDog(){
  dog.addImage(happyDog);


  var foodstockval = foodObj.getFoodStock();

  if (foodstockval <= 0){
    foodObj.updateFoodStock(foodstockval*0);
  }
  else {
    foodObj.updateFoodStock(foodstockval-1);
  }

  db.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
  
}

//function to add food in stock
function addFoods(){
  foodS++;
  db.ref('/').update({
    Food:foodS
  })
}