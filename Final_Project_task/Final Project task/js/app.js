//click event, this triggers who whole process
document.querySelector('#addItemBtn').addEventListener('click', function (event) {
    const inputName = document.querySelector('#inputName').value;
    const inputDescription = document.querySelector('#inputDescription').value;
    const inputDueDate = document.querySelector('#inputDueDate').value;
    const inputAssignedTo = document.querySelector('#inputAssignedTo').value;
    const inputStatus = document.querySelector('#inputStatus').value;

    let allChecksPassed = formValidation(inputName, inputDescription, inputDueDate, inputAssignedTo, inputStatus);
   

    // this will allow information to pass if all inputs have come back TRUE if one fails an error will occur
    if (allChecksPassed) {
        event.preventDefault();
        makeTaskObject(inputName, inputDescription, inputDueDate, inputAssignedTo, inputStatus);
        let taskIndex = myTaskManager.allTasks.length - 1;

        myTaskManager.addTask(myTaskManager.allTasks[taskIndex], taskIndex)
    } else {
        event.preventDefault();
        alert("There are not enough characters in one of the fields")
    }
})

document.addEventListener('click', function (event) {
    const isButton = (event.target.nodeName == 'BUTTON');
    if (isButton) {
        const element = event.target;
        let buttonJob = element.attributes.job.value;
        if (buttonJob !== "" && buttonJob == 'delete') {
            myTaskManager.taskRemoval(element);
        }
    }
})

// this section is creating a function that will validate input on the form
function formValidation(inputName, inputDescription, inputDueDate, inputAssignedTo, inputStatus) {
    let isAllValid = false;

    // this section will create the character limit and also help when a user clicks on the choose option instead of the actual options available
    if ((inputName.length >= 3) && (inputAssignedTo.length >= 2) && (inputDescription.length >= 10) && (inputDueDate) && (inputStatus != 'Choose...')) {
        isAllValid = true;
    }

    return isAllValid;
}

function makeTaskObject(inputName, inputDescription, inputDueDate, inputAssignedTo, inputStatus) {
    myTaskManager.allTasks.push({
        "Name": inputName,
        "AssignedTo": inputAssignedTo,
        "Description": inputDescription,
        "DueDate": inputDueDate,
        "Status": inputStatus,
        "ID": `${myTaskManager.allTasks.length < 1 ? 1 : myTaskManager.allTasks.length + 1}`
    })

    localStorage.setItem("taskArray", JSON.stringify(myTaskManager.allTasks));
    return myTaskManager.allTasks;
}

class TaskManager {
    constructor(name) {
        this.allTasks = [];
        this.name = name;
    }

    addTask(taskObject, taskIndex) {
        const img1 = "./img/leafy.jpg";
        const img2 = "./img/cardleaves.jpg";

        // left side of the question mark we are saying if task index % 2 (finding the remainder of the index array)is == 0, print image 1 else print image 2
        /// this section will add tasks to the cards with the users new input
        let cardHTML =
                `<div class="col-md-4 col-sm-12 card-section" taskID="${taskObject.ID}">
                    <div class="card">
                        <div class="card-header">
                            <h3> &nbsp; Task </h3>
                            <img src="${taskIndex % 2 == 0 ? img1 : img2}" class="card-img-top" alt="...">
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">Name: ${taskObject.Name} </li>
                            <li class="list-group-item">Assigned To: ${taskObject.AssignedTo} </li>
                            <li class="list-group-item">Due Date: ${taskObject.DueDate} </li>
                            <li class="list-group-item">Description : ${taskObject.Description} </li>
                            <li class="list-group-item">Status: ${taskObject.Status} </li>
                        </ul>
                        <button type="button" class="btn btn-dark button-delete" job="delete" deleteID="${taskObject.ID}">Delete</button>
                    </div>
                </div>`

        let cardsHTMLrow = document.querySelector('#rows');
        cardsHTMLrow.innerHTML += cardHTML;

        ////////this section creates a list on the right side of the form. it is refering to the listItem id in the html page
        let listHTML = ` <a class="list-group-item list-group-item-action flex-column align-items-start" taskID="${taskObject.ID}">
                        <div class="d-flex w-100 justify-content-between">
                            <h8 class="mb-1">Assigned To: ${taskObject.AssignedTo}</h8>
                            <large>Due Date: ${taskObject.DueDate} </large>
                        </div>
                        <small>Status: ${taskObject.Status}</small>
                        <div>
                        <small> Task: ${taskObject.Description}</small>
                        </div>
                        </a>`

        let listHTMLrow = document.querySelector('#listItems');
        listHTMLrow.innerHTML += listHTML;

    }

    taskRemoval(element) {
        //this removes the item from the array perm
        let thistaskID = element.parentNode.parentNode.attributes.taskID.value;
        for (let i = 0; i < this.allTasks.length; i++) {
            if (this.allTasks[i].ID == thistaskID) {
                this.allTasks.splice(i, 1);
                localStorage.setItem("taskArray", JSON.stringify(myTaskManager.allTasks));
            }
        }

        //removes task
        let listGroupElements = document.querySelectorAll('a.list-group-item');
        for (let i = 0; i < listGroupElements.length; i++) {
            // element = elementsA[i];
            console.log(listGroupElements[i].getAttribute('taskID'));
            console.log(element.getAttribute('deleteID'));
            if (listGroupElements[i].getAttribute('taskID') == element.getAttribute('deleteID')) {
                listGroupElements[i].remove();
            }
        }
        //removes card
        element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode)
    }

    updateTask() {

    }
}

let myTaskManager = new TaskManager("ThisIsATask");

//this gets the data back from local storage
let dataReturned = localStorage.getItem("taskArray");

if (dataReturned) {
    myTaskManager.allTasks = JSON.parse(dataReturned);

    populatePage(myTaskManager.allTasks)
} else {
    myTaskManager.taskArray = [];
}

///////////// this will create new task and populate the page with the users input
//// we added i+1 to basically set the addtask array to 1 so it can be divided by 2 i++ will add the next card and increment the index num by 1
function populatePage(array) {
    for (let i = 0; i < array.length; i++) {
        myTaskManager.addTask(array[i], i + 1);
    }
}
//adding date in 
function updateDateTime(){
const dateObj = new Date();
let date = document.querySelector('#date');
let dateTime = `${dateObj.toLocaleDateString()}&nbsp;&nbsp;&nbsp;&nbsp;${dateObj.toLocaleTimeString()}`; 

date.innerHTML = dateTime;

setTimeout(updateDateTime, 1000);

}
updateDateTime();