// parent element to store cards 
const taskContainer = document.querySelector(".task__container");

// Global Store
//  we are saving all the details of the card inside the globalStore
let globalStore = [];

// here we are using function to create the card is because the functions are able to change the data dynamically 
// we are taking the values from the taskData and here we are destructuring them 
// here we are providing the card with the dynamic data that the user has given to us and we are returning the card with the dynamic data 
const newCard = ({ id, imageUrl, taskTitle, taskType, taskDescription }) => `
<div class="col-md-6 col-lg-4 mb-3" id = ${id}>
<div class="card ">
<div class="card-header d-flex justify-content-end gap-2">
<button type="button" onclick="editCard.apply(this , arguments)"  id=${id} class="btn btn-outline-success"><i id=${id} onclick="editCard.apply(this , arguments)" class="fas fa-edit"></i></button>
<button type="button" id=${id} onclick="deleteCard.apply(this , arguments)" class="btn btn-outline-danger"><i id=${id} class="fas fa-trash-alt" onclick="deleteCard.apply(this , arguments)"></i></button>
</div>
<img src=${imageUrl}  alt="...">
<div class="card-body ">
<h5 class="card-title">${taskTitle}</h5>
<p class="card-text">${taskDescription}</p>
<span class="badge bg-primary">${taskType}</span>
</div>
<div class="card-footer text-muted ">
<button type="button" id=${id} class="btn btn-outline-primary rounded-pill float-end"> Open Task</button>
</div>
</div>
</div>`




const loadInitialTaskCards = () => {
    // access localStorage
    const getInitialData = localStorage.getItem("tasky");

    // cause if we are running this app on a new system then there might not be any tasky key so it will return error but now it will work
    if (!getInitialData) return;

    // convert stringified object to object
    const { cards } = JSON.parse(getInitialData);

    // map around the array to generate the HTML card and inject it to DOM
    cards.map((cardObject) => {
        const createNewCard = newCard(cardObject);
        taskContainer.insertAdjacentHTML("beforeend", createNewCard);
        globalStore.push(cardObject);
    })
}


//  event is a method that gets executed when we click and this method fetches all the details of that card for us 
const deleteCard = (event) => {
    //  first we want the id of the card that we want to delete
    event = window.event;
    const targetID = event.target.id;
    const tagName = event.target.tagName;
    //  search that id in the globalStore and remove the object which has the id
    const newUpdatedArray = globalStore.filter((cardObject) => cardObject.id !== targetID)
    //  loop over the new globalStore and inject new updated cards to the DOM
    // newUpdatedArray.map((cardObject) => {
    //     const createNewCard = newCard(cardObject);
    //     taskContainer.insertAdjacentHTML("beforeend", createNewCard);
    // })

    globalStore = newUpdatedArray;

    localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }))

    if (tagName === "BUTTON") {
        return taskContainer.removeChild(
            event.target.parentNode.parentNode.parentNode)
    }

    return taskContainer.removeChild(
        event.target.parentNode.parentNode.parentNode.parentNode)
}


const editCard = (event) => {
 event = window.event;
 const targetID = event.target.id;
 const tagname = event.target.tagName;

    let parentElement;
    
    if(tagname === "BUTTON"){
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }
    
    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    let submitButton = parentElement.childNodes[7].childNodes[1];
  

    taskTitle.setAttribute("contenteditable" , "true");
    taskDescription.setAttribute("contenteditable" , "true");
    taskType.setAttribute("contenteditable" , "true");
    submitButton.setAttribute("onclick" , "saveEditChanges.apply(this , arguments)")
    submitButton.innerHTML = "Save Changes"
}

const saveEditChanges = (event) => {
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;
   
       let parentElement;
       
       if(tagname === "BUTTON"){
           parentElement = event.target.parentNode.parentNode;
       } else {
           parentElement = event.target.parentNode.parentNode.parentNode;
       }
       let taskTitle = parentElement.childNodes[5].childNodes[1];
       let taskDescription = parentElement.childNodes[5].childNodes[3];
       let taskType = parentElement.childNodes[5].childNodes[5];
       let submitButton = parentElement.childNodes[7].childNodes[1];
     

       const updatedData = {
           taskTitle : taskTitle.innerHTML,
           taskDescription: taskDescription.innerHTML,
           taskType : taskType.innerHTML,
       }
 
       globalStore = globalStore.map((task)=>{
           if(task.id === targetID){
               return {
                   id : task.id,
                   imageUrl : task.imageUrl,
                   taskTitle : updatedData.taskTitle,
                   taskDescription : updatedData.taskDescription,
                   taskType : updatedData.taskType,
               }
           }
           return;
       })
       localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }))  //key -> data

       taskTitle.setAttribute("contenteditable" , "false");
       taskDescription.setAttribute("contenteditable" , "false");
       taskType.setAttribute("contenteditable" , "false");
       submitButton.removeAttribute("onclick")
       submitButton.innerHTML = "Open Task"

}



// this save changes will get executed when user clicks on save changes
const saveChanges = () => {

    const taskData = {
        id: `${Date.now()}`,  //unique number for card id
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType: document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdescription").value,
        // here we are only taking the values from the element 
    }

    const createNewCard = newCard(taskData);
    // after getting the card we are storing it inside a constant

    // now we have to insert the data in the parent so we have to call the parent and use the insertAdjacentHTML method
    // in this method we have to pass the location that where we want our card to appear and after that we have to pass the constant that is containing the card 
    taskContainer.insertAdjacentHTML("beforeend", createNewCard);

    // here we are pushing the taskData inside the globalStorage
    globalStore.push(taskData);

    // now in order to save some item inside the localStorage we have to first use the setItem method and then we have to give it an id and after id we have to provide it with the value that we want to store inside it
    //  if we will directly pass cards : globalStorage then it will not return any value expect for object object because the current data is not in the form of string so we have to first convert our data into string 
    localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }))  //key -> data
    //  now our whole global object is converted into string
};