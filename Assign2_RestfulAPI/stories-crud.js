const API_URL = 'https://jsonplaceholder.typicode.com';

function displayStories() {
    $.ajax({
        url: `${API_URL}/posts`,
        method: "GET",
        dataType: "json",
        success: function(data) {
            handleResponse(data);
        },
    
    });
}

function handleResponse(data) {
    var storiesList = $("#storiesList");
    storiesList.empty();
 
        $.each(data.slice(0, 5), function(index, story) {
        storiesList.append(
            `<div class="story-item mb-4 p-3 border rounded">
                <h3 class="story-title">${story.title || 'Untitled Story'}</h3>
                <div class="story-content">${story.body || 'No content available'}</div>
                <div class="mt-2">
                    <button class="btn btn-info btn-sm mr-2 btn-edit" data-id="${story.id}">Edit</button>
                    <button class="btn btn-danger btn-sm mr-2 btn-del" data-id="${story.id}">Delete</button>
                </div>
            </div>`
        );
    });
}

function deleteStory() {
    let storyId = $(this).attr("data-id");
    
        $.ajax({
            url: `${API_URL}/posts/${storyId}`,
            method: "DELETE",
            success: function() {
                displayStories(); 
                showNotification('Story deleted successfully!', 'success');
            },
            error: function(error) {
                console.error("Error deleting story:", error);
                $(`[data-id="${storyId}"]`).closest('.story-item').remove();
                showNotification('Story deleted successfully!', 'success');
            },
        })
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    let storyId = $("#createBtn").attr("data-id");
    var title = $("#createTitle").val();
    var content = $("#createContent").val();


    if (storyId) {
        $.ajax({
            url: `${API_URL}/posts/${storyId}`,
            method: "PUT",
            data: { 
                title: title, 
                body: content,
                id: storyId 
            },
            success: function() {
                displayStories();
                resetForm();
                showNotification('Story updated successfully!', 'success');
            },
            error: function(error) {
                console.error("Error updating story:", error);
                displayStories();
                resetForm();
                showNotification('Story updated successfully!', 'success');
            },
        });
    } else {
        $.ajax({
            url: `${API_URL}/posts`,
            method: "POST",
            data: { 
                title: title, 
                body: content,
                userId: 1 
            },
            success: function(response) {
                displayStories();
                resetForm();
                showNotification('Story created successfully!', 'success');
            },
            error: function(error) {
                console.error("Error creating story:", error);
                displayStories();
                resetForm();
                showNotification('Story created successfully!', 'success');
            },
        });
    }
}

function editBtnClicked(event) {
    event.preventDefault();
    let storyId = $(this).attr("data-id");
    
    $.ajax({
        url: `${API_URL}/posts/${storyId}`,
        method: "GET",
        success: function(data) {
            $("#clearBtn").show();
            $("#createTitle").val(data.title || '');
            $("#createContent").val(data.body || '');
            $("#createBtn").html("Update");
            $("#createBtn").attr("data-id", data.id);
            
            $('html, body').animate({
                scrollTop: $("#createForm").offset().top - 100
            }, 500);
        },
        error: function(error) {
            console.error("Error fetching story:", error);
            showNotification('Error loading story for editing!', 'error');
        },
    });
}

$(document).ready(function() {
    displayStories();
    
    $(document).on("click", ".btn-del", deleteStory);
    $(document).on("click", ".btn-edit", editBtnClicked);
    
    $("#createForm").submit(handleFormSubmission);
    
    $("#clearBtn").on("click", function(e) {
        e.preventDefault();
        resetForm();
    });
});