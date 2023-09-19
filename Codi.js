/**
 * Starts the application
 * This is the function that is run when the app starts
 *
 * It prints a welcome line, and then a line with "----",
 * then nothing.
 *
 * @param  {string} name the name of the app
 * @returns {void}
 */
function startApp(name) {
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", onDataReceived);
  console.log(`Welcome to ${name}'s application!`);
  console.log("--------------------");
}

/**
 * Decides what to do depending on the data that was received
 * This function receives the input sent by the user.
 *
 * For example, if the user entered
 * ```
 * node tasks.js batata
 * ```
 *
 * The text received would be "batata"
 * This function  then directs to other functions
 *
 * @param  {string} text data typed by the user
 * @returns {void}
 */
function onDataReceived(text) {
  // split the text into action and argument
  const command = text.replace('\n', '').trim().split(' ')
  const action = command[0]
  const args = command[1]


  
  if (action === "quit" || action === "exit") {
    quit();
  } else if (action === "hello") {
    // handle more than one argument
    command.length > 2 ? console.log('Hello takes one argument') :
    console.log(`Hello${args? ' ' + args : ''}!`)
  } else if (action === "--help" || action === "-h") {
    help();
  }else if(action === 'list' || action === 'ls'){
    command.length === 1 ? list() : console.log('list do not take arguments')
  } else if(action === 'add'){
    command.length === 2 ? add(args) : console.log('add should take ONE argument');
  }else if(action === 'remove'){
    if (args){
      if(isNaN(Number(args))){
        console.log('remove argument should be a number')
        return
      } 
        command.length <=2 ? remove(args) : console.log(`remove can't take more than one argument`)
    }else {
      remove();
      console.log('last task has been removed')
    }
  }
   else {
    unknownCommand(text);
  }

}

/**
 * prints "unknown command"
 * This function is supposed to run when all other commands have failed
 *
 * @param  {string} c the text received
 * @returns {void}
 */
function unknownCommand(c) {
  console.log('unknown command: "' + c.trim() + '"');
}

/**
 * Says hello
 *
 * @returns {void}
 */
function hello() {
  console.log("hello!");
}

/**
 * Exits the application
 *
 * @returns {void}
 */
function quit() {
  console.log("Quitting now, goodbye!");
  process.exit();
}
// prints all possible commands and their purpose when the user type '-h' or '--help'
function help() {
  console.log(`
  hello             prints hello
  quit, exit        stop running the app `);
}
// function to list todo tasks when the user run 'list' command
function list(){
  tasks.forEach((task,idx) => {
    console.log(`${idx + 1} - ${task}\n`)
  });
}
// function to add a task to the todo list when the user run 'add' command with an argument containing a the task
function add(task){
  tasks.push(task)
  console.log('task have been added successfuly')
}
// function to remove a task form the list, default value to handle undefiened values
function remove(number = tasks.length){
  if (number - 1 <= tasks.length){
    tasks.splice(number - 1 ,1)
  }else{
    console.log(`number doesn't exist`)
  }

}
// The following line starts the application
startApp("Jad Sarout");
var tasks = ['Debate research', 'Node basics', 'Drink coffee', 'Forget sleeping!']