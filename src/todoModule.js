var todoListApp = (function(){
    let tasks = [];
    const taskList = document.getElementById('list');
    const addTaskInput = document.getElementById('add');
    const tasksCounter = document.getElementById('tasks-counter');

    console.log('Working');

    async function fetchTODO(){
        // // GET Request
        // fetch('https://jsonplaceholder.typicode.com/todos')
        //     .then(function(response){
        //         return response.json();
        //     })
        //     .then(function(data){
        //         tasks = data.slice(0, 10);
        //         renderList();
        //     })
        //     .catch(function(error){
        //         console.log('error', error);
        //     })
        // ---- using async, await
        try{
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            const data = await response.json();
            tasks = data.slice(0, 10);
            renderList();
        }
        catch(error){
            console.log(error);
        }
    }   

    function addTaskToDOM(task){
        const li = document.createElement('li');
        li.innerHTML = `
                <input type="checkbox" id="${task.id}" ${task.completed ? 'checked':''} class="custom-checkbox">
                <label for="${task.id}">${task.title}</label>
                <img src="src/bin.svg" class="delete" data-id="${task.id}" />
        `;
        taskList.append(li);
    }

    function renderList () {
        taskList.innerHTML='';
        for(let i = 0; i<tasks.length; i++){
            addTaskToDOM(tasks[i]);
        }
        tasksCounter.innerHTML = tasks.length;
    }

    function toggleTask (taskId) {
        const task = tasks.filter(function(task) {
            return task.id === Number(taskId);
        });
        if(task.length > 0){
            const currentTask = task[0];
            //revert the done/not done status
            currentTask.completed = !currentTask.completed;
            renderList();
            showNotification("Task toggled successfully!");
            return;
        }
        showNotification("Couldn't toggle the task!");
    }

    function deleteTask (taskId) {
        const newTasks = tasks.filter(function(task) {
            return task.id !== Number(taskId);
        });
        tasks = newTasks;
        renderList();
        showNotification('Task deleted successfully!');
    }

    function addTask (task) {
        if(task){
            tasks.push(task);
            renderList();
            showNotification('Task added successfully!');
            return;
        }
        showNotification('Task cannot be added!');
    }

    function showNotification(text) {
        alert(text);
    }

    function handleInputKeyPress(e){
        if(e.key == 'Enter'){
            const title = e.target.value;
            if(!title){
                showNotification("Task text can't be empty");
                return;
            }
            const task = {
                title: title,
                id: Date.now(),
                completed: false
            };
            console.log(task);
            e.target.value = '';
            addTask(task);
        }
    }

    function handleClickListener(e){
        const target = e.target;
        console.log(target);
        if(target.className == 'delete'){
            const taskID = target.dataset.id;
            deleteTask(taskID);
        } else if(target.className == 'custom-checkbox'){
            const taskID = target.id;
            toggleTask(taskID);
        }
    }

    function initializeApp(){
        fetchTODO();
        addTaskInput.addEventListener('keyup', handleInputKeyPress);
        document.addEventListener('click', handleClickListener);
    }

    initializeApp();
    return {
        initialize: initializeApp
    };
})()

