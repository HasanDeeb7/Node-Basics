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

let tasks = [];
const fs = require("fs");
const file = process.argv[2] || 'database.json'
try {
  let dataRecieved = fs.readFileSync('database.json');
  tasks = JSON.parse(dataRecieved);
} catch (err) {
  console.error("Error receiving data from file", err);
}

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
  const command = text.replace("\n", "").trim().split(" ");
  const action = command[0];
  const args = command[1];

  if (action === "quit" || action === "exit") {
    quit();
  } else if (action === "hello") {
    // handle more than one argument
    command.length > 2
      ? console.log("Hello takes one argument")
      : console.log(`Hello${args ? " " + args : ""}!`);
  } else if (action === "--help" || action === "-h") {
    help();
  } else if (action === "list" || action === "ls") {
    command.length === 1 ? list() : console.log("list do not take arguments");
  } else if (action === "add") {
    command.length >= 2
      ? add(command.slice(1).join(' '))
      : console.log("add should take ONE argument");
  } else if (action === "remove") {
    if (args) {
      if (isNaN(Number(args))) {
        console.log("remove argument should be a number");
        return;
      }
      command.length <= 2
        ? remove(args)
        : console.log(`remove can't take more than one argument`);
    } else {
      remove();
      console.log("last task has been removed");
    }
  } else if (action === "edit") {
    if (command.length < 2) {
      console.log("edit should at least have one argument");
    } else {
      edit(args, command.slice(1));
    }
  } else if (action === "check") {
    if (command.length === 2 && !isNaN(Number(args))) {
      check(args);
    } else console.log("check should take a number as an only argument");
  } else if (action === "uncheck") {
    if (command.length === 2 && !isNaN(Number(args))) {
      uncheck(args);
    } else console.log("check should take a number as an only argument");
  } else {
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
  console.log("run --help or -h to check possible commands");
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
  saveData();
  process.exit();
}
// prints all possible commands and their purpose when the user type '-h' or '--help'
function help() {
  console.log(`
  hello                             prints hello
  quit, exit                        stop running the app
  list, ls                          list all tasks with the completion status 
  add <arguments>                   adds a task to the tasks list
  remove [number]                   remove the task at specified number from the list, removes the last task if no arguments
  edit [number] <text to replace>   update the task at the number specified with the text specified, update the last task if no arguments
  check/uncheck <number>            toggle the status of the task
  
  `);
}
// function to list todo tasks when the user run 'list' command
function list() {
  tasks.forEach((task, idx) => {
    console.log(
      `${task.done ? "[\u2714]" : "[\u2718]"} ${idx + 1} - ${task.task}\n`
    );
  });
}
// function to add a task to the todo list when the user run 'add' command with an argument containing a the task
function add(task) {
  tasks.push({ task: task, done: false });
  console.log("task have been added successfuly");
}
// function to remove a task form the list, default value to handle undefiened values
function remove(number = tasks.length) {
  if (number - 1 <= tasks.length) {
    tasks.splice(number - 1, 1);
  } else {
    console.log(`number doesn't exist`);
  }
}

function edit(args, command) {
  if (isNaN(Number(args))) {
    tasks.splice(-1, 1, { task: command.slice(0).join(" ") });
    console.log(command[0]);
  } else
    tasks.splice(Number(args) - 1, 1, { task: command.slice(1).join(" ") });
  // console.log('else: '+ typeof Number(command[0]))
}
function check(args) {
  tasks[args - 1].done = true;
}
function uncheck(args) {
  tasks[args - 1].done = false;
}
function saveData() {
  let data = JSON.stringify(tasks);
  fs.writeFileSync(file, data);
}

// The following line starts the application
startApp("Hasan Deeb");

