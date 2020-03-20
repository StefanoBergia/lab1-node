"use strict"

let tasks=[];
let new_task;
let old_task;
let old_task_index;
let rm_date;
let millis;
let now;
let state='menu';

let readLineS=require('readline-sync');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '>'
});


PrintMenu();
rl.prompt();
state='m';
rl.on('line', (line) => {

    if (state=='m'){
        switch (line.trim()) {
        case '1':
            new_task={};
            state='i1'
            console.log("insert description:");
            break;
        case '2':
            console.log("insert task to remove: ");
            state="d1";
            break;
        case '3':
            console.log("insert date to remove (in a correct format): ");
            state="d2";
            break;
        case '4':
            tasks.sort((a,b)=>a.description.localeCompare(b.description));
            console.log(tasks);
            break;

        case '5':
            console.log("exiting program");
            process.exit(0);
            break;
        default:
            console.log(`unknown command`);
            break;
        }
    }else if( state=='i1'){
        if(!tasks.find(
            (element)=>element.description.localeCompare(new_task.description)==0)){
            state='i2'
            new_task.description=line;
             console.log("insert urgency (urgent/not urgent): ");
        }else{
            console.log("task already present");
            state='m';
        }

    }else if(state=='i2'){
        
        if(line=="urgent" || line=="not urgent"){
            state='i3'
            new_task.urgency=line;
            console.log("insert type (private/shared): ");
        }else
            console.log("insert urgency (urgent/not urgent): ");
    }else if( state=='i3'){
        if(line=="private" || line=="shared"){
            state='i4'
            new_task.type=line;
            console.log("insert deadline (in a valid format): ");
        }else
            console.log("insert type (private/shared): ");
    }else if(state=='i4'){

        new_task.deadline=new Date(line);
        now=new Date();
        millis=new_task.deadline.getTime()-now.getTime();

        if( millis> 0){

            state='m'
            new_task.timer=setTimeout(function(data_local) { 
                return function() { 
                    tasks.splice(data_local.index,1);
                    console.log(data_local.task+ " has expired");
                } 
            }({index:tasks.length,task:new_task.description}), millis);

            tasks.push(new_task);
            console.log(new_task.description+" added");

        }else{
            console.log("impossible to set a task in the past");
        }

    }else if(state=='d1'){
        old_task=readLineS.question("insert task to remove: ");
        old_task_index=tasks.findIndex(
            (element)=>element.description.localeCompare(line)==0);
        if(old_task_index>=0){
            clearTimeout(tasks[old_task_index].timer);
            tasks.splice(old_task_index,1);
            console.log("task removed");
        }
        else
            console.log("this task doesn't exists");
        state='m';
    }else if (state=='d2'){
        rm_date=new Date(line);
        rm_date.setMilliseconds(0);
        rm_date.setHours(0);
        rm_date.setMinutes(0);
        let rm_date_2=new Date(rm_date);
        rm_date_2.setDate(rm_date.getDate()+1);
        
        tasks=tasks.filter((o)=>{
            if(o.deadline>=rm_date && o.deadline<=rm_date_2){
                console.log(o.description+ " deleted");
                clearTimeout(o.timer);
                return 1;
            }
            return 0;
        });
        state='m';
    }
    if(state=='m')
        PrintMenu();
    rl.prompt();
  }).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
  });


function PrintMenu(){

    console.log("1-insert a new task");
    console.log("2-remove a task");
    console.log("3-remove tasks based on dates");
    console.log("4-show all tasks in alphabetical order");
    console.log("5- close program");
}

