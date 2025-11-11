// console.log("Script Running");
// console.log($); // this is jQuery 

$(document).ready(function() {
    console.log("Date input value:", $("#dueDate").val());
    console.log("Date input value length:", $("#dueDate").val().length);
    console.log("Date input attribute value:", $("#dueDate").attr('value'));
    console.log("Date input prop value:", $("#dueDate").prop('value'));
  
    const LS_KEY = "todo_app_state";
    let selectedDate = null;

    // set default due date to tomorrow if empty
    if (!$("#dueDate").val()) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        $("#dueDate").val(tomorrowStr);
        selectedDate = tomorrowStr; // keep global in sync
    } else {
        selectedDate = $("#dueDate").val();
    }

    function saveState() {
        const teammates = [];
        $('#assignee option').each(function() {
            if ($(this).val()) {
                teammates.push($(this).val());
            }
        });
        const tasks = [];
        $('#lists .task').each(function() {
            const $task = $(this);
            tasks.push({
                assignee: $task.closest('.teammate').data('assignee'), 
                text: $task.find('.txt').text(),
                due: $task.data('due'), // store raw due date
                completed: $task.hasClass('completed')
            });
        });
        const state = { teammates, tasks }; //object shorthand
        localStorage.setItem(LS_KEY, JSON.stringify(state));
    }

    function loadState() {
        const savedState = localStorage.getItem(LS_KEY);
        if (!savedState)
            return;
        try {
            const state = JSON.parse(savedState);
            if (state.teammates && Array.isArray(state.teammates)) {
                state.teammates.forEach(name => {
                    addTeammateToDropdown(name);
                });
            }
            if (state.tasks && Array.isArray(state.tasks)) {
                state.tasks.forEach(task => {
                    addTaskToDOM(task.assignee, task.text, task.due, task.completed);
                });
                renderTasks();
            } else { 
                $(".empty-tasks").show(); //shows the no tasks message when there are no tasks
            }
        } catch (e) {
            console.error("Error loading state:", e);
        }
    }
  
    function addTaskToDOM(assignee, taskText, dueDate, completed = false) {
        $(".empty-tasks").hide(); //hides the no tasks message when a task is added
        let $section = $(`.teammate[data-assignee="${assignee}"]`);
        if ($section.length === 0) {
            $section = $(`
                <section class="teammate" data-assignee="${assignee}">
                    <h2>${assignee}</h2>
                    <ul class="task-list"></ul>
                </section>
            `);
            $('#lists').append($section);
        }
        const $taskItem = $(`
            <li class="task${completed ? ' completed' : ''}" data-due="${dueDate}">
                <input type="checkbox" class="done" ${completed ? 'checked' : ''}/>
                <span class="txt">${taskText}</span>
                <span class="due">(due: ${dueDate})</span>
            </li>
        `);
        $section.find('.task-list').append($taskItem);
    }

    function addTeammateToDropdown(name) {
        const $select = $("#assignee");
        $select.append($("<option>").val(name).text("Assign: " + name));
        const $options = $select.find("option:not(:first)").get(); // Exclude the first option
        $options.sort(function(a, b) {
            return a.text.localeCompare(b.text);
        });
        $select.find("option:not(:first)").remove(); 
        $select.append($options);
        //if teammate exists do not add
        if ($select.find("option").length > 1) {
            $select.find("option:first").prop("disabled", true);
        } 
    }
  
    function renderTasks() {
        const $lists = $("#lists");
        
        // Sort teammate sections alphabetically
        const $sections = $lists.find(".teammate").get();
        $sections.sort(function(a, b) {
            const nameA = $(a).data('assignee');
            const nameB = $(b).data('assignee');
            return nameA.localeCompare(nameB);
        });
        
        $lists.empty();
        
        // Re-append sorted sections
        $sections.forEach(section => {
            const $section = $(section);
            
            // Sort tasks within each section by due date
            const $tasks = $section.find(".task").get();
            $tasks.sort(function(a, b) {
                const dateA = $(a).data('due') || '';
                const dateB = $(b).data('due') || '';
                return String(dateA).localeCompare(String(dateB));
            });
            
            $section.find("ul").empty().append($tasks);
            $lists.append($section);
        });
        
        // Show/hide "No tasks" message
        if ($lists.children().length === 0) {
            $(".empty-tasks").show();
        } else {
            $(".empty-tasks").hide();
        }
    }

    $("#dueDate").on("change", function() {
        selectedDate = $(this).val();
        console.log("Date changed to: ", selectedDate);
    });

    // Add event listener to "Add" button
    $("#addButton").on("click", function() { //just a click event
        var teammateName = $("#teammate").val().trim(); //trim removes whitespace
        // Validate input
        if (!teammateName) {
            alert("Please enter a valid name.");
            return;
        }
        // check for duplicate (case-insensitive)
        var exists = false;
        $("#assignee option").each(function() {
            if (($(this).val() || "").toLowerCase() === teammateName.toLowerCase()) {
                exists = true;
                return false; // break the loop
            }
        });
        if (exists) {
            alert(teammateName + " already exists!");
            return;
        }
        // append teammate
        $("#assignee").append(
            $("<option></option>").val(teammateName).text("Assign: " + teammateName)
        );
        $("#teammate").val(""); //clears input field after adding

        //sort assignees alphabetically
        var $list = $("#assignee");
        var $options = $list.find("option");
        $options.sort(function(a, b) {
            if (a.text > b.text) return 1;
            else if (a.text < b.text) return -1;
            else return 0;
        });
        $list.empty();
        $list.append($options);
    });

    //event listen to assign
    $("#assignButton").on("click", function() {
        console.log("Assign button clicked");
        const assignee = $("#assignee").val();
        const task = $("#taskText").val();

        if (!selectedDate) {
            alert("Please select a due date.");
            return;
        }
        if (!assignee) {
            alert("Please select an assignee.");
            return;
        }
        if (!task) {
            alert("Please enter a task.");
            return;
        }
        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        if (selectedDate < currentDate) {
            alert("Due date cannot be in the past.");
            return;
        }
        // Add task to DOM
        addTaskToDOM(assignee, task, selectedDate);
        // Re-render with sorting
        renderTasks();
        // Clear input fields and reset to new default date
        $("#taskText").val("");
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        $("#dueDate").val(tomorrowStr);
        selectedDate = tomorrowStr; // Update global variable
        saveState();
    });

    // Task completion handler (using event delegation)
    $(document).on("change", ".done", function() {
        const $task = $(this).closest(".task");
        if (this.checked) {
            $task.addClass("completed");
        } else {
            $task.removeClass("completed");
        }
        saveState();
    });
    
    // Clear completed button handler
    $("#completeButton").on("click", function() {
        const $completed = $(".task.completed");
        if ($completed.length === 0) {
            return; // Do nothing if no completed tasks
        }
        // Remove completed tasks
        $completed.remove();
        // Remove empty teammate sections
        $(".teammate").each(function() {
            if ($(this).find(".task").length === 0) {
                $(this).remove();
            }
        });
        // Check if task list is now empty
        if ($("#lists .teammate").length === 0) {
            $(".empty-tasks").show();
        }
        saveState();
    });

    // Reset button handler
    $("#resetButton").on("click", function() {
        if (confirm("Are you sure you want to reset all teammates and to-do items?")) {
            // Clear task list
            $("#lists").empty();
            // Show empty message
            $(".empty-tasks").show();
            // Reset dropdown to initial state (matching your HTML)
            $("#assignee").html('<option disabled selected value="">Assign To</option>');
            // Clear input fields
            $("#teammate").val("");
            $("#taskText").val("");
            $("#dueDate").val("");
            selectedDate = null; // Reset the global variable
            // Remove from localStorage
            localStorage.removeItem(LS_KEY);
        }
    });

    // Load saved state on startup
    loadState();
    renderTasks();
});
